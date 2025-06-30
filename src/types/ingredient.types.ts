import { Types, Document } from 'mongoose';

export interface IIngredient extends Document {
  name: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  isDeleted: boolean;
}

export interface ICreateIngredient {
  name: string;
  createdBy?: string;
}

export interface IUpdateIngredient {
  name?: string;
  updatedBy?: string;
}

export interface GetIngredientsQuery {
  page?: string;
  limit?: string;
  search?: string;
  includeDeleted?: string;
}

export interface PaginatedIngredientsResult {
  ingredients: IIngredient[];
  totalIngredients: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
