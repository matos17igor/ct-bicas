import { Request, Response } from "express";
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
        where: { userId, endTime: { gt: new Date() } },
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

  listByCourtAndDate = async (req: Request, res: Response) => {
    try {
      const courtId = req.params.courtId as string;
      const date = req.query.date as string;

      if (!date) {
        return res
          .status(400)
          .json({ error: "A data e obrigatoria (formato YYYY-MM-DD)" });
      }

      const searchDate = new Date(date);
      const startOfDay = new Date(searchDate.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setUTCHours(23, 59, 59, 999));

      const bookings = await prisma.booking.findMany({
        where: {
          courtId,
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
        },
        orderBy: {
          startTime: "asc",
        },
      });

      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao procurar horários ocupados." });
    }
  };

  delete = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string; // id do agendamento
      const userId = req.userId as string;

      const booking = await prisma.booking.findUnique({
        where: { id },
      });

      if (!booking) {
        return res.status(404).json({ error: "Agendamento nao encontrado" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (booking.userId !== userId && user?.role !== "ADMIN") {
        return res.status(403).json({
          error: "Voce nao tem permissao para cancelar esse agendamento",
        });
      }

      await prisma.booking.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao cancelar o agendamento" });
    }
  };

  indexAll = async (req: Request, res: Response) => {
    try {
      const bookings = await prisma.booking.findMany({
        where: { endTime: { gt: new Date() } },
        include: {
          court: true, // Traz os dados da quadra
          user: {
            select: {
              name: true,
              email: true, // Traz o contato do cliente
            },
          },
        },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });

      res.json(bookings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar todos os agendamentos." });
    }
  };
}
