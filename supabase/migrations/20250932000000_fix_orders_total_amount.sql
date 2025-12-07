-- Migration: Fix orders table column naming
-- Add total_amount as alias for total column for backward compatibility

-- Add total_amount column as a generated column that mirrors total
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(12, 2) GENERATED ALWAYS AS (total) STORED;

-- Create index on total_amount for performance
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON public.orders(total_amount);
