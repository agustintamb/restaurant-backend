import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createAllergen,
  updateAllergen,
  deleteAllergen,
  restoreAllergen,
  getAllergenById,
  getAllergens,
} from '@/controllers/allergen.controller';

const router = Router();

// Todas las rutas de alérgenos requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createAllergen);
router.get('/', getAllergens);
router.get('/:id', getAllergenById);
router.put('/:id', updateAllergen);
router.delete('/:id', deleteAllergen);
router.patch('/:id/restore', restoreAllergen);

export default router;
