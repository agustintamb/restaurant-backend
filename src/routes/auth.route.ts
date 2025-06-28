import { Router } from 'express';
import { login } from '@/controllers/auth.controller';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y autorización
 */
const router = Router();

router.post('/login', login);

export default router;
