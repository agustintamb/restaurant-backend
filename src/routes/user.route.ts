import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/role.middleware';
import {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
} from '../controllers/user.controller';

const router = Router();

// Todas las rutas de usuarios requieren autenticación y rol admin
router.use(authenticateToken, requireAdmin);

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
