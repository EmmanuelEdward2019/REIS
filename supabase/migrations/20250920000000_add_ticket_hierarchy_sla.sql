-- Add ticket hierarchy and SLA fields to tickets table
ALTER TABLE public.tickets
ADD COLUMN IF NOT EXISTS hierarchy_level TEXT DEFAULT 'L1' CHECK (hierarchy_level IN ('L1', 'L2', 'L3', 'L4')),
ADD COLUMN IF NOT EXISTS sla_deadline TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS sla_status TEXT DEFAULT 'within_sla' CHECK (sla_status IN ('within_sla', 'approaching_breach', 'breached')),
ADD COLUMN IF NOT EXISTS escalated_from UUID REFERENCES public.tickets(id),
ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS escalation_reason TEXT;

-- Create internal_memos table for admin/partner internal communication
CREATE TABLE IF NOT EXISTS public.internal_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  memo_content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT true,
  customer_visible_status TEXT, -- What the customer sees in dropdown
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries (skip if already exists)
CREATE INDEX IF NOT EXISTS idx_tickets_hierarchy_level ON public.tickets(hierarchy_level);
CREATE INDEX IF NOT EXISTS idx_tickets_sla_status ON public.tickets(sla_status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_internal_memos_ticket_id ON public.internal_memos(ticket_id);

-- RLS Policies for internal_memos
-- Only admins and assigned partners can view internal memos
DROP POLICY IF EXISTS "Admins and assigned users can view internal memos" ON public.internal_memos;
CREATE POLICY "Admins and assigned users can view internal memos"
ON public.internal_memos FOR SELECT
USING (
  auth.uid() IN (
    SELECT assigned_to FROM public.tickets WHERE id = ticket_id
  ) OR
  auth.uid() = user_id
);

-- Only admins and assigned partners can create internal memos
DROP POLICY IF EXISTS "Admins and assigned users can create internal memos" ON public.internal_memos;
CREATE POLICY "Admins and assigned users can create internal memos"
ON public.internal_memos FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT assigned_to FROM public.tickets WHERE id = ticket_id
  ) OR
  auth.uid() = user_id
);

-- Function to calculate SLA deadline based on priority
CREATE OR REPLACE FUNCTION public.calculate_sla_deadline(
  ticket_priority TEXT,
  created_timestamp TIMESTAMP WITH TIME ZONE
)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  CASE ticket_priority
    WHEN 'critical' THEN
      RETURN created_timestamp + INTERVAL '4 hours';
    WHEN 'high' THEN
      RETURN created_timestamp + INTERVAL '24 hours';
    WHEN 'medium' THEN
      RETURN created_timestamp + INTERVAL '72 hours';
    WHEN 'low' THEN
      RETURN created_timestamp + INTERVAL '168 hours'; -- 7 days
    ELSE
      RETURN created_timestamp + INTERVAL '72 hours'; -- default to medium
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update SLA status based on deadline
CREATE OR REPLACE FUNCTION public.update_sla_status()
RETURNS TRIGGER AS $$
DECLARE
  time_remaining INTERVAL;
  threshold_time INTERVAL;
BEGIN
  -- Calculate time remaining until SLA deadline
  time_remaining := NEW.sla_deadline - NOW();
  
  -- Set threshold for "approaching breach" (20% of total SLA time)
  threshold_time := (NEW.sla_deadline - NEW.created_at) * 0.2;
  
  -- Update SLA status
  IF time_remaining < INTERVAL '0' THEN
    NEW.sla_status := 'breached';
  ELSIF time_remaining < threshold_time THEN
    NEW.sla_status := 'approaching_breach';
  ELSE
    NEW.sla_status := 'within_sla';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-calculate SLA deadline on ticket creation
CREATE OR REPLACE FUNCTION public.set_initial_sla()
RETURNS TRIGGER AS $$
BEGIN
  -- Set SLA deadline if not already set
  IF NEW.sla_deadline IS NULL THEN
    NEW.sla_deadline := public.calculate_sla_deadline(NEW.priority, NEW.created_at);
  END IF;
  
  -- Set initial SLA status
  NEW.sla_status := 'within_sla';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS set_initial_sla_trigger ON public.tickets;
CREATE TRIGGER set_initial_sla_trigger
  BEFORE INSERT ON public.tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_initial_sla();

-- Trigger to update SLA status on ticket update
DROP TRIGGER IF EXISTS update_sla_status_trigger ON public.tickets;
CREATE TRIGGER update_sla_status_trigger
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW
  WHEN (OLD.sla_deadline IS DISTINCT FROM NEW.sla_deadline OR OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.update_sla_status();

-- Trigger for updated_at on internal_memos
DROP TRIGGER IF EXISTS update_internal_memos_updated_at ON public.internal_memos;
CREATE TRIGGER update_internal_memos_updated_at
  BEFORE UPDATE ON public.internal_memos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on internal_memos
ALTER TABLE public.internal_memos ENABLE ROW LEVEL SECURITY;

-- Add comment for documentation
COMMENT ON TABLE public.internal_memos IS 'Internal communication between admins and partners that customers cannot see';
COMMENT ON COLUMN public.tickets.hierarchy_level IS 'Ticket escalation level: L1 (initial), L2, L3, L4';
COMMENT ON COLUMN public.tickets.sla_status IS 'Current SLA status: within_sla, approaching_breach, or breached';
COMMENT ON COLUMN public.internal_memos.customer_visible_status IS 'Status message that customer can see in dropdown';

