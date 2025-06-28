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
            example: '60d0fe4f5311236168a109ca',
          },
          username: {
            type: 'string',
            description: 'Nombre de usuario (email)',
            example: 'admin@mail.com',
          },
          role: {
            type: 'string',
            description: 'Rol del usuario',
            example: 'admin',
          },
        },
      },
    },
  },
  LoginResponseWrapper: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Inicio de sesión exitoso',
      },
      result: {
        $ref: '#/components/schemas/LoginResponse',
      },
    },
  },
};
