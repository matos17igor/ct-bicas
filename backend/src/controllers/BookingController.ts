import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import {
  sendBookingConfirmedToClient,
  sendBookingAlertToOwner,
  sendBookingCancelledToClient,
} from "../services/EmailService.js";

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

      // Dispara emails em background (não bloqueia a resposta)
      const user = await prisma.user.findUnique({ where: { id: userId } });
      console.log("📧 Tentando enviar email para:", user?.email);
      if (user) {
        const emailData = {
          clientName: user.name,
          clientEmail: user.email,
          clientPhone: user.phone,
          courtName: court.name,
          date: booking.date.toISOString(),
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
        };
        sendBookingConfirmedToClient(emailData)
          .then(() => console.log("✅ Email cliente enviado!"))
          .catch((err) => console.error("❌ Erro email cliente:", err.message));
        sendBookingAlertToOwner(emailData)
          .then(() => console.log("✅ Email dono enviado!"))
          .catch((err) => console.error("❌ Erro email dono:", err.message));
      } else {
        console.log("❌ Usuário não encontrado para envio de email");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao realizar agendamento" });
    }
  };

  indexByUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId as string;

      const bookings = await prisma.booking.findMany({
        where: { userId, endTime: { gt: new Date() }, isBlocked: false },
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
      const id = req.params.id as string;
      const userId = req.userId as string;

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { court: true },
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

      // Regra: usuários comuns não podem cancelar com menos de 1h de antecedência
      if (user?.role !== "ADMIN") {
        const now = new Date();
        const diffMs = booking.startTime.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours < 1) {
          return res.status(403).json({
            error:
              "Cancelamentos só são permitidos com até 1 hora de antecedência.",
          });
        }
      }

      // Busca dados do cliente que fez o agendamento
      let bookingOwner = null;
      if (booking.userId) {
        bookingOwner = await prisma.user.findUnique({
          where: { id: booking.userId },
        });
      }

      await prisma.booking.delete({ where: { id } });

      res.status(204).send();

      // Envia email de cancelamento ao cliente em background
      if (bookingOwner) {
        sendBookingCancelledToClient({
          clientName: bookingOwner.name,
          clientEmail: bookingOwner.email ?? "",
          courtName: booking.court.name,
          date: booking.date.toISOString(),
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
        })
          .then(() => console.log("✅ Email cancelamento enviado!"))
          .catch((err: Error) =>
            console.error("❌ Erro email cancelamento:", err.message)
          );
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao cancelar o agendamento" });
    }
  };

  indexAll = async (req: Request, res: Response) => {
    try {
      const bookings = await prisma.booking.findMany({
        where: { endTime: { gt: new Date() }, isBlocked: false },
        include: {
          court: true, // Traz os dados da quadra
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
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
