import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageDropzone } from './ImageDropzone';
import { api } from '../services/api';
import { GrowthStage, SampleCase, SoilType } from '../types';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  Cpu, 
  Loader2,
  Activity,
  Layers,
  ThermometerSun
} from 'lucide-react';

const consultationSchema = z.object({
  cropType: z.string().min(2, 'Crop type is required'),
  growthStage: z.enum(['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity'], {
    errorMap: () => ({ message: 'Please select a growth stage' })
  }),
  soilType: z.enum(['Clay', 'Loam', 'Sandy', 'Silt', 'Peaty'], {
    errorMap: () => ({ message: 'Please select a soil type' })
  }),
  symptomsDescription: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  actionHorizon: z.enum(['Immediate (24h)', 'Short-term (7 days)', 'Seasonal']).default('Immediate (24h)'),
});

type FormData = z.infer<typeof consultationSchema>;

interface ConsultationFormProps {
  onSubmitConsultation: (formData: FormData, file: File | null, imageUrl?: string) => Promise<void>;
  isSubmitting: boolean;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({
  onSubmitConsultation,
  isSubmitting,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sampleCases, setSampleCases] = useState<SampleCase[]>([]);
  const [analysisStep, setAnalysisStep] = useState<string>('Initializing multi-spectral vision pipeline...');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      cropType: 'Tomato',
      growthStage: 'Vegetative',
      soilType: 'Loam',
      symptomsDescription: '',
      actionHorizon: 'Immediate (24h)',
    },
  });

  // Load sample presets
  useEffect(() => {
    api.getSampleCases('demo-token')
      .then((data) => setSampleCases(data))
      .catch(() => {});
  }, []);

  // Animated analysis stages when submitting
  useEffect(() => {
    if (!isSubmitting) return;

    const steps = [
      'Extracting visual leaf morphology & lesion patterns...',
      'Cross-referencing global phytopathology ontologies...',
      'Formulating Gemini 2.5 Flash multimodal agronomic reasoning...',
      'Synthesizing Organic, Chemical, and Cultural treatment protocols...',
      'Compiling structured agronomic advisory report...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % steps.length;
      setAnalysisStep(steps[currentStep]);
    }, 1800);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  const handleSelectSample = (sample: SampleCase) => {
    setValue('cropType', sample.cropType);
    setValue('growthStage', sample.growthStage);
    setValue('soilType', sample.soilType);
    setValue('symptomsDescription', sample.symptoms);
    setPreviewUrl(sample.imageUrl);
    setSelectedFile(null); // Will use sample.imageUrl
  };

  const onFormSubmit = async (data: FormData) => {
    await onSubmitConsultation(data, selectedFile, previewUrl || undefined);
  };

  const commonCrops = [
    'Tomato', 'Corn / Maize', 'Wheat', 'Rice / Paddy', 
    'Potato', 'Soybean', 'Apple Orchard', 'Citrus / Orange', 
    'Grape Vineyard', 'Cotton', 'Bell Pepper'
  ];

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* 1. Multimodal Specimen Uploader */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md">
        <ImageDropzone
          onImageSelected={(file, url) => {
            setSelectedFile(file);
            setPreviewUrl(url || null);
          }}
          selectedPreview={previewUrl}
          sampleCases={sampleCases}
          onSelectSample={handleSelectSample}
        />
      </div>

      {/* 2. Agronomic Metadata Field Inputs */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Crop & Field Parameters</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Crop Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Crop Variety / Species <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              list="crop-suggestions"
              {...register('cropType')}
              placeholder="e.g. Tomato, Corn, Wheat..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
            <datalist id="crop-suggestions">
              {commonCrops.map(c => <option key={c} value={c} />)}
            </datalist>
            {errors.cropType && (
              <p className="mt-1 text-xs text-rose-400">{errors.cropType.message}</p>
            )}
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Crop Growth Stage <span className="text-emerald-400">*</span>
            </label>
            <select
              {...register('growthStage')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            >
              <option value="Germination">Germination / Seedling</option>
              <option value="Vegetative">Vegetative Growth</option>
              <option value="Flowering">Flowering / Heading</option>
              <option value="Fruiting">Fruiting / Pod Formation</option>
              <option value="Maturity">Maturity / Ripening</option>
            </select>
            {errors.growthStage && (
              <p className="mt-1 text-xs text-rose-400">{errors.growthStage.message}</p>
            )}
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Soil Type <span className="text-emerald-400">*</span>
            </label>
            <select
              {...register('soilType')}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            >
              <option value="Loam">Loam (Balanced silt, sand, clay)</option>
              <option value="Clay">Clay (High nutrient, heavy water retention)</option>
              <option value="Sandy">Sandy (High drainage, prone to leaching)</option>
              <option value="Silt">Silt (Fine textured, fertile)</option>
              <option value="Peaty">Peaty (High organic matter, acidic)</option>
            </select>
            {errors.soilType && (
              <p className="mt-1 text-xs text-rose-400">{errors.soilType.message}</p>
            )}
          </div>
        </div>

        {/* Symptoms Observed */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Observed Symptoms & Field Context (Optional)</span>
            <span className="text-[11px] font-normal text-slate-400">Up to 1000 characters</span>
          </label>
          <textarea
            {...register('symptomsDescription')}
            rows={3}
            placeholder="Describe visual abnormalities, leaf spot colors, pest presence, curling, waterlogging, or recent fertilizer applications..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
          {errors.symptomsDescription && (
            <p className="mt-1 text-xs text-rose-400">{errors.symptomsDescription.message}</p>
          )}
        </div>

        {/* Action Plan Horizon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {(['Immediate (24h)', 'Short-term (7 days)', 'Seasonal'] as const).map((horizon) => (
            <label
              key={horizon}
              className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-all ${
                watch('actionHorizon') === horizon
                  ? 'border-emerald-500 bg-emerald-500/10 text-white'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <input
                type="radio"
                value={horizon}
                {...register('actionHorizon')}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold">{horizon} Priority</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Submission / Processing State */}
      {isSubmitting ? (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 text-emerald-400 animate-spin" />
            <span className="font-bold text-base text-white">Google Gemini 2.5 Flash Analyzing Crop Specimen...</span>
          </div>
          <p className="text-xs text-emerald-300/80 animate-pulse font-medium">
            {analysisStep}
          </p>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden max-w-md mx-auto">
            <div className="h-full bg-emerald-500 rounded-full animate-shimmer" style={{ width: '80%' }}></div>
          </div>
        </div>
      ) : (
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/20 hover:from-emerald-400 hover:to-green-500 active:scale-[0.99] transition-all"
        >
          <Sparkles className="h-5 w-5" />
          <span>Execute Multimodal AI Crop Diagnosis</span>
        </button>
      )}
    </form>
  );
};
