export const categorySchemas = {
  Category: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único de la categoría',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      name: {
        type: 'string',
        description: 'Nombre de la categoría',
        example: 'Entradas',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug del nombre para URLs',
        example: 'entradas',
      },
      subcategories: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string', description: 'ID de subcategoría' },
            { $ref: '#/components/schemas/SubcategoryReference' },
          ],
        },
        description: 'Lista de subcategorías asociadas',
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
    required: ['_id', 'name', 'nameSlug', 'isDeleted', 'createdAt', 'updatedAt'],
  },

  // Referencia de subcategoría para populate
  SubcategoryReference: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID de la subcategoría',
      },
      name: {
        type: 'string',
        description: 'Nombre de la subcategoría',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug de la subcategoría',
      },
    },
  },

  // Schema para crear categoría
  CreateCategoryRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre de la categoría (debe ser único)',
        minLength: 2,
        maxLength: 50,
        example: 'Entradas',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug personalizado (opcional, se genera automáticamente)',
        minLength: 2,
        maxLength: 50,
        example: 'entradas',
      },
    },
  },

  // Schema para actualizar categoría
  UpdateCategoryRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nuevo nombre de la categoría',
        minLength: 2,
        maxLength: 50,
        example: 'Platos Principales',
      },
      nameSlug: {
        type: 'string',
        description: 'Nuevo slug personalizado',
        minLength: 2,
        maxLength: 50,
        example: 'platos-principales',
      },
    },
  },

  // Schema para la paginación de categorías
  PaginatedCategories: {
    type: 'object',
    properties: {
      categories: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Category',
        },
        description: 'Lista de categorías',
      },
      totalCategories: {
        type: 'number',
        description: 'Total de categorías',
        example: 8,
      },
      totalPages: {
        type: 'number',
        description: 'Total de páginas',
        example: 1,
      },
      currentPage: {
        type: 'number',
        description: 'Página actual',
        example: 1,
      },
      hasNextPage: {
        type: 'boolean',
        description: 'Indica si hay página siguiente',
        example: false,
      },
      hasPrevPage: {
        type: 'boolean',
        description: 'Indica si hay página anterior',
        example: false,
      },
    },
    required: [
      'categories',
      'totalCategories',
      'totalPages',
      'currentPage',
      'hasNextPage',
      'hasPrevPage',
    ],
  },

  // Schema para query parameters de getCategories
  GetCategoriesQuery: {
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
        description: 'Cantidad de categorías por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda (busca en name y nameSlug)',
        example: 'entrada',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir categorías eliminadas',
        example: 'false',
        default: 'false',
      },
      includeSubcategories: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir subcategorías en la respuesta',
        example: 'true',
        default: 'false',
      },
    },
  },

  // Schemas para respuestas con patrón message/result
  CategoryResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Categoría creada exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Category',
      },
    },
    required: ['message', 'result'],
  },

  CategoriesListResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Lista de categorías obtenida exitosamente',
      },
      result: {
        $ref: '#/components/schemas/PaginatedCategories',
      },
    },
    required: ['message', 'result'],
  },

  DeleteCategoryResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Categoría eliminada exitosamente',
      },
    },
    required: ['message'],
  },
};
