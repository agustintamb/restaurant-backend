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
