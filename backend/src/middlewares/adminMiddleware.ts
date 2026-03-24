import { Response, Request, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware.js";
import { prisma } from "../lib/prisma.js";

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.send(401).json({ error: "Usuario nao autenticado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        error: "Acesso negado. Apenas administradores podem realizar esta acao",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erro ao verificar permissoes" });
  }
};
