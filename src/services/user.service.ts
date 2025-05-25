import mongoose from 'mongoose';
import { User } from '../models/User.model';
import { UserCreateRequest, UserUpdateRequest, UserQuery } from '../types/user.types';

export const createUserService = async (userData: UserCreateRequest) => {
  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) {
    throw new Error('El nombre de usuario ya existe');
  }

  const user = new User(userData);
  await user.save();
  return user.toObject({
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  });
};

export const updateUserService = async (id: string, updateData: UserUpdateRequest) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de usuario inválido');
  }

  // Si se actualiza username, verificar que no existe
  if (updateData.username) {
    const existingUser = await User.findOne({
      username: updateData.username,
      _id: { $ne: id },
    });
    if (existingUser) {
      throw new Error('El nombre de usuario ya existe');
    }
  }

  const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};

export const deleteUserService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de usuario inválido');
  }

  const user = await User.findByIdAndDelete(id).select('-password');
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};

export const getUserByIdService = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('ID de usuario inválido');
  }

  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};

export const getUsersService = async (query: UserQuery) => {
  const { search, page, limit } = query;

  // Construir filtros
  let filters: any = {};

  if (search) {
    filters.username = { $regex: search, $options: 'i' };
  }

  // Paginación usando mongoose
  const currentPage = parseInt(page?.toString() || '1');
  const itemsPerPage = parseInt(limit?.toString() || '10');
  const skip = (currentPage - 1) * itemsPerPage;

  const [users, totalItems] = await Promise.all([
    User.find(filters).select('-password').sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage),
    User.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return {
    users,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
    },
  };
};
