import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  createUserService,
  updateUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
} from '../services/user.service';

export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const createdBy = req.user?.id;
    const user = await createUserService(req.body, createdBy);
    res.status(201).json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedBy = req.user?.id;
    const user = await updateUserService(req.params.id, req.body, updatedBy);
    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedBy = req.user?.id;
    const user = await deleteUserService(req.params.id, deletedBy);
    res.json({
      message: 'Usuario eliminado correctamente',
      user: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.json(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await getUsersService(req.query);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
