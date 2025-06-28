export const authSchemas = {
  LoginRequest: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        description: 'Nombre de usuario (email)',
        example: 'admin@mail.com',
      },
      password: {
        type: 'string',
        description: 'Contraseña del usuario',
        example: 'admin123',
      },
    },
  },
  LoginResponse: {
    type: 'object',
    properties: {
      token: {
        type: 'string',
        description: 'Token JWT para autenticación',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'ID del usuario',
          },
          username: {
            type: 'string',
            description: 'Nombre de usuario',
          },
          firstName: {
            type: 'string',
            description: 'Nombre del usuario',
          },
          lastName: {
            type: 'string',
            description: 'Apellido del usuario',
          },
          role: {
            type: 'string',
            description: 'Rol del usuario',
          },
        },
      },
    },
  },
};
