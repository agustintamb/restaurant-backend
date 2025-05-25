import { Router } from 'express';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  getCategories,
} from '../controllers/category.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';

const router = Router();

// Rutas públicas
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Rutas protegidas (requieren autenticación y rol admin)
router.post('/', authenticateToken, requireAdmin, createCategory);
router.put('/:id', authenticateToken, requireAdmin, updateCategory);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

export default router;
