import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  getCategoriesService,
} from '../services/category.service';

export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const createdBy = req.user?.id;
    const category = await createCategoryService(req.body, createdBy);
    res.status(201).json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedBy = req.user?.id;
    const category = await updateCategoryService(req.params.id, req.body, updatedBy);
    res.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedBy = req.user?.id;
    const category = await deleteCategoryService(req.params.id, deletedBy);
    res.json({
      message: 'Categoría eliminada correctamente',
      category: category,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    res.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService(req.query);
    res.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
