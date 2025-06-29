import { Types, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin';
  comparePassword(password: string): Promise<boolean>;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedBy?: Types.ObjectId;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface ICreateUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'admin';
  createdBy?: string;
}

export interface IUpdateUser {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'admin';
}

export interface IUpdateUserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface GetUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
  includeDeleted?: string;
}

export interface PaginatedResult {
  users: IUser[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
