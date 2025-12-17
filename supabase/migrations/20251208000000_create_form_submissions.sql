-- Create form_submissions table for storing all website form submissions
CREATE TABLE IF NOT EXISTS public.form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'newsletter', 'consultation', 'quote_request', 'partner_inquiry', 'support', 'other')),
    name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT,
    interest TEXT,
    source_page TEXT,
    metadata JSONB DEFAULT '{}',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived', 'spam')),
    assigned_to UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ
);

-- Create index for faster queries
CREATE INDEX idx_form_submissions_form_type ON public.form_submissions(form_type);
CREATE INDEX idx_form_submissions_status ON public.form_submissions(status);
CREATE INDEX idx_form_submissions_created_at ON public.form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_email ON public.form_submissions(email);

-- Enable RLS
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all form submissions" ON public.form_submissions
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.user_role = 'admin'
        )
    );

-- Policy: Anyone can insert (for public forms)
CREATE POLICY "Anyone can submit forms" ON public.form_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_form_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER form_submissions_updated_at
    BEFORE UPDATE ON public.form_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_form_submissions_updated_at();

-- Add comment
COMMENT ON TABLE public.form_submissions IS 'Stores all form submissions from the website including contact forms, newsletter signups, consultation requests, etc.';
