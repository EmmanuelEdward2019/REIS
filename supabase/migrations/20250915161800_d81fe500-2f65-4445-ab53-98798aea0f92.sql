-- Create comprehensive IoT and dashboard management system

-- User profiles table for extended user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  service_class TEXT CHECK (service_class IN ('residential', 'commercial', 'industrial')) DEFAULT 'residential',
  partner_category TEXT CHECK (partner_category IN ('installation_company', 'individual_installer', 'marketing_company', 'technical_partner')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_type TEXT CHECK (verification_type IN ('nin', 'bvn')),
  verification_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- IoT Controllers table
CREATE TABLE public.controllers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  installation_id UUID, -- Reference to installation/project
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL, -- solar_inverter, battery_system, energy_meter, etc.
  ip_address INET,
  mac_address TEXT,
  firmware_version TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_heartbeat TIMESTAMP WITH TIME ZONE,
  installation_date DATE,
  warranty_expiry DATE,
  location JSONB, -- {lat, lng, address}
  configuration JSONB, -- Device-specific config
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time energy metrics from IoT devices
CREATE TABLE public.energy_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id UUID REFERENCES public.controllers(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  solar_generation_w DECIMAL(10,2), -- Current solar generation in watts
  house_load_w DECIMAL(10,2), -- Current house load in watts
  battery_power_w DECIMAL(10,2), -- Battery power (+ charging, - discharging)
  grid_power_w DECIMAL(10,2), -- Grid power consumption
  battery_level_percent DECIMAL(5,2), -- Battery charge level
  battery_voltage_v DECIMAL(8,2), -- Battery voltage
  battery_current_a DECIMAL(8,2), -- Battery current
  battery_temp_c DECIMAL(5,2), -- Battery temperature
  inverter_temp_c DECIMAL(5,2), -- Inverter temperature
  energy_generated_kwh_daily DECIMAL(10,4), -- Daily energy generation
  energy_used_kwh_daily DECIMAL(10,4), -- Daily energy consumption
  efficiency_percent DECIMAL(5,2), -- System efficiency
  system_status TEXT DEFAULT 'normal' CHECK (system_status IN ('normal', 'warning', 'error', 'maintenance')),
  alerts JSONB -- Array of current alerts/warnings
);

-- Installation inventory
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id UUID REFERENCES public.controllers(id) ON DELETE CASCADE NOT NULL,
  component_type TEXT NOT NULL, -- solar_panel, battery, inverter, cable, etc.
  component_name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  serial_number TEXT,
  quantity INTEGER DEFAULT 1,
  unit_cost DECIMAL(10,2),
  installation_date DATE,
  warranty_start DATE,
  warranty_end DATE,
  maintenance_schedule TEXT, -- monthly, quarterly, annually
  last_maintenance DATE,
  next_maintenance DATE,
  condition TEXT DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'faulty')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced ticketing system
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  controller_id UUID REFERENCES public.controllers(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'pending', 'work_in_progress', 'closed')),
  category TEXT CHECK (category IN ('technical', 'billing', 'installation', 'maintenance')),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Ticket updates/comments
CREATE TABLE public.ticket_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  update_type TEXT CHECK (update_type IN ('comment', 'status_change', 'assignment', 'priority_change')),
  content TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing and payments
CREATE TABLE public.billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL, -- installation, maintenance, product, consultation
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_date DATE,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products catalog
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES auth.users(id), -- Partner who added the product
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- solar_panel, battery, inverter, etc.
  brand TEXT,
  model TEXT,
  description TEXT,
  specifications JSONB,
  price DECIMAL(12,2),
  currency TEXT DEFAULT 'NGN',
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  images JSONB, -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.controllers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for controllers
CREATE POLICY "Users can view their own controllers" 
ON public.controllers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own controllers" 
ON public.controllers FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for energy metrics
CREATE POLICY "Users can view metrics from their controllers" 
ON public.energy_metrics FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.controllers 
  WHERE id = energy_metrics.controller_id 
  AND user_id = auth.uid()
));

-- RLS Policies for inventory
CREATE POLICY "Users can view inventory for their controllers" 
ON public.inventory FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.controllers 
  WHERE id = inventory.controller_id 
  AND user_id = auth.uid()
));

-- RLS Policies for tickets
CREATE POLICY "Users can view their own tickets" 
ON public.tickets FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = assigned_to);

CREATE POLICY "Users can create tickets" 
ON public.tickets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Assigned users can update tickets" 
ON public.tickets FOR UPDATE 
USING (auth.uid() = assigned_to OR auth.uid() = user_id);

-- RLS Policies for billing
CREATE POLICY "Users can view their own billing" 
ON public.billing FOR SELECT 
USING (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (is_active = true);

CREATE POLICY "Partners can manage their own products" 
ON public.products FOR ALL 
USING (auth.uid() = partner_id);

-- Create indexes for performance
CREATE INDEX idx_controllers_user_id ON public.controllers(user_id);
CREATE INDEX idx_controllers_online ON public.controllers(is_online);
CREATE INDEX idx_energy_metrics_controller_timestamp ON public.energy_metrics(controller_id, timestamp DESC);
CREATE INDEX idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX idx_tickets_assigned_to ON public.tickets(assigned_to);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_billing_user_id ON public.billing(user_id);
CREATE INDEX idx_products_category ON public.products(category);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_controllers_updated_at
    BEFORE UPDATE ON public.controllers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
    BEFORE UPDATE ON public.inventory
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_billing_updated_at
    BEFORE UPDATE ON public.billing
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique ticket numbers
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number = 'TKT-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('ticket_sequence')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for ticket numbers
CREATE SEQUENCE ticket_sequence START 1;

-- Trigger for auto-generating ticket numbers
CREATE TRIGGER generate_ticket_number_trigger
    BEFORE INSERT ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_ticket_number();

-- Realtime setup for live data
ALTER TABLE public.energy_metrics REPLICA IDENTITY FULL;
ALTER TABLE public.controllers REPLICA IDENTITY FULL;
ALTER TABLE public.tickets REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.energy_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.controllers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;