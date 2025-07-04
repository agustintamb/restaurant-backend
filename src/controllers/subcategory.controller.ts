import { Request, Response } from 'express';
import {
  createSubcategoryService,
  updateSubcategoryService,
  deleteSubcategoryService,
  getSubcategoryByIdService,
  getSubcategoriesService,
  restoreSubcategoryService,
} from '@/services/subcategory.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Crear nueva subcategoría
 *     tags: [Subcategorías]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSubcategoryRequest'
 *     responses:
 *       201:
 *         description: Subcategoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubcategoryResponse'
 *       400:
 *         description: Error en la validación, subcategoría ya existe o categoría padre no existe
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
export const createSubcategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const subcategory = await createSubcategoryService(req.body, token);
    res.status(201).json({
      message: 'Subcategoría creada exitosamente',
      result: subcategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Actualizar subcategoría
 *     tags: [Subcategorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la subcategoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSubcategoryRequest'
 *     responses:
 *       200:
 *         description: Subcategoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubcategoryResponse'
 *       400:
 *         description: Error en la validación o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Subcategoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const updateSubcategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const subcategory = await updateSubcategoryService(req.params.id, req.body, token);
    res.status(200).json({
      message: 'Subcategoría actualizada exitosamente',
      result: subcategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Eliminar subcategoría (eliminación lógica)
 *     tags: [Subcategorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la subcategoría
 *     responses:
 *       200:
 *         description: Subcategoría eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSubcategoryResponse'
 *       400:
 *         description: Error en la solicitud, subcategoría ya eliminada o está siendo usada por platos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Subcategoría no encontrada
 *       401:
 *         description: No autorizado
 */
export const deleteSubcategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const result = await deleteSubcategoryService(req.params.id, token);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /subcategories/{id}/restore:
 *   patch:
 *     summary: Restaurar subcategoría eliminada
 *     tags: [Subcategorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la subcategoría a restaurar
 *     responses:
 *       200:
 *         description: Subcategoría restaurada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubcategoryResponse'
 *       400:
 *         description: Error en la solicitud o subcategoría no está eliminada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Subcategoría no encontrada
 *       401:
 *         description: No autorizado
 */
export const restoreSubcategory = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const subcategory = await restoreSubcategoryService(req.params.id, token);
    res.status(200).json({
      message: 'Subcategoría restaurada exitosamente',
      result: subcategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Obtener subcategoría por ID
 *     tags: [Subcategorías]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la subcategoría
 *     responses:
 *       200:
 *         description: Subcategoría obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubcategoryResponse'
 *       404:
 *         description: Subcategoría no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: No autorizado
 */
export const getSubcategoryById = async (req: Request, res: Response) => {
  try {
    const subcategory = await getSubcategoryByIdService(req.params.id);
    res.status(200).json({
      message: 'Subcategoría obtenida exitosamente',
      result: subcategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Obtener lista de subcategorías
 *     tags: [Subcategorías]
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
 *         description: Cantidad de subcategorías por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda (busca en name y nameSlug)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtrar por ID de categoría padre
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir subcategorías eliminadas
 *       - in: query
 *         name: includeCategory
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *           default: "false"
 *         description: Incluir información de la categoría padre en la respuesta
 *     responses:
 *       200:
 *         description: Lista de subcategorías obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubcategoriesListResponse'
 *       400:
 *         description: Error en la solicitud o parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: No autorizado
 */
export const getSubcategories = async (req: Request, res: Response) => {
  try {
    const result = await getSubcategoriesService(req.query);
    res.status(200).json({
      message: 'Lista de subcategorías obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
