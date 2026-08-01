import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export class TournamentController {
  createTournament = async (req: AuthRequest, res: Response) => {
    try {
      const { title, description, category, date, startTime, status } =
        req.body;

      if (!title || !description || !category || !date || !startTime) {
        return res
          .status(400)
          .json({ error: "Por favor preencha todos os campos obrigatórios!" });
      }

      const newTournament = await prisma.tournament.create({
        data: {
          title,
          description,
          date: new Date(date),
          startTime,
          category,
          status,
        },
      });
      return res.status(201).json(newTournament);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Erro interno ao criar novo torneio!" });
    }
  };
}
