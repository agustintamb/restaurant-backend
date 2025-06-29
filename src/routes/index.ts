import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import allergenRoutes from './allergen.route';
import ingredientRoutes from './ingredient.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/allergens', allergenRoutes);
router.use('/ingredients', ingredientRoutes);

export default router;
