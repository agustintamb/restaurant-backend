import { Types, Document } from 'mongoose';

export interface ISubcategory extends Document {
  name: string;
  category: Types.ObjectId; // Referencia a la categoría padre
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface ICreateSubcategory {
  name: string;
  categoryId: string; // ID de la categoría padre
  createdBy?: string;
}

export interface IUpdateSubcategory {
  name?: string;
  categoryId?: string;
  updatedBy?: string;
}

export interface GetSubcategoriesQuery {
  page?: string;
  limit?: string;
  search?: string;
  categoryId?: string; // Para filtrar por categoría
  includeDeleted?: string;
  includeCategory?: string; // Para incluir la categoría en el populate
}

export interface PaginatedSubcategoriesResult {
  subcategories: ISubcategory[];
  totalSubcategories: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
