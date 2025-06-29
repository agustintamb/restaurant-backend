import { Request, Response } from 'express';
import {
  createDishService,
  updateDishService,
  deleteDishService,
  getDishByIdService,
  getDishesService,
} from '@/services/dish.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

export const createDish = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const dish = await createDishService(req.body, token);
    res.status(201).json({
      message: 'Plato creado exitosamente',
      result: dish,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const updateDish = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const dish = await updateDishService(req.params.id, req.body, token);
    res.status(200).json({
      message: 'Plato actualizado exitosamente',
      result: dish,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

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
