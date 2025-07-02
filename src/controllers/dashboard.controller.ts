import { Request, Response } from 'express';
import { getDashboardStatsService } from '@/services/dashboard.service';

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Obtener estadísticas del dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStatsResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json({
      message: 'Estadísticas del dashboard obtenidas exitosamente',
      result: stats,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
