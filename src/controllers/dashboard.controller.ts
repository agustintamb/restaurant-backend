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
 *     description: Obtiene estadísticas completas de todos los módulos del sistema incluyendo totales, activos, eliminados y datos específicos como contactos no leídos
 *     responses:
 *       200:
 *         description: Estadísticas del dashboard obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardStatsResponse'
 *       400:
 *         description: Error al obtener las estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
