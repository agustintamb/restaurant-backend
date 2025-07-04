export const allergenSchemas = {
  Allergen: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único del alérgeno',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      name: {
        type: 'string',
        description: 'Nombre del alérgeno',
        example: 'Gluten',
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

  // Schema para crear alérgeno
  CreateAllergenRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre del alérgeno (debe ser único)',
        minLength: 2,
        maxLength: 50,
        example: 'Gluten',
      },
    },
  },

  // Schema para actualizar alérgeno
  UpdateAllergenRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nuevo nombre del alérgeno',
        minLength: 2,
        maxLength: 50,
        example: 'Lactosa',
      },
    },
  },

  // Schema para la paginación de alérgenos
  PaginatedAllergens: {
    type: 'object',
    properties: {
      allergens: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Allergen',
        },
        description: 'Lista de alérgenos',
      },
      totalAllergens: {
        type: 'number',
        description: 'Total de alérgenos',
        example: 15,
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
      'allergens',
      'totalAllergens',
      'totalPages',
      'currentPage',
      'hasNextPage',
      'hasPrevPage',
    ],
  },

  // Schema para query parameters de getAllergens
  GetAllergensQuery: {
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
        description: 'Cantidad de alérgenos por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda (busca en name)',
        example: 'gluten',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir alérgenos eliminados',
        example: 'false',
        default: 'false',
      },
    },
  },

  // Schemas para respuestas con patrón message/result
  AllergenResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Alérgeno creado exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Allergen',
      },
    },
    required: ['message', 'result'],
  },

  AllergensListResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Lista de alérgenos obtenida exitosamente',
      },
      result: {
        $ref: '#/components/schemas/PaginatedAllergens',
      },
    },
    required: ['message', 'result'],
  },

  DeleteAllergenResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Alérgeno eliminado exitosamente',
      },
    },
    required: ['message'],
  },
};
