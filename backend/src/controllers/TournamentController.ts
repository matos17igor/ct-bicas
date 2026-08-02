import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { SportCategory, TournamentStatus } from "../generated/prisma/index.js";

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

      if (!Object.values(SportCategory).includes(category)) {
        return res.status(400).json({ error: "Categoria inválida!" });
      }

      if (status && !Object.values(TournamentStatus).includes(status)) {
        return res.status(400).json({ error: "Status inválido!" });
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

  getAllTournaments = async (req: Request, res: Response) => {
    try {
      const tournaments = await prisma.tournament.findMany({
        orderBy: {
          date: "asc",
        },
      });

      return res.status(200).json(tournaments);
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: "Erro interno ao buscar torneios!"})
    }
  }

  editTournament = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const {title, description, category, date, startTime, status} = req.body;
      
      const tournament = await prisma.tournament.findUnique({
        where: {id}
      });

      if(!tournament) {
        return res.status(404).json({error: "Torneio não encontrado!"})
      }

      if(status && !Object.values(TournamentStatus).includes(status)) {
        return res.status(400).json({error: "Status inválido!"})
      }

      if(category && !Object.values(SportCategory).includes(category)) {
        return res.status(400).json({error: "Categoria inválida!"})
      }

      const updateTournament = await prisma.tournament.update({
        where: {id},
        data: {
          title,
          description,
          category, 
          startTime,
          status,
          ...(date && { date: new Date(date) })
        }
      })

      return res.status(200).json(updateTournament);
    } catch (error) {
      return res.status(500).json({error: "Erro interno ao atualizar torneio!"})
    }
  };
  
  getTournamentById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      const tournament = await prisma.tournament.findUnique({
        where: {
          id,
        },
      });

      if (!tournament) {
        return res.status(404).json({ error: "Torneio não encontrado!" });
      }

      return res.status(200).json(tournament);
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: "Erro interno ao buscar torneio!"})
    }
  }

  deleteTournament = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;

      const tournament = await prisma.tournament.findUnique({
        where: {id},
      });

      if (!tournament) {
        return res.status(404).json({ error: "Torneio não encontrado!" });
      }

      await prisma.tournament.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({ message: "Torneio deletado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({error: "Erro interno ao deletar torneio!"})
    }
  }
}
