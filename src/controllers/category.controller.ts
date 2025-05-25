import { Request, Response } from 'express';
import {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  getCategoriesService,
} from '../services/category.service';

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await createCategoryService(req.body);
    res.status(201).json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    await deleteCategoryService(req.params.id);
    res.status(204).send();
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
    const categories = await getCategoriesService();
    res.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
