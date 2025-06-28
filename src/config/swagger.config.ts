import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { CONFIG } from './env.config';
import { allSchemas } from '@/swagger/schemas';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bodegón API',
      version: '1.0.0',
      description: 'API REST para sistema de bodegón',
    },
    servers: [
      {
        url: `http://localhost:${CONFIG.port}/api`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresar token JWT solo (no incluir Bearer)',
        },
      },
      schemas: allSchemas,
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);
export const swaggerUI = swaggerUi;
