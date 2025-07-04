export const dashboardSchemas = {
  // Schema para estadísticas individuales
  EntityStats: {
    type: 'object',
    properties: {
      total: {
        type: 'number',
        description: 'Total de registros (incluyendo eliminados)',
        example: 100,
      },
      active: {
        type: 'number',
        description: 'Registros activos (no eliminados)',
        example: 95,
      },
      deleted: {
        type: 'number',
        description: 'Registros eliminados',
        example: 5,
      },
    },
    required: ['total', 'active', 'deleted'],
  },

  // Schema para estadísticas de contactos (incluye campos adicionales)
  ContactStats: {
    type: 'object',
    properties: {
      total: {
        type: 'number',
        description: 'Total de contactos (incluyendo eliminados)',
        example: 150,
      },
      active: {
        type: 'number',
        description: 'Contactos activos (no eliminados)',
        example: 140,
      },
      deleted: {
        type: 'number',
        description: 'Contactos eliminados',
        example: 10,
      },
      unread: {
        type: 'number',
        description: 'Contactos no leídos',
        example: 25,
      },
      read: {
        type: 'number',
        description: 'Contactos leídos',
        example: 115,
      },
    },
    required: ['total', 'active', 'deleted', 'unread', 'read'],
  },

  // Schema principal para las estadísticas del dashboard
  DashboardStats: {
    type: 'object',
    properties: {
      dishes: {
        $ref: '#/components/schemas/EntityStats',
        description: 'Estadísticas de platos',
      },
      categories: {
        $ref: '#/components/schemas/EntityStats',
        description: 'Estadísticas de categorías',
      },
      subcategories: {
        $ref: '#/components/schemas/EntityStats',
        description: 'Estadísticas de subcategorías',
      },
      ingredients: {
        $ref: '#/components/schemas/EntityStats',
        description: 'Estadísticas de ingredientes',
      },
      allergens: {
        $ref: '#/components/schemas/EntityStats',
        description: 'Estadísticas de alérgenos',
      },
      users: {
        $ref: '#/components/schemas/EntityStats',
        description: 'Estadísticas de usuarios',
      },
      contacts: {
        $ref: '#/components/schemas/ContactStats',
        description: 'Estadísticas de contactos',
      },
    },
    required: [
      'dishes',
      'categories',
      'subcategories',
      'ingredients',
      'allergens',
      'users',
      'contacts',
    ],
  },

  // Schema para la respuesta del dashboard
  DashboardStatsResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Estadísticas del dashboard obtenidas exitosamente',
      },
      result: {
        $ref: '#/components/schemas/DashboardStats',
      },
    },
    required: ['message', 'result'],
  },
};
