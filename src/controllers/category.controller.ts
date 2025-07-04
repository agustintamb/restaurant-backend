import { Request, Response } from 'express';
import {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  getCategoriesService,
  restoreCategoryService,
} from '@/services/category.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear nueva categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Error en la validación o categoría ya existe
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
export const createCategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const category = await createCategoryService(req.body, token);
    res.status(201).json({
      message: 'Categoría creada exitosamente',
      result: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Actualizar categoría
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Error en la validación o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const category = await updateCategoryService(req.params.id, req.body, token);
    res.status(200).json({
      message: 'Categoría actualizada exitosamente',
      result: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Eliminar categoría (eliminación lógica)
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteCategoryResponse'
 *       400:
 *         description: Error en la solicitud, categoría ya eliminada o tiene subcategorías asociadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 */
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const result = await deleteCategoryService(req.params.id, token);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /categories/{id}/restore:
 *   patch:
 *     summary: Restaurar categoría eliminada
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría a restaurar
 *     responses:
 *       200:
 *         description: Categoría restaurada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Error en la solicitud o categoría no está eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Categoría no encontrada
 *       401:
 *         description: No autorizado
 */
export const restoreCategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const category = await restoreCategoryService(req.params.id, token);
    res.status(200).json({
      message: 'Categoría restaurada exitosamente',
      result: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtener categoría por ID
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoryResponse'
 *       404:
 *         description: Categoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 */
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    res.status(200).json({
      message: 'Categoría obtenida exitosamente',
      result: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener lista de categorías
 *     tags: [Categorías]
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
 *         description: Cantidad de categorías por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (busca en name y nameSlug)
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir categorías eliminadas
 *       - in: query
 *         name: includeSubcategories
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir subcategorías en la respuesta
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CategoriesListResponse'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await getCategoriesService(req.query);
    res.status(200).json({
      message: 'Lista de categorías obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
