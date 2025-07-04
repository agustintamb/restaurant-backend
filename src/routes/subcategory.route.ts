import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  restoreSubcategory,
  getSubcategoryById,
  getSubcategories,
} from '@/controllers/subcategory.controller';

/**
 * @swagger
 * tags:
 *   name: Subcategorías
 *   description: Gestión de subcategorías del sistema
 */

const router = Router();

// Todas las rutas de subcategorías requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createSubcategory);
router.get('/', getSubcategories);
router.get('/:id', getSubcategoryById);
router.put('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);
router.patch('/:id/restore', restoreSubcategory);

export default router;
