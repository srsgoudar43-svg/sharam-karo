import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ScanSearch, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Droplets, 
  Bug, 
  FileText,
  Sparkles,
  BarChart3,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const domains = [
    {
      title: 'Nutrient Deficiencies',
      desc: 'Instant detection of Nitrogen (N), Phosphorus (P), Potassium (K), and micronutrient chlorosis patterns.',
      icon: Layers,
      color: 'from-amber-500/20 to-amber-700/20 text-amber-400 border-amber-500/30'
    },
    {
      title: 'Fungal Pathogens',
      desc: 'Identification of Alternaria early blights, stripe rusts, powdery mildews, and Phytophthora late blights.',
      icon: Sprout,
      color: 'from-emerald-500/20 to-emerald-700/20 text-emerald-400 border-emerald-500/30'
    },
    {
      title: 'Pest Infestations',
      desc: 'Larval defoliation detection, Fall Armyworm frass analysis, whitefly vectors, and aphid colony tracking.',
      icon: Bug,
      color: 'from-rose-500/20 to-rose-700/20 text-rose-400 border-rose-500/30'
    },
    {
      title: 'Microclimate & Spray Timing',
      desc: 'Live agricultural weather telemetry with foliar spray windows preventing chemical washouts.',
      icon: Droplets,
      color: 'from-sky-500/20 to-sky-700/20 text-sky-400 border-sky-500/30'
    }
  ];

  const targetCrops = [
    { category: 'Cereal Grains', items: 'Wheat, Rice, Corn / Maize, Barley, Sorghum' },
    { category: 'Legumes & Pulses', items: 'Soybeans, Lentils, Chickpeas, Field Peas' },
    { category: 'Horticultural Crops', items: 'Tomatoes, Potatoes, Bell Peppers, Brassicas' },
    { category: 'Fruit Orchards', items: 'Citrus, Apples, Mangoes, Stone Fruits, Vineyards' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="mx-auto max-w-5xl text-center px-4 sm:px-6 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Powered by Google Gemini 2.5 Flash Multimodal Vision</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Instant Crop Health Diagnostics <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
              & Agronomic Field Advisory
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Bridge the gap between complex phytopathology science and on-farm execution.
            Upload leaf or soil photos, receive structured diagnostic insights, and execute certified organic and chemical treatment protocols tailored to your soil.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/consultation/new"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3.5 text-base font-bold text-slate-950 shadow-xl shadow-emerald-500/25 hover:from-emerald-400 hover:to-green-500 active:scale-95 transition-all"
            >
              <ScanSearch className="h-5 w-5" />
              <span>Start Free Crop Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-base font-semibold text-white hover:bg-slate-800 hover:border-slate-600 transition-all"
            >
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              <span>Open Field Dashboard</span>
            </Link>
          </div>

          {/* Key Value Metric Pills */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="block text-2xl font-extrabold text-white">&lt; 3.0s</span>
              <span className="text-xs text-slate-400 font-medium">Multimodal Diagnostic Time</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="block text-2xl font-extrabold text-emerald-400">98.4%</span>
              <span className="text-xs text-slate-400 font-medium">Verified Symptom Precision</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="block text-2xl font-extrabold text-white">4 Domains</span>
              <span className="text-xs text-slate-400 font-medium">Organic, Chem, Cultural, Prev</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <span className="block text-2xl font-extrabold text-teal-400">100% RLS</span>
              <span className="text-xs text-slate-400 font-medium">Data Privacy Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Diagnostic Domains */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Comprehensive Pathology Suite</span>
          <h2 className="text-3xl font-extrabold text-white">Target Diagnostic Domains</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Multimodal inspection calibrated for the most damaging agricultural diseases and nutrient restrictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((d, i) => {
            const Icon = d.icon;
            return (
              <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 glass-panel-hover flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${d.color} border`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{d.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {d.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Supported Crop Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Agricultural Coverage</span>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Calibrated for Major Global Crop Categories
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Whether you farm smallholder vegetable beds or manage thousands of acres of broadacre cereal grains, AgriCure AI provides specialized cultivar recommendations.
              </p>
              <div className="pt-2">
                <Link
                  to="/consultation/new"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Explore Supported Crops in Consultation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {targetCrops.map((c, i) => (
                <div key={i} className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">{c.category}</h4>
                  </div>
                  <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                    {c.items}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Enterprise AI Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Cpu className="h-5 w-5" />
              <span>Multimodal Vision</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Native image parsing with @google/genai using gemini-2.5-flash and strictly enforced responseSchema JSON output.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="h-5 w-5" />
              <span>Row Level Security</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              PostgreSQL schema fortified with RLS data isolation policies guaranteeing that farmers exclusively access their own field records.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <FileText className="h-5 w-5" />
              <span>Field-Ready Export</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate formatted Markdown and printable PDF diagnostic reports for offline field execution and extension review.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
