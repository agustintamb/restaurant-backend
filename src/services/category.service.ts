import mongoose from 'mongoose';
import { Category } from '../models/Category.model';
import { CategoryCreateRequest, CategoryUpdateRequest } from '../types/category.types';

export const createCategoryService = async (categoryData: CategoryCreateRequest) => {
  const category = new Category(categoryData);
  await category.save();
  return category;
};

export const updateCategoryService = async (id: string, updateData: CategoryUpdateRequest) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  return category;
};

export const deleteCategoryService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de categoría inválido');
  }

  // Verificar que no hay productos asociados
  const Product = mongoose.model('Product');
  const productsCount = await Product.countDocuments({ categoryId: id });
  if (productsCount > 0) {
    throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  return category;
};

export const getCategoryByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de categoría inválido');
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }
  return category;
};

export const getCategoriesService = async () => {
  return Category.find().sort({ createdAt: -1 });
};
