import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import { getDashboardStats } from '@/controllers/dashboard.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Gestión del panel de control del sistema
 */

// Todas las rutas de dashboard requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.get('/stats', getDashboardStats);

export default router;
