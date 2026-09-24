import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  token: string | null;
  role: UserRole;
  isLoading: boolean;
  isDemo: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, role?: UserRole) => Promise<{ error?: string }>;
  signInDemo: (role: UserRole) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Supabase client initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseAnonKey !== 'your_supabase_anon_key_here'
);

export const supabase: SupabaseClient | null = (isSupabaseConfigured && supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('agricure_token') || 'demo-farmer-token');
  const [role, setRole] = useState<UserRole>('Farmer');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(true);

  // Initialize session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('agricure_token');
        const storedRole = (localStorage.getItem('agricure_role') as UserRole) || 'Farmer';

        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            setToken(session.access_token);
            setIsDemo(false);
            const userRole = (session.user.user_metadata?.role as UserRole) || 'Farmer';
            setRole(userRole);
            await fetchProfile(session.user.id, session.access_token);
            setIsLoading(false);
            return;
          }
        }

        // Default or remembered Demo session
        if (storedToken && storedToken.startsWith('demo-')) {
          setToken(storedToken);
          setRole(storedRole);
          setIsDemo(true);
          createDemoUser(storedRole);
        } else {
          // Default to Farmer demo mode
          setToken('demo-farmer-token');
          setRole('Farmer');
          setIsDemo(true);
          createDemoUser('Farmer');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        createDemoUser('Farmer');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          setToken(session.access_token);
          localStorage.setItem('agricure_token', session.access_token);
          setIsDemo(false);
          const userRole = (session.user.user_metadata?.role as UserRole) || 'Farmer';
          setRole(userRole);
          await fetchProfile(session.user.id, session.access_token);
        } else {
          // Keep demo active if logged out of Supabase
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const createDemoUser = (userRole: UserRole) => {
    const id = userRole === 'Agronomist' 
      ? '00000000-0000-0000-0000-000000000002'
      : userRole === 'Enterprise Admin'
      ? '00000000-0000-0000-0000-000000000003'
      : '00000000-0000-0000-0000-000000000001';

    const fullName = userRole === 'Agronomist'
      ? 'Dr. Sarah Vance, Ph.D.'
      : userRole === 'Enterprise Admin'
      ? 'David Sterling (AgriCorp)'
      : 'John Miller';

    const mockProfile: UserProfile = {
      id,
      full_name: fullName,
      farm_name: userRole === 'Agronomist' ? 'State Agricultural Extension Lab' : 'Sun Valley Heritage Farm',
      location: 'Salinas Valley, California',
      farm_size_acres: userRole === 'Enterprise Admin' ? 1250.0 : 42.5,
      primary_soil_type: 'Loam',
      role: userRole,
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    };

    setProfile(mockProfile);
    setUser({
      id,
      email: `${userRole.toLowerCase().replace(' ', '')}@agricure.local`,
      app_metadata: {},
      user_metadata: { full_name: fullName, role: userRole },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User);
  };

  const fetchProfile = async (userId: string, authToken: string) => {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch profile:', err);
    }
  };

  const signIn = async (email: string, password?: string): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          setUser(data.user);
          setToken(data.session.access_token);
          localStorage.setItem('agricure_token', data.session.access_token);
          setIsDemo(false);
          await fetchProfile(data.user.id, data.session.access_token);
          return {};
        }
      } else if (supabase && !password) {
        // Magic link
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        return {};
      }

      // If Supabase is not connected, sign in with demo email simulation
      signInDemo('Farmer');
      return {};
    } catch (err: any) {
      return { error: err.message || 'Authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userRole: UserRole = 'Farmer'): Promise<{ error?: string }> => {
    setIsLoading(true);
    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: userRole,
            }
          }
        });
        if (error) throw error;
        if (data.session) {
          setUser(data.user);
          setToken(data.session.access_token);
          localStorage.setItem('agricure_token', data.session.access_token);
          setIsDemo(false);
          return {};
        }
      }

      // Fallback
      signInDemo(userRole);
      return {};
    } catch (err: any) {
      return { error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInDemo = (demoRole: UserRole) => {
    const demoToken = `demo-${demoRole.toLowerCase().replace(' ', '')}-token`;
    localStorage.setItem('agricure_token', demoToken);
    localStorage.setItem('agricure_role', demoRole);
    setToken(demoToken);
    setRole(demoRole);
    setIsDemo(true);
    createDemoUser(demoRole);
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('agricure_token');
    localStorage.removeItem('agricure_role');
    // Switch to clean farmer demo or null
    signInDemo('Farmer');
  };

  const refreshProfile = async () => {
    if (token) {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      token,
      role,
      isLoading,
      isDemo,
      signIn,
      signUp,
      signInDemo,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
