export const userSchemas = {
  User: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único del usuario',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
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
        nullable: true,
      },
      role: {
        type: 'string',
        enum: ['admin'],
        description: 'Rol del usuario',
        example: 'admin',
      },
      // Campos de auditoría
      createdBy: {
        oneOf: [
          { type: 'string', description: 'ID del usuario que lo creó' },
          { $ref: '#/components/schemas/UserReference' },
        ],
        nullable: true,
      },
      updatedBy: {
        oneOf: [
          { type: 'string', description: 'ID del usuario que lo modificó' },
          { $ref: '#/components/schemas/UserReference' },
        ],
        nullable: true,
      },
      deletedBy: {
        oneOf: [
          { type: 'string', description: 'ID del usuario que lo eliminó' },
          { $ref: '#/components/schemas/UserReference' },
        ],
        nullable: true,
      },
      deletedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de eliminación',
        nullable: true,
      },
      isDeleted: {
        type: 'boolean',
        description: 'Estado de eliminación lógica',
        example: false,
        default: false,
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
    required: [
      '_id',
      'username',
      'firstName',
      'lastName',
      'role',
      'isDeleted',
      'createdAt',
      'updatedAt',
    ],
  },

  // Referencia de usuario para populate
  UserReference: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID del usuario',
      },
      firstName: {
        type: 'string',
        description: 'Nombre del usuario',
      },
      lastName: {
        type: 'string',
        description: 'Apellido del usuario',
      },
      username: {
        type: 'string',
        description: 'Email del usuario',
      },
    },
  },

  // Schema para crear usuario
  CreateUserRequest: {
    type: 'object',
    required: ['username', 'password', 'firstName', 'lastName'],
    properties: {
      username: {
        type: 'string',
        format: 'email',
        description: 'Email del usuario (debe ser único)',
        example: 'nuevo@mail.com',
      },
      password: {
        type: 'string',
        description: 'Contraseña del usuario',
        minLength: 6,
        example: 'password123',
      },
      firstName: {
        type: 'string',
        description: 'Nombre del usuario',
        minLength: 2,
        maxLength: 50,
        example: 'María',
      },
      lastName: {
        type: 'string',
        description: 'Apellido del usuario',
        minLength: 2,
        maxLength: 50,
        example: 'González',
      },
      phone: {
        type: 'string',
        description: 'Número de teléfono (opcional)',
        example: '+54 9 11 9876-5432',
      },
      role: {
        type: 'string',
        enum: ['admin'],
        description: 'Rol del usuario (opcional, por defecto admin)',
        example: 'admin',
      },
    },
  },

  // Schema para actualizar usuario
  UpdateUserRequest: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        format: 'email',
        description: 'Nuevo email del usuario',
        example: 'actualizado@mail.com',
      },
      password: {
        type: 'string',
        description: 'Nueva contraseña',
        minLength: 6,
        example: 'newpassword123',
      },
      firstName: {
        type: 'string',
        description: 'Nuevo nombre',
        minLength: 2,
        maxLength: 50,
        example: 'Carlos',
      },
      lastName: {
        type: 'string',
        description: 'Nuevo apellido',
        minLength: 2,
        maxLength: 50,
        example: 'Rodríguez',
      },
      phone: {
        type: 'string',
        description: 'Nuevo número de teléfono',
        example: '+54 9 11 5555-4444',
      },
      role: {
        type: 'string',
        enum: ['admin'],
        description: 'Nuevo rol del usuario',
        example: 'admin',
      },
    },
  },

  // Schema para actualizar perfil
  UpdateUserProfileRequest: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        description: 'Nuevo nombre',
        minLength: 2,
        maxLength: 50,
        example: 'Carlos',
      },
      lastName: {
        type: 'string',
        description: 'Nuevo apellido',
        minLength: 2,
        maxLength: 50,
        example: 'Rodríguez',
      },
      phone: {
        type: 'string',
        description: 'Nuevo número de teléfono',
        example: '+54 9 11 5555-4444',
      },
    },
  },

  // Schema para la paginación de usuarios
  PaginatedUsers: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User',
        },
        description: 'Lista de usuarios',
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
    required: ['users', 'totalUsers', 'totalPages', 'currentPage', 'hasNextPage', 'hasPrevPage'],
  },

  // Schema para query parameters de getUsers
  GetUsersQuery: {
    type: 'object',
    properties: {
      page: {
        type: 'string',
        description: 'Número de página',
        example: '1',
        default: '1',
      },
      limit: {
        type: 'string',
        description: 'Cantidad de usuarios por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda (busca en username, firstName, lastName, phone)',
        example: 'juan',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir usuarios eliminados',
        example: 'false',
        default: 'false',
      },
    },
  },

  // Schemas para respuestas con patrón message/result
  UserResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Usuario creado exitosamente',
      },
      result: {
        $ref: '#/components/schemas/User',
      },
    },
    required: ['message', 'result'],
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
        $ref: '#/components/schemas/User',
      },
    },
    required: ['message', 'result'],
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
    required: ['message', 'result'],
  },

  DeleteUserResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Usuario eliminado exitosamente',
      },
    },
    required: ['message'],
  },

  // Schema para errores
  ErrorResponse: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Mensaje de error',
        example: 'El usuario ya existe',
      },
    },
    required: ['error'],
  },
};
