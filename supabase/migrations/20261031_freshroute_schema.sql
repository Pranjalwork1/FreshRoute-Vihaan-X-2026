-- FRESHROUTE DATABASE SCHEMA MIGRATION: PHASE 1 FOUNDATION & CORE ENTITIES
-- Run this in your Supabase SQL Editor

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. USER ROLES TABLE (Multi-role architecture)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'local_vendor', 'retailer', 'wholesaler', 'logistics_provider', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

-- 4. BUSINESS PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  contact_phone TEXT,
  verification_status TEXT DEFAULT 'not_submitted' CHECK (verification_status IN ('not_submitted', 'pending', 'verified', 'rejected')),
  operating_region TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address_line TEXT,
  village TEXT,
  city TEXT,
  district TEXT,
  state TEXT,
  postal_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ROLE-SPECIFIC PROFILES TABLE (Extensions for specific business roles)
CREATE TABLE IF NOT EXISTS public.role_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('farmer', 'local_vendor', 'retailer', 'wholesaler', 'logistics_provider')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_role_profile UNIQUE (user_id, role)
);

-- 7. VERIFICATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. USER PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  notifications_email BOOLEAN DEFAULT true,
  notifications_sms BOOLEAN DEFAULT true,
  notifications_whatsapp BOOLEAN DEFAULT false,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- 9. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. PRODUCE CATALOG TABLE (Prepared for Phase 2)
CREATE TABLE IF NOT EXISTS public.produce_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Vegetables', 'Fruits', 'Grains', 'Pulses', 'Seasonal Produce', 'Other Produce')),
  unit_type TEXT DEFAULT 'kg',
  aliases TEXT[] DEFAULT '{}',
  handling_guidance TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. PRODUCE BATCHES TABLE (Prepared for Phase 2)
CREATE TABLE IF NOT EXISTS public.produce_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  catalog_product_id UUID REFERENCES public.produce_catalog(id) ON DELETE SET NULL,
  batch_code TEXT NOT NULL,
  produce_name TEXT NOT NULL,
  category TEXT NOT NULL,
  variety TEXT,
  description TEXT,
  quantity_total NUMERIC NOT NULL CHECK (quantity_total >= 0),
  quantity_available NUMERIC NOT NULL CHECK (quantity_available >= 0),
  quantity_reserved NUMERIC DEFAULT 0 CHECK (quantity_reserved >= 0),
  quantity_sold NUMERIC DEFAULT 0 CHECK (quantity_sold >= 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  price_per_unit NUMERIC NOT NULL CHECK (price_per_unit >= 0),
  minimum_order_quantity NUMERIC DEFAULT 1 CHECK (minimum_order_quantity >= 0),
  is_negotiable BOOLEAN DEFAULT false,
  bulk_pricing_details TEXT,
  quality_grade TEXT DEFAULT 'Ungraded',
  harvest_date DATE,
  current_condition TEXT,
  storage_condition TEXT,
  packaging_type TEXT,
  availability_deadline TIMESTAMPTZ,
  pickup_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  pickup_location_text TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. BATCH IMAGES TABLE (Prepared for Phase 2)
CREATE TABLE IF NOT EXISTS public.batch_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES public.produce_batches(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_business_profiles_user ON public.business_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_role_profiles_user ON public.role_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_user ON public.verification_requests(user_id);

-- TRIGGER FOR NEW USER PROFILE & PREFERENCES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone'
  );

  INSERT INTO public.user_preferences (user_id)
  VALUES (new.id)
  ON CONFLICT DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produce_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_images ENABLE ROW LEVEL SECURITY;

-- POLICIES: PROFILES
CREATE POLICY "Public profile view"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POLICIES: USER ROLES
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert permitted non-admin roles"
  ON public.user_roles FOR INSERT WITH CHECK (
    auth.uid() = user_id AND role <> 'admin'
  );

-- POLICIES: BUSINESS PROFILES
CREATE POLICY "Business profiles viewable by everyone"
  ON public.business_profiles FOR SELECT USING (true);

CREATE POLICY "Users can manage own business profile"
  ON public.business_profiles FOR ALL USING (auth.uid() = user_id);

-- POLICIES: ADDRESSES
CREATE POLICY "Users can manage own addresses"
  ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- POLICIES: ROLE PROFILES
CREATE POLICY "Users can manage own role profile details"
  ON public.role_profiles FOR ALL USING (auth.uid() = user_id);

-- POLICIES: VERIFICATION REQUESTS
CREATE POLICY "Users can view own verification requests"
  ON public.verification_requests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can submit verification requests"
  ON public.verification_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- POLICIES: USER PREFERENCES
CREATE POLICY "Users can manage own preferences"
  ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

-- POLICIES: PRODUCE CATALOG
CREATE POLICY "Catalog viewable by all"
  ON public.produce_catalog FOR SELECT USING (true);

-- POLICIES: PRODUCE BATCHES
CREATE POLICY "Batches viewable by all"
  ON public.produce_batches FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Sellers manage own batches"
  ON public.produce_batches FOR ALL USING (auth.uid() = seller_id);

-- POLICIES: BATCH IMAGES
CREATE POLICY "Batch images viewable by all"
  ON public.batch_images FOR SELECT USING (true);

CREATE POLICY "Sellers manage batch images"
  ON public.batch_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.produce_batches WHERE id = batch_images.batch_id AND seller_id = auth.uid())
  );
