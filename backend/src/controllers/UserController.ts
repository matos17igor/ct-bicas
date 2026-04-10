import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { sendVerificationEmail } from "../services/EmailService.js";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password, phone } = req.body;

      if (phone && !/^\d{11}$/.test(phone)) {
        return res.status(400).json({ error: "O WhatsApp deve conter exatamente 11 dígitos numéricos com DDD (Ex: 32999999999)." });
      }

      const userExists = await prisma.user.findUnique({
        where: { email },
      });

      // Verifica se o usuario ja existe
      if (userExists) {
        return res
          .status(400)
          .json({ error: "Este email ja esta cadastrado!" });
      }

      // Criptografia de senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Salva no banco
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: phone || null,
        },
      });

      // Gera código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await prisma.token.create({
        data: {
          code,
          type: "VERIFY_EMAIL",
          userId: user.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hora
        },
      });

      // Envia em background
      sendVerificationEmail(user.email, user.name, code)
        .then(() => console.log("E-mail de confirmação enviado para", user.email))
        .catch((e) => console.error("Erro ao enviar e-mail de confirmação:", e));

      // Retorna os dados sem a senha
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno no server" });
    }
  }
}
