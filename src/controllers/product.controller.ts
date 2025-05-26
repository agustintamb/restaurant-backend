import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
} from '../services/product.service';

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const createdBy = req.user?.id;
    const product = await createProductService(req.body, createdBy);
    res.status(201).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedBy = req.user?.id;
    const product = await updateProductService(req.params.id, req.body, updatedBy);
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const deletedBy = req.user?.id;
    const product = await deleteProductService(req.params.id, deletedBy);
    res.json({
      message: 'Producto desactivado correctamente',
      product: product,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await getProductsService(req.query);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
