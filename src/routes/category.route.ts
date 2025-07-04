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

/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Gestión de categorías del sistema
 */

router.get('/', getCategories);

// Todas las siguientes rutas requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createCategory);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.patch('/:id/restore', restoreCategory);

export default router;
