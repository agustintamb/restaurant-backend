import { Types, Document } from 'mongoose';

export interface IAllergen extends Document {
  name: string;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface ICreateAllergen {
  name: string;
  createdBy?: string;
}

export interface IUpdateAllergen {
  name?: string;
  updatedBy?: string;
}

export interface GetAllergensQuery {
  page?: string;
  limit?: string;
  search?: string;
  includeDeleted?: string;
}

export interface PaginatedAllergensResult {
  allergens: IAllergen[];
  totalAllergens: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
