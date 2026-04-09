import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export class BlockedSlotController {
  // POST /admin/blocked-slots
  create = async (req: Request, res: Response) => {
    try {
      const { courtId, date, startTime, endTime, reason } = req.body;

      if (!courtId || !date || !startTime || !endTime) {
        res.status(400).json({ error: "Preencha todos os campos." });
        return;
      }

      // Verifica conflito com agendamentos de clientes
      const conflict = await prisma.booking.findFirst({
        where: {
          courtId,
          date: new Date(date),
          startTime: { lt: new Date(endTime) },
          endTime: { gt: new Date(startTime) },
        },
      });
      if (conflict) {
        res
          .status(400)
          .json({ error: "Já existe um agendamento de cliente nesse horário." });
        return;
      }

      const blocked = await prisma.booking.create({
        data: {
          courtId,
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          isBlocked: true,
          reason: reason || null,
        },
        include: { court: true },
      });

      res.status(201).json(blocked);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar bloqueio." });
    }
  };

  // GET /admin/blocked-slots — lista bloqueios futuros
  index = async (_req: Request, res: Response) => {
    try {
      const slots = await prisma.booking.findMany({
        where: { isBlocked: true, endTime: { gt: new Date() } },
        include: { court: true },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar bloqueios." });
    }
  };

  // DELETE /admin/blocked-slots/:id
  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      
      const slot = await prisma.booking.findUnique({ where: { id } });
      if (!slot || !slot.isBlocked) {
        res.status(404).json({ error: "Bloqueio não encontrado." });
        return;
      }
      
      await prisma.booking.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao remover bloqueio." });
    }
  };
}
