export const commonSchemas = {
  Error: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Mensaje de error',
        example: 'Ha ocurrido un error',
      },
    },
  },
  Success: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Operación completada exitosamente',
      },
    },
  },
  ValidationError: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Mensaje de error de validación',
        example: 'Datos de entrada inválidos',
      },
      details: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Campo con error',
            },
            message: {
              type: 'string',
              description: 'Mensaje específico del error',
            },
          },
        },
      },
    },
  },
};
