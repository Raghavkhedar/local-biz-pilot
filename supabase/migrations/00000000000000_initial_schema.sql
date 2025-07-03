-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pin VARCHAR(255) NOT NULL,
  role VARCHAR(10) NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff'))
);

-- Create business_profiles table
CREATE TABLE IF NOT EXISTS public.business_profiles (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  gst_number VARCHAR(20),
  logo_url TEXT,
  settings JSONB,
  UNIQUE(user_id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100) NOT NULL,
  barcode VARCHAR(50),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  images TEXT[],
  unit VARCHAR(20) NOT NULL CHECK (unit IN ('box', 'piece', 'square_feet', 'square_meter')),
  pieces_per_box INTEGER,
  area_per_piece DECIMAL(10,2),
  area_unit VARCHAR(20) CHECK (area_unit IN ('square_feet', 'square_meter')),
  dimensions JSONB,
  material VARCHAR(100),
  finish VARCHAR(100),
  color VARCHAR(50),
  pattern VARCHAR(100),
  grade VARCHAR(20) CHECK (grade IN ('premium', 'standard', 'economy')),
  water_resistance VARCHAR(20) CHECK (water_resistance IN ('high', 'medium', 'low')),
  slip_resistance VARCHAR(3) CHECK (slip_resistance IN ('R9', 'R10', 'R11', 'R12', 'R13')),
  usage TEXT[],
  manufacturer VARCHAR(255),
  origin VARCHAR(100),
  hsn_code VARCHAR(20),
  tax_rate DECIMAL(5,2),
  description TEXT,
  UNIQUE(user_id, sku)
);

-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  gst_number VARCHAR(20),
  credit_limit DECIMAL(10,2),
  customer_group VARCHAR(50)
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invoice_number VARCHAR(50) NOT NULL,
  customer_id BIGINT NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  customer_name VARCHAR(255) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  due_date DATE NOT NULL,
  notes TEXT,
  UNIQUE(user_id, invoice_number)
);

-- Create invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invoice_id BIGINT NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2),
  hsn_code VARCHAR(20)
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER invoice_items_updated_at
  BEFORE UPDATE ON public.invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own business profile" ON public.business_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own business profile" ON public.business_profiles
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own products" ON public.products
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own products" ON public.products
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own customers" ON public.customers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own customers" ON public.customers
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own invoices" ON public.invoices
  FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own invoice items" ON public.invoice_items
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their own invoice items" ON public.invoice_items
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));