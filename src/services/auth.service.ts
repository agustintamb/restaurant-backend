import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { CONFIG } from '../config/env.config';
import { LoginRequest } from '../types/auth.types';

export const loginService = async (loginData: LoginRequest) => {
  const { username, password } = loginData;

  // Buscar usuario
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar contraseña
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas');
  }

  // Generar token
  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    CONFIG.jwtSecret!,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: (user._id as string).toString(),
      username: user.username,
      role: user.role,
    },
  };
};
