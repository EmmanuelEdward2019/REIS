-- Create partner_applications table for comprehensive partner onboarding
CREATE TABLE IF NOT EXISTS public.partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id TEXT UNIQUE, -- Generated partner ID (e.g., PTNR-2025-0001)
  
  -- Application Status
  application_status TEXT DEFAULT 'draft' CHECK (application_status IN ('draft', 'submitted', 'under_review', 'kyc_pending', 'kyc_approved', 'compliance_verified', 'active', 'suspended', 'rejected')),
  submission_date TIMESTAMP WITH TIME ZONE,
  approval_date TIMESTAMP WITH TIME ZONE,
  
  -- Basic Information
  partner_type TEXT CHECK (partner_type IN ('company', 'individual')),
  partner_country TEXT NOT NULL,
  partner_category TEXT NOT NULL, -- installer, supplier, marketing, technical
  legal_name TEXT NOT NULL,
  trading_name TEXT,
  
  -- Contact Information
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  address JSONB, -- {street, city, state, postal_code, country}
  
  -- Company Details (for company type)
  registration_number TEXT,
  tax_id TEXT,
  vat_number TEXT,
  incorporation_date DATE,
  company_size TEXT, -- 1-10, 11-50, 51-200, 201-500, 500+
  
  -- Individual Details (for individual type)
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  national_id TEXT,
  
  -- Business Profile
  years_in_business INTEGER,
  annual_revenue TEXT,
  number_of_employees INTEGER,
  service_areas JSONB, -- Array of regions/cities served
  
  -- Capabilities & Certifications
  services_provided JSONB, -- Array of services
  certifications JSONB, -- Array of certification objects
  technical_capabilities JSONB, -- Array of technical skills
  equipment_owned JSONB, -- Array of equipment
  
  -- Financial Information
  bank_name TEXT,
  bank_account_number TEXT,
  bank_routing_number TEXT,
  bank_swift_code TEXT,
  payment_terms TEXT,
  
  -- Insurance & Compliance
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  insurance_expiry DATE,
  insurance_coverage_amount DECIMAL(15,2),
  health_safety_policy BOOLEAN DEFAULT FALSE,
  quality_management_system BOOLEAN DEFAULT FALSE,
  environmental_policy BOOLEAN DEFAULT FALSE,
  
  -- References
  business_references JSONB, -- Array of reference objects

  -- Documents
  documents JSONB, -- Array of document objects with URLs
  
  -- KYC/Verification
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'in_progress', 'approved', 'rejected')),
  kyc_verified_at TIMESTAMP WITH TIME ZONE,
  kyc_verified_by UUID REFERENCES auth.users(id),
  kyc_notes TEXT,
  
  -- Agreement & Terms
  terms_accepted BOOLEAN DEFAULT FALSE,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  privacy_accepted BOOLEAN DEFAULT FALSE,
  privacy_accepted_at TIMESTAMP WITH TIME ZONE,
  code_of_conduct_accepted BOOLEAN DEFAULT FALSE,
  
  -- Admin Notes
  admin_notes TEXT,
  rejection_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partner_certifications table for tracking certifications
CREATE TABLE IF NOT EXISTS public.partner_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT, -- technical, safety, quality, environmental
  issuing_body TEXT,
  validity_period_months INTEGER, -- How long certification is valid
  is_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partner_certification_records table for individual partner certifications
CREATE TABLE IF NOT EXISTS public.partner_certification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partner_applications(id) ON DELETE CASCADE NOT NULL,
  certification_id UUID REFERENCES public.partner_certifications(id) ON DELETE CASCADE NOT NULL,
  certification_number TEXT,
  issue_date DATE,
  expiry_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
  document_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_codes table for tracking partner jobs
CREATE TABLE IF NOT EXISTS public.job_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_code TEXT UNIQUE NOT NULL, -- ET-REIS-RES-AUD-2024-0123
  partner_id UUID REFERENCES public.partner_applications(id),
  client_id UUID REFERENCES auth.users(id),
  
  -- Job Details
  job_type TEXT NOT NULL, -- installation, maintenance, audit, consultation
  service_class TEXT NOT NULL CHECK (service_class IN ('residential', 'commercial', 'industrial')),
  project_name TEXT NOT NULL,
  description TEXT,
  
  -- Location
  location JSONB NOT NULL, -- {address, city, state, country, lat, lng}
  
  -- Financial
  estimated_value DECIMAL(15,2),
  actual_value DECIMAL(15,2),
  currency TEXT DEFAULT 'NGN',
  
  -- Status & Timeline
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled', 'on_hold')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  start_date DATE,
  expected_completion_date DATE,
  actual_completion_date DATE,
  
  -- Technical Details
  system_size_kw DECIMAL(10,2),
  equipment_details JSONB,
  
  -- Documents & Reports
  documents JSONB, -- Array of document URLs
  completion_report_url TEXT,
  
  -- Ratings & Feedback
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  client_feedback TEXT,
  partner_rating INTEGER CHECK (partner_rating >= 1 AND partner_rating <= 5),
  partner_feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_certification_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partner_applications
DROP POLICY IF EXISTS "Users can view their own partner application" ON public.partner_applications;
CREATE POLICY "Users can view their own partner application"
ON public.partner_applications FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own partner application" ON public.partner_applications;
CREATE POLICY "Users can create their own partner application"
ON public.partner_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own partner application" ON public.partner_applications;
CREATE POLICY "Users can update their own partner application"
ON public.partner_applications FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all partner applications" ON public.partner_applications;
CREATE POLICY "Admins can view all partner applications"
ON public.partner_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can update all partner applications" ON public.partner_applications;
CREATE POLICY "Admins can update all partner applications"
ON public.partner_applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- RLS Policies for partner_certifications
DROP POLICY IF EXISTS "All authenticated users can view certifications" ON public.partner_certifications;
CREATE POLICY "All authenticated users can view certifications"
ON public.partner_certifications FOR SELECT
TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage certifications" ON public.partner_certifications;
CREATE POLICY "Admins can manage certifications"
ON public.partner_certifications FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- RLS Policies for partner_certification_records
DROP POLICY IF EXISTS "Partners can view their certification records" ON public.partner_certification_records;
CREATE POLICY "Partners can view their certification records"
ON public.partner_certification_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_applications
    WHERE id = partner_certification_records.partner_id
    AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can view all certification records" ON public.partner_certification_records;
CREATE POLICY "Admins can view all certification records"
ON public.partner_certification_records FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage certification records" ON public.partner_certification_records;
CREATE POLICY "Admins can manage certification records"
ON public.partner_certification_records FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- RLS Policies for job_codes
DROP POLICY IF EXISTS "Partners can view their job codes" ON public.job_codes;
CREATE POLICY "Partners can view their job codes"
ON public.job_codes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.partner_applications
    WHERE id = job_codes.partner_id
    AND user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Clients can view their job codes" ON public.job_codes;
CREATE POLICY "Clients can view their job codes"
ON public.job_codes FOR SELECT
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins can view all job codes" ON public.job_codes;
CREATE POLICY "Admins can view all job codes"
ON public.job_codes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can manage all job codes" ON public.job_codes;
CREATE POLICY "Admins can manage all job codes"
ON public.job_codes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND user_role = 'admin'
  )
);

-- Create sequences for partner IDs and job codes
CREATE SEQUENCE IF NOT EXISTS partner_id_sequence START 1;
CREATE SEQUENCE IF NOT EXISTS job_code_sequence START 1;

-- Function to generate partner ID
CREATE OR REPLACE FUNCTION public.generate_partner_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.partner_id = 'PTNR-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('partner_id_sequence')::TEXT, 4, '0');
    RETURN NEW;
END;
$$;

-- Function to generate job code
CREATE OR REPLACE FUNCTION public.generate_job_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.job_code = 'ET-REIS-' || 
                   CASE NEW.service_class
                     WHEN 'residential' THEN 'RES'
                     WHEN 'commercial' THEN 'COM'
                     WHEN 'industrial' THEN 'IND'
                   END || '-' ||
                   CASE NEW.job_type
                     WHEN 'installation' THEN 'INS'
                     WHEN 'maintenance' THEN 'MNT'
                     WHEN 'audit' THEN 'AUD'
                     WHEN 'consultation' THEN 'CON'
                   END || '-' ||
                   EXTRACT(YEAR FROM NOW()) || '-' ||
                   LPAD(nextval('job_code_sequence')::TEXT, 4, '0');
    RETURN NEW;
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS generate_partner_id_trigger ON public.partner_applications;
CREATE TRIGGER generate_partner_id_trigger
    BEFORE INSERT ON public.partner_applications
    FOR EACH ROW
    WHEN (NEW.partner_id IS NULL)
    EXECUTE FUNCTION public.generate_partner_id();

DROP TRIGGER IF EXISTS generate_job_code_trigger ON public.job_codes;
CREATE TRIGGER generate_job_code_trigger
    BEFORE INSERT ON public.job_codes
    FOR EACH ROW
    WHEN (NEW.job_code IS NULL)
    EXECUTE FUNCTION public.generate_job_code();

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_partner_applications_updated_at ON public.partner_applications;
CREATE TRIGGER update_partner_applications_updated_at
    BEFORE UPDATE ON public.partner_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_certifications_updated_at ON public.partner_certifications;
CREATE TRIGGER update_partner_certifications_updated_at
    BEFORE UPDATE ON public.partner_certifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_certification_records_updated_at ON public.partner_certification_records;
CREATE TRIGGER update_partner_certification_records_updated_at
    BEFORE UPDATE ON public.partner_certification_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_codes_updated_at ON public.job_codes;
CREATE TRIGGER update_job_codes_updated_at
    BEFORE UPDATE ON public.job_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

