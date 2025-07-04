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

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crear nuevo contacto (público)
 *     tags: [Contactos]
 *     description: Endpoint público para enviar mensajes de contacto desde el sitio web
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContactRequest'
 *     responses:
 *       201:
 *         description: Mensaje enviado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *       400:
 *         description: Error en la validación de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /contacts/{id}/mark-as-read:
 *   patch:
 *     summary: Marcar contacto como leído
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contacto
 *     responses:
 *       200:
 *         description: Contacto marcado como leído exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarkAsReadContactResponse'
 *       400:
 *         description: Error en la solicitud o contacto ya está leído
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contacto no encontrado
 *       401:
 *         description: No autorizado
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Eliminar contacto (eliminación lógica)
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contacto
 *     responses:
 *       200:
 *         description: Contacto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteContactResponse'
 *       400:
 *         description: Error en la solicitud o contacto ya eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contacto no encontrado
 *       401:
 *         description: No autorizado
 */
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

/**
 * @swagger
 * /contacts/{id}/restore:
 *   patch:
 *     summary: Restaurar contacto eliminado
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contacto a restaurar
 *     responses:
 *       200:
 *         description: Contacto restaurado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *       400:
 *         description: Error en la solicitud o contacto no está eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Contacto no encontrado
 *       401:
 *         description: No autorizado
 */
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

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Obtener contacto por ID
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contacto
 *     responses:
 *       200:
 *         description: Contacto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactResponse'
 *       404:
 *         description: Contacto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 */
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

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Obtener lista de contactos
 *     tags: [Contactos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *           default: "1"
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *           default: "10"
 *         description: Cantidad de contactos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (busca en name, email, phone, message)
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir contactos eliminados
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filtrar por estado de lectura (true=leídos, false=no leídos)
 *     responses:
 *       200:
 *         description: Lista de contactos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactsListResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
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
