import { Request } from 'express';

const getTokenFromRequest = (req: Request): string => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new Error('Token no proporcionado');
  return authHeader.substring(7); // Remover "Bearer "
};

export default getTokenFromRequest;
