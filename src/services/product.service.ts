import mongoose from 'mongoose';
import { Product } from '../models/Product.model';
import { Category } from '../models/Category.model';
import { ProductCreateRequest, ProductUpdateRequest, ProductQuery } from '../types/product.types';

export const createProductService = async (productData: ProductCreateRequest) => {
  // Verificar que la categoría existe
  const category = await Category.findById(productData.categoryId);
  if (!category) {
    throw new Error('Categoría no encontrada');
  }

  const product = new Product(productData);
  await product.save();
  return product.populate('categoryId');
};

export const updateProductService = async (id: string, updateData: ProductUpdateRequest) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de producto inválido');
  }

  // Si se actualiza categoryId, verificar que existe
  if (updateData.categoryId) {
    const category = await Category.findById(updateData.categoryId);
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
  }

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true }).populate(
    'categoryId'
  );
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  return product;
};

export const deleteProductService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de producto inválido');
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  return product;
};

export const getProductByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de producto inválido');
  }

  const product = await Product.findById(id).populate('categoryId');
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  return product;
};

export const getProductsService = async (query: ProductQuery) => {
  const { category, subcategory, search, page, limit } = query;

  // Construir filtros
  let filters: any = {};

  if (category) {
    // Buscar categoría por nombre o ID
    let categoryDoc;
    if (mongoose.Types.ObjectId.isValid(category)) {
      categoryDoc = await Category.findById(category);
    } else {
      categoryDoc = await Category.findOne({ name: { $regex: category, $options: 'i' } });
    }
    if (categoryDoc) {
      filters.categoryId = categoryDoc._id;
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
    const products = await Product.find(filters).populate('categoryId').sort({ createdAt: -1 });
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
