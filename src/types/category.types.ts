import { Types, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameSlug: string;
  subcategories?: Types.ObjectId[];
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
  nameSlug?: string;
  createdBy?: string;
}

export interface IUpdateCategory {
  name?: string;
  nameSlug?: string;
  updatedBy?: string;
}

export interface GetCategoriesQuery {
  page?: string;
  limit?: string;
  search?: string;
  includeDeleted?: string;
  includeSubcategories?: string;
}

export interface PaginatedCategoriesResult {
  categories: ICategory[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
