-- Migration: Seed Sample Products for Shop
-- This adds sample products to test the shop functionality

-- ============================================================================
-- INSERT SAMPLE PRODUCTS
-- ============================================================================

-- Solar Panels
INSERT INTO public.products (name, description, category, subcategory, price_ngn, price_gbp, brand, sku, stock_quantity, is_active, is_featured, specifications, images) VALUES
(
  'Canadian Solar 550W Monocrystalline Panel',
  'High-efficiency monocrystalline solar panel with 21.2% efficiency. Perfect for residential and commercial installations. Comes with 25-year performance warranty.',
  'solar_panel',
  'residential',
  185000,
  285,
  'Canadian Solar',
  'CS-550W-MONO',
  150,
  true,
  true,
  '{"power": "550W", "efficiency": "21.2%", "warranty": "25 years", "dimensions": "2278x1134x35mm", "weight": "27.5kg", "cells": "144 cells", "voltage": "41.7V", "current": "13.2A"}'::jsonb,
  '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800"]'::jsonb
),
(
  'JA Solar 450W Bifacial Panel',
  'Advanced bifacial technology captures sunlight from both sides, increasing energy yield by up to 30%. Ideal for ground-mounted systems.',
  'solar_panel',
  'commercial',
  165000,
  255,
  'JA Solar',
  'JA-450W-BF',
  200,
  true,
  false,
  '{"power": "450W", "efficiency": "20.8%", "warranty": "25 years", "dimensions": "2094x1038x35mm", "weight": "24kg", "cells": "120 cells", "bifacial": true}'::jsonb,
  '["https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800"]'::jsonb
),
(
  'Trina Solar 600W Vertex Panel',
  'Ultra-high power output with advanced cell technology. Perfect for large-scale commercial and industrial projects.',
  'solar_panel',
  'industrial',
  195000,
  300,
  'Trina Solar',
  'TS-600W-VTX',
  100,
  true,
  true,
  '{"power": "600W", "efficiency": "21.5%", "warranty": "25 years", "dimensions": "2384x1096x35mm", "weight": "29kg", "cells": "150 cells"}'::jsonb,
  '["https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800"]'::jsonb
);

-- Inverters
INSERT INTO public.products (name, description, category, subcategory, price_ngn, price_gbp, brand, sku, stock_quantity, is_active, is_featured, specifications, images) VALUES
(
  'Huawei SUN2000-5KTL Hybrid Inverter',
  '5kW hybrid inverter with built-in battery management. Smart monitoring via mobile app. Perfect for residential solar + storage systems.',
  'inverter',
  'residential',
  850000,
  1300,
  'Huawei',
  'HW-5KTL-HYB',
  75,
  true,
  true,
  '{"power": "5kW", "type": "Hybrid", "efficiency": "98.4%", "warranty": "10 years", "mppt": "2 MPPT", "battery_compatible": true, "wifi": true}'::jsonb,
  '["https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800"]'::jsonb
),
(
  'SMA Sunny Tripower 25kW',
  'Commercial-grade three-phase inverter with advanced grid management. Ideal for medium to large commercial installations.',
  'inverter',
  'commercial',
  3200000,
  4900,
  'SMA',
  'SMA-25KW-TP',
  40,
  true,
  false,
  '{"power": "25kW", "type": "Grid-tied", "efficiency": "98.6%", "warranty": "10 years", "mppt": "3 MPPT", "phases": 3}'::jsonb,
  '["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"]'::jsonb
),
(
  'Fronius Symo 10kW',
  'Austrian-engineered precision inverter with SnapINverter technology for easy installation. Excellent for residential and small commercial.',
  'inverter',
  'residential',
  1450000,
  2200,
  'Fronius',
  'FR-10KW-SYM',
  60,
  true,
  false,
  '{"power": "10kW", "type": "Grid-tied", "efficiency": "98.1%", "warranty": "10 years", "mppt": "2 MPPT", "wifi": true}'::jsonb,
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]'::jsonb
);

-- Batteries
INSERT INTO public.products (name, description, category, subcategory, price_ngn, price_gbp, brand, sku, stock_quantity, is_active, is_featured, specifications, images) VALUES
(
  'BYD Battery-Box Premium LVS 12.0',
  '12kWh lithium iron phosphate battery with modular design. Expandable up to 256kWh. 10-year warranty with 6000 cycles.',
  'battery',
  'residential',
  4500000,
  6900,
  'BYD',
  'BYD-12KWH-LVS',
  30,
  true,
  true,
  '{"capacity": "12kWh", "chemistry": "LiFePO4", "warranty": "10 years", "cycles": 6000, "voltage": "51.2V", "expandable": true, "dod": "95%"}'::jsonb,
  '["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"]'::jsonb
),
(
  'Pylontech US5000 Battery Module',
  '4.8kWh battery module with stackable design. Up to 16 modules can be connected for 76.8kWh total capacity.',
  'battery',
  'residential',
  1850000,
  2850,
  'Pylontech',
  'PYL-4.8KWH-US5',
  80,
  true,
  false,
  '{"capacity": "4.8kWh", "chemistry": "LiFePO4", "warranty": "10 years", "cycles": 6000, "voltage": "48V", "stackable": true}'::jsonb,
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]'::jsonb
),
(
  'Tesla Powerwall 2',
  '13.5kWh integrated battery system with built-in inverter. Sleek design, mobile app monitoring, and backup power capability.',
  'battery',
  'residential',
  6500000,
  10000,
  'Tesla',
  'TESLA-PW2-13.5',
  15,
  true,
  true,
  '{"capacity": "13.5kWh", "chemistry": "Li-ion", "warranty": "10 years", "power": "5kW continuous", "backup": true, "integrated_inverter": true}'::jsonb,
  '["https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800"]'::jsonb
);

-- Controllers
INSERT INTO public.products (name, description, category, subcategory, price_ngn, price_gbp, brand, sku, stock_quantity, is_active, is_featured, specifications, images) VALUES
(
  'Victron SmartSolar MPPT 150/35',
  'Advanced MPPT charge controller with Bluetooth connectivity. Ultra-fast maximum power point tracking and battery life algorithm.',
  'controller',
  'residential',
  285000,
  440,
  'Victron Energy',
  'VIC-150-35-MPPT',
  120,
  true,
  false,
  '{"max_pv_voltage": "150V", "max_charge_current": "35A", "efficiency": "98%", "bluetooth": true, "warranty": "5 years"}'::jsonb,
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]'::jsonb
),
(
  'Morningstar TriStar MPPT 600V',
  'Professional-grade MPPT controller for large systems. Advanced features including TrakStar technology and Ethernet connectivity.',
  'controller',
  'commercial',
  950000,
  1450,
  'Morningstar',
  'MS-600V-MPPT',
  45,
  true,
  false,
  '{"max_pv_voltage": "600V", "max_charge_current": "60A", "efficiency": "99%", "ethernet": true, "warranty": "5 years"}'::jsonb,
  '["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"]'::jsonb
);

-- Accessories
INSERT INTO public.products (name, description, category, subcategory, price_ngn, price_gbp, brand, sku, stock_quantity, is_active, is_featured, specifications, images) VALUES
(
  'Solar Panel Mounting Kit - Roof',
  'Complete aluminum mounting system for 10 solar panels. Includes rails, clamps, and all necessary hardware. Suitable for tile and metal roofs.',
  'accessory',
  'residential',
  125000,
  190,
  'Renusol',
  'REN-MOUNT-10P',
  200,
  true,
  false,
  '{"panels": "10 panels", "material": "Aluminum", "roof_types": ["tile", "metal"], "warranty": "10 years"}'::jsonb,
  '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800"]'::jsonb
),
(
  'MC4 Solar Cable Connectors (10 Pairs)',
  'High-quality weatherproof MC4 connectors for solar panel wiring. IP67 rated, UV resistant, rated for 30A.',
  'accessory',
  'residential',
  8500,
  13,
  'Amphenol',
  'AMP-MC4-10PR',
  500,
  true,
  false,
  '{"quantity": "10 pairs", "rating": "30A", "ip_rating": "IP67", "warranty": "2 years"}'::jsonb,
  '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"]'::jsonb
),
(
  '6mm² Solar PV Cable - 100m Roll',
  'Double-insulated solar cable rated for outdoor use. UV resistant, temperature range -40°C to +90°C. TÜV certified.',
  'accessory',
  'commercial',
  45000,
  70,
  'Lapp',
  'LAPP-6MM-100M',
  150,
  true,
  false,
  '{"size": "6mm²", "length": "100m", "temp_range": "-40°C to +90°C", "certification": "TÜV", "warranty": "5 years"}'::jsonb,
  '["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"]'::jsonb
);

-- Services
INSERT INTO public.products (name, description, category, subcategory, price_ngn, price_gbp, brand, sku, stock_quantity, is_active, is_featured, specifications, images) VALUES
(
  'Residential Solar Installation Service',
  'Professional installation service for residential solar systems up to 10kW. Includes site survey, system design, installation, and commissioning.',
  'service',
  'residential',
  500000,
  770,
  'Eagle & Thistle',
  'ET-INST-RES',
  999,
  true,
  true,
  '{"max_system_size": "10kW", "includes": ["site_survey", "design", "installation", "commissioning"], "duration": "2-3 days", "warranty": "5 years workmanship"}'::jsonb,
  '["https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800"]'::jsonb
),
(
  'Annual Maintenance Package',
  'Comprehensive annual maintenance for solar systems. Includes cleaning, inspection, performance testing, and detailed report.',
  'service',
  'residential',
  85000,
  130,
  'Eagle & Thistle',
  'ET-MAINT-ANN',
  999,
  true,
  false,
  '{"visits": "2 per year", "includes": ["cleaning", "inspection", "testing", "report"], "warranty": "1 year"}'::jsonb,
  '["https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800"]'::jsonb
);

-- ============================================================================
-- UPDATE STATISTICS
-- ============================================================================

-- Refresh materialized views if any exist
-- (None currently, but placeholder for future)

COMMENT ON TABLE public.products IS 'Sample products seeded for shop functionality testing';

