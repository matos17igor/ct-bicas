import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/EmailService.js";

export class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Email ou senha incorretos!" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Email ou senha incorretos" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ 
          code: "UNVERIFIED",
          error: "Sua conta não foi confirmada. Redirecionando para verificação..."
        });
      }

      // Gera o JWT
      const secret = process.env.JWT_SECRET as string;
      if (!secret) {
        throw new Error("A variavel JWT_SECRET nao esta definida no .env");
      }

      const token = jwt.sign({ id: user.id, role: user.role }, secret, {
        expiresIn: "1d",
      });

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno no server" });
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
      if (user.isVerified) return res.status(400).json({ error: "E-mail já verificado." });

      const token = await prisma.token.findFirst({
        where: { userId: user.id, code, type: "VERIFY_EMAIL", expiresAt: { gt: new Date() } },
      });

      if (!token) return res.status(400).json({ error: "Código inválido ou expirado." });

      await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
      await prisma.token.deleteMany({ where: { userId: user.id, type: "VERIFY_EMAIL" } });

      return res.json({ message: "E-mail verificado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao verificar e-mail" });
    }
  };

  resendCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
      if (user.isVerified) return res.status(400).json({ error: "E-mail já verificado." });

      await prisma.token.deleteMany({ where: { userId: user.id, type: "VERIFY_EMAIL" } });

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.token.create({
        data: {
          code,
          type: "VERIFY_EMAIL",
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      });

      await sendVerificationEmail(user.email, user.name, code);
      return res.json({ message: "Código reenviado com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao reenviar o código." });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(200).json({ message: "Instruções enviadas se o e-mail existir." });

      await prisma.token.deleteMany({ where: { userId: user.id, type: "RESET_PASSWORD" } });

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await prisma.token.create({
        data: {
          code,
          type: "RESET_PASSWORD",
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        },
      });

      await sendPasswordResetEmail(user.email, user.name, code);
      return res.status(200).json({ message: "Instruções enviadas se o e-mail existir." });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao solicitar recuperação." });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, code, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(400).json({ error: "Código inválido ou expirado." });

      const token = await prisma.token.findFirst({
        where: { userId: user.id, code, type: "RESET_PASSWORD", expiresAt: { gt: new Date() } },
      });

      if (!token) return res.status(400).json({ error: "Código inválido ou expirado." });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });
      await prisma.token.deleteMany({ where: { userId: user.id, type: "RESET_PASSWORD" } });

      return res.json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao tentar redefinir senha." });
    }
  };
}
