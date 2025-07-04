export const authSchemas = {
  // Schema para login request
  LoginRequest: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        format: 'email',
        description: 'Email del usuario',
        example: 'admin@mail.com',
      },
      password: {
        type: 'string',
        description: 'Contraseña del usuario',
        minLength: 6,
        example: 'admin123',
      },
    },
  },

  // Schema para login response
  LoginResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Inicio de sesión exitoso',
      },
      result: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'Token JWT de autenticación',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'ID del usuario',
                example: '64f1a2b3c4d5e6f7a8b9c0d1',
              },
              username: {
                type: 'string',
                description: 'Email del usuario',
                example: 'admin@mail.com',
              },
              role: {
                type: 'string',
                description: 'Rol del usuario',
                example: 'admin',
              },
            },
            required: ['id', 'username', 'role'],
          },
        },
        required: ['token', 'user'],
      },
    },
    required: ['message', 'result'],
  },
};
