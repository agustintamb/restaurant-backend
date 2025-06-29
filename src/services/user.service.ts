import { User } from '@/models/User.model';
import {
  ICreateUser,
  GetUsersQuery,
  IUser,
  PaginatedResult,
  IUpdateUser,
  IUpdateUserProfile,
} from '@/types/user.types';
import mongoose, { Types } from 'mongoose';
import { validateTokenService } from './auth.service';

export const createUserService = async (userData: ICreateUser, token: string): Promise<IUser> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  const existingUser = await User.findOne({ username: userData.username });
  if (existingUser) throw new Error('El usuario ya existe');

  const user = new User({
    username: userData.username,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    role: userData.role || 'admin',
    createdBy: new Types.ObjectId(currentUserId), // Usuario que crea
  });
  await user.save();

  // Return sin la pw
  const userObject = user.toObject();
  delete userObject.password;
  return userObject as IUser;
};

export const updateUserService = async (
  userId: string,
  updateData: IUpdateUser,
  token: string
): Promise<IUser> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario inválido');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  // Verificar si el username ya existe (si se está actualizando)
  if (updateData.username && updateData.username !== user.username) {
    const existingUser = await User.findOne({ username: updateData.username });
    if (existingUser) throw new Error('El nombre de usuario ya existe');
  }

  // Actualizar campos
  if (updateData.username) user.username = updateData.username;
  if (updateData.password) user.password = updateData.password;
  if (updateData.firstName) user.firstName = updateData.firstName;
  if (updateData.lastName) user.lastName = updateData.lastName;
  if (updateData.phone !== undefined) user.phone = updateData.phone;
  if (updateData.role) user.role = updateData.role;

  // Establecer automáticamente el usuario que modifica
  user.updatedBy = new Types.ObjectId(currentUserId);

  await user.save();

  // Return sin la pw
  const userObject = user.toObject();
  delete userObject.password;
  return userObject as IUser;
};

export const updateUserProfileService = async (
  userId: string,
  updateData: IUpdateUserProfile,
  token: string
): Promise<IUser> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario inválido');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  // Actualizar solo campos de perfil (sin username, password, role)
  if (updateData.firstName) user.firstName = updateData.firstName;
  if (updateData.lastName) user.lastName = updateData.lastName;
  if (updateData.phone !== undefined) user.phone = updateData.phone;

  // Establecer automáticamente el usuario que modifica
  user.updatedBy = new Types.ObjectId(currentUserId);

  await user.save();

  // Return sin la pw
  const userObject = user.toObject();
  delete userObject.password;
  return userObject as IUser;
};

export const deleteUserService = async (
  userId: string,
  token: string
): Promise<{ message: string }> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('ID de usuario inválido');
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');
  if (user.isDeleted) throw new Error('El usuario ya está eliminado');

  // Eliminación lógica con auditoría
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.deletedBy = new Types.ObjectId(currentUserId); // Usuario que elimina

  await user.save();

  return {
    message: 'Usuario eliminado exitosamente',
  };
};

export const getUserByIdService = async (userId: string): Promise<IUser> => {
  if (!Types.ObjectId.isValid(userId)) throw new Error('ID de usuario inválido');

  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('Usuario no encontrado');

  return user;
};

export const getCurrentUserDataService = async (token?: string) => {
  if (!token) throw new Error('Token no proporcionado');

  // Validate token and extract user ID
  const { id } = await validateTokenService(token);
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error('ID de usuario inválido');

  const user = await User.findOne({ _id: id, isDeleted: { $ne: true } }).select('-password');
  if (!user) throw new Error('Usuario no encontrado');
  return user;
};

export const getUsersService = async (query: GetUsersQuery): Promise<PaginatedResult> => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const search = query.search || '';
  const includeDeleted = query.includeDeleted === 'true';

  // Filters para la búsqueda
  const filters: any = {};

  if (search) {
    filters.$or = [
      { username: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  // No incluir eliminados por defecto
  if (!includeDeleted) {
    filters.isDeleted = { $ne: true };
  }

  // Calcular skip
  const skip = (page - 1) * limit;

  // Ejecutar consultas con populate para obtener datos de los usuarios en createdBy, updatedBy, deletedBy
  const [users, totalUsers] = await Promise.all([
    User.find(filters)
      .select('-password')
      .populate('createdBy', 'firstName lastName username')
      .populate('updatedBy', 'firstName lastName username')
      .populate('deletedBy', 'firstName lastName username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users,
    totalUsers,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
