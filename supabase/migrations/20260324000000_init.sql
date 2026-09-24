-- AI-Powered Agriculture Crop Advisory Assistant
-- Production PostgreSQL Migration with Row Level Security (RLS)
-- File: supabase/migrations/20260324000000_init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Profile Extension Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    farm_name TEXT,
    location TEXT NOT NULL,
    farm_size_acres NUMERIC(10,2) DEFAULT 5.0,
    primary_soil_type TEXT DEFAULT 'Loam',
    role TEXT DEFAULT 'Farmer' CHECK (role IN ('Farmer', 'Agronomist', 'Enterprise Admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Consultations Table
CREATE TABLE IF NOT EXISTS public.consultations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    crop_type TEXT NOT NULL,
    growth_stage TEXT NOT NULL,
    soil_type TEXT NOT NULL,
    symptoms_description TEXT,
    image_url TEXT,
    diagnosis_title TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    urgency_level TEXT CHECK (urgency_level IN ('Low', 'Moderate', 'High', 'Critical')) NOT NULL,
    raw_ai_response JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Treatment Actions Table
CREATE TABLE IF NOT EXISTS public.treatment_actions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT CHECK (action_type IN ('Organic', 'Chemical', 'Cultural', 'Preventive')) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    timing TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_crop_type ON public.consultations(crop_type);
CREATE INDEX IF NOT EXISTS idx_consultations_urgency ON public.consultations(urgency_level);
CREATE INDEX IF NOT EXISTS idx_treatment_actions_consultation ON public.treatment_actions(consultation_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_actions ENABLE ROW LEVEL SECURITY;

-- 4. Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 5. Consultations RLS Policies
DROP POLICY IF EXISTS "Users can view own consultations" ON public.consultations;
CREATE POLICY "Users can view own consultations" 
    ON public.consultations FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own consultations" ON public.consultations;
CREATE POLICY "Users can insert own consultations" 
    ON public.consultations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own consultations" ON public.consultations;
CREATE POLICY "Users can delete own consultations" 
    ON public.consultations FOR DELETE 
    USING (auth.uid() = user_id);

-- 6. Treatment Actions RLS Policies
DROP POLICY IF EXISTS "Users can view treatments for own consultations" ON public.treatment_actions;
CREATE POLICY "Users can view treatments for own consultations" 
    ON public.treatment_actions FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.consultations 
        WHERE consultations.id = treatment_actions.consultation_id 
        AND consultations.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert treatments for own consultations" ON public.treatment_actions;
CREATE POLICY "Users can insert treatments for own consultations" 
    ON public.treatment_actions FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.consultations 
        WHERE consultations.id = treatment_actions.consultation_id 
        AND consultations.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete treatments for own consultations" ON public.treatment_actions;
CREATE POLICY "Users can delete treatments for own consultations" 
    ON public.treatment_actions FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM public.consultations 
        WHERE consultations.id = treatment_actions.consultation_id 
        AND consultations.user_id = auth.uid()
    ));

-- Automatic profile creation trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, farm_name, location, farm_size_acres, primary_soil_type, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agricultural Producer'),
    COALESCE(NEW.raw_user_meta_data->>'farm_name', 'Green Valley Farm'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Central Valley, CA'),
    5.0,
    'Loam',
    'Farmer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
