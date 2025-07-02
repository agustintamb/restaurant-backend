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

router.get('/', getDishes);
router.get('/:id', getDishById);

// Todas las siguientes rutas requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

// with uploadMiddleware
router.post('/', uploadMiddleware, createDish);
router.put('/:id', uploadMiddleware, updateDish);

router.delete('/:id', deleteDish);
router.patch('/:id/restore', restoreDish);

export default router;
