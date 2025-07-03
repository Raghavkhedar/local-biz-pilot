-- Insert test user
INSERT INTO public.users (id, pin, role)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '1234',
  'owner'
);

-- Insert business profile
INSERT INTO public.business_profiles (user_id, company_name, address, phone, email, gst_number)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Local Business Pilot',
  '123 Main Street, City, State, 12345',
  '+91 9876543210',
  'contact@localbusinesspilot.com',
  '27AAAAA0000A1Z5'
);

-- Insert test products
INSERT INTO public.products (
  user_id, name, sku, price, quantity, category, barcode, low_stock_threshold,
  unit, pieces_per_box, area_per_piece, area_unit, dimensions, material,
  finish, color, pattern, grade, water_resistance, slip_resistance, usage,
  manufacturer, origin, hsn_code, tax_rate, description
)
VALUES
(
  '00000000-0000-0000-0000-000000000000',
  'Premium Ceramic Floor Tile',
  'TILE001',
  1200.00,
  500,
  'Floor Tiles',
  '8901234567890',
  50,
  'box',
  10,
  1.44,
  'square_meter',
  '{"length": 600, "width": 600, "thickness": 9}',
  'Ceramic',
  'Matte',
  'Beige',
  'Marble',
  'premium',
  'high',
  'R11',
  ARRAY['Indoor', 'Residential', 'Commercial'],
  'TileCraft Industries',
  'India',
  '69072100',
  18.00,
  'Premium quality ceramic floor tiles with marble pattern'
),
(
  '00000000-0000-0000-0000-000000000000',
  'Designer Wall Tile',
  'TILE002',
  950.00,
  300,
  'Wall Tiles',
  '8901234567891',
  30,
  'box',
  12,
  1.08,
  'square_meter',
  '{"length": 300, "width": 600, "thickness": 8}',
  'Ceramic',
  'Glossy',
  'White',
  'Geometric',
  'premium',
  'medium',
  'R9',
  ARRAY['Indoor', 'Residential', 'Bathroom'],
  'TileCraft Industries',
  'India',
  '69072200',
  18.00,
  'Designer wall tiles with modern geometric patterns'
);

-- Insert test customers
INSERT INTO public.customers (
  user_id, name, phone, email, address, gst_number, credit_limit, customer_group
)
VALUES
(
  '00000000-0000-0000-0000-000000000000',
  'John Doe',
  '+91 9876543211',
  'john.doe@example.com',
  '456 Business Avenue, City, State, 12345',
  '27BBBBB1111B1Z5',
  50000.00,
  'regular'
),
(
  '00000000-0000-0000-0000-000000000000',
  'Jane Smith',
  '+91 9876543212',
  'jane.smith@example.com',
  '789 Commerce Street, City, State, 12345',
  '27CCCCC2222C1Z5',
  100000.00,
  'premium'
);

-- Insert test invoice
INSERT INTO public.invoices (
  user_id, invoice_number, customer_id, customer_name,
  subtotal, tax, total, status, due_date, notes
)
VALUES
(
  '00000000-0000-0000-0000-000000000000',
  'INV-2024-001',
  1,
  'John Doe',
  12000.00,
  2160.00,
  14160.00,
  'paid',
  '2024-02-29',
  'Payment received via bank transfer'
);

-- Insert test invoice items
INSERT INTO public.invoice_items (
  invoice_id, product_id, product_name, quantity,
  unit_price, total, tax_rate, hsn_code
)
VALUES
(
  1,
  1,
  'Premium Ceramic Floor Tile',
  10,
  1200.00,
  12000.00,
  18.00,
  '69072100'
);