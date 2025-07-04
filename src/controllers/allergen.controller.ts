import { Request, Response } from 'express';
import {
  createAllergenService,
  updateAllergenService,
  deleteAllergenService,
  getAllergenByIdService,
  getAllergensService,
  restoreAllergenService,
} from '@/services/allergen.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';


/**
 * @swagger
 * /allergens:
 *   post:
 *     summary: Crear nuevo alérgeno
 *     tags: [Alérgenos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAllergenRequest'
 *     responses:
 *       201:
 *         description: Alérgeno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllergenResponse'
 *       400:
 *         description: Error en la validación o alérgeno ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const createAllergen = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const allergen = await createAllergenService(req.body, token);
    res.status(201).json({
      message: 'Alérgeno creado exitosamente',
      result: allergen,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /allergens/{id}:
 *   put:
 *     summary: Actualizar alérgeno
 *     tags: [Alérgenos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del alérgeno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAllergenRequest'
 *     responses:
 *       200:
 *         description: Alérgeno actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllergenResponse'
 *       400:
 *         description: Error en la validación o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Alérgeno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const updateAllergen = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const allergen = await updateAllergenService(req.params.id, req.body, token);
    res.status(200).json({
      message: 'Alérgeno actualizado exitosamente',
      result: allergen,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /allergens/{id}:
 *   delete:
 *     summary: Eliminar alérgeno (eliminación lógica)
 *     tags: [Alérgenos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del alérgeno
 *     responses:
 *       200:
 *         description: Alérgeno eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteAllergenResponse'
 *       400:
 *         description: Error en la solicitud o alérgeno ya eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Alérgeno no encontrado
 *       401:
 *         description: No autorizado
 */
export const deleteAllergen = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const result = await deleteAllergenService(req.params.id, token);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /allergens/{id}:
 *   get:
 *     summary: Obtener alérgeno por ID
 *     tags: [Alérgenos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del alérgeno
 *     responses:
 *       200:
 *         description: Alérgeno obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllergenResponse'
 *       404:
 *         description: Alérgeno no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 */
export const getAllergenById = async (req: Request, res: Response) => {
  try {
    const allergen = await getAllergenByIdService(req.params.id);
    res.status(200).json({
      message: 'Alérgeno obtenido exitosamente',
      result: allergen,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

/**
 * @swagger
 * /allergens:
 *   get:
 *     summary: Obtener lista de alérgenos
 *     tags: [Alérgenos]
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
 *         description: Cantidad de alérgenos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (busca en name)
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir alérgenos eliminados
 *     responses:
 *       200:
 *         description: Lista de alérgenos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllergensListResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const getAllergens = async (req: Request, res: Response) => {
  try {
    const result = await getAllergensService(req.query);
    res.status(200).json({
      message: 'Lista de alérgenos obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /allergens/{id}/restore:
 *   patch:
 *     summary: Restaurar alérgeno eliminado
 *     tags: [Alérgenos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del alérgeno a restaurar
 *     responses:
 *       200:
 *         description: Alérgeno restaurado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllergenResponse'
 *       400:
 *         description: Error en la solicitud o alérgeno no está eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Alérgeno no encontrado
 *       401:
 *         description: No autorizado
 */
export const restoreAllergen = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const allergen = await restoreAllergenService(req.params.id, token);
    res.status(200).json({
      message: 'Alérgeno restaurado exitosamente',
      result: allergen,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
