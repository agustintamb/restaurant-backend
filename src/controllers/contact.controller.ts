import { Request, Response } from 'express';
import {
  createContactService,
  markAsReadContactService,
  deleteContactService,
  getContactByIdService,
  getContactsService,
  restoreContactService,
} from '@/services/contact.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

// Esta ruta es PÚBLICA - no requiere autenticación
export const createContact = async (req: Request, res: Response) => {
  try {
    const contact = await createContactService(req.body);
    res.status(201).json({
      message: 'Mensaje enviado exitosamente',
      result: contact,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

// Las siguientes rutas requieren autenticación y rol admin
export const markAsReadContact = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const contact = await markAsReadContactService(req.params.id, token);
    res.status(200).json({
      message: 'Contacto marcado como leído exitosamente',
      result: contact,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const result = await deleteContactService(req.params.id, token);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const restoreContact = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const contact = await restoreContactService(req.params.id, token);
    res.status(200).json({
      message: 'Contacto restaurado exitosamente',
      result: contact,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const contact = await getContactByIdService(req.params.id);
    res.status(200).json({
      message: 'Contacto obtenido exitosamente',
      result: contact,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const result = await getContactsService(req.query);
    res.status(200).json({
      message: 'Lista de contactos obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
