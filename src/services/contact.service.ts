import mongoose from 'mongoose';
import { Contact } from '@/models/Contact.model';
import { ICreateContact, GetContactsQuery, PaginatedContactsResult } from '@/types/contact.types';
import { validateTokenService } from '@/services/auth.service';

export const createContactService = async (contactData: ICreateContact) => {
  const contact = new Contact(contactData);
  await contact.save();
  return contact;
};

export const markAsReadContactService = async (contactId: string, token?: string) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) throw new Error('ID de contacto inválido');

  const contact = await Contact.findById(contactId);

  if (!contact) throw new Error('Contacto no encontrado');
  if (contact.isDeleted) throw new Error('No se puede marcar como leído un contacto eliminado');
  if (contact.isRead) throw new Error('El contacto ya está marcado como leído');

  let userId;
  if (token) {
    const user = await validateTokenService(token);
    userId = user.id;
  }

  // Marcar como leído
  contact.isRead = true;
  contact.readAt = new Date();
  if (userId) contact.readBy = userId;

  await contact.save();

  return contact;
};

export const deleteContactService = async (contactId: string, token?: string) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) throw new Error('ID de contacto inválido');

  const contact = await Contact.findById(contactId);

  if (!contact) throw new Error('Contacto no encontrado');
  if (contact.isDeleted) throw new Error('El contacto ya está eliminado');

  let userId;
  if (token) {
    const user = await validateTokenService(token);
    userId = user._id;
  }

  // Soft delete manual
  contact.isDeleted = true;
  contact.deletedAt = new Date();
  if (userId) contact.deletedBy = userId;

  // Limpiar campos de restore
  contact.restoredAt = undefined;
  contact.restoredBy = undefined;
  await contact.save();

  return {
    message: 'Contacto eliminado exitosamente',
    result: contact,
  };
};

export const getContactByIdService = async (contactId: string) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) throw new Error('ID de contacto inválido');

  const contact = await Contact.findById(contactId)
    .populate('readBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username');

  if (!contact) throw new Error('Contacto no encontrado');

  return contact;
};

export const getContactsService = async (
  query: GetContactsQuery
): Promise<PaginatedContactsResult> => {
  const { page = '1', limit = '10', search = '', includeDeleted = 'false', isRead } = query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  // Construir filtros
  const filters: any = {};

  // Filtro de eliminados
  if (includeDeleted === 'false') filters.isDeleted = false;

  // Filtro de leídos/no leídos
  if (isRead === 'true') filters.isRead = true;
  else if (isRead === 'false') filters.isRead = false;

  // Filtro de búsqueda
  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i' } },
    ];
  }

  const contacts = await Contact.find(filters)
    .populate('readBy', 'firstName lastName username')
    .populate('deletedBy', 'firstName lastName username')
    .populate('restoredBy', 'firstName lastName username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  const totalContacts = await Contact.countDocuments(filters);
  const totalUnread = await Contact.countDocuments({ isRead: false, isDeleted: false });
  const totalPages = Math.ceil(totalContacts / limitNumber);

  return {
    contacts,
    totalContacts,
    totalUnread,
    totalPages,
    currentPage: pageNumber,
    hasNextPage: pageNumber < totalPages,
    hasPrevPage: pageNumber > 1,
  };
};

export const restoreContactService = async (contactId: string, token?: string) => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) throw new Error('ID de contacto inválido');

  const contact = await Contact.findById(contactId);
  if (!contact) throw new Error('Contacto no encontrado');

  if (!contact.isDeleted) throw new Error('El contacto no está eliminado');

  let userId;
  if (token) {
    const user = await validateTokenService(token);
    userId = user._id;
  }

  // Restore manual
  contact.isDeleted = false;
  contact.restoredAt = new Date();
  if (userId) contact.restoredBy = userId;

  await contact.save();

  return contact;
};
