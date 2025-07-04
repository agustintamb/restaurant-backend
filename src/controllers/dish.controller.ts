import { Request, Response } from 'express';
import {
  createDishService,
  updateDishService,
  deleteDishService,
  getDishByIdService,
  getDishesService,
  restoreDishService,
} from '@/services/dish.service';
import { uploadDishImageService } from '@/services/upload.service';
import parseArrayField from '@/utils/parseArrayField';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

/**
 * @swagger
 * /dishes:
 *   post:
 *     summary: Crear nuevo plato
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateDishRequest'
 *     responses:
 *       201:
 *         description: Plato creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DishResponse'
 *       400:
 *         description: Error en la validación, datos inválidos o relaciones no válidas
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
export const createDish = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    let dishData = { ...req.body };

    // Parse array fields from JSON strings
    if (dishData.ingredientIds) {
      dishData.ingredientIds = parseArrayField(dishData.ingredientIds);
    }
    if (dishData.allergenIds) {
      dishData.allergenIds = parseArrayField(dishData.allergenIds);
    }

    // Handle image upload if present
    if (req.file) {
      const imageUrl = await uploadDishImageService(req.file.buffer, req.file.originalname);
      dishData.image = imageUrl;
    }

    const dish = await createDishService(dishData, token);
    res.status(201).json({
      message: 'Plato creado exitosamente',
      result: dish,
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /dishes/{id}:
 *   put:
 *     summary: Actualizar plato
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del plato
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDishRequest'
 *     responses:
 *       200:
 *         description: Plato actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DishResponse'
 *       400:
 *         description: Error en la validación, datos inválidos o relaciones no válidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Plato no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const updateDish = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    let updateData = { ...req.body };

    // Parse array fields from JSON strings
    if (updateData.ingredientIds) {
      updateData.ingredientIds = parseArrayField(updateData.ingredientIds);
    }
    if (updateData.allergenIds) {
      updateData.allergenIds = parseArrayField(updateData.allergenIds);
    }

    // Handle image upload if present
    if (req.file) {
      const imageUrl = await uploadDishImageService(
        req.file.buffer,
        req.file.originalname,
        req.params.id
      );
      updateData.image = imageUrl;
    }

    const dish = await updateDishService(req.params.id, updateData, token);
    res.status(200).json({
      message: 'Plato actualizado exitosamente',
      result: dish,
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /dishes/{id}:
 *   delete:
 *     summary: Eliminar plato (eliminación lógica)
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del plato
 *     responses:
 *       200:
 *         description: Plato eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteDishResponse'
 *       400:
 *         description: Error en la solicitud o plato ya eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Plato no encontrado
 *       401:
 *         description: No autorizado
 */
export const deleteDish = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const result = await deleteDishService(req.params.id, token);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /dishes/{id}/restore:
 *   patch:
 *     summary: Restaurar plato eliminado
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del plato a restaurar
 *     responses:
 *       200:
 *         description: Plato restaurado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DishResponse'
 *       400:
 *         description: Error en la solicitud o plato no está eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Plato no encontrado
 *       401:
 *         description: No autorizado
 */
export const restoreDish = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const dish = await restoreDishService(req.params.id, token);
    res.status(200).json({
      message: 'Plato restaurado exitosamente',
      result: dish,
    });
  } catch (error) {
    console.error('Error restoring dish:', error);
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /dishes/{id}:
 *   get:
 *     summary: Obtener plato por ID
 *     tags: [Platos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del plato
 *     responses:
 *       200:
 *         description: Plato obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DishResponse'
 *       404:
 *         description: Plato no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido
 */
export const getDishById = async (req: Request, res: Response) => {
  try {
    const dish = await getDishByIdService(req.params.id);
    res.status(200).json({
      message: 'Plato obtenido exitosamente',
      result: dish,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

/**
 * @swagger
 * /dishes:
 *   get:
 *     summary: Obtener lista de platos
 *     tags: [Platos]
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
 *         description: Cantidad de platos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (busca en name, nameSlug, description)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: subcategoryId
 *         schema:
 *           type: string
 *         description: Filtrar por ID de subcategoría
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir platos eliminados
 *       - in: query
 *         name: includeRelations
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir categorías, subcategorías, ingredientes y alérgenos en la respuesta
 *     responses:
 *       200:
 *         description: Lista de platos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DishesListResponse'
 *       400:
 *         description: Error en la solicitud o parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getDishes = async (req: Request, res: Response) => {
  try {
    const result = await getDishesService(req.query);
    res.status(200).json({
      message: 'Lista de platos obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
