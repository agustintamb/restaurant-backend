export const ingredientSchemas = {
  Ingredient: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único del ingrediente',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      name: {
        type: 'string',
        description: 'Nombre del ingrediente',
        example: 'Cebolla',
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
      restoredBy: {
        oneOf: [
          { type: 'string', description: 'ID del usuario que lo restauró' },
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
      restoredAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha de restauración',
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
    required: ['_id', 'name', 'isDeleted', 'createdAt', 'updatedAt'],
  },

  // Schema para crear ingrediente
  CreateIngredientRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre del ingrediente (debe ser único)',
        minLength: 2,
        maxLength: 50,
        example: 'Cebolla',
      },
    },
  },

  // Schema para actualizar ingrediente
  UpdateIngredientRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nuevo nombre del ingrediente',
        minLength: 2,
        maxLength: 50,
        example: 'Cebolla Morada',
      },
    },
  },

  // Schema para la paginación de ingredientes
  PaginatedIngredients: {
    type: 'object',
    properties: {
      ingredients: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Ingredient',
        },
        description: 'Lista de ingredientes',
      },
      totalIngredients: {
        type: 'number',
        description: 'Total de ingredientes',
        example: 30,
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
    required: [
      'ingredients',
      'totalIngredients',
      'totalPages',
      'currentPage',
      'hasNextPage',
      'hasPrevPage',
    ],
  },

  // Schema para query parameters de getIngredients
  GetIngredientsQuery: {
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
        description: 'Cantidad de ingredientes por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda (busca en name)',
        example: 'cebolla',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir ingredientes eliminados',
        example: 'false',
        default: 'false',
      },
    },
  },

  // Schemas para respuestas con patrón message/result
  IngredientResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Ingrediente creado exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Ingredient',
      },
    },
    required: ['message', 'result'],
  },

  IngredientsListResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Lista de ingredientes obtenida exitosamente',
      },
      result: {
        $ref: '#/components/schemas/PaginatedIngredients',
      },
    },
    required: ['message', 'result'],
  },

  DeleteIngredientResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Ingrediente eliminado exitosamente',
      },
    },
    required: ['message'],
  },
};
