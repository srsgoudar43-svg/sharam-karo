import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ScanSearch, 
  History, 
  Settings, 
  MapPin, 
  Layers, 
  Activity,
  Cpu
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { profile, role } = useAuth();

  const navItems = [
    { name: 'Field Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'New Consultation', to: '/consultation/new', icon: ScanSearch, highlight: true },
    { name: 'Advisory Logs', to: '/history', icon: History },
    { name: 'Farm Settings', to: '/profile', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-950/50 p-4">
      <div className="space-y-6">
        {/* Farm Profile Summary Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Field Unit</span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              {role}
            </span>
          </div>
          <h4 className="mt-1 text-sm font-bold text-white truncate">
            {profile?.farm_name || 'Sun Valley Heritage Farm'}
          </h4>
          <div className="mt-2.5 space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{profile?.location || 'Central Valley, CA'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>{profile?.farm_size_acres || 42.5} Acres • {profile?.primary_soil_type || 'Loam'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm'
                      : item.highlight
                      ? 'text-emerald-300 hover:bg-slate-850 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
                {item.highlight && (
                  <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* AI Telemetry & Health Indicator */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-emerald-400" /> GenAI Engine
          </span>
          <span className="flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            gemini-2.5-flash
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
          <span>Row Level Security (RLS)</span>
          <span className="text-slate-300 font-mono text-[10px]">Active</span>
        </div>
      </div>
    </aside>
  );
};
