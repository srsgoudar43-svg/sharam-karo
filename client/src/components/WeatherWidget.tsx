import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { WeatherTelemetry } from '../types';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Compass
} from 'lucide-react';

interface WeatherWidgetProps {
  locationName?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ locationName }) => {
  const [telemetry, setTelemetry] = useState<WeatherTelemetry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    api.getWeather(locationName)
      .then((data) => {
        if (isMounted) {
          setTelemetry(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Weather load error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [locationName]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse space-y-4">
        <div className="h-5 w-48 bg-slate-800 rounded"></div>
        <div className="h-12 w-full bg-slate-800/60 rounded-xl"></div>
      </div>
    );
  }

  if (!telemetry) return null;

  const sprayColor = 
    telemetry.sprayAdvisory.status === 'Optimal'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : telemetry.sprayAdvisory.status === 'Caution'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  const SprayIcon = 
    telemetry.sprayAdvisory.status === 'Optimal'
      ? CheckCircle2
      : telemetry.sprayAdvisory.status === 'Caution'
      ? AlertTriangle
      : ShieldAlert;

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Agricultural Weather Telemetry</h3>
        </div>
        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
          <Compass className="h-3 w-3 text-emerald-400" /> {telemetry.location}
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
          <span className="text-[11px] font-medium text-slate-400">Air Temperature</span>
          <p className="mt-1 text-2xl font-extrabold text-white">{telemetry.temperatureC}°C</p>
          <span className="text-[11px] text-emerald-400 font-medium">{telemetry.condition}</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
          <span className="text-[11px] font-medium text-slate-400">Relative Humidity</span>
          <p className="mt-1 text-2xl font-extrabold text-white flex items-center gap-1">
            <Droplets className="h-5 w-5 text-blue-400 inline" />
            {telemetry.humidity}%
          </p>
          <span className="text-[11px] text-slate-400">Soil: {telemetry.soilMoistureEst}</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
          <span className="text-[11px] font-medium text-slate-400">Surface Wind</span>
          <p className="mt-1 text-2xl font-extrabold text-white flex items-center gap-1">
            <Wind className="h-5 w-5 text-teal-400 inline" />
            {telemetry.windSpeedKmh} <span className="text-xs font-normal text-slate-400">km/h</span>
          </p>
          <span className="text-[11px] text-emerald-400 font-medium">Calm drift</span>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
          <span className="text-[11px] font-medium text-slate-400">Rain Risk / UV</span>
          <p className="mt-1 text-2xl font-extrabold text-white">
            {telemetry.precipitationRisk}% <span className="text-xs font-normal text-slate-400">/ UV {telemetry.uvIndex}</span>
          </p>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sun className="h-3 w-3 text-amber-400" /> Low rain hazard
          </span>
        </div>
      </div>

      {/* Spray Window Advisory */}
      <div className={`mt-4 rounded-xl border p-3.5 ${sprayColor} transition-all`}>
        <div className="flex items-start gap-2.5">
          <SprayIcon className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider">
                Foliar Spray Advisory: {telemetry.sprayAdvisory.status}
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {telemetry.sprayAdvisory.reason}
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] font-medium opacity-80">
              <Clock className="h-3.5 w-3.5" />
              <span>Recommended Application Window: {telemetry.sprayAdvisory.nextFavorableWindow}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Outlook */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
          5-Day Agricultural Weather Outlook
        </span>
        <div className="grid grid-cols-5 gap-2 text-center">
          {telemetry.forecast.map((f, i) => (
            <div key={i} className="rounded-lg bg-slate-950/40 p-2 border border-slate-800/60">
              <span className="block text-xs font-semibold text-slate-300">{f.day}</span>
              <span className="block text-sm font-bold text-white mt-1">{f.tempHigh}°</span>
              <span className="block text-[11px] text-slate-400">{f.tempLow}°</span>
              <span className="block text-[10px] text-blue-400 mt-1">{f.precipitationChance}% rain</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
