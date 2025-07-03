import { Types, Document } from 'mongoose';

export interface IDish extends Document {
  name: string;
  nameSlug: string;
  description: string;
  price: number;
  image: string;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  ingredients: Types.ObjectId[];
  allergens: Types.ObjectId[];
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  isDeleted: boolean;
}

export interface ICreateDish {
  name: string;
  nameSlug?: string;
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
  nameSlug?: string;
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
  categoryId?: string;
  subcategoryId?: string;
  includeDeleted?: string;
  includeRelations?: string;
}

export interface PaginatedDishesResult {
  dishes: IDish[];
  totalDishes: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
