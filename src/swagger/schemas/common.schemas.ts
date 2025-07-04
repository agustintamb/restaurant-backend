export const commonSchemas = {
  // Schema para errores
  ErrorResponse: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Mensaje de error',
        example: 'Recurso no encontrado',
      },
    },
    required: ['error'],
  },

  // Schema genérico para respuestas de éxito con mensaje
  SuccessResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Operación realizada exitosamente',
      },
    },
    required: ['message'],
  },

  // Schema para parámetros de ID en rutas
  IdParameter: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID del recurso',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
    },
    required: ['id'],
  },

  // Schema base para paginación
  PaginationMeta: {
    type: 'object',
    properties: {
      totalPages: {
        type: 'number',
        description: 'Total de páginas',
        example: 5,
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
    required: ['totalPages', 'currentPage', 'hasNextPage', 'hasPrevPage'],
  },

  // Schema para query parameters comunes de paginación
  PaginationQuery: {
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
        description: 'Cantidad de registros por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda',
        example: 'buscar',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir registros eliminados',
        example: 'false',
        default: 'false',
      },
    },
  },
};
