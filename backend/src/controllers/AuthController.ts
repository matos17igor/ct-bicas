import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export class AuhtController {
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

      // Gera o JWT
      const secret = process.env.JWT_SECRET as string;
      if (!secret) {
        throw new Error("A variavel JWT_SECRET nao esta definida no .env");
      }

      const token = jwt.sign({ id: user.id }, secret, {
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
}
