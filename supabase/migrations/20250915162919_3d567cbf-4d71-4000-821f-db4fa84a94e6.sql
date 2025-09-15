-- Fix security linter issues

-- Fix search_path for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number = 'TKT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('ticket_sequence')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add missing RLS policies for ticket_updates
CREATE POLICY "Users can view ticket updates for their tickets" 
ON public.ticket_updates FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.tickets 
  WHERE id = ticket_updates.ticket_id 
  AND (user_id = auth.uid() OR assigned_to = auth.uid())
));

CREATE POLICY "Users can create ticket updates for their tickets" 
ON public.ticket_updates FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.tickets 
    WHERE id = ticket_updates.ticket_id 
    AND (user_id = auth.uid() OR assigned_to = auth.uid())
  )
);

-- Add missing RLS policies for inventory (insert, update, delete)
CREATE POLICY "Users can insert inventory for their controllers" 
ON public.inventory FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.controllers 
  WHERE id = inventory.controller_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update inventory for their controllers" 
ON public.inventory FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.controllers 
  WHERE id = inventory.controller_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can delete inventory for their controllers" 
ON public.inventory FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.controllers 
  WHERE id = inventory.controller_id 
  AND user_id = auth.uid()
));

-- Add missing RLS policies for energy_metrics (insert)
CREATE POLICY "System can insert energy metrics" 
ON public.energy_metrics FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.controllers 
  WHERE id = energy_metrics.controller_id 
  AND user_id = auth.uid()
));

-- Add missing RLS policies for billing (insert, update)
CREATE POLICY "System can create billing records" 
ON public.billing FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own billing" 
ON public.billing FOR UPDATE 
USING (auth.uid() = user_id);