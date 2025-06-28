import { Request, Response } from 'express';
import {
  createUserService,
  updateUserService,
  updateUserProfileService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  getCurrentUserDataService,
} from '@/services/user.service';

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error en la validación o usuario ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no válido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      result: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error en la validación o ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no válido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    res.status(200).json({
      message: 'Usuario actualizado exitosamente',
      result: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /users/profile/{id}:
 *   put:
 *     summary: Actualizar perfil de usuario (sin contraseña)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserProfile'
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error en la validación o ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no válido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await updateUserProfileService(req.params.id, req.body);
    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      result: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario (eliminación lógica)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Error en la validación, ID inválido o usuario ya eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no válido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await deleteUserService(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: ID de usuario inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no válido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await getUserByIdService(req.params.id);
    res.status(200).json({
      message: 'Usuario obtenido exitosamente',
      result: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(404).json({ error: message });
  }
};

/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Obtener datos del usuario actual
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentUserResponse'
 *       400:
 *         description: Token no proporcionado o ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no válido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getCurrentUserDataService(token);
    res.status(200).json({
      message: 'Datos del usuario obtenidos correctamente',
      result: user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener lista de usuarios con paginación
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad de usuarios por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre de usuario, nombre, apellido o teléfono
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir usuarios eliminados
 *     responses:
 *       200:
 *         description: Lista de usuarios con paginación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       400:
 *         description: Error en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token no válido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await getUsersService(req.query);
    res.status(200).json({
      message: 'Lista de usuarios obtenida exitosamente',
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ha ocurrido un error';
    res.status(400).json({ error: message });
  }
};
