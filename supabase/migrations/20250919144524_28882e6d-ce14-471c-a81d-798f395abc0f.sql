-- Create orders table
CREATE TABLE public.orders (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number text NOT NULL UNIQUE,
    user_id uuid NOT NULL,
    partner_id uuid,
    status text NOT NULL DEFAULT 'pending',
    total_amount numeric NOT NULL DEFAULT 0,
    currency text NOT NULL DEFAULT 'NGN',
    shipping_address jsonb,
    billing_address jsonb,
    payment_method text,
    payment_status text DEFAULT 'pending',
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id),
    quantity integer NOT NULL DEFAULT 1,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create warehouses table
CREATE TABLE public.warehouses (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    code text NOT NULL UNIQUE,
    location jsonb NOT NULL,
    address text,
    manager_id uuid,
    capacity_sqm numeric,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    code text NOT NULL UNIQUE,
    contact_person text,
    email text,
    phone text,
    address jsonb,
    payment_terms text,
    rating numeric DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create purchase_orders table
CREATE TABLE public.purchase_orders (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    po_number text NOT NULL UNIQUE,
    supplier_id uuid NOT NULL REFERENCES public.suppliers(id),
    warehouse_id uuid REFERENCES public.warehouses(id),
    status text NOT NULL DEFAULT 'draft',
    total_amount numeric NOT NULL DEFAULT 0,
    currency text NOT NULL DEFAULT 'NGN',
    expected_delivery date,
    actual_delivery date,
    created_by uuid,
    approved_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create purchase_order_items table
CREATE TABLE public.purchase_order_items (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    purchase_order_id uuid NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id),
    quantity_ordered integer NOT NULL,
    quantity_received integer DEFAULT 0,
    unit_cost numeric NOT NULL,
    total_cost numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create stock_movements table for inventory tracking
CREATE TABLE public.stock_movements (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid NOT NULL REFERENCES public.products(id),
    warehouse_id uuid NOT NULL REFERENCES public.warehouses(id),
    movement_type text NOT NULL, -- 'IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'
    quantity integer NOT NULL,
    reference_type text, -- 'ORDER', 'PURCHASE_ORDER', 'TRANSFER', 'ADJUSTMENT'
    reference_id uuid,
    notes text,
    created_by uuid,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create boms (Bill of Materials) table
CREATE TABLE public.boms (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    code text NOT NULL UNIQUE,
    product_id uuid REFERENCES public.products(id), -- Parent product this BOM creates
    description text,
    version text DEFAULT '1.0',
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create bom_items table
CREATE TABLE public.bom_items (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    bom_id uuid NOT NULL REFERENCES public.boms(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id),
    quantity numeric NOT NULL DEFAULT 1,
    unit_cost numeric,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bom_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create their order items" ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Admin-only policies for warehouse management
CREATE POLICY "Warehouses are viewable by authenticated users" ON public.warehouses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage warehouses" ON public.warehouses FOR ALL USING (false); -- Will be updated when we add admin roles

-- Admin-only policies for suppliers
CREATE POLICY "Suppliers are viewable by authenticated users" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage suppliers" ON public.suppliers FOR ALL USING (false);

-- Admin-only policies for purchase orders
CREATE POLICY "POs are viewable by authenticated users" ON public.purchase_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage POs" ON public.purchase_orders FOR ALL USING (false);

CREATE POLICY "PO items are viewable by authenticated users" ON public.purchase_order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage PO items" ON public.purchase_order_items FOR ALL USING (false);

-- Stock movements viewable by authenticated users
CREATE POLICY "Stock movements are viewable by authenticated users" ON public.stock_movements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage stock movements" ON public.stock_movements FOR ALL USING (false);

-- BOMs viewable by authenticated users
CREATE POLICY "BOMs are viewable by authenticated users" ON public.boms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage BOMs" ON public.boms FOR ALL USING (false);

CREATE POLICY "BOM items are viewable by authenticated users" ON public.bom_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage BOM items" ON public.bom_items FOR ALL USING (false);

-- Create sequences for order numbers and PO numbers
CREATE SEQUENCE order_sequence START 1;
CREATE SEQUENCE po_sequence START 1;

-- Create functions to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.order_number = 'ORD-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('order_sequence')::TEXT, 6, '0');
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_po_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.po_number = 'PO-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('po_sequence')::TEXT, 6, '0');
    RETURN NEW;
END;
$$;

-- Create triggers for auto-generating numbers
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_order_number();

CREATE TRIGGER generate_po_number_trigger
    BEFORE INSERT ON public.purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_po_number();

-- Create triggers for updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_warehouses_updated_at
    BEFORE UPDATE ON public.warehouses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
    BEFORE UPDATE ON public.suppliers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
    BEFORE UPDATE ON public.purchase_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boms_updated_at
    BEFORE UPDATE ON public.boms
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();