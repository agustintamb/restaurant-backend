import { Category } from '@/models/Category.model';
import { Types } from 'mongoose';
import {
  ICreateCategory,
  GetCategoriesQuery,
  ICategory,
  PaginatedCategoriesResult,
  IUpdateCategory,
} from '@/types/category.types';
import { validateTokenService } from './auth.service';

export const createCategoryService = async (
  categoryData: ICreateCategory,
  token: string
): Promise<ICategory> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  const existingCategory = await Category.findOne({ name: categoryData.name });
  if (existingCategory) throw new Error('La categoría ya existe');

  const category = new Category({
    name: categoryData.name,
    createdBy: new Types.ObjectId(currentUserId),
  });

  await category.save();
  return category;
};

export const updateCategoryService = async (
  categoryId: string,
  updateData: IUpdateCategory,
  token: string
): Promise<ICategory> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(categoryId)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Categoría no encontrada');

  // Verificar si el nombre ya existe (si se está actualizando)
  if (updateData.name && updateData.name !== category.name) {
    const existingCategory = await Category.findOne({ name: updateData.name });
    if (existingCategory) throw new Error('El nombre de la categoría ya existe');
  }

  // Actualizar campos
  if (updateData.name) category.name = updateData.name;

  // Establecer automáticamente el usuario que modifica
  category.updatedBy = new Types.ObjectId(currentUserId);

  await category.save();
  return category;
};

export const restoreCategoryService = async (
  categoryId: string,
  token: string
): Promise<ICategory> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(categoryId)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Categoría no encontrada');
  if (!category.isDeleted) throw new Error('La categoría no está eliminada');

  // Restaurar con auditoría
  category.isDeleted = false;
  category.restoredAt = new Date();
  category.restoredBy = new Types.ObjectId(currentUserId);

  await category.save();
  return category;
};

export const deleteCategoryService = async (
  categoryId: string,
  token: string
): Promise<{ message: string }> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(categoryId)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findById(categoryId);
  if (!category) throw new Error('Categoría no encontrada');
  if (category.isDeleted) throw new Error('La categoría ya está eliminada');

  // Verificar si tiene subcategorías asociadas
  if (category.subcategories && category.subcategories.length > 0) {
    throw new Error('No se puede eliminar una categoría que tiene subcategorías asociadas');
  }

  // Limpiar campos de restore si existían
  category.restoredAt = undefined;
  category.restoredBy = undefined;

  // Eliminación lógica con auditoría y limpieza de campos de restore
  category.isDeleted = true;
  category.deletedAt = new Date();
  category.deletedBy = new Types.ObjectId(currentUserId);

  await category.save();

  return {
    message: 'Categoría eliminada exitosamente',
  };
};

export const getCategoryByIdService = async (categoryId: string): Promise<ICategory> => {
  if (!Types.ObjectId.isValid(categoryId)) throw new Error('ID de categoría inválido');

  const category = await Category.findById(categoryId)
    .populate('subcategories', 'name')
    .populate('createdBy', 'firstName lastName username')
    .populate('updatedBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username');

  if (!category) throw new Error('Categoría no encontrada');

  return category;
};

export const getCategoriesService = async (
  query: GetCategoriesQuery
): Promise<PaginatedCategoriesResult> => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const search = query.search || '';
  const includeDeleted = query.includeDeleted === 'true';
  const includeSubcategories = query.includeSubcategories === 'true';

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

  // Construir la consulta base
  let categoriesQuery = Category.find(filters)
    .populate('createdBy', 'firstName lastName username')
    .populate('updatedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username');

  // Incluir subcategorías si se solicita
  if (includeSubcategories) {
    categoriesQuery = categoriesQuery.populate('subcategories', 'name');
  }

  // Ejecutar consultas
  const [categories, totalCategories] = await Promise.all([
    categoriesQuery.skip(skip).limit(limit).sort({ createdAt: -1 }),
    Category.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalCategories / limit);

  return {
    categories,
    totalCategories,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
