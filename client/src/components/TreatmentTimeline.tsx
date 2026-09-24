import React, { useState } from 'react';
import { ActionType, TreatmentAction } from '../types';
import confetti from 'canvas-confetti';
import { 
  Leaf, 
  FlaskConical, 
  Shovel, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  Circle,
  Filter,
  Sparkles
} from 'lucide-react';

interface TreatmentTimelineProps {
  treatments: TreatmentAction[];
}

export const TreatmentTimeline: React.FC<TreatmentTimelineProps> = ({ treatments }) => {
  const [filterType, setFilterType] = useState<ActionType | 'All'>('All');
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  const toggleComplete = (idx: number, id?: string) => {
    const key = id || String(idx);
    const updated = { ...completedMap, [key]: !completedMap[key] };
    setCompletedMap(updated);

    // If all tasks are completed, trigger celebration confetti!
    const allDone = treatments.every((_, i) => updated[treatments[i].id || String(i)]);
    if (allDone && treatments.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#86efac', '#eab308']
      });
    }
  };

  const actionConfig: Record<ActionType, { icon: any; color: string; badge: string; border: string }> = {
    Organic: {
      icon: Leaf,
      color: 'text-emerald-400',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      border: 'border-emerald-500/30',
    },
    Chemical: {
      icon: FlaskConical,
      color: 'text-sky-400',
      badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      border: 'border-sky-500/30',
    },
    Cultural: {
      icon: Shovel,
      color: 'text-amber-400',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      border: 'border-amber-500/30',
    },
    Preventive: {
      icon: ShieldCheck,
      color: 'text-indigo-400',
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      border: 'border-indigo-500/30',
    },
  };

  const filteredTreatments = filterType === 'All'
    ? treatments
    : treatments.filter(t => t.actionType === filterType);

  const completedCount = treatments.filter((t, i) => completedMap[t.id || String(i)]).length;
  const progressPercent = treatments.length > 0 ? Math.round((completedCount / treatments.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Actionable Treatment & Intervention Protocols</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {treatments.length} Steps
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Certified treatment steps categorized by agricultural intervention method.
          </p>
        </div>

        {/* Action Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 no-print">
          {(['All', 'Organic', 'Chemical', 'Cultural', 'Preventive'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterType === type
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Field Intervention Progress Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2 no-print">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Field Treatment Progress
          </span>
          <span className="text-emerald-400 font-bold">
            {completedCount} of {treatments.length} Completed ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Treatments List / Timeline */}
      <div className="space-y-4">
        {filteredTreatments.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">
            No treatments found under category "{filterType}".
          </p>
        ) : (
          filteredTreatments.map((treatment, idx) => {
            const config = actionConfig[treatment.actionType] || actionConfig.Cultural;
            const Icon = config.icon;
            const key = treatment.id || String(idx);
            const isDone = Boolean(completedMap[key]);

            return (
              <div
                key={key}
                onClick={() => toggleComplete(idx, treatment.id)}
                className={`group relative rounded-xl border p-4.5 transition-all cursor-pointer ${
                  isDone
                    ? 'border-emerald-500/30 bg-emerald-950/15 opacity-70'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    type="button"
                    className="mt-1 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>

                  <div className="flex-1 space-y-2">
                    {/* Header: Title, Category Badge, Timing Tag */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${config.badge} border`}>
                          <Icon className="h-3 w-3" />
                          {treatment.actionType}
                        </span>
                        <h4 className={`text-base font-bold transition-colors ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {treatment.title}
                        </h4>
                      </div>

                      {/* Timing Tag */}
                      <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                        <Clock className="h-3 w-3" />
                        <span>{treatment.timing}</span>
                      </div>
                    </div>

                    {/* Detailed Instructions */}
                    <p className={`text-sm leading-relaxed ${isDone ? 'text-slate-500' : 'text-slate-300'}`}>
                      {treatment.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
