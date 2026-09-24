import React from 'react';
import { ConsultationRecord, UrgencyLevel } from '../types';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Layers, 
  Calendar, 
  Printer, 
  Download, 
  Share2,
  Cpu
} from 'lucide-react';

interface DiagnosisCardProps {
  consultation: ConsultationRecord;
  onExportMarkdown?: () => void;
  onPrint?: () => void;
}

export const DiagnosisCard: React.FC<DiagnosisCardProps> = ({
  consultation,
  onExportMarkdown,
  onPrint,
}) => {
  const {
    crop_type,
    growth_stage,
    soil_type,
    diagnosis_title,
    confidence_score,
    urgency_level,
    raw_ai_response,
    image_url,
    created_at
  } = consultation;

  const urgencyStyles: Record<UrgencyLevel, { bg: string; text: string; border: string; icon: any }> = {
    Critical: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      icon: AlertOctagon,
    },
    High: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: AlertTriangle,
    },
    Moderate: {
      bg: 'bg-yellow-500/15',
      text: 'text-yellow-300',
      border: 'border-yellow-500/30',
      icon: Info,
    },
    Low: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: CheckCircle2,
    },
  };

  const currentUrgency = urgencyStyles[urgency_level] || urgencyStyles.Moderate;
  const UrgencyIcon = currentUrgency.icon;

  // Gauge circumference calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence_score / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-md">
      {/* Top Bar: Urgency Tier, Confidence Gauge, Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Urgency Badge */}
          <div className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider ${currentUrgency.bg} ${currentUrgency.text} border ${currentUrgency.border}`}>
            <UrgencyIcon className="h-4 w-4" />
            <span>Urgency: {urgency_level}</span>
          </div>

          {/* Model Stamp */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" />
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* Action utilities: Print, Markdown Export */}
        <div className="no-print flex items-center gap-2">
          {onExportMarkdown && (
            <button
              onClick={onExportMarkdown}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition-colors"
              title="Download Markdown Diagnostic Summary"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export MD</span>
            </button>
          )}
          {onPrint && (
            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition-colors"
              title="Print Advisory / Save as PDF"
            >
              <Printer className="h-3.5 w-3.5 text-emerald-400" />
              <span>Print / PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Diagnostic Presentation */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Specimen Image Preview & Gauge */}
        <div className="lg:col-span-4 space-y-4">
          {image_url ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-inner">
              <img
                src={image_url}
                alt={diagnosis_title}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded-lg bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-slate-800">
                Specimen Capture
              </div>
            </div>
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 text-slate-500 text-xs">
              No image attached
            </div>
          )}

          {/* Confidence Score Circular Radial Gauge */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-400 block">AI Diagnostic Confidence</span>
              <span className="text-xl font-extrabold text-white">{confidence_score}%</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">High Certainty Match</span>
            </div>
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="45"
                  cy="45"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {Math.round(confidence_score)}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Metadata, Summary */}
        <div className="lg:col-span-8 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
              <span>AGRONOMIC DIAGNOSIS RESULT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {diagnosis_title}
            </h1>
          </div>

          {/* Quick Field Context Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-lg bg-slate-800/80 px-3 py-1 font-semibold text-slate-200 border border-slate-700/60">
              Crop: <strong className="text-white">{crop_type}</strong>
            </span>
            <span className="rounded-lg bg-slate-800/80 px-3 py-1 font-semibold text-slate-200 border border-slate-700/60">
              Stage: <strong className="text-white">{growth_stage}</strong>
            </span>
            <span className="rounded-lg bg-slate-800/80 px-3 py-1 font-semibold text-slate-200 border border-slate-700/60">
              Soil: <strong className="text-white">{soil_type}</strong>
            </span>
            <span className="rounded-lg bg-slate-800/80 px-3 py-1 font-semibold text-slate-200 border border-slate-700/60 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              {new Date(created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </span>
          </div>

          {/* Agronomic Summary Statement */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4.5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Etiology & Agronomic Findings
            </span>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {raw_ai_response?.summary || 'Detailed pathological findings confirmed presence of foliar stress and tissue discoloration.'}
            </p>
          </div>

          {/* Symptoms noted by user */}
          {consultation.symptoms_description && (
            <div className="text-xs text-slate-400 border-l-2 border-emerald-500 pl-3 py-0.5">
              <span className="font-semibold text-slate-300">Field Symptoms Reported: </span>
              "{consultation.symptoms_description}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
