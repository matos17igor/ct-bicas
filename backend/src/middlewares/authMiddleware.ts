import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void | Response => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token nao fornecido" });
  }

  const [, token] = authorization.split(" ");

  try {
    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(
      token as string,
      secret
    ) as unknown as ITokenPayload;

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalido ou expirado" });
  }
};
