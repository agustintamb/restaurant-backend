import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from '@/routes';
import { CONFIG } from '@/config/env.config';
import { connectDB } from '@/config/database.config';
import { specs, swaggerUI } from '@/config/swagger.config';

// Env vars
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(
  cors({
    origin: CONFIG.corsAllowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Bodegón API Docs',
  })
);

// API Routes
app.use('/api', routes);

// 404 Handler
app.all('/{*any}', (req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

async function startServer() {
  await connectDB();
  app.listen(CONFIG.port, () => {
    console.log(`🚀 Servidor iniciado en puerto ${CONFIG.port}`);
    console.log(`🌐 Ambiente: ${CONFIG.nodeEnv}`);
    console.log(`📱 Frontend URL: ${CONFIG.corsAllowedOrigins[0]}`);
    console.log(`🔧 Backoffice URL: ${CONFIG.corsAllowedOrigins[1]}`);
    console.log(`📚 Swagger: http://localhost:${CONFIG.port}/api-docs`);
  });
}

startServer().catch(err => {
  console.error('❌ Error iniciando servidor:', err);
  process.exit(1);
});

export default app;
