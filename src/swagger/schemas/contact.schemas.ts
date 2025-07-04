export const contactSchemas = {
  Contact: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'ID único del contacto',
        example: '64f1a2b3c4d5e6f7a8b9c0d1',
      },
      name: {
        type: 'string',
        description: 'Nombre de la persona',
        example: 'Juan Pérez',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email de contacto',
        example: 'juan@example.com',
      },
      phone: {
        type: 'string',
        description: 'Número de teléfono',
        example: '+54 9 11 1234-5678',
      },
      message: {
        type: 'string',
        description: 'Mensaje del contacto',
        example: 'Quisiera hacer una reserva para 4 personas',
      },
      isRead: {
        type: 'boolean',
        description: 'Estado de lectura del mensaje',
        example: false,
        default: false,
      },
      // Campos de auditoría para lectura
      readBy: {
        oneOf: [
          { type: 'string', description: 'ID del usuario que lo marcó como leído' },
          { $ref: '#/components/schemas/UserReference' },
        ],
        nullable: true,
      },
      readAt: {
        type: 'string',
        format: 'date-time',
        description: 'Fecha cuando fue marcado como leído',
        nullable: true,
      },
      // Campos de auditoría para eliminación
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
      'email',
      'phone',
      'message',
      'isRead',
      'isDeleted',
      'createdAt',
      'updatedAt',
    ],
  },

  // Schema para crear contacto (público)
  CreateContactRequest: {
    type: 'object',
    required: ['name', 'email', 'phone', 'message'],
    properties: {
      name: {
        type: 'string',
        description: 'Nombre completo de la persona',
        minLength: 2,
        maxLength: 100,
        example: 'Juan Pérez',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email de contacto',
        example: 'juan@example.com',
      },
      phone: {
        type: 'string',
        description: 'Número de teléfono',
        minLength: 8,
        maxLength: 20,
        example: '+54 9 11 1234-5678',
      },
      message: {
        type: 'string',
        description: 'Mensaje o consulta',
        minLength: 10,
        maxLength: 1000,
        example: 'Quisiera hacer una reserva para 4 personas para el sábado por la noche',
      },
    },
  },

  // Schema para la paginación de contactos
  PaginatedContacts: {
    type: 'object',
    properties: {
      contacts: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Contact',
        },
        description: 'Lista de contactos',
      },
      totalContacts: {
        type: 'number',
        description: 'Total de contactos',
        example: 50,
      },
      totalUnread: {
        type: 'number',
        description: 'Total de contactos no leídos',
        example: 5,
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
    required: [
      'contacts',
      'totalContacts',
      'totalUnread',
      'totalPages',
      'currentPage',
      'hasNextPage',
      'hasPrevPage',
    ],
  },

  // Schema para query parameters de getContacts
  GetContactsQuery: {
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
        description: 'Cantidad de contactos por página',
        example: '10',
        default: '10',
      },
      search: {
        type: 'string',
        description: 'Término de búsqueda (busca en name, email, phone, message)',
        example: 'juan',
      },
      includeDeleted: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Incluir contactos eliminados',
        example: 'false',
        default: 'false',
      },
      isRead: {
        type: 'string',
        enum: ['true', 'false'],
        description: 'Filtrar por estado de lectura (true=leídos, false=no leídos)',
        example: 'false',
      },
    },
  },

  // Schemas para respuestas con patrón message/result
  ContactResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Mensaje enviado exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Contact',
      },
    },
    required: ['message', 'result'],
  },

  ContactsListResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de éxito',
        example: 'Lista de contactos obtenida exitosamente',
      },
      result: {
        $ref: '#/components/schemas/PaginatedContacts',
      },
    },
    required: ['message', 'result'],
  },

  MarkAsReadContactResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Contacto marcado como leído exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Contact',
      },
    },
    required: ['message', 'result'],
  },

  DeleteContactResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Mensaje de confirmación',
        example: 'Contacto eliminado exitosamente',
      },
      result: {
        $ref: '#/components/schemas/Contact',
      },
    },
    required: ['message', 'result'],
  },
};
