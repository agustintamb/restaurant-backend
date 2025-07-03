import { Dish } from '@/models/Dish.model';
import { Category } from '@/models/Category.model';
import { Subcategory } from '@/models/Subcategory.model';
import { Ingredient } from '@/models/Ingredient.model';
import { Allergen } from '@/models/Allergen.model';
import { Types } from 'mongoose';
import {
  ICreateDish,
  GetDishesQuery,
  IDish,
  PaginatedDishesResult,
  IUpdateDish,
} from '@/types/dish.types';
import { validateTokenService } from './auth.service';
import { generateSlug } from '@/utils/slug';

export const createDishService = async (dishData: ICreateDish, token: string): Promise<IDish> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  // Verificar que la categoría existe
  if (!Types.ObjectId.isValid(dishData.categoryId)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findById(dishData.categoryId);
  if (!category) throw new Error('La categoría especificada no existe');

  // Si se especifica subcategoría, verificar que existe y pertenece a la categoría
  let subcategoryId = null;
  if (dishData.subcategoryId) {
    if (!Types.ObjectId.isValid(dishData.subcategoryId)) {
      throw new Error('ID de subcategoría inválido');
    }

    const subcategory = await Subcategory.findById(dishData.subcategoryId);
    if (!subcategory) throw new Error('La subcategoría especificada no existe');

    if (subcategory.category.toString() !== dishData.categoryId) {
      throw new Error('La subcategoría no pertenece a la categoría especificada');
    }

    subcategoryId = new Types.ObjectId(dishData.subcategoryId);
  }

  // Verificar que todos los ingredientes existen
  const ingredientIds = dishData.ingredientIds.map(id => {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`ID de ingrediente inválido: ${id}`);
    }
    return new Types.ObjectId(id);
  });

  if (ingredientIds.length > 0) {
    const ingredientsCount = await Ingredient.countDocuments({
      _id: { $in: ingredientIds },
      isDeleted: { $ne: true },
    });
    if (ingredientsCount !== ingredientIds.length) {
      throw new Error('Uno o más ingredientes especificados no existen');
    }
  }

  // Verificar que todos los alérgenos existen
  const allergenIds = dishData.allergenIds.map(id => {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error(`ID de alérgeno inválido: ${id}`);
    }
    return new Types.ObjectId(id);
  });

  if (allergenIds.length > 0) {
    const allergensCount = await Allergen.countDocuments({
      _id: { $in: allergenIds },
      isDeleted: { $ne: true },
    });
    if (allergensCount !== allergenIds.length) {
      throw new Error('Uno o más alérgenos especificados no existen');
    }
  }

  // Generar nameSlug si no se proporciona
  const nameSlug = dishData.nameSlug || generateSlug(dishData.name);

  // Verificar que el slug no exista
  const existingSlug = await Dish.findOne({ nameSlug });
  if (existingSlug) throw new Error('Ya existe un plato con ese slug');

  const dish = new Dish({
    name: dishData.name,
    nameSlug,
    description: dishData.description,
    price: dishData.price,
    image: dishData.image || 'placeholder-dish.jpg',
    category: new Types.ObjectId(dishData.categoryId),
    subcategory: subcategoryId,
    ingredients: ingredientIds,
    allergens: allergenIds,
    createdBy: new Types.ObjectId(currentUserId),
  });

  await dish.save();
  return dish;
};

export const updateDishService = async (
  dishId: string,
  updateData: IUpdateDish,
  token: string
): Promise<IDish> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(dishId)) {
    throw new Error('ID de plato inválido');
  }

  const dish = await Dish.findById(dishId);
  if (!dish) throw new Error('Plato no encontrado');

  // Verificar categoría si se está actualizando
  if (updateData.categoryId && updateData.categoryId !== dish.category.toString()) {
    if (!Types.ObjectId.isValid(updateData.categoryId)) {
      throw new Error('ID de categoría inválido');
    }

    const category = await Category.findById(updateData.categoryId);
    if (!category) throw new Error('La categoría especificada no existe');

    dish.category = new Types.ObjectId(updateData.categoryId);
  }

  // Verificar subcategoría si se está actualizando
  if (updateData.subcategoryId !== undefined) {
    if (updateData.subcategoryId === null || updateData.subcategoryId === '') {
      dish.subcategory = undefined;
    } else {
      if (!Types.ObjectId.isValid(updateData.subcategoryId)) {
        throw new Error('ID de subcategoría inválido');
      }

      const subcategory = await Subcategory.findById(updateData.subcategoryId);
      if (!subcategory) throw new Error('La subcategoría especificada no existe');

      const categoryId = updateData.categoryId || dish.category.toString();
      if (subcategory.category.toString() !== categoryId) {
        throw new Error('La subcategoría no pertenece a la categoría especificada');
      }

      dish.subcategory = new Types.ObjectId(updateData.subcategoryId);
    }
  }

  // Verificar ingredientes si se están actualizando
  if (updateData.ingredientIds) {
    const ingredientIds = updateData.ingredientIds.map(id => {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error(`ID de ingrediente inválido: ${id}`);
      }
      return new Types.ObjectId(id);
    });

    if (ingredientIds.length > 0) {
      const ingredientsCount = await Ingredient.countDocuments({
        _id: { $in: ingredientIds },
        isDeleted: { $ne: true },
      });
      if (ingredientsCount !== ingredientIds.length) {
        throw new Error('Uno o más ingredientes especificados no existen');
      }
    }

    dish.ingredients = ingredientIds;
  }

  // Verificar alérgenos si se están actualizando
  if (updateData.allergenIds) {
    const allergenIds = updateData.allergenIds.map(id => {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error(`ID de alérgeno inválido: ${id}`);
      }
      return new Types.ObjectId(id);
    });

    if (allergenIds.length > 0) {
      const allergensCount = await Allergen.countDocuments({
        _id: { $in: allergenIds },
        isDeleted: { $ne: true },
      });
      if (allergensCount !== allergenIds.length) {
        throw new Error('Uno o más alérgenos especificados no existen');
      }
    }

    dish.allergens = allergenIds;
  }

  // Verificar slug si se proporciona explícitamente
  if (updateData.nameSlug) {
    const existingSlug = await Dish.findOne({
      nameSlug: updateData.nameSlug,
      _id: { $ne: dishId },
    });
    if (existingSlug) throw new Error('Ya existe un plato con ese slug');
    dish.nameSlug = updateData.nameSlug;
  }

  // Actualizar otros campos
  if (updateData.name) dish.name = updateData.name;
  if (updateData.description) dish.description = updateData.description;
  if (updateData.price !== undefined) dish.price = updateData.price;
  if (updateData.image) dish.image = updateData.image;

  // Establecer automáticamente el usuario que modifica
  dish.updatedBy = new Types.ObjectId(currentUserId);

  await dish.save();
  return dish;
};

export const restoreDishService = async (dishId: string, token: string): Promise<IDish> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(dishId)) {
    throw new Error('ID de plato inválido');
  }

  const dish = await Dish.findById(dishId);
  if (!dish) throw new Error('Plato no encontrado');
  if (!dish.isDeleted) throw new Error('El plato no está eliminado');

  // Restaurar con auditoría
  dish.isDeleted = false;
  dish.restoredAt = new Date();
  dish.restoredBy = new Types.ObjectId(currentUserId);

  await dish.save();
  return dish;
};

export const deleteDishService = async (
  dishId: string,
  token: string
): Promise<{ message: string }> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(dishId)) {
    throw new Error('ID de plato inválido');
  }

  const dish = await Dish.findById(dishId);
  if (!dish) throw new Error('Plato no encontrado');
  if (dish.isDeleted) throw new Error('El plato ya está eliminado');

  // Limpiar campos de restore si existían
  dish.restoredAt = undefined;
  dish.restoredBy = undefined;

  // Eliminación lógica con auditoría y limpieza de campos de restore
  dish.isDeleted = true;
  dish.deletedAt = new Date();
  dish.deletedBy = new Types.ObjectId(currentUserId);

  await dish.save();

  return {
    message: 'Plato eliminado exitosamente',
  };
};

export const getDishByIdService = async (dishId: string): Promise<IDish> => {
  if (!Types.ObjectId.isValid(dishId)) throw new Error('ID de plato inválido');

  const dish = await Dish.findById(dishId)
    .populate('category', 'name nameSlug')
    .populate('subcategory', 'name nameSlug')
    .populate('ingredients', 'name')
    .populate('allergens', 'name')
    .populate('createdBy', 'firstName lastName username')
    .populate('updatedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username');

  if (!dish) throw new Error('Plato no encontrado');

  return dish;
};

export const getDishesService = async (query: GetDishesQuery): Promise<PaginatedDishesResult> => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const search = query.search || '';
  const categoryId = query.categoryId;
  const subcategoryId = query.subcategoryId;
  const includeDeleted = query.includeDeleted === 'true';
  const includeRelations = query.includeRelations === 'true';

  // Filtros para la búsqueda
  const filters: any = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { nameSlug: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (categoryId) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error('ID de categoría inválido');
    }
    filters.category = categoryId;
  }

  if (subcategoryId) {
    if (!Types.ObjectId.isValid(subcategoryId)) {
      throw new Error('ID de subcategoría inválido');
    }
    filters.subcategory = subcategoryId;
  }

  // No incluir eliminados por defecto
  if (!includeDeleted) {
    filters.isDeleted = { $ne: true };
  }

  // Calcular skip
  const skip = (page - 1) * limit;

  // Construir la consulta base
  let dishesQuery = Dish.find(filters)
    .populate('createdBy', 'firstName lastName username')
    .populate('updatedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username');

  // Incluir relaciones si se solicita
  if (includeRelations) {
    dishesQuery = dishesQuery
      .populate('category', 'name nameSlug')
      .populate('subcategory', 'name nameSlug')
      .populate('ingredients', 'name')
      .populate('allergens', 'name');
  }

  // Ejecutar consultas
  const [dishes, totalDishes] = await Promise.all([
    dishesQuery.skip(skip).limit(limit).sort({ createdAt: -1 }),
    Dish.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalDishes / limit);

  return {
    dishes,
    totalDishes,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
