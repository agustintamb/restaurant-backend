import { Allergen } from '@/models/Allergen.model';
import { Types } from 'mongoose';
import {
  ICreateAllergen,
  GetAllergensQuery,
  IAllergen,
  PaginatedAllergensResult,
  IUpdateAllergen,
} from '@/types/allergen.types';
import { validateTokenService } from './auth.service';

export const createAllergenService = async (
  allergenData: ICreateAllergen,
  token: string
): Promise<IAllergen> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  const existingAllergen = await Allergen.findOne({ name: allergenData.name });
  if (existingAllergen) throw new Error('El alérgeno ya existe');

  const allergen = new Allergen({
    name: allergenData.name,
    createdBy: new Types.ObjectId(currentUserId), // Usuario que crea
  });

  await allergen.save();
  return allergen;
};

export const updateAllergenService = async (
  allergenId: string,
  updateData: IUpdateAllergen,
  token: string
): Promise<IAllergen> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(allergenId)) {
    throw new Error('ID de alérgeno inválido');
  }

  const allergen = await Allergen.findById(allergenId);
  if (!allergen) throw new Error('Alérgeno no encontrado');

  // Verificar si el nombre ya existe (si se está actualizando)
  if (updateData.name && updateData.name !== allergen.name) {
    const existingAllergen = await Allergen.findOne({ name: updateData.name });
    if (existingAllergen) throw new Error('El nombre del alérgeno ya existe');
  }

  // Actualizar campos
  if (updateData.name) allergen.name = updateData.name;

  // Establecer automáticamente el usuario que modifica
  allergen.updatedBy = new Types.ObjectId(currentUserId);

  await allergen.save();
  return allergen;
};

export const deleteAllergenService = async (
  allergenId: string,
  token: string
): Promise<{ message: string }> => {
  // Obtener el usuario que realiza la acción desde el token
  const { id: currentUserId } = await validateTokenService(token);

  if (!Types.ObjectId.isValid(allergenId)) {
    throw new Error('ID de alérgeno inválido');
  }

  const allergen = await Allergen.findById(allergenId);
  if (!allergen) throw new Error('Alérgeno no encontrado');
  if (allergen.isDeleted) throw new Error('El alérgeno ya está eliminado');

  // Eliminación lógica con auditoría
  allergen.isDeleted = true;
  allergen.deletedAt = new Date();
  allergen.deletedBy = new Types.ObjectId(currentUserId); // Usuario que elimina

  await allergen.save();

  return {
    message: 'Alérgeno eliminado exitosamente',
  };
};

export const getAllergenByIdService = async (allergenId: string): Promise<IAllergen> => {
  if (!Types.ObjectId.isValid(allergenId)) throw new Error('ID de alérgeno inválido');

  const allergen = await Allergen.findById(allergenId);
  if (!allergen) throw new Error('Alérgeno no encontrado');

  return allergen;
};

export const getAllergensService = async (
  query: GetAllergensQuery
): Promise<PaginatedAllergensResult> => {
  const page = parseInt(query.page || '1');
  const limit = parseInt(query.limit || '10');
  const search = query.search || '';
  const includeDeleted = query.includeDeleted === 'true';

  // Filtros para la búsqueda
  const filters: any = {};

  if (search) {
    filters.name = { $regex: search, $options: 'i' };
  }

  // No incluir eliminados por defecto
  if (!includeDeleted) {
    filters.isDeleted = { $ne: true };
  }

  // Calcular skip
  const skip = (page - 1) * limit;

  // Ejecutar consultas con populate para obtener datos de los usuarios en createdBy, updatedBy, deletedBy
  const [allergens, totalAllergens] = await Promise.all([
    Allergen.find(filters)
      .populate('createdBy', 'firstName lastName username')
      .populate('updatedBy', 'firstName lastName username')
      .populate('deletedBy', 'firstName lastName username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Allergen.countDocuments(filters),
  ]);

  const totalPages = Math.ceil(totalAllergens / limit);

  return {
    allergens,
    totalAllergens,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
