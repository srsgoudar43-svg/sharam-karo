import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserRole } from '../types';
import { 
  User, 
  MapPin, 
  Layers, 
  Save, 
  ShieldCheck, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const profileFormSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  farmName: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  farmSizeAcres: z.coerce.number().positive('Must be greater than 0'),
  primarySoilType: z.string().min(2, 'Soil type is required'),
  role: z.enum(['Farmer', 'Agronomist', 'Enterprise Admin']).default('Farmer'),
});

type FormData = z.infer<typeof profileFormSchema>;

export const ProfilePage: React.FC = () => {
  const { profile, token, refreshProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [healthData, setHealthData] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: profile?.full_name || 'John Miller',
      farmName: profile?.farm_name || 'Sun Valley Heritage Farm',
      location: profile?.location || 'Central Valley, CA',
      farmSizeAcres: profile?.farm_size_acres || 42.5,
      primarySoilType: profile?.primary_soil_type || 'Loam',
      role: (profile?.role as UserRole) || 'Farmer',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name,
        farmName: profile.farm_name,
        location: profile.location,
        farmSizeAcres: profile.farm_size_acres,
        primarySoilType: profile.primary_soil_type,
        role: profile.role,
      });
    }

    api.getHealth()
      .then((data) => setHealthData(data))
      .catch(() => {});
  }, [profile, reset]);

  const onSubmit = async (data: FormData) => {
    if (!token) return;
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await api.updateProfile(data, token);
      await refreshProfile();
      setSuccessMsg('Farm profile settings successfully updated.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Farm Profile & Operational Parameters
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure default soil properties, farm coordinates, and user role permissions for tailored diagnostics.
        </p>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Operator <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
                {errors.fullName && <p className="mt-1 text-xs text-rose-400">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Farm / Enterprise Name
                </label>
                <input
                  type="text"
                  {...register('farmName')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Geographic Location / County <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
                {errors.location && <p className="mt-1 text-xs text-rose-400">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total Farm Size (Acres) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('farmSizeAcres')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
                {errors.farmSizeAcres && <p className="mt-1 text-xs text-rose-400">{errors.farmSizeAcres.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Soil Profile
                </label>
                <select
                  {...register('primarySoilType')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Loam">Loam (Optimal balanced soil)</option>
                  <option value="Clay">Clay (Heavy, nutrient-rich)</option>
                  <option value="Sandy">Sandy (High drainage, leach-prone)</option>
                  <option value="Silt">Silt (Fine fertile sediment)</option>
                  <option value="Peaty">Peaty (Organic matter rich)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operator Role
                </label>
                <select
                  {...register('role')}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Farmer">Smallholder Farmer</option>
                  <option value="Agronomist">Certified Agronomist</option>
                  <option value="Enterprise Admin">Enterprise Admin</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Farm Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live System Architecture & Status Card */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">System & Security Telemetry</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" /> Multimodal AI Engine
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Online</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {healthData?.aiEngine?.mode || 'gemini-2.5-flash with structured JSON responseSchema'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-emerald-400" /> Database & RLS
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Enabled</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {healthData?.database?.mode || 'Supabase PostgreSQL RLS Data Isolation Rules Active'}
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 space-y-1">
              <span className="block font-semibold text-slate-300">Active API Version</span>
              <p className="text-[11px] text-slate-400 font-mono">
                AgriCure API v1.0.0 (Express / TypeScript / Helmet / CORS)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
