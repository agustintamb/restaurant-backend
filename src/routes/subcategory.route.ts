import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getSubcategoryById,
  getSubcategories,
} from '@/controllers/subcategory.controller';

const router = Router();

// Todas las rutas de subcategorías requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createSubcategory);
router.get('/', getSubcategories);
router.get('/:id', getSubcategoryById);
router.put('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);

export default router;
