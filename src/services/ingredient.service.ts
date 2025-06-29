import { Ingredient } from '@/models/Ingredient.model';
import { Types } from 'mongoose';
import {
  ICreateIngredient,
  GetIngredientsQuery,
  IIngredient,
  PaginatedIngredientsResult,
  IUpdateIngredient,
} from '@/types/ingredient.types';
import { validateTokenService } from './auth.service';

export const createIngredientService = async (
  ingredientData: ICreateIngredient,
  token: string
): Promise<IIngredient> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  const existingIngredient = await Ingredient.findOne({ name: ingredientData.name });
  if (existingIngredient) throw new Error('El ingrediente ya existe');

  const ingredient = new Ingredient({
    name: ingredientData.name,
    createdBy: new Types.ObjectId(currentUserId), // Usuario que crea
  });

  await ingredient.save();
  return ingredient;
};

export const updateIngredientService = async (
  ingredientId: string,
  updateData: IUpdateIngredient,
  token: string
): Promise<IIngredient> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(ingredientId)) {
    throw new Error('ID de ingrediente inválido');
  }

  const ingredient = await Ingredient.findById(ingredientId);
  if (!ingredient) throw new Error('Ingrediente no encontrado');

  // Verificar si el nombre ya existe (si se está actualizando)
  if (updateData.name && updateData.name !== ingredient.name) {
    const existingIngredient = await Ingredient.findOne({ name: updateData.name });
    if (existingIngredient) throw new Error('El nombre del ingrediente ya existe');
  }

  // Actualizar campos
  if (updateData.name) ingredient.name = updateData.name;

  // Establecer automáticamente el usuario que modifica
  ingredient.updatedBy = new Types.ObjectId(currentUserId);

  await ingredient.save();
  return ingredient;
};

export const deleteIngredientService = async (
  ingredientId: string,
  token: string
): Promise<{ message: string }> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(ingredientId)) {
    throw new Error('ID de ingrediente inválido');
  }

  const ingredient = await Ingredient.findById(ingredientId);
  if (!ingredient) throw new Error('Ingrediente no encontrado');
  if (ingredient.isDeleted) throw new Error('El ingrediente ya está eliminado');

  // Eliminación lógica con auditoría
  ingredient.isDeleted = true;
  ingredient.deletedAt = new Date();
  ingredient.deletedBy = new Types.ObjectId(currentUserId); // Usuario que elimina

  await ingredient.save();

  return {
    message: 'Ingrediente eliminado exitosamente',
  };
};

export const getIngredientByIdService = async (ingredientId: string): Promise<IIngredient> => {
  if (!Types.ObjectId.isValid(ingredientId)) throw new Error('ID de ingrediente inválido');

  const ingredient = await Ingredient.findById(ingredientId);
  if (!ingredient) throw new Error('Ingrediente no encontrado');

  return ingredient;
};

export const getIngredientsService = async (
  query: GetIngredientsQuery
): Promise<PaginatedIngredientsResult> => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const search = query.search || '';
  const includeDeleted = query.includeDeleted === 'true';

  // Filtros para la búsqueda
  const filters: any = {};

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  // No incluir eliminados por defecto
  if (!includeDeleted) {
    filters.isDeleted = { $ne: true };
  }

  // Calcular skip
  const skip = (page - 1) * limit;

  // Ejecutar consultas con populate para obtener datos de los usuarios en createdBy, updatedBy, deletedBy
  const [ingredients, totalIngredients] = await Promise.all([
    Ingredient.find(filters)
      .populate('createdBy', 'firstName lastName username')
      .populate('updatedBy', 'firstName lastName username')
      .populate('deletedBy', 'firstName lastName username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Ingredient.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalIngredients / limit);

  return {
    ingredients,
    totalIngredients,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
