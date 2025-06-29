import { Request, Response } from 'express';
import {
  createIngredientService,
  updateIngredientService,
  deleteIngredientService,
  getIngredientByIdService,
  getIngredientsService,
} from '@/services/ingredient.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

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
