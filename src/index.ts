import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CONFIG } from './config/env.config';
import { connectDB } from './config/database.config';

// Env vars
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(
  cors({
    origin: CONFIG.corsAllowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    env: CONFIG.nodeEnv,
    timestamp: new Date().toISOString(),
    message: 'API is up & running',
  });
});

async function startServer() {
  await connectDB();
  app.listen(CONFIG.port, () => console.log(`🚀 Servidor iniciado`));
}

startServer().catch(err => {
  console.error('❌ Error iniciando servidor:', err);
  process.exit(1);
});

export default app;
