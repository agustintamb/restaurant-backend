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
