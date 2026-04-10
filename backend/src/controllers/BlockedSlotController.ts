import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export class BlockedSlotController {
  // POST /admin/blocked-slots
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courtId, date, startTime, endTime, reason, isWeekly } = req.body;

      if (!courtId || !date || !startTime || !endTime) {
        res.status(400).json({ error: "Preencha todos os campos." });
        return;
      }

      const occurrences = isWeekly ? 24 : 1; // 24 weeks ~ 6 months
      const recurringGroupId = isWeekly ? crypto.randomUUID() : null;

      const newBlocks = [];
      const baseDate = new Date(date);
      const baseStartTime = new Date(startTime);
      const baseEndTime = new Date(endTime);

      for (let i = 0; i < occurrences; i++) {
        const currentDate = new Date(baseDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + (i * 7));

        const currentStartTime = new Date(baseStartTime);
        currentStartTime.setUTCDate(currentStartTime.getUTCDate() + (i * 7));

        const currentEndTime = new Date(baseEndTime);
        currentEndTime.setUTCDate(currentEndTime.getUTCDate() + (i * 7));

        newBlocks.push({
          courtId,
          date: currentDate,
          startTime: currentStartTime,
          endTime: currentEndTime,
          isBlocked: true,
          reason: reason || null,
          recurringGroupId,
        });
      }

      // Verifica conflito com agendamentos de clientes para todas as datas
      for (const block of newBlocks) {
        const conflict = await prisma.booking.findFirst({
          where: {
            courtId,
            date: block.date,
            startTime: { lt: block.endTime },
            endTime: { gt: block.startTime },
            isBlocked: false, // Only block if a REAL client is booked, overlapping manual blocks is ok to overwrite visually, but actually let's block overlaps
          },
        });
        
        if (conflict) {
          const formattedDate = block.date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
          res.status(400).json({ error: `Já existe um agendamento de cliente na data ${formattedDate}. Desmarque-o antes de bloquear essa série.` });
          return;
        }
      }

      await prisma.booking.createMany({
        data: newBlocks,
      });

      res.status(201).json({ message: "Bloqueio criado com sucesso", count: newBlocks.length });
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
      const deleteAll = req.query.deleteAll === "true";
      
      const slot = await prisma.booking.findUnique({ where: { id } });
      if (!slot || !slot.isBlocked) {
        res.status(404).json({ error: "Bloqueio não encontrado." });
        return;
      }
      
      if (deleteAll && slot.recurringGroupId) {
        await prisma.booking.deleteMany({
          where: { recurringGroupId: slot.recurringGroupId }
        });
      } else {
        await prisma.booking.delete({ where: { id } });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Erro ao remover bloqueio." });
    }
  };
}
