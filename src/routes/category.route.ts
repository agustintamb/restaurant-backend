import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  getCategoryById,
  getCategories,
} from '@/controllers/category.controller';

const router = Router();

// Todas las rutas de categorías requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.patch('/:id/restore', restoreCategory);

export default router;
