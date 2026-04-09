import { Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { AuthRequest } from "../middlewares/authMiddleware.js";

export class ProfileController {
  getMe = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, phone: true },
      });
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar perfil" });
    }
  };

  updateMe = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const { name, phone } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(phone !== undefined && { phone: phone || null }),
        },
        select: { id: true, name: true, email: true, phone: true },
      });

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar perfil" });
    }
  };

  updatePassword = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId as string;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Preencha todos os campos" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Senha atual incorreta" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      res.json({ message: "Senha atualizada com sucesso!" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar senha" });
    }
  };
}
