import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { requireAdmin } from '@/middlewares/role.middleware';
import {
  createContact,
  markAsReadContact,
  deleteContact,
  restoreContact,
  getContactById,
  getContacts,
} from '@/controllers/contact.controller';

const router = Router();

// Ruta PÚBLICA para crear contacto (desde el formulario del sitio web)
router.post('/', createContact);

// Rutas que requieren autenticación y rol admin (para el backoffice)
router.use(authenticateToken, requireAdmin);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.patch('/:id/mark-as-read', markAsReadContact);
router.delete('/:id', deleteContact);
router.patch('/:id/restore', restoreContact);

export default router;
