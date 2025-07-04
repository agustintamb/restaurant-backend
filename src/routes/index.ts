import { Router } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import allergenRoutes from './allergen.route';
import ingredientRoutes from './ingredient.route';
import categoryRoutes from './category.route';
import subcategoryRoutes from './subcategory.route';
import dishRoutes from './dish.route';
import dashboardRoutes from './dashboard.route';
import contactRoutes from './contact.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/allergens', allergenRoutes);
router.use('/ingredients', ingredientRoutes);
router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/dishes', dishRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/contacts', contactRoutes);

export default router;
