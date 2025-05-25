import { Request, Response } from 'express';
import { loginService } from '../services/auth.service';

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(401).json({ error: message });
  }
};
