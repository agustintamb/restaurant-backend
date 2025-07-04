export const dishSchemas = {
  Dish: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único del plato',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      name: {
        type: 'string',
        description: 'Nombre del plato',
        example: 'Empanadas de Carne',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug del nombre para URLs',
        example: 'empanadas-de-carne',
      },
      description: {
        type: 'string',
        description: 'Descripción del plato',
        example: 'Deliciosas empanadas caseras rellenas de carne picada con cebolla y especias',
      },
      price: {
        type: 'number',
        description: 'Precio del plato',
        minimum: 0,
        example: 1500,
      },
      image: {
        type: 'string',
        description: 'URL de la imagen del plato',
        example: 'https://example.com/images/empanadas.jpg',
      },
      category: {
        oneOf: [
          { type: 'string', description: 'ID de la categoría' },
          { $ref: '#/components/schemas/CategoryReference' },
        ],
      },
      subcategory: {
        oneOf: [
          { type: 'string', description: 'ID de la subcategoría' },
          { $ref: '#/components/schemas/SubcategoryReference' },
        ],
        nullable: true,
      },
      ingredients: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string', description: 'ID del ingrediente' },
            { $ref: '#/components/schemas/IngredientReference' },
          ],
        },
        description: 'Lista de ingredientes del plato',
      },
      allergens: {
        type: 'array',
        items: {
          oneOf: [
            { type: 'string', description: 'ID del alérgeno' },
            { $ref: '#/components/schemas/AllergenReference' },
          ],
        },
        description: 'Lista de alérgenos del plato',
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
    required: [
      '_id',
      'name',
      'nameSlug',
      'description',
      'price',
      'image',
      'category',
      'ingredients',
      'allergens',
      'isDeleted',
      'createdAt',
      'updatedAt',
    ],
  },

  // Referencias para populate
  CategoryReference: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID de la categoría',
      },
      name: {
        type: 'string',
        description: 'Nombre de la categoría',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug de la categoría',
      },
    },
  },

  IngredientReference: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID del ingrediente',
      },
      name: {
        type: 'string',
        description: 'Nombre del ingrediente',
      },
    },
  },

  AllergenReference: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID del alérgeno',
      },
      name: {
        type: 'string',
        description: 'Nombre del alérgeno',
      },
    },
  },

  // Schema para crear plato
  CreateDishRequest: {
    type: 'object',
    required: ['name', 'description', 'price', 'categoryId', 'ingredientIds', 'allergenIds'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre del plato (debe ser único)',
        minLength: 2,
        maxLength: 100,
        example: 'Empanadas de Carne',
      },
      nameSlug: {
        type: 'string',
        description: 'Slug personalizado (opcional, se genera automáticamente)',
        minLength: 2,
        maxLength: 100,
        example: 'empanadas-de-carne',
      },
      description: {
        type: 'string',
        description: 'Descripción del plato',
        minLength: 10,
        maxLength: 500,
        example: 'Deliciosas empanadas caseras rellenas de carne picada con cebolla y especias',
      },
      price: {
        type: 'number',
        description: 'Precio del plato',
        minimum: 0,
        example: 1500,
      },
      categoryId: {
        type: 'string',
        description: 'ID de la categoría',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      subcategoryId: {
        type: 'string',
        description: 'ID de la subcategoría (opcional)',
        example: '64f1a2b3c4d5e6f7a8b9c0d2',
        nullable: true,
      },
      ingredientIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Array de IDs de ingredientes',
        example: ['64f1a2b3c4d5e6f7a8b9c0d3', '64f1a2b3c4d5e6f7a8b9c0d4'],
      },
      allergenIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Array de IDs de alérgenos',
        example: ['64f1a2b3c4d5e6f7a8b9c0d5'],
      },
      image: {
        type: 'string',
        format: 'binary',
        description: 'Imagen del plato (archivo)',
      },
    },
  },

  // Schema para actualizar plato
  UpdateDishRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nuevo nombre del plato',
        minLength: 2,
        maxLength: 100,
        example: 'Empanadas de Carne Especiales',
      },
      nameSlug: {
        type: 'string',
        description: 'Nuevo slug personalizado',
        minLength: 2,
        maxLength: 100,
        example: 'empanadas-de-carne-especiales',
      },
      description: {
        type: 'string',
        description: 'Nueva descripción del plato',
        minLength: 10,
        maxLength: 500,
        example: 'Empanadas artesanales con carne premium y especias gourmet',
      },
      price: {
        type: 'number',
        description: 'Nuevo precio del plato',
        minimum: 0,
        example: 1800,
      },
      categoryId: {
        type: 'string',
        description: 'Nuevo ID de categoría',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      subcategoryId: {
        type: 'string',
        description: 'Nuevo ID de subcategoría',
        example: '64f1a2b3c4d5e6f7a8b9c0d2',
        nullable: true,
      },
      ingredientIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Nuevos IDs de ingredientes',
        example: ['64f1a2b3c4d5e6f7a8b9c0d3', '64f1a2b3c4d5e6f7a8b9c0d4'],
      },
      allergenIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Nuevos IDs de alérgenos',
        example: ['64f1a2b3c4d5e6f7a8b9c0d5'],
      },
      image: {
        type: 'string',
        format: 'binary',
        description: 'Nueva imagen del plato (archivo)',
      },
    },
  },

  // Schema para la paginación de platos
  PaginatedDishes: {
    type: 'object',
    properties: {
      dishes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Dish',
        },
        description: 'Lista de platos',
      },
      totalDishes: {
        type: 'number',
        description: 'Total de platos',
        example: 45,
      },
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
    required: ['dishes', 'totalDishes', 'totalPages', 'currentPage', 'hasNextPage', 'hasPrevPage'],
  },

  // Schema para query parameters de getDishes
  GetDishesQuery: {
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
        description: 'Cantidad de platos por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda (busca en name, nameSlug, description)',
        example: 'empanada',
      },
      categoryId: {
        type: 'string',
        description: 'Filtrar por ID de categoría',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      subcategoryId: {
        type: 'string',
        description: 'Filtrar por ID de subcategoría',
        example: '64f1a2b3c4d5e6f7a8b9c0d2',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir platos eliminados',
        example: 'false',
        default: 'false',
      },
      includeRelations: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir categorías, subcategorías, ingredientes y alérgenos en la respuesta',
        example: 'true',
        default: 'false',
      },
    },
  },

  // Schemas para respuestas con patrón message/result
  DishResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Plato creado exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Dish',
      },
    },
    required: ['message', 'result'],
  },

  DishesListResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Lista de platos obtenida exitosamente',
      },
      result: {
        $ref: '#/components/schemas/PaginatedDishes',
      },
    },
    required: ['message', 'result'],
  },

  DeleteDishResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Plato eliminado exitosamente',
      },
    },
    required: ['message'],
  },
};
