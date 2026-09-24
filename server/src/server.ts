import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import apiRouter from './routes/api';

const app = express();

// Security configurations
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false // Disable CSP for local dev & image previews
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with generous limit for image payloads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Mount API router
app.use('/api', apiRouter);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'AI-Powered Agriculture Crop Advisory Assistant API',
    status: 'operational',
    documentation: '/api/health',
    version: '1.0.0'
  });
});

// Centralized error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌱 Crop Advisory Assistant Backend Server Active`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`🤖 AI Engine: Google Gemini 2.5 Flash (${config.hasGeminiKey ? 'Active' : 'Fallback Engine'})`);
  console.log(`🗄️ Database: Supabase PostgreSQL (${config.hasSupabase ? 'Connected' : 'In-Memory Store'})`);
  console.log(`=======================================================`);
});
