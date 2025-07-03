import { Types, Document } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  nameSlug: string;
  category: Types.ObjectId;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface ICreateSubcategory {
  name: string;
  nameSlug?: string;
  categoryId: string;
  createdBy?: string;
}

export interface IUpdateSubcategory {
  name?: string;
  nameSlug?: string;
  categoryId?: string;
  updatedBy?: string;
}

export interface GetSubcategoriesQuery {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string;
  includeDeleted?: string;
  includeCategory?: string;
}

export interface PaginatedSubcategoriesResult {
  subcategories: ISubcategory[];
  totalSubcategories: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
