import { z } from 'zod';

export const consultationFormSchema = z.object({
  cropType: z.string().min(2, 'Crop type is required'),
  growthStage: z.enum(['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'], {
    errorMap: () => ({ message: 'Valid growth stage is required' })
  }),
  soilType: z.enum(['Clay', 'Loam', 'Sandy', 'Silt', 'Peaty'], {
    errorMap: () => ({ message: 'Valid soil type is required' })
  }),
  symptomsDescription: z.string().max(1000, 'Description too long').optional(),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  farmName: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  farmSizeAcres: z.coerce.number().positive('Must be greater than 0'),
  primarySoilType: z.string().min(2, 'Soil type is required'),
  role: z.enum(['Farmer', 'Agronomist', 'Enterprise Admin']).optional(),
});

export type ConsultationFormInput = z.infer<typeof consultationFormSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
