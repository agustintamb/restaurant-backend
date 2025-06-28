export const userSchemas = {
  User: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único del usuario',
      },
      username: {
        type: 'string',
        description: 'Nombre de usuario (email)',
        example: 'admin@mail.com',
      },
      firstName: {
        type: 'string',
        description: 'Nombre del usuario',
        example: 'Juan',
      },
      lastName: {
        type: 'string',
        description: 'Apellido del usuario',
        example: 'Pérez',
      },
      phone: {
        type: 'string',
        description: 'Número de teléfono',
        example: '+54 9 11 1234-5678',
      },
      role: {
        type: 'string',
        enum: ['admin'],
        description: 'Rol del usuario',
        example: 'admin',
      },
      createdBy: {
        type: 'string',
        description: 'ID del usuario que lo creó',
      },
      modifiedBy: {
        type: 'string',
        description: 'ID del usuario que lo modificó',
      },
      deletedBy: {
        type: 'string',
        description: 'ID del usuario que lo eliminó',
      },
      deletedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de eliminación',
      },
      isDeleted: {
        type: 'boolean',
        description: 'Estado de eliminación lógica',
        example: false,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de creación',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de última actualización',
      },
    },
  },
  CreateUser: {
    type: 'object',
    required: ['username', 'password', 'firstName', 'lastName'],
    properties: {
      username: {
        type: 'string',
        description: 'Nombre de usuario (email)',
        example: 'nuevo@mail.com',
      },
      password: {
        type: 'string',
        description: 'Contraseña del usuario',
        example: 'password123',
      },
      firstName: {
        type: 'string',
        description: 'Nombre del usuario',
        example: 'María',
      },
      lastName: {
        type: 'string',
        description: 'Apellido del usuario',
        example: 'González',
      },
      phone: {
        type: 'string',
        description: 'Número de teléfono (opcional)',
        example: '+54 9 11 9876-5432',
      },
      createdBy: {
        type: 'string',
        description: 'ID del usuario que lo crea',
      },
    },
  },
  UpdateUser: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        description: 'Nuevo nombre de usuario',
        example: 'actualizado@mail.com',
      },
      password: {
        type: 'string',
        description: 'Nueva contraseña',
        example: 'newpassword123',
      },
      firstName: {
        type: 'string',
        description: 'Nuevo nombre',
        example: 'Carlos',
      },
      lastName: {
        type: 'string',
        description: 'Nuevo apellido',
        example: 'Rodríguez',
      },
      phone: {
        type: 'string',
        description: 'Nuevo número de teléfono',
        example: '+54 9 11 5555-4444',
      },
      modifiedBy: {
        type: 'string',
        description: 'ID del usuario que lo modifica',
      },
    },
  },
  UpdateUserProfile: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        description: 'Nuevo nombre',
        example: 'Carlos',
      },
      lastName: {
        type: 'string',
        description: 'Nuevo apellido',
        example: 'Rodríguez',
      },
      phone: {
        type: 'string',
        description: 'Nuevo número de teléfono',
        example: '+54 9 11 5555-4444',
      },
      modifiedBy: {
        type: 'string',
        description: 'ID del usuario que lo modifica',
      },
    },
  },
  PaginatedUsers: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User',
        },
      },
      totalUsers: {
        type: 'number',
        description: 'Total de usuarios',
        example: 25,
      },
      totalPages: {
        type: 'number',
        description: 'Total de páginas',
        example: 3,
      },
      currentPage: {
        type: 'number',
        description: 'Página actual',
        example: 1,
      },
      hasNextPage: {
        type: 'boolean',
        description: 'Indica si hay página siguiente',
        example: true,
      },
      hasPrevPage: {
        type: 'boolean',
        description: 'Indica si hay página anterior',
        example: false,
      },
    },
  },
  // Schemas para las respuestas con el patrón message/result
  UserResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Usuario obtenido exitosamente',
      },
      result: {
        $ref: '#/components/schemas/User',
      },
    },
  },
  CurrentUserResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Datos del usuario obtenidos correctamente',
      },
      result: {
        allOf: [
          { $ref: '#/components/schemas/User' },
          {
            type: 'object',
            properties: {
              createdBy: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                    description: 'Username del usuario que lo creó',
                  },
                },
              },
              updatedBy: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                    description: 'Username del usuario que lo actualizó',
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
  UsersListResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Lista de usuarios obtenida exitosamente',
      },
      result: {
        $ref: '#/components/schemas/PaginatedUsers',
      },
    },
  },
};
