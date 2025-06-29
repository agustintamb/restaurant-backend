import { Request, Response } from 'express';
import {
  createAllergenService,
  updateAllergenService,
  deleteAllergenService,
  getAllergenByIdService,
  getAllergensService,
} from '@/services/allergen.service';
import getTokenFromRequest from '@/utils/getTokenFromRequest';

export const createAllergen = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const allergen = await createAllergenService(req.body, token);
    res.status(201).json({
      message: 'Alérgeno creado exitosamente',
      result: allergen,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const updateAllergen = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const allergen = await updateAllergenService(req.params.id, req.body, token);
    res.status(200).json({
      message: 'Alérgeno actualizado exitosamente',
      result: allergen,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const deleteAllergen = async (req: Request, res: Response) => {
  try {
    const token = getTokenFromRequest(req);
    const result = await deleteAllergenService(req.params.id, token);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const getAllergenById = async (req: Request, res: Response) => {
  try {
    const allergen = await getAllergenByIdService(req.params.id);
    res.status(200).json({
      message: 'Alérgeno obtenido exitosamente',
      result: allergen,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

export const getAllergens = async (req: Request, res: Response) => {
  try {
    const result = await getAllergensService(req.query);
    res.status(200).json({
      message: 'Lista de alérgenos obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
