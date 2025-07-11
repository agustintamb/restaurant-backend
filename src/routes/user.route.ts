import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  getUserById,
  getUsers,
  getCurrentUser,
} from '@/controllers/user.controller';

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

const router = Router();
// Todas las rutas de usuarios requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createUser);
router.get('/', getUsers);
router.get('/current', getCurrentUser);
router.get('/:id', getUserById);
router.put('/profile/:id', updateUserProfile);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
