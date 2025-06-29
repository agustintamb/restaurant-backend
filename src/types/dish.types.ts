import { Types, Document } from 'mongoose';

export interface IDish extends Document {
  name: string;
  description: string;
  price: number;
  image: string; // URL o path de la imagen
  category: Types.ObjectId; // Referencia a la categoría
  subcategory?: Types.ObjectId; // Referencia a la subcategoría (opcional)
  ingredients: Types.ObjectId[]; // Referencias a ingredientes
  allergens: Types.ObjectId[]; // Referencias a alérgenos
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface ICreateDish {
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  subcategoryId?: string;
  ingredientIds: string[];
  allergenIds: string[];
  createdBy?: string;
}

export interface IUpdateDish {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  categoryId?: string;
  subcategoryId?: string;
  ingredientIds?: string[];
  allergenIds?: string[];
  updatedBy?: string;
}

export interface GetDishesQuery {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string; // Para filtrar por categoría
  subcategoryId?: string; // Para filtrar por subcategoría
  includeDeleted?: string;
  includeRelations?: string; // Para incluir category, subcategory, ingredients, allergens
}

export interface PaginatedDishesResult {
  dishes: IDish[];
  totalDishes: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
