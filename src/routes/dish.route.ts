import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createDish,
  updateDish,
  deleteDish,
  getDishById,
  getDishes,
} from '@/controllers/dish.controller';

const router = Router();

// Todas las rutas de platos requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createDish);
router.get('/', getDishes);
router.get('/:id', getDishById);
router.put('/:id', updateDish);
router.delete('/:id', deleteDish);

export default router;
