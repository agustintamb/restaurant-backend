import { Types, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  readBy?: Types.ObjectId;
  readAt?: Date;
  createdAt: Date;
  deletedBy?: Types.ObjectId;
  deletedAt?: Date;
  restoredBy?: Types.ObjectId;
  restoredAt?: Date;
  isDeleted: boolean;
}

export interface ICreateContact {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface GetContactsQuery {
  page?: string;
  limit?: string;
  search?: string;
  includeDeleted?: string;
  isRead?: string;
}

export interface PaginatedContactsResult {
  contacts: IContact[];
  totalContacts: number;
  totalUnread: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
