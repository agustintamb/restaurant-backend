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
  modifiedBy?: Types.ObjectId;
  modifiedAt: Date;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  isDeleted: boolean;
}

export interface CreateUserDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'admin';
  createdBy?: string;
}

export interface UpdateUserDto {
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'admin';
  modifiedBy?: string;
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
