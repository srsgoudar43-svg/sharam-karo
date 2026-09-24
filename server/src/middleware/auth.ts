import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { config } from '../config/env';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'Farmer' | 'Agronomist' | 'Enterprise Admin';
  fullName: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      res.status(401).json({ error: 'Invalid or empty Bearer token' });
      return;
    }

    // Handle Demo/Guest accounts for friction-free out-of-the-box evaluation
    if (token.startsWith('demo-') || token === 'guest-farmer-token' || (!config.hasSupabase && token === 'local-user-token')) {
      const role = token.includes('agronomist')
        ? 'Agronomist'
        : token.includes('admin')
        ? 'Enterprise Admin'
        : 'Farmer';
      
      const id = token.includes('agronomist')
        ? '00000000-0000-0000-0000-000000000002'
        : token.includes('admin')
        ? '00000000-0000-0000-0000-000000000003'
        : '00000000-0000-0000-0000-000000000001';

      req.user = {
        id,
        email: `${role.toLowerCase().replace(' ', '')}@agricure.local`,
        role,
        fullName: role === 'Farmer' ? 'John Miller' : role === 'Agronomist' ? 'Dr. Sarah Vance' : 'David Sterling',
      };
      next();
      return;
    }

    // Authenticate via Supabase JWT
    if (supabase) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        res.status(401).json({ error: 'Invalid or expired authentication token' });
        return;
      }

      req.user = {
        id: user.id,
        email: user.email || 'user@agricure.app',
        role: (user.user_metadata?.role as any) || 'Farmer',
        fullName: user.user_metadata?.full_name || 'Agricultural Producer',
      };
      next();
      return;
    }

    // Fallback if token passed but Supabase not configured in env
    req.user = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'producer@agricure.local',
      role: 'Farmer',
      fullName: 'John Miller',
    };
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
