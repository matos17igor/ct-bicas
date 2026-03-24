import { Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export class BookingController {
  create = async (req: AuthRequest, res: Response) => {
    try {
      const { courtId, date, startTime, endTime } = req.body;
      const userId = req.userId as string;

      if (!courtId || !date || !startTime || !endTime) {
        res
          .status(400)
          .json({ error: "Preencha todos os campos do agendamento." });
        return;
      }
      // Validar se a quadra existe
      const court = await prisma.court.findUnique({
        where: { id: courtId },
      });

      if (!court) {
        return res.status(404).json({ error: "Quadra nao encontrada" });
      }

      // Conflito de horario
      const conflict = await prisma.booking.findFirst({
        where: {
          courtId,
          date: new Date(date),
          startTime: { lt: new Date(endTime) },
          endTime: { gt: new Date(startTime) },
        },
      });

      if (conflict) {
        return res
          .status(400)
          .json({ error: "Este horario ja esta ocupado na quadra" });
      }

      // Cria o agendamento
      const booking = await prisma.booking.create({
        data: {
          courtId,
          userId,
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
        },
      });

      res.status(201).json(booking);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao realizar agendamento" });
    }
  };

  indexByUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId as string;

      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          court: true,
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });

      res.json(bookings);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  };
}
