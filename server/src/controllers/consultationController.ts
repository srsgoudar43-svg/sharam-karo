import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { consultationFormSchema } from '../validation/schemas';
import { runMultimodalDiagnosis } from '../services/geminiService';
import { storeService } from '../services/storeService';

export const consultationController = {
  // POST /api/consultations
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized user context' });
        return;
      }

      // Validate textual parameters via Zod
      const validationResult = consultationFormSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.format()
        });
        return;
      }

      const { cropType, growthStage, soilType, symptomsDescription } = validationResult.data;

      // Extract image if uploaded
      let imageBuffer: Buffer | undefined = undefined;
      let imageMimeType: string | undefined = undefined;
      let imageUrl: string | undefined = undefined;

      if (req.file) {
        imageBuffer = req.file.buffer;
        imageMimeType = req.file.mimetype;
        // Generate a base64 data URI for instant client rendering and persistence
        imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      } else if (req.body.imageUrl) {
        imageUrl = req.body.imageUrl;
      }

      // Run AI Diagnosis via Google Gemini 2.5 Flash
      const aiResult = await runMultimodalDiagnosis({
        cropType,
        growthStage,
        soilType,
        symptomsDescription,
        imageBuffer,
        imageMimeType,
      });

      // Persist to Database (Supabase + Store)
      const consultation = await storeService.createConsultation({
        userId: user.id,
        cropType,
        growthStage,
        soilType,
        symptomsDescription,
        imageUrl,
        aiResult
      });

      res.status(201).json({
        success: true,
        consultationId: consultation.id,
        result: aiResult,
        consultation
      });
    } catch (error: any) {
      console.error('Error in create consultation controller:', error);
      res.status(500).json({
        error: error.message || 'Internal Server Error while evaluating crop condition'
      });
    }
  },

  // GET /api/consultations
  async list(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized user context' });
        return;
      }

      const { cropType, urgency, search } = req.query as {
        cropType?: string;
        urgency?: string;
        search?: string;
      };

      const records = await storeService.listConsultations(user.id, {
        cropType,
        urgency,
        search
      });

      res.status(200).json({
        success: true,
        count: records.length,
        consultations: records
      });
    } catch (error: any) {
      console.error('Error in list consultations controller:', error);
      res.status(500).json({ error: error.message || 'Failed to list consultations' });
    }
  },

  // GET /api/consultations/:id
  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized user context' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const record = await storeService.getConsultationById(id, user.id);

      if (!record) {
        res.status(404).json({ error: `Consultation with ID ${id} not found` });
        return;
      }

      res.status(200).json({
        success: true,
        consultation: record
      });
    } catch (error: any) {
      console.error('Error in getById consultation controller:', error);
      res.status(500).json({ error: error.message || 'Failed to retrieve consultation' });
    }
  },

  // DELETE /api/consultations/:id
  async remove(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized user context' });
        return;
      }

      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await storeService.deleteConsultation(id, user.id);

      res.status(200).json({
        success: true,
        message: 'Consultation deleted successfully'
      });
    } catch (error: any) {
      console.error('Error in remove consultation controller:', error);
      res.status(500).json({ error: error.message || 'Failed to delete consultation' });
    }
  },

  // GET /api/sample-cases
  async getSampleCases(req: AuthenticatedRequest, res: Response): Promise<void> {
    const samples = [
      {
        id: 'sample-early-blight',
        title: 'Tomato Early Blight (Alternaria)',
        cropType: 'Tomato',
        growthStage: 'Fruiting',
        soilType: 'Loam',
        symptoms: 'Target-pattern dark concentric rings with chlorotic yellow margins on bottom leaves.',
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80',
        badge: 'Fungal Pathogen'
      },
      {
        id: 'sample-armyworm',
        title: 'Corn Fall Armyworm Damage',
        cropType: 'Corn',
        growthStage: 'Vegetative',
        soilType: 'Loam',
        symptoms: 'Windowpaned leaves, irregular ragged holes in whorl, visible caterpillar frass.',
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
        badge: 'Pest Infestation'
      },
      {
        id: 'sample-nitrogen-def',
        title: 'Corn Nitrogen Deficiency',
        cropType: 'Corn',
        growthStage: 'Vegetative',
        soilType: 'Sandy',
        symptoms: 'Inverted V-shaped yellowing extending along leaf midrib from tip to base.',
        imageUrl: 'https://images.unsplash.com/photo-1600333859399-231a44e3fa52?auto=format&fit=crop&w=600&q=80',
        badge: 'Nutrient Deficiency'
      },
      {
        id: 'sample-wheat-rust',
        title: 'Wheat Stripe Rust',
        cropType: 'Wheat',
        growthStage: 'Flowering',
        soilType: 'Clay',
        symptoms: 'Linear yellow-orange pustule stripes between veins on upper flag leaves.',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
        badge: 'High Urgency'
      }
    ];

    res.status(200).json({ success: true, samples });
  }
};
