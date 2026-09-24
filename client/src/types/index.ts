export type UrgencyLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type ActionType = 'Organic' | 'Chemical' | 'Cultural' | 'Preventive';
export type GrowthStage = 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturity';
export type SoilType = 'Clay' | 'Loam' | 'Sandy' | 'Silt' | 'Peaty';
export type UserRole = 'Farmer' | 'Agronomist' | 'Enterprise Admin';

export interface TreatmentAction {
  id?: string;
  consultationId?: string;
  actionType: ActionType;
  title: string;
  description: string;
  timing: string;
  createdAt?: string;
  completed?: boolean;
}

export interface ConsultationDiagnosis {
  diagnosisTitle: string;
  confidenceScore: number;
  urgencyLevel: UrgencyLevel;
  summary: string;
  treatments: TreatmentAction[];
}

export interface ConsultationRecord {
  id: string;
  user_id: string;
  crop_type: string;
  growth_stage: string;
  soil_type: string;
  symptoms_description?: string;
  image_url?: string;
  diagnosis_title: string;
  confidence_score: number;
  urgency_level: UrgencyLevel;
  raw_ai_response: ConsultationDiagnosis;
  created_at: string;
  treatments?: TreatmentAction[];
}

export interface UserProfile {
  id: string;
  full_name: string;
  farm_name?: string;
  location: string;
  farm_size_acres: number;
  primary_soil_type: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface WeatherTelemetry {
  location: string;
  temperatureC: number;
  condition: string;
  humidity: number;
  windSpeedKmh: number;
  precipitationRisk: number;
  uvIndex: number;
  soilMoistureEst: string;
  sprayAdvisory: {
    status: 'Optimal' | 'Caution' | 'Unfavorable';
    reason: string;
    nextFavorableWindow: string;
  };
  forecast: Array<{
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    precipitationChance: number;
  }>;
}

export interface SampleCase {
  id: string;
  title: string;
  cropType: string;
  growthStage: GrowthStage;
  soilType: SoilType;
  symptoms: string;
  imageUrl: string;
  badge: string;
}
