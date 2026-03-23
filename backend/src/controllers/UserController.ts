import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

export class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

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
        },
      });

      // Retorna os dados sem a senha
      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno no server" });
    }
  }
}
