import { Dish } from '@/models/Dish.model';
import { Category } from '@/models/Category.model';
import { Subcategory } from '@/models/Subcategory.model';
import { Ingredient } from '@/models/Ingredient.model';
import { Allergen } from '@/models/Allergen.model';
import { User } from '@/models/User.model';
import { IDashboardStats } from '@/types/dashboard.types';

export const getDashboardStatsService = async (): Promise<IDashboardStats> => {
  try {
    const [
      totalDishes,
      activeDishes,
      deletedDishes,

      totalCategories,
      activeCategories,
      deletedCategories,

      totalSubcategories,
      activeSubcategories,
      deletedSubcategories,

      totalIngredients,
      activeIngredients,
      deletedIngredients,

      totalAllergens,
      activeAllergens,
      deletedAllergens,

      totalUsers,
      activeUsers,
      deletedUsers,
    ] = await Promise.all([
      // Platos
      Dish.countDocuments({}),
      Dish.countDocuments({ isDeleted: { $ne: true } }),
      Dish.countDocuments({ isDeleted: true }),

      // Categorías
      Category.countDocuments({}),
      Category.countDocuments({ isDeleted: { $ne: true } }),
      Category.countDocuments({ isDeleted: true }),

      // Subcategorías
      Subcategory.countDocuments({}),
      Subcategory.countDocuments({ isDeleted: { $ne: true } }),
      Subcategory.countDocuments({ isDeleted: true }),

      // Ingredientes
      Ingredient.countDocuments({}),
      Ingredient.countDocuments({ isDeleted: { $ne: true } }),
      Ingredient.countDocuments({ isDeleted: true }),

      // Alérgenos
      Allergen.countDocuments({}),
      Allergen.countDocuments({ isDeleted: { $ne: true } }),
      Allergen.countDocuments({ isDeleted: true }),

      // Usuarios
      User.countDocuments({}),
      User.countDocuments({ isDeleted: { $ne: true } }),
      User.countDocuments({ isDeleted: true }),
    ]);

    return {
      dishes: {
        total: totalDishes,
        active: activeDishes,
        deleted: deletedDishes,
      },
      categories: {
        total: totalCategories,
        active: activeCategories,
        deleted: deletedCategories,
      },
      subcategories: {
        total: totalSubcategories,
        active: activeSubcategories,
        deleted: deletedSubcategories,
      },
      ingredients: {
        total: totalIngredients,
        active: activeIngredients,
        deleted: deletedIngredients,
      },
      allergens: {
        total: totalAllergens,
        active: activeAllergens,
        deleted: deletedAllergens,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        deleted: deletedUsers,
      },
    };
  } catch (error) {
    throw new Error('Error al obtener estadísticas del dashboard');
  }
};
