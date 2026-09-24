import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sprout, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, signInDemo, isDemo } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Farmer');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    if (isSignUp) {
      if (!fullName) {
        setErrorMsg('Please enter your full name');
        setIsSubmitting(false);
        return;
      }
      const res = await signUp(email, password, fullName, selectedRole);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        navigate('/dashboard');
      }
    } else {
      const res = await signIn(email, password);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        navigate('/dashboard');
      }
    }

    setIsSubmitting(false);
  };

  const handleMagicLink = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address for magic link');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    const res = await signIn(email);
    setIsSubmitting(false);
    if (res.error) {
      setErrorMsg(res.error);
    } else {
      setMagicLinkSent(true);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    signInDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
            <Sprout className="h-7 w-7 text-slate-950" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isSignUp ? 'Create Farm Account' : 'Welcome to AgriCure AI'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignUp
              ? 'Join our multimodal agricultural advisory network'
              : 'Sign in to access your field diagnostics and treatment logs'}
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 mb-6 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Instant Role-Based Demo Access:</span>
          </div>
          <p className="text-[11px] text-slate-300">
            Evaluate the platform without credentials using pre-configured agricultural personas:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin('Farmer')}
              className="rounded-lg border border-emerald-500/40 bg-slate-950/70 p-2 text-center hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 text-xs font-semibold transition-all"
            >
              Farmer
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Agronomist')}
              className="rounded-lg border border-emerald-500/40 bg-slate-950/70 p-2 text-center hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 text-xs font-semibold transition-all"
            >
              Agronomist
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Enterprise Admin')}
              className="rounded-lg border border-emerald-500/40 bg-slate-950/70 p-2 text-center hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 text-xs font-semibold transition-all truncate"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(null); }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
              !isSignUp ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(null); }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
              isSignUp ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {magicLinkSent && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Magic link dispatched! Check your email inbox.</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maria Gonzalez"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">User Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Farmer">Smallholder Farmer</option>
                  <option value="Agronomist">Agronomist / Extension Agent</option>
                  <option value="Enterprise Admin">Enterprise Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-green-500 active:scale-98 transition-all disabled:opacity-50"
          >
            <span>{isSignUp ? 'Complete Registration' : 'Sign In with Supabase Auth'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {!isSignUp && (
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={isSubmitting}
              className="w-full text-center text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1"
            >
              Or send Magic Link to Email
            </button>
          )}
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Encrypted Auth & Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
};
