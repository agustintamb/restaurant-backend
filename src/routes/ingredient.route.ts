import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createIngredient,
  updateIngredient,
  deleteIngredient,
  restoreIngredient,
  getIngredientById,
  getIngredients,
} from '@/controllers/ingredient.controller';

const router = Router();

// Todas las rutas de ingredientes requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createIngredient);
router.get('/', getIngredients);
router.get('/:id', getIngredientById);
router.put('/:id', updateIngredient);
router.delete('/:id', deleteIngredient);
router.patch('/:id/restore', restoreIngredient);

export default router;
