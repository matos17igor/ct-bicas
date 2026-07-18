import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export class CourtController {
  // Cadastrar nova quadra
  create = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: "O nome da quadra e obrigatorio" });
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

  update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { name } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: "O nome nome da quadra e obrigatorio" });
      }

      const courtExists = await prisma.court.findUnique({
        where: { id },
      });
      if (!courtExists) {
        return res.status(404).json({ error: "Quadra nao encontrada" });
      }

      const updatedCourt = await prisma.court.updateMany({
        where: { id },
        data: { name },
      });

      return res.json(updatedCourt);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro interno ao atualizar quadra" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      const courtExists = await prisma.court.findUnique({ where: { id } });
      if (!courtExists) {
        return res.status(404).json({ error: "Quadra nao encontrada" });
      }

      await prisma.court.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao excluir quadra" });
    }
  };
}
