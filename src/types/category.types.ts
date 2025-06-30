import { Types, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  subcategories?: Types.ObjectId[]; // Referencias a subcategorías
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface ICreateCategory {
  name: string;
  createdBy?: string;
}

export interface IUpdateCategory {
  name?: string;
  updatedBy?: string;
}

export interface GetCategoriesQuery {
  page?: string;
  limit?: string;
  search?: string;
  includeDeleted?: string;
  includeSubcategories?: string; // Para incluir las subcategorías en el populate
}

export interface PaginatedCategoriesResult {
  categories: ICategory[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
