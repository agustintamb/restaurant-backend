import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import { Category } from '../models/Category.model';
import { ProductCreateRequest, ProductUpdateRequest, ProductQuery } from '../types/product.types';

export const createProductService = async (
  productData: ProductCreateRequest,
  createdBy?: string
) => {
  // Verificar que la categoría existe y está activa
  const category = await Category.findOne({ _id: productData.categoryId, isActive: true });
  if (!category) {
    throw new Error('Categoría no encontrada o inactiva');
  }

  // Verificar que no existe un producto activo con el mismo nombre en la misma categoría
  const existingProduct = await Product.findOne({
    name: productData.name,
    categoryId: productData.categoryId,
    isActive: true,
  });

  if (existingProduct) {
    throw new Error('Ya existe un producto con ese nombre en esta categoría');
  }

  const product = new Product({
    ...productData,
    createdBy,
    updatedBy: createdBy,
  });

  await product.save();
  return product.populate('categoryId');
};

export const updateProductService = async (
  id: string,
  updateData: ProductUpdateRequest,
  updatedBy?: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de producto inválido');
  }

  // Verificar que el producto existe y está activo
  const existingProduct = await Product.findOne({ _id: id, isActive: true });
  if (!existingProduct) {
    throw new Error('Producto no encontrado');
  }

  // Si se actualiza categoryId, verificar que existe y está activa
  if (updateData.categoryId) {
    const category = await Category.findOne({ _id: updateData.categoryId, isActive: true });
    if (!category) {
      throw new Error('Categoría no encontrada o inactiva');
    }
  }

  // Si se actualiza el nombre, verificar que no existe otro producto activo con ese nombre en la misma categoría
  if (updateData.name) {
    const categoryId = updateData.categoryId || existingProduct.categoryId;
    const duplicateProduct = await Product.findOne({
      name: updateData.name,
      categoryId: categoryId,
      _id: { $ne: id },
      isActive: true,
    });

    if (duplicateProduct) {
      throw new Error('Ya existe un producto con ese nombre en esta categoría');
    }
  }

  const product = await Product.findByIdAndUpdate(
    id,
    {
      ...updateData,
      updatedBy,
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('categoryId');

  return product;
};

export const deleteProductService = async (id: string, deletedBy?: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de producto inválido');
  }

  // Soft delete: cambiar isActive a false
  const product = await Product.findOneAndUpdate(
    { _id: id, isActive: true },
    {
      isActive: false,
      updatedBy: deletedBy,
      updatedAt: new Date(),
    },
    { new: true }
  ).populate('categoryId');

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  return product;
};

export const getProductByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de producto inválido');
  }

  const product = await Product.findOne({ _id: id, isActive: true })
    .populate('categoryId')
    .populate('createdBy', 'username')
    .populate('updatedBy', 'username');

  if (!product) {
    throw new Error('Producto no encontrado');
  }

  return product;
};

export const getProductsService = async (query: ProductQuery) => {
  const { category, subcategory, search, page, limit, includeInactive } = query;

  // Por default solo productos activos
  let filters: any = {};
  filters.isActive = true;

  if (category) {
    // Buscar categoría por nombre o ID (solo categorías activas)
    let categoryDoc;
    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryDoc = await Category.findOne({ _id: category, isActive: true });
    } else {
      categoryDoc = await Category.findOne({
        name: { $regex: category, $options: 'i' },
        isActive: true,
      });
    }
    if (categoryDoc) {
      filters.categoryId = categoryDoc._id;
    } else {
      // Si no se encuentra la categoría, no devolver productos
      filters.categoryId = null;
    }
  }

  if (subcategory) {
    filters.subcategoryId = subcategory;
  }

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { ingredientes: { $elemMatch: { $regex: search, $options: 'i' } } },
    ];
  }

  // Si no hay page ni limit, devolver todos los productos sin paginar
  if (!page && !limit) {
    const products = await Product.find(filters)
      .populate('categoryId')
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .sort({ createdAt: -1 });

    return {
      products,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: products.length,
        itemsPerPage: products.length,
      },
    };
  }

  // Paginación usando mongoose
  const currentPage = parseInt(page?.toString() || '1');
  const itemsPerPage = parseInt(limit?.toString() || '10');
  const skip = (currentPage - 1) * itemsPerPage;

  const [products, totalItems] = await Promise.all([
    Product.find(filters)
      .populate('categoryId')
      .populate('createdBy', 'username')
      .populate('updatedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage),
    Product.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    products,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
    },
  };
};
