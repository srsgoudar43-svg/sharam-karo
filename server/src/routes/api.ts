import { Router, Request, Response } from 'express';
import { consultationController } from '../controllers/consultationController';
import { profileController } from '../controllers/profileController';
import { weatherController } from '../controllers/weatherController';
import { authenticateUser } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { config } from '../config/env';
import { supabase } from '../config/supabase';

const router = Router();

// Health & System Diagnostic Endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AgriCure Crop Advisory Assistant API',
    version: '1.0.0',
    aiEngine: {
      provider: 'Google Gemini',
      model: 'gemini-2.5-flash',
      configured: config.hasGeminiKey,
      mode: config.hasGeminiKey ? 'Live Multimodal API' : 'Domain Agronomic Expert Engine (Fallback)'
    },
    database: {
      provider: 'Supabase PostgreSQL',
      configured: Boolean(supabase),
      mode: supabase ? 'Cloud PostgreSQL with Row Level Security' : 'High-Performance Local Session Store'
    }
  });
});

// Weather Telemetry & Spray Suitability
router.get('/weather', weatherController.getWeather);

// Sample Diagnostic Cases for instant one-click testing
router.get('/sample-cases', authenticateUser, consultationController.getSampleCases);

// Consultation Routes
router.post('/consultations', authenticateUser, upload.single('image'), consultationController.create);
router.get('/consultations', authenticateUser, consultationController.list);
router.get('/consultations/:id', authenticateUser, consultationController.getById);
router.delete('/consultations/:id', authenticateUser, consultationController.remove);

// Farm Profile Routes
router.get('/profile', authenticateUser, profileController.getProfile);
router.put('/profile', authenticateUser, profileController.updateProfile);

export default router;
