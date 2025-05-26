import mongoose from 'mongoose';
import { Category } from '../models/Category.model';
import {
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryQuery,
} from '../types/category.types';

export const createCategoryService = async (
  categoryData: CategoryCreateRequest,
  createdBy?: string
) => {
  // Verificar que no existe una categoría activa con el mismo nombre
  const existingCategory = await Category.findOne({
    name: categoryData.name,
    isActive: true,
  });

  if (existingCategory) {
    throw new Error('Ya existe una categoría con ese nombre');
  }

  const category = new Category({
    ...categoryData,
    createdBy,
    updatedBy: createdBy,
  });

  await category.save();
  return category;
};

export const updateCategoryService = async (
  id: string,
  updateData: CategoryUpdateRequest,
  updatedBy?: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de categoría inválido');
  }

  // Verificar que la categoría existe y está activa
  const existingCategory = await Category.findOne({ _id: id, isActive: true });
  if (!existingCategory) {
    throw new Error('Categoría no encontrada');
  }

  // Si se actualiza el nombre, verificar que no existe otra categoría activa con ese nombre
  if (updateData.name) {
    const duplicateCategory = await Category.findOne({
      name: updateData.name,
      _id: { $ne: id },
      isActive: true,
    });

    if (duplicateCategory) {
      throw new Error('Ya existe una categoría con ese nombre');
    }
  }

  const category = await Category.findByIdAndUpdate(
    id,
    {
      ...updateData,
      updatedBy,
      updatedAt: new Date(),
    },
    { new: true }
  );

  return category;
};

export const deleteCategoryService = async (id: string, deletedBy?: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de categoría inválido');
  }

  // Verificar que no hay productos activos asociados
  const Product = mongoose.model('Product');
  const activeProductsCount = await Product.countDocuments({
    categoryId: id,
    isActive: true,
  });

  if (activeProductsCount > 0) {
    throw new Error('No se puede eliminar la categoría porque tiene productos activos asociados');
  }

  // Soft delete: cambiar isActive a false
  const category = await Category.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      isActive: false,
      updatedBy: deletedBy,
      updatedAt: new Date(),
    },
    { new: true }
  );

  if (!category) {
    throw new Error('Categoría no encontrada');
  }

  return category;
};

export const getCategoryByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findOne({ _id: id, isActive: true })
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');

  if (!category) {
    throw new Error('Categoría no encontrada');
  }

  return category;
};

export const getCategoriesService = async (query: CategoryQuery = {}) => {
  const { search } = query;

  // Por default solo categorias activas
  let filters: any = {};
  filters.isActive = true;

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  return Category.find(filters)
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username')
    .sort({ createdAt: -1 });
};
