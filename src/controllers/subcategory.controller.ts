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
