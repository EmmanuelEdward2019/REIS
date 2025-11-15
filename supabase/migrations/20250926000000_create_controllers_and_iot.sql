-- Migration: Create IoT Controllers and Real-time Data tables
-- This enables live monitoring of solar installations

-- ============================================================================
-- DROP EXISTING TABLES (if they exist from failed migrations)
-- ============================================================================
DROP TABLE IF EXISTS public.maintenance_schedules CASCADE;
DROP TABLE IF EXISTS public.controller_alerts CASCADE;
DROP TABLE IF EXISTS public.controller_historical_data CASCADE;
DROP TABLE IF EXISTS public.controller_live_data CASCADE;
DROP TABLE IF EXISTS public.controllers CASCADE;

-- ============================================================================
-- CONTROLLERS TABLE
-- ============================================================================
CREATE TABLE public.controllers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id VARCHAR(100) UNIQUE NOT NULL,
  client_id UUID NOT NULL, -- FK added later
  installation_id UUID, -- Link to installation/project
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  system_capacity_kw DECIMAL(10, 2), -- System capacity in kW
  panel_count INTEGER,
  inverter_model VARCHAR(100),
  battery_capacity_kwh DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'maintenance', 'offline'
  firmware_version VARCHAR(50),
  last_communication TIMESTAMPTZ,
  installation_date DATE,
  warranty_expiry DATE,
  metadata JSONB, -- Additional configuration
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTROLLER LIVE DATA TABLE (Real-time metrics)
-- ============================================================================
CREATE TABLE public.controller_live_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id UUID REFERENCES public.controllers(id) ON DELETE CASCADE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Power Generation
  current_power_w DECIMAL(10, 2), -- Current power output in Watts
  daily_energy_kwh DECIMAL(10, 3), -- Energy generated today in kWh
  monthly_energy_kwh DECIMAL(10, 3),
  total_energy_kwh DECIMAL(12, 3), -- Lifetime energy
  
  -- Voltage & Current
  pv_voltage_v DECIMAL(6, 2), -- PV array voltage
  pv_current_a DECIMAL(6, 2), -- PV array current
  battery_voltage_v DECIMAL(6, 2),
  battery_current_a DECIMAL(6, 2),
  load_voltage_v DECIMAL(6, 2),
  load_current_a DECIMAL(6, 2),
  
  -- Battery Status
  battery_soc_percent DECIMAL(5, 2), -- State of Charge
  battery_temperature_c DECIMAL(5, 2),
  battery_health_percent DECIMAL(5, 2),
  
  -- Environmental
  panel_temperature_c DECIMAL(5, 2),
  ambient_temperature_c DECIMAL(5, 2),
  irradiance_w_m2 DECIMAL(7, 2), -- Solar irradiance
  
  -- System Status
  inverter_status VARCHAR(50), -- 'normal', 'fault', 'standby'
  grid_status VARCHAR(50), -- 'connected', 'disconnected'
  load_power_w DECIMAL(10, 2),
  grid_power_w DECIMAL(10, 2),
  
  -- Efficiency & Performance
  system_efficiency_percent DECIMAL(5, 2),
  performance_ratio DECIMAL(5, 2),
  
  -- Alarms & Faults
  fault_codes JSONB, -- Array of fault codes
  alarm_status VARCHAR(50), -- 'normal', 'warning', 'critical'
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTROLLER HISTORICAL DATA (Aggregated for analytics)
-- ============================================================================
CREATE TABLE public.controller_historical_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id UUID REFERENCES public.controllers(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  
  -- Daily Aggregates
  total_energy_kwh DECIMAL(10, 3),
  peak_power_w DECIMAL(10, 2),
  avg_power_w DECIMAL(10, 2),
  min_battery_soc DECIMAL(5, 2),
  max_battery_soc DECIMAL(5, 2),
  avg_system_efficiency DECIMAL(5, 2),
  
  -- Environmental Averages
  avg_panel_temp_c DECIMAL(5, 2),
  avg_irradiance_w_m2 DECIMAL(7, 2),
  
  -- Operational Hours
  system_uptime_hours DECIMAL(5, 2),
  grid_connected_hours DECIMAL(5, 2),
  
  -- Faults & Alarms
  fault_count INTEGER DEFAULT 0,
  alarm_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(controller_id, date)
);

-- ============================================================================
-- CONTROLLER ALERTS TABLE
-- ============================================================================
CREATE TABLE public.controller_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id UUID REFERENCES public.controllers(id) ON DELETE CASCADE NOT NULL,
  alert_type VARCHAR(50) NOT NULL, -- 'fault', 'warning', 'maintenance', 'offline'
  severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  fault_code VARCHAR(50),
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(user_id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MAINTENANCE SCHEDULES TABLE
-- ============================================================================
CREATE TABLE public.maintenance_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  controller_id UUID REFERENCES public.controllers(id) ON DELETE CASCADE NOT NULL,
  maintenance_type VARCHAR(100) NOT NULL, -- 'routine', 'preventive', 'corrective'
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  assigned_partner_id UUID REFERENCES public.profiles(user_id),
  status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  notes TEXT,
  checklist JSONB, -- Maintenance checklist items
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_controllers_client ON public.controllers(client_id);
CREATE INDEX IF NOT EXISTS idx_controllers_status ON public.controllers(status);
CREATE INDEX IF NOT EXISTS idx_live_data_controller ON public.controller_live_data(controller_id);
CREATE INDEX IF NOT EXISTS idx_live_data_timestamp ON public.controller_live_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_historical_data_controller ON public.controller_historical_data(controller_id);
CREATE INDEX IF NOT EXISTS idx_historical_data_date ON public.controller_historical_data(date DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_controller ON public.controller_alerts(controller_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON public.controller_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_maintenance_controller ON public.maintenance_schedules(controller_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_date ON public.maintenance_schedules(scheduled_date);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE TRIGGER update_controllers_updated_at BEFORE UPDATE ON public.controllers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON public.controller_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at BEFORE UPDATE ON public.maintenance_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION: Get Latest Controller Data
-- ============================================================================
CREATE OR REPLACE FUNCTION get_latest_controller_data(p_controller_id UUID)
RETURNS TABLE (
  controller_id UUID,
  current_power_w DECIMAL,
  daily_energy_kwh DECIMAL,
  battery_soc_percent DECIMAL,
  system_efficiency_percent DECIMAL,
  alarm_status VARCHAR,
  data_timestamp TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cld.controller_id,
    cld.current_power_w,
    cld.daily_energy_kwh,
    cld.battery_soc_percent,
    cld.system_efficiency_percent,
    cld.alarm_status,
    cld.timestamp AS data_timestamp
  FROM public.controller_live_data cld
  WHERE cld.controller_id = p_controller_id
  ORDER BY cld.timestamp DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Aggregate Daily Data
-- ============================================================================
CREATE OR REPLACE FUNCTION aggregate_daily_controller_data()
RETURNS void AS $$
BEGIN
  INSERT INTO public.controller_historical_data (
    controller_id,
    date,
    total_energy_kwh,
    peak_power_w,
    avg_power_w,
    min_battery_soc,
    max_battery_soc,
    avg_system_efficiency,
    avg_panel_temp_c,
    avg_irradiance_w_m2,
    system_uptime_hours
  )
  SELECT 
    controller_id,
    DATE(timestamp) as date,
    MAX(daily_energy_kwh) as total_energy_kwh,
    MAX(current_power_w) as peak_power_w,
    AVG(current_power_w) as avg_power_w,
    MIN(battery_soc_percent) as min_battery_soc,
    MAX(battery_soc_percent) as max_battery_soc,
    AVG(system_efficiency_percent) as avg_system_efficiency,
    AVG(panel_temperature_c) as avg_panel_temp_c,
    AVG(irradiance_w_m2) as avg_irradiance_w_m2,
    COUNT(*) * 0.25 as system_uptime_hours -- Assuming 15-min intervals
  FROM public.controller_live_data
  WHERE DATE(timestamp) = CURRENT_DATE - INTERVAL '1 day'
  GROUP BY controller_id, DATE(timestamp)
  ON CONFLICT (controller_id, date) DO UPDATE
  SET 
    total_energy_kwh = EXCLUDED.total_energy_kwh,
    peak_power_w = EXCLUDED.peak_power_w,
    avg_power_w = EXCLUDED.avg_power_w,
    min_battery_soc = EXCLUDED.min_battery_soc,
    max_battery_soc = EXCLUDED.max_battery_soc,
    avg_system_efficiency = EXCLUDED.avg_system_efficiency,
    avg_panel_temp_c = EXCLUDED.avg_panel_temp_c,
    avg_irradiance_w_m2 = EXCLUDED.avg_irradiance_w_m2,
    system_uptime_hours = EXCLUDED.system_uptime_hours;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Controllers: Clients can view their own, admins and partners can view all
ALTER TABLE public.controllers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "controllers_select" ON public.controllers FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
    )
  );

CREATE POLICY "controllers_insert_admin" ON public.controllers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

CREATE POLICY "controllers_update_admin" ON public.controllers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role = 'admin'
    )
  );

-- Live Data: Inherit from controllers
ALTER TABLE public.controller_live_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "live_data_select" ON public.controller_live_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.controllers c
      WHERE c.id = controller_live_data.controller_id
      AND (c.client_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
      ))
    )
  );

CREATE POLICY "live_data_insert_system" ON public.controller_live_data FOR INSERT
  TO authenticated
  WITH CHECK (true); -- IoT devices will use service role

-- Historical Data: Same as live data
ALTER TABLE public.controller_historical_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "historical_data_select" ON public.controller_historical_data FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.controllers c
      WHERE c.id = controller_historical_data.controller_id
      AND (c.client_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
      ))
    )
  );

-- Alerts: Inherit from controllers
ALTER TABLE public.controller_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alerts_select" ON public.controller_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.controllers c
      WHERE c.id = controller_alerts.controller_id
      AND (c.client_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
      ))
    )
  );

CREATE POLICY "alerts_update_admin_partner" ON public.controller_alerts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
    )
  );

-- Maintenance: Inherit from controllers
ALTER TABLE public.maintenance_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "maintenance_select" ON public.maintenance_schedules FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.controllers c
      WHERE c.id = maintenance_schedules.controller_id
      AND (c.client_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
      ))
    )
  );

CREATE POLICY "maintenance_insert_admin_partner" ON public.maintenance_schedules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
    )
  );

CREATE POLICY "maintenance_update_admin_partner" ON public.maintenance_schedules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND user_role IN ('admin', 'partner')
    )
  );

-- ============================================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ============================================================================
-- Add foreign keys after tables are created to avoid circular dependency issues

-- Controllers table foreign keys
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints
      WHERE constraint_name = 'controllers_client_id_fkey'
      AND table_name = 'controllers'
    ) THEN
      ALTER TABLE public.controllers
      ADD CONSTRAINT controllers_client_id_fkey
      FOREIGN KEY (client_id) REFERENCES public.profiles(user_id);
    END IF;
  END IF;
END $$;

