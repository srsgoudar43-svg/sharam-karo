import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ConsultationRecord } from '../types';
import { WeatherWidget } from '../components/WeatherWidget';
import { 
  ScanSearch, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  FileText,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { profile, token, role } = useAuth();
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (token) {
      api.getConsultations(token)
        .then((records) => {
          if (isMounted) {
            setConsultations(records);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error('Failed to load dashboard consultations:', err);
          if (isMounted) setLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [token]);

  const criticalOrHigh = consultations.filter(c => c.urgency_level === 'Critical' || c.urgency_level === 'High');
  const avgConfidence = consultations.length > 0 
    ? Math.round(consultations.reduce((sum, c) => sum + Number(c.confidence_score), 0) / consultations.length)
    : 95;

  return (
    <div className="space-y-8">
      {/* Top Banner: Farm Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/30 p-6 shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Active Field Station • {profile?.location || 'Central Valley, CA'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {profile?.farm_name || 'Sun Valley Heritage Farm'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Welcome back, {profile?.full_name || 'Farmer'}. Live agricultural telemetry and phytopathology monitors are operational.
          </p>
        </div>

        <Link
          to="/consultation/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all shrink-0"
        >
          <ScanSearch className="h-4 w-4" />
          <span>New Crop Scan</span>
        </Link>
      </div>

      {/* Critical Alerts Banner (If any urgent issues detected) */}
      {criticalOrHigh.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-300">
                Active High-Urgency Agronomic Alerts ({criticalOrHigh.length})
              </h4>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                Pathogen threats detected requiring prompt intervention. View details below:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {criticalOrHigh.map(c => (
                  <Link
                    key={c.id}
                    to={`/consultation/${c.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-950/60 px-2.5 py-1 text-xs font-semibold text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 transition-colors"
                  >
                    <span>{c.crop_type}: {c.diagnosis_title}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-semibold text-slate-400">Total Advisory Logs</span>
          <p className="mt-1 text-2xl font-extrabold text-white">{consultations.length}</p>
          <span className="text-[11px] text-emerald-400 font-medium">Archived to PostgreSQL</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-semibold text-slate-400">Urgent Interventions</span>
          <p className="mt-1 text-2xl font-extrabold text-rose-400">{criticalOrHigh.length}</p>
          <span className="text-[11px] text-slate-400">Action within 48h required</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-semibold text-slate-400">Diagnostic Certainty</span>
          <p className="mt-1 text-2xl font-extrabold text-emerald-400">{avgConfidence}%</p>
          <span className="text-[11px] text-emerald-400">gemini-2.5-flash vision</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-xs font-semibold text-slate-400">Soil Condition</span>
          <p className="mt-1 text-2xl font-extrabold text-amber-400">{profile?.primary_soil_type || 'Loam'}</p>
          <span className="text-[11px] text-slate-400">{profile?.farm_size_acres || 42.5} Total Acres</span>
        </div>
      </div>

      {/* Agricultural Weather Telemetry Widget */}
      <WeatherWidget locationName={profile?.location} />

      {/* Recent Field Advisory Consultations */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Field Advisories</h3>
            <p className="text-xs text-slate-400">Recent multimodal scans and agronomic action steps</p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            Loading field records...
          </div>
        ) : consultations.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-sm text-slate-400">No crop consultations logged yet.</p>
            <Link
              to="/consultation/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              <ScanSearch className="h-4 w-4" />
              <span>Diagnose First Crop</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {consultations.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/40 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {c.image_url ? (
                    <img
                      src={c.image_url}
                      alt={c.crop_type}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700">
                      <Activity className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{c.diagnosis_title}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        c.urgency_level === 'Critical' ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' :
                        c.urgency_level === 'High' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                        c.urgency_level === 'Moderate' ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' :
                        'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {c.urgency_level}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Crop: <strong className="text-slate-300">{c.crop_type}</strong></span>
                      <span>Stage: {c.growth_stage}</span>
                      <span>Confidence: <strong className="text-emerald-400">{c.confidence_score}%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center">
                  <span className="text-xs text-slate-500 hidden md:block">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/consultation/${c.id}`}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-700 hover:text-white transition-all"
                  >
                    <span>View Treatment Plan</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
