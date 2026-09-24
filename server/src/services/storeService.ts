import { supabase } from '../config/supabase';
import { ConsultationRecord, TreatmentAction, UserProfile } from '../types';
import crypto from 'crypto';

// In-Memory store as cache and fallback if Supabase DB is not yet provisioned
interface StoreData {
  profiles: Map<string, UserProfile>;
  consultations: Map<string, ConsultationRecord>;
  treatments: Map<string, TreatmentAction[]>;
}

const memoryStore: StoreData = {
  profiles: new Map(),
  consultations: new Map(),
  treatments: new Map(),
};

// Seed initial realistic profile and historical advisory sessions
function seedStore() {
  const defaultUserId = '00000000-0000-0000-0000-000000000001';
  
  memoryStore.profiles.set(defaultUserId, {
    id: defaultUserId,
    full_name: 'John Miller',
    farm_name: 'Sun Valley Heritage Farm',
    location: 'Salinas Valley, CA',
    farm_size_acres: 42.5,
    primary_soil_type: 'Loam',
    role: 'Farmer',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  });

  const seedConsultation1Id = 'c1000000-0000-0000-0000-000000000001';
  const seed1Treatments: TreatmentAction[] = [
    {
      id: 't1-1',
      consultationId: seedConsultation1Id,
      actionType: 'Cultural',
      title: 'Drip Irrigation Conversion & Leaf Pruning',
      description: 'Prune 10 inches of bottom foliage to stop soil-splash spore inoculations and switch from overhead sprinklers to root drip.',
      timing: 'Immediate (24 hours)'
    },
    {
      actionType: 'Organic',
      title: 'Copper Octanoate Foliar Spray',
      description: 'Spray OMRI-listed liquid copper octanoate (0.5 oz/gal) thoroughly covering both sides of leaves.',
      timing: 'Within 48 hours'
    },
    {
      actionType: 'Chemical',
      title: 'Azoxystrobin (Heritage) Protectant',
      description: 'Apply broad-spectrum strobilurin fungicide at 0.5 lbs/acre to prevent spore germination.',
      timing: 'Within 5-7 days'
    },
    {
      actionType: 'Preventive',
      title: 'Four-Year Solanaceous Crop Rotation',
      description: 'Rotate fields with non-host legume cover crops (clover, vetch) to interrupt spore life cycle in soil.',
      timing: 'Post-harvest'
    }
  ];

  memoryStore.consultations.set(seedConsultation1Id, {
    id: seedConsultation1Id,
    user_id: defaultUserId,
    crop_type: 'Tomato (Heirloom Cherokee)',
    growth_stage: 'Fruiting',
    soil_type: 'Loam',
    symptoms_description: 'Target-board concentric rings and yellow halos on lower mature foliage.',
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80',
    diagnosis_title: 'Early Blight (Alternaria solani)',
    confidence_score: 95.5,
    urgency_level: 'High',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    raw_ai_response: {
      diagnosisTitle: 'Early Blight (Alternaria solani)',
      confidenceScore: 95.5,
      urgencyLevel: 'High',
      summary: 'Aggressive fungal leaf spot caused by Alternaria solani. Dark brown circular lesions with concentric rings and chlorotic halos observed on lower canopy leaves.',
      treatments: seed1Treatments,
    },
    treatments: seed1Treatments,
  });
  memoryStore.treatments.set(seedConsultation1Id, seed1Treatments);

  const seedConsultation2Id = 'c1000000-0000-0000-0000-000000000002';
  const seed2Treatments: TreatmentAction[] = [
    {
      id: 't2-1',
      consultationId: seedConsultation2Id,
      actionType: 'Cultural',
      title: 'Side-Dress Urea / Ammonium Nitrate',
      description: 'Side-dress 45 kg N/ha into the root zone 10cm away from the stalk followed by immediate light watering.',
      timing: 'Immediate (within 48 hours)'
    },
    {
      actionType: 'Organic',
      title: 'Foliar Fish & Kelp Hydrolysate',
      description: 'Apply high-nitrogen cold-pressed fish fertilizer (5-1-1) at 5 tablespoons per gallon of water.',
      timing: 'Within 3 days'
    },
    {
      actionType: 'Preventive',
      title: 'Winter Hairy Vetch Cover Crop',
      description: 'Plant winter hardy legume cover crop to fix 120-150 lbs biological nitrogen per acre.',
      timing: 'Upcoming Autumn'
    }
  ];

  memoryStore.consultations.set(seedConsultation2Id, {
    id: seedConsultation2Id,
    user_id: defaultUserId,
    crop_type: 'Sweet Corn (Zea mays)',
    growth_stage: 'Vegetative',
    soil_type: 'Sandy',
    symptoms_description: 'Inverted V-shaped chlorosis extending from leaf tips toward the base along the midrib.',
    image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    diagnosis_title: 'Nitrogen (N) Deficiency Chlorosis',
    confidence_score: 92.0,
    urgency_level: 'Moderate',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    raw_ai_response: {
      diagnosisTitle: 'Nitrogen (N) Deficiency Chlorosis',
      confidenceScore: 92.0,
      urgencyLevel: 'Moderate',
      summary: 'Classic nutrient starvation symptom in sandy soils where high leaching has depleted bioavailable nitrate. Older leaves translocate nitrogen to young whorls.',
      treatments: seed2Treatments,
    },
    treatments: seed2Treatments,
  });
  memoryStore.treatments.set(seedConsultation2Id, seed2Treatments);
}

seedStore();

export const storeService = {
  // Save new consultation
  async createConsultation(params: {
    userId: string;
    cropType: string;
    growthStage: string;
    soilType: string;
    symptomsDescription?: string;
    imageUrl?: string;
    aiResult: any;
  }): Promise<ConsultationRecord> {
    const { userId, cropType, growthStage, soilType, symptomsDescription, imageUrl, aiResult } = params;
    const consultationId = crypto.randomUUID();

    const record: ConsultationRecord = {
      id: consultationId,
      user_id: userId,
      crop_type: cropType,
      growth_stage: growthStage,
      soil_type: soilType,
      symptoms_description: symptomsDescription,
      image_url: imageUrl,
      diagnosis_title: aiResult.diagnosisTitle,
      confidence_score: aiResult.confidenceScore,
      urgency_level: aiResult.urgencyLevel,
      raw_ai_response: aiResult,
      created_at: new Date().toISOString(),
      treatments: (aiResult.treatments || []).map((t: any) => ({
        ...t,
        id: crypto.randomUUID(),
        consultationId,
        createdAt: new Date().toISOString()
      }))
    };

    // Save to memory store first
    memoryStore.consultations.set(consultationId, record);
    memoryStore.treatments.set(consultationId, record.treatments || []);

    // Also persist to Supabase if client is connected
    if (supabase) {
      try {
        const { data: dbConsultation, error: dbError } = await supabase
          .from('consultations')
          .insert({
            user_id: userId,
            crop_type: cropType,
            growth_stage: growthStage,
            soil_type: soilType,
            symptoms_description: symptomsDescription,
            image_url: imageUrl,
            diagnosis_title: aiResult.diagnosisTitle,
            confidence_score: aiResult.confidenceScore,
            urgency_level: aiResult.urgencyLevel,
            raw_ai_response: aiResult
          })
          .select()
          .single();

        if (!dbError && dbConsultation) {
          const treatmentRows = (aiResult.treatments || []).map((t: any) => ({
            consultation_id: dbConsultation.id,
            action_type: t.actionType,
            title: t.title,
            description: t.description,
            timing: t.timing
          }));

          await supabase.from('treatment_actions').insert(treatmentRows);
          record.id = dbConsultation.id;
        }
      } catch (err) {
        console.warn('Supabase DB persistence error (fallback memory kept):', err);
      }
    }

    return record;
  },

  // List consultations for a user
  async listConsultations(userId: string, filters?: { cropType?: string; urgency?: string; search?: string }): Promise<ConsultationRecord[]> {
    if (supabase) {
      try {
        let query = supabase
          .from('consultations')
          .select('*, treatment_actions(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (filters?.cropType) {
          query = query.ilike('crop_type', `%${filters.cropType}%`);
        }
        if (filters?.urgency) {
          query = query.eq('urgency_level', filters.urgency);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            user_id: row.user_id,
            crop_type: row.crop_type,
            growth_stage: row.growth_stage,
            soil_type: row.soil_type,
            symptoms_description: row.symptoms_description,
            image_url: row.image_url,
            diagnosis_title: row.diagnosis_title,
            confidence_score: Number(row.confidence_score),
            urgency_level: row.urgency_level,
            raw_ai_response: row.raw_ai_response,
            created_at: row.created_at,
            treatments: (row.treatment_actions || []).map((t: any) => ({
              id: t.id,
              actionType: t.action_type,
              title: t.title,
              description: t.description,
              timing: t.timing,
            }))
          }));
        }
      } catch (err) {
        console.warn('Supabase query error, reading memory store:', err);
      }
    }

    // Read from memory store
    let records = Array.from(memoryStore.consultations.values())
      .filter(c => c.user_id === userId || userId === '00000000-0000-0000-0000-000000000001');

    if (filters?.cropType) {
      const q = filters.cropType.toLowerCase();
      records = records.filter(c => c.crop_type.toLowerCase().includes(q));
    }
    if (filters?.urgency) {
      records = records.filter(c => c.urgency_level === filters.urgency);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      records = records.filter(c =>
        c.crop_type.toLowerCase().includes(q) ||
        c.diagnosis_title.toLowerCase().includes(q) ||
        (c.symptoms_description && c.symptoms_description.toLowerCase().includes(q))
      );
    }

    return records.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // Get consultation by ID
  async getConsultationById(id: string, userId: string): Promise<ConsultationRecord | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('consultations')
          .select('*, treatment_actions(*)')
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            id: data.id,
            user_id: data.user_id,
            crop_type: data.crop_type,
            growth_stage: data.growth_stage,
            soil_type: data.soil_type,
            symptoms_description: data.symptoms_description,
            image_url: data.image_url,
            diagnosis_title: data.diagnosis_title,
            confidence_score: Number(data.confidence_score),
            urgency_level: data.urgency_level,
            raw_ai_response: data.raw_ai_response,
            created_at: data.created_at,
            treatments: (data.treatment_actions || []).map((t: any) => ({
              id: t.id,
              actionType: t.action_type,
              title: t.title,
              description: t.description,
              timing: t.timing,
            }))
          };
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback memory check:', err);
      }
    }

    const item = memoryStore.consultations.get(id);
    if (item) {
      const treatments = memoryStore.treatments.get(id) || [];
      return { ...item, treatments };
    }
    return null;
  },

  // Delete consultation
  async deleteConsultation(id: string, userId: string): Promise<boolean> {
    if (supabase) {
      try {
        await supabase.from('consultations').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    memoryStore.consultations.delete(id);
    memoryStore.treatments.delete(id);
    return true;
  },

  // Get User Profile
  async getProfile(userId: string): Promise<UserProfile> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error && data) {
          return data as UserProfile;
        }
      } catch (err) {
        console.warn('Supabase profile error:', err);
      }
    }

    const existing = memoryStore.profiles.get(userId);
    if (existing) return existing;

    const fallback: UserProfile = {
      id: userId,
      full_name: 'Agricultural Producer',
      farm_name: 'Green Horizons Farm',
      location: 'Central Valley, CA',
      farm_size_acres: 25.0,
      primary_soil_type: 'Loam',
      role: 'Farmer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    memoryStore.profiles.set(userId, fallback);
    return fallback;
  },

  // Update User Profile
  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile(userId);
    const updated: UserProfile = {
      ...current,
      ...data,
      updated_at: new Date().toISOString()
    };

    memoryStore.profiles.set(userId, updated);

    if (supabase) {
      try {
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            full_name: updated.full_name,
            farm_name: updated.farm_name,
            location: updated.location,
            farm_size_acres: updated.farm_size_acres,
            primary_soil_type: updated.primary_soil_type,
            role: updated.role,
            updated_at: updated.updated_at
          });
      } catch (err) {
        console.warn('Supabase profile update warning:', err);
      }
    }

    return updated;
  }
};
