import { Subcategory } from '@/models/Subcategory.model';
import { Category } from '@/models/Category.model';
import { Types } from 'mongoose';
import {
  ICreateSubcategory,
  GetSubcategoriesQuery,
  ISubcategory,
  PaginatedSubcategoriesResult,
  IUpdateSubcategory,
} from '@/types/subcategory.types';
import { validateTokenService } from './auth.service';
import { Dish } from '@/models/Dish.model';

export const createSubcategoryService = async (
  subcategoryData: ICreateSubcategory,
  token: string
): Promise<ISubcategory> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  // Verificar que la categoría existe
  if (!Types.ObjectId.isValid(subcategoryData.categoryId)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findById(subcategoryData.categoryId);
  if (!category) throw new Error('La categoría especificada no existe');

  // Verificar que no existe una subcategoría con el mismo nombre en la misma categoría
  const existingSubcategory = await Subcategory.findOne({
    name: subcategoryData.name,
    category: subcategoryData.categoryId,
  });
  if (existingSubcategory) {
    throw new Error('Ya existe una subcategoría con ese nombre en esta categoría');
  }

  const subcategory = new Subcategory({
    name: subcategoryData.name,
    category: new Types.ObjectId(subcategoryData.categoryId),
    createdBy: new Types.ObjectId(currentUserId),
  });

  await subcategory.save();

  // Agregar la subcategoría al array de subcategorías de la categoría
  await Category.findByIdAndUpdate(subcategoryData.categoryId, {
    $push: { subcategories: subcategory._id },
  });

  return subcategory;
};

export const updateSubcategoryService = async (
  subcategoryId: string,
  updateData: IUpdateSubcategory,
  token: string
): Promise<ISubcategory> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(subcategoryId)) {
    throw new Error('ID de subcategoría inválido');
  }

  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) throw new Error('Subcategoría no encontrada');

  // Si se está cambiando la categoría, verificar que existe
  if (updateData.categoryId && updateData.categoryId !== subcategory.category.toString()) {
    if (!Types.ObjectId.isValid(updateData.categoryId)) {
      throw new Error('ID de categoría inválido');
    }

    const newCategory = await Category.findById(updateData.categoryId);
    if (!newCategory) throw new Error('La nueva categoría especificada no existe');

    // Remover de la categoría anterior
    await Category.findByIdAndUpdate(subcategory.category, {
      $pull: { subcategories: subcategory._id },
    });

    // Agregar a la nueva categoría
    await Category.findByIdAndUpdate(updateData.categoryId, {
      $push: { subcategories: subcategory._id },
    });

    subcategory.category = new Types.ObjectId(updateData.categoryId);
  }

  // Verificar si el nombre ya existe en la categoría (si se está actualizando)
  if (updateData.name && updateData.name !== subcategory.name) {
    const categoryId = updateData.categoryId || subcategory.category;
    const existingSubcategory = await Subcategory.findOne({
      name: updateData.name,
      category: categoryId,
      _id: { $ne: subcategoryId },
    });
    if (existingSubcategory) {
      throw new Error('Ya existe una subcategoría con ese nombre en esta categoría');
    }
    subcategory.name = updateData.name;
  }

  // Establecer automáticamente el usuario que modifica
  subcategory.updatedBy = new Types.ObjectId(currentUserId);

  await subcategory.save();
  return subcategory;
};

export const restoreSubcategoryService = async (
  subcategoryId: string,
  token: string
): Promise<ISubcategory> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(subcategoryId)) {
    throw new Error('ID de subcategoría inválido');
  }

  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) throw new Error('Subcategoría no encontrada');
  if (!subcategory.isDeleted) throw new Error('La subcategoría no está eliminada');

  // Restaurar con auditoría
  subcategory.isDeleted = false;
  subcategory.restoredAt = new Date();
  subcategory.restoredBy = new Types.ObjectId(currentUserId);

  await subcategory.save();

  // Agregar la subcategoría de vuelta al array de la categoría
  await Category.findByIdAndUpdate(subcategory.category, {
    $addToSet: { subcategories: subcategory._id },
  });

  return subcategory;
};

export const deleteSubcategoryService = async (
  subcategoryId: string,
  token: string
): Promise<{ message: string }> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(subcategoryId)) {
    throw new Error('ID de subcategoría inválido');
  }

  const subcategory = await Subcategory.findById(subcategoryId);
  if (!subcategory) throw new Error('Subcategoría no encontrada');
  if (subcategory.isDeleted) throw new Error('La subcategoría ya está eliminada');

  // check if a subcategory is used by any dish
  const dishCount = await Dish.countDocuments({ subcategory: subcategory._id });
  if (dishCount > 0)
    throw new Error(
      'No se puede eliminar la subcategoría porque está asignada por uno o más platos'
    );

  // Remover la subcategoría del array de la categoría
  await Category.findByIdAndUpdate(subcategory.category, {
    $pull: { subcategories: subcategory._id },
  });

  // Limpiar campos de restore si existían
  subcategory.restoredAt = undefined;
  subcategory.restoredBy = undefined;

  // Eliminación lógica con auditoría y limpieza de campos de restore
  subcategory.isDeleted = true;
  subcategory.deletedAt = new Date();
  subcategory.deletedBy = new Types.ObjectId(currentUserId);

  await subcategory.save();

  return {
    message: 'Subcategoría eliminada exitosamente',
  };
};

export const getSubcategoryByIdService = async (subcategoryId: string): Promise<ISubcategory> => {
  if (!Types.ObjectId.isValid(subcategoryId)) throw new Error('ID de subcategoría inválido');

  const subcategory = await Subcategory.findById(subcategoryId)
    .populate('category', 'name')
    .populate('createdBy', 'firstName lastName username')
    .populate('updatedBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username');

  if (!subcategory) throw new Error('Subcategoría no encontrada');

  return subcategory;
};

export const getSubcategoriesService = async (
  query: GetSubcategoriesQuery
): Promise<PaginatedSubcategoriesResult> => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const search = query.search || '';
  const categoryId = query.categoryId;
  const includeDeleted = query.includeDeleted === 'true';
  const includeCategory = query.includeCategory === 'true';

  // Filtros para la búsqueda
  const filters: any = {};

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  if (categoryId) {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new Error('ID de categoría inválido');
    }
    filters.category = categoryId;
  }

  // No incluir eliminados por defecto
  if (!includeDeleted) {
    filters.isDeleted = { $ne: true };
  }

  // Calcular skip
  const skip = (page - 1) * limit;

  // Construir la consulta base
  let subcategoriesQuery = Subcategory.find(filters)
    .populate('createdBy', 'firstName lastName username')
    .populate('updatedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username');

  // Incluir categoría si se solicita
  if (includeCategory) {
    subcategoriesQuery = subcategoriesQuery.populate('category', 'name');
  }

  // Ejecutar consultas
  const [subcategories, totalSubcategories] = await Promise.all([
    subcategoriesQuery.skip(skip).limit(limit).sort({ createdAt: -1 }),
    Subcategory.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalSubcategories / limit);

  return {
    subcategories,
    totalSubcategories,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
