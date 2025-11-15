-- Add payment_reference column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_payment_reference 
ON public.orders(payment_reference);

-- Add comment
COMMENT ON COLUMN public.orders.payment_reference IS 'Unique payment reference from payment gateway (Paystack/Stripe)';

