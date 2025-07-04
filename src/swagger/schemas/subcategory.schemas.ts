export const subcategorySchemas = {
  Subcategory: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único de la subcategoría',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      name: {
        type: 'string',
        description: 'Nombre de la subcategoría',
        example: 'Empanadas',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug del nombre para URLs',
        example: 'empanadas',
      },
      category: {
        oneOf: [
          { type: 'string', description: 'ID de la categoría padre' },
          { $ref: '#/components/schemas/CategoryReference' },
        ],
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
    required: ['_id', 'name', 'nameSlug', 'category', 'isDeleted', 'createdAt', 'updatedAt'],
  },

  // Schema para crear subcategoría
  CreateSubcategoryRequest: {
    type: 'object',
    required: ['name', 'categoryId'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre de la subcategoría (debe ser único dentro de la categoría)',
        minLength: 2,
        maxLength: 50,
        example: 'Empanadas',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug personalizado (opcional, se genera automáticamente)',
        minLength: 2,
        maxLength: 50,
        example: 'empanadas',
      },
      categoryId: {
        type: 'string',
        description: 'ID de la categoría padre',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
    },
  },

  // Schema para actualizar subcategoría
  UpdateSubcategoryRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nuevo nombre de la subcategoría',
        minLength: 2,
        maxLength: 50,
        example: 'Empanadas Especiales',
      },
      nameSlug: {
        type: 'string',
        description: 'Nuevo slug personalizado',
        minLength: 2,
        maxLength: 50,
        example: 'empanadas-especiales',
      },
      categoryId: {
        type: 'string',
        description: 'Nuevo ID de categoría padre',
        example: '64f1a2b3c4d5e6f7a8b9c0d2',
      },
    },
  },

  // Schema para la paginación de subcategorías
  PaginatedSubcategories: {
    type: 'object',
    properties: {
      subcategories: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Subcategory',
        },
        description: 'Lista de subcategorías',
      },
      totalSubcategories: {
        type: 'number',
        description: 'Total de subcategorías',
        example: 20,
      },
      totalPages: {
        type: 'number',
        description: 'Total de páginas',
        example: 2,
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
      'subcategories',
      'totalSubcategories',
      'totalPages',
      'currentPage',
      'hasNextPage',
      'hasPrevPage',
    ],
  },

  // Schema para query parameters de getSubcategories
  GetSubcategoriesQuery: {
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
        description: 'Cantidad de subcategorías por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda (busca en name y nameSlug)',
        example: 'empanada',
      },
      categoryId: {
        type: 'string',
        description: 'Filtrar por ID de categoría padre',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir subcategorías eliminadas',
        example: 'false',
        default: 'false',
      },
      includeCategory: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir información de la categoría padre en la respuesta',
        example: 'true',
        default: 'false',
      },
    },
  },

  // Schemas para respuestas con patrón message/result
  SubcategoryResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Subcategoría creada exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Subcategory',
      },
    },
    required: ['message', 'result'],
  },

  SubcategoriesListResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Lista de subcategorías obtenida exitosamente',
      },
      result: {
        $ref: '#/components/schemas/PaginatedSubcategories',
      },
    },
    required: ['message', 'result'],
  },

  DeleteSubcategoryResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Subcategoría eliminada exitosamente',
      },
    },
    required: ['message'],
  },
};
