import { Request, Response } from 'express';
import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductByIdService,
  getProductsService,
} from '../services/product.service';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await updateProductService(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await deleteProductService(req.params.id);
    res.status(204).send();
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
