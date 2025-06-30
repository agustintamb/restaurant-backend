import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getDishes,
  restoreDish,
} from '@/controllers/dish.controller';
import { uploadMiddleware } from '@/utils/upload';

const router = Router();

// Todas las rutas de platos requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

// with uploadMiddleware
router.post('/', uploadMiddleware, createDish);
router.put('/:id', uploadMiddleware, updateDish);

router.get('/', getDishes);
router.get('/:id', getDishById);
router.delete('/:id', deleteDish);
router.patch('/:id/restore', restoreDish);

export default router;
