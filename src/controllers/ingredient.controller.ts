import { Request, Response } from 'express';
import {
  createIngredientService,
  updateIngredientService,
  deleteIngredientService,
  getIngredientByIdService,
  getIngredientsService,
  restoreIngredientService,
} from '@/services/ingredient.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

/**
 * @swagger
 * /ingredients:
 *   post:
 *     summary: Crear nuevo ingrediente
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIngredientRequest'
 *     responses:
 *       201:
 *         description: Ingrediente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngredientResponse'
 *       400:
 *         description: Error en la validación o ingrediente ya existe
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
export const createIngredient = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const ingredient = await createIngredientService(req.body, token);
    res.status(201).json({
      message: 'Ingrediente creado exitosamente',
      result: ingredient,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /ingredients/{id}:
 *   put:
 *     summary: Actualizar ingrediente
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ingrediente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateIngredientRequest'
 *     responses:
 *       200:
 *         description: Ingrediente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngredientResponse'
 *       400:
 *         description: Error en la validación o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ingrediente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const ingredient = await updateIngredientService(req.params.id, req.body, token);
    res.status(200).json({
      message: 'Ingrediente actualizado exitosamente',
      result: ingredient,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /ingredients/{id}:
 *   delete:
 *     summary: Eliminar ingrediente (eliminación lógica)
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ingrediente
 *     responses:
 *       200:
 *         description: Ingrediente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteIngredientResponse'
 *       400:
 *         description: Error en la solicitud o ingrediente ya eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ingrediente no encontrado
 *       401:
 *         description: No autorizado
 */
export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const result = await deleteIngredientService(req.params.id, token);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /ingredients/{id}/restore:
 *   patch:
 *     summary: Restaurar ingrediente eliminado
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ingrediente a restaurar
 *     responses:
 *       200:
 *         description: Ingrediente restaurado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngredientResponse'
 *       400:
 *         description: Error en la solicitud o ingrediente no está eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Ingrediente no encontrado
 *       401:
 *         description: No autorizado
 */
export const restoreIngredient = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const ingredient = await restoreIngredientService(req.params.id, token);
    res.status(200).json({
      message: 'Ingrediente restaurado exitosamente',
      result: ingredient,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /ingredients/{id}:
 *   get:
 *     summary: Obtener ingrediente por ID
 *     tags: [Ingredientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ingrediente
 *     responses:
 *       200:
 *         description: Ingrediente obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngredientResponse'
 *       404:
 *         description: Ingrediente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 */
export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const ingredient = await getIngredientByIdService(req.params.id);
    res.status(200).json({
      message: 'Ingrediente obtenido exitosamente',
      result: ingredient,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Obtener lista de ingredientes
 *     tags: [Ingredientes]
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
 *         description: Cantidad de ingredientes por página
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
 *         description: Incluir ingredientes eliminados
 *     responses:
 *       200:
 *         description: Lista de ingredientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngredientsListResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const getIngredients = async (req: Request, res: Response) => {
  try {
    const result = await getIngredientsService(req.query);
    res.status(200).json({
      message: 'Lista de ingredientes obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
