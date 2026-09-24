import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env';

let supabaseClient: SupabaseClient | null = null;

if (config.hasSupabase) {
  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✓ Supabase Client successfully initialized');
  } catch (err) {
    console.warn('⚠️ Supabase Client initialization warning:', err);
    supabaseClient = null;
  }
} else {
  console.log('ℹ️ Supabase credentials not fully configured in env; running with in-memory persistence & demo user fallback.');
}

export const supabase = supabaseClient;
