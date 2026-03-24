import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export class CourtController {
  // Cadastrar nova quadra
  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: "O nome da quadra e obrigatorio" });
      }

      const court = await prisma.court.create({
        data: {
          name,
        },
      });

      return res.status(201).json(court);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno ao criar quadra" });
    }
  };

  // Listar todas as quadras
  index = async (req: Request, res: Response) => {
    try {
      const courts = await prisma.court.findMany();
      return res.json(courts);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro ao buscar quadras" });
    }
  };
}
