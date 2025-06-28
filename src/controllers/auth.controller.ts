import { Request, Response } from 'express';
import { loginService } from '@/services/auth.service';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponseWrapper'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Credenciales inválidas"
 */
export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(401).json({ error: message });
  }
};
