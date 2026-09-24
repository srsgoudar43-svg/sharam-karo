import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  PlusCircle, 
  User, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, profile, role, isDemo, signInDemo, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleRoleSwitch = (newRole: UserRole) => {
    signInDemo(newRole);
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="h-6 w-6 text-slate-950" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                AgriCure <span className="text-emerald-400 font-extrabold text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">AI</span>
              </span>
              <span className="block text-[11px] text-slate-400 font-medium">Precision Crop Health</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/dashboard' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Field Dashboard
          </Link>
          <Link
            to="/history"
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/history' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Advisory Logs
          </Link>
          <Link
            to="/profile"
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
              location.pathname === '/profile' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Farm Settings
          </Link>
        </nav>

        {/* Action Button & User Persona Dropdown */}
        <div className="flex items-center gap-3">
          <Link
            to="/consultation/new"
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 active:scale-[0.98] transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Consultation</span>
            <span className="sm:hidden">Diagnose</span>
          </Link>

          {/* User Profile / Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-850 transition-colors"
            >
              <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                {profile?.full_name ? profile.full_name[0] : 'U'}
              </div>
              <div className="hidden text-left lg:block">
                <span className="block font-semibold text-slate-200 leading-tight truncate max-w-[120px]">
                  {profile?.full_name || 'Farmer'}
                </span>
                <span className="block text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                  {role}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-0.5" />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{profile?.full_name || user?.email}</p>
                  <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> {role} Access
                  </p>
                </div>

                {/* Role Switcher */}
                <div className="py-2 border-b border-slate-800">
                  <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-400" /> Switch Test Persona
                  </p>
                  <button
                    onClick={() => handleRoleSwitch('Farmer')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      role === 'Farmer' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Smallholder Farmer</span>
                    {role === 'Farmer' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('Agronomist')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      role === 'Agronomist' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Certified Agronomist</span>
                    {role === 'Agronomist' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>}
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('Enterprise Admin')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      role === 'Enterprise Admin' ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>Enterprise Admin</span>
                    {role === 'Enterprise Admin' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>}
                  </button>
                </div>

                <div className="pt-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="h-3.5 w-3.5 text-slate-400" /> Farm Profile & Settings
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 mt-1"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Field Dashboard
          </Link>
          <Link
            to="/consultation/new"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-slate-800"
          >
            New Crop Consultation
          </Link>
          <Link
            to="/history"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Advisory Logs & Archive
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Farm Settings
          </Link>
        </div>
      )}
    </header>
  );
};
