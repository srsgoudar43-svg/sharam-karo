import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ConsultationRecord, UrgencyLevel } from '../types';
import { 
  Search, 
  Filter, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Layers, 
  ScanSearch, 
  Activity,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { token } = useAuth();
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');

  const fetchRecords = () => {
    if (!token) return;
    setLoading(true);
    api.getConsultations(token, {
      urgency: selectedUrgency !== 'All' ? selectedUrgency : undefined,
      search: searchQuery || undefined
    })
      .then((records) => {
        setConsultations(records);
        setLoading(false);
      })
      .catch((err) => {
        console.error('History fetch error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecords();
  }, [token, selectedUrgency]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!token) return;
    if (!window.confirm('Delete this diagnostic report permanently?')) return;

    try {
      await api.deleteConsultation(id, token);
      setConsultations(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  const urgencyStyles: Record<UrgencyLevel, { bg: string; text: string; border: string }> = {
    Critical: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30' },
    High: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
    Moderate: { bg: 'bg-yellow-500/15', text: 'text-yellow-300', border: 'border-yellow-500/30' },
    Low: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  };

  const filtered = consultations.filter((c) => {
    if (selectedCrop !== 'All' && !c.crop_type.toLowerCase().includes(selectedCrop.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Historical Advisory Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Searchable repository of past field consultations, crop pathologies, and intervention tracking.
          </p>
        </div>

        <Link
          to="/consultation/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 active:scale-95 transition-all self-start sm:self-auto"
        >
          <ScanSearch className="h-4 w-4" />
          <span>New Consultation</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur-md space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by pathogen name, crop variety, or symptoms..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Urgency Filter */}
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="All">All Urgency Tiers</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              Filter
            </button>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setSelectedUrgency('All'); fetchRecords(); }}
              className="rounded-xl border border-slate-700 p-2 text-slate-400 hover:text-white transition-colors"
              title="Reset Filters"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Consultations Results List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">
            Querying advisory logs from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-300">No advisory records matched your filters.</p>
            <p className="text-xs text-slate-500">Try adjusting search terms or start a new diagnosis scan.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filtered.map((record) => {
              const urgency = urgencyStyles[record.urgency_level] || urgencyStyles.Moderate;

              return (
                <div
                  key={record.id}
                  className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/40 p-3 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {record.image_url ? (
                      <img
                        src={record.image_url}
                        alt={record.crop_type}
                        className="h-14 w-14 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 border border-slate-700">
                        <Activity className="h-7 w-7" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/consultation/${record.id}`}
                          className="text-base font-bold text-white hover:text-emerald-400 transition-colors"
                        >
                          {record.diagnosis_title}
                        </Link>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${urgency.bg} ${urgency.text} ${urgency.border}`}>
                          {record.urgency_level}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span>Crop: <strong className="text-slate-200">{record.crop_type}</strong></span>
                        <span>Stage: {record.growth_stage}</span>
                        <span>Soil: {record.soil_type}</span>
                        <span>Certainty: <strong className="text-emerald-400">{record.confidence_score}%</strong></span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <Link
                      to={`/consultation/${record.id}`}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-700 hover:text-white transition-all"
                    >
                      <span>Report</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(record.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
