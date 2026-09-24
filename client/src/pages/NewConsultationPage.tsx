import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ConsultationForm } from '../components/ConsultationForm';
import { 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export const NewConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (formData: any, file: File | null, imageUrl?: string) => {
    if (!token) {
      setErrorMsg('Authentication token missing. Please sign in again.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const data = new FormData();
      data.append('cropType', formData.cropType);
      data.append('growthStage', formData.growthStage);
      data.append('soilType', formData.soilType);
      if (formData.symptomsDescription) {
        data.append('symptomsDescription', formData.symptomsDescription);
      }

      if (file) {
        data.append('image', file);
      } else if (imageUrl) {
        data.append('imageUrl', imageUrl);
      }

      const res = await api.createConsultation(data, token);

      if (res && res.consultationId) {
        navigate(`/consultation/${res.consultationId}`);
      } else {
        throw new Error('Consultation completed but response ID was missing.');
      }
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      setErrorMsg(err.message || 'An error occurred during multimodal analysis. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Page Title & Mission Banner */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Multimodal Plant Pathology & Agronomic Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          New Crop Health Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Upload specimen imagery of affected leaf, stem, fruit, or soil samples. Gemini 2.5 Flash will diagnose pathogens and formulate multi-stage intervention steps.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Interactive Form Component */}
      <ConsultationForm
        onSubmitConsultation={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Trust & Quality Assurance Footnote */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Strict Schema Validation via Zod & Gemini ResponseSchema (JSON)</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCheck2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Automatic persistence to PostgreSQL with Row Level Security</span>
        </div>
      </div>
    </div>
  );
};
