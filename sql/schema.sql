-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('phone', 'tablet', 'hotspot', 'iot')),
  price DECIMAL(10,2) NOT NULL,
  monthly_cost DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  features JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rate_plans table
CREATE TABLE IF NOT EXISTS rate_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  monthly_cost DECIMAL(10,2) NOT NULL,
  data_limit TEXT,
  features JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  monthly_recurring DECIMAL(10,2) DEFAULT 0,
  shipping_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  rate_plan_id UUID REFERENCES rate_plans(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  monthly_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  phone_number TEXT,
  sim_card TEXT,
  imei TEXT,
  device_name TEXT,
  rate_plan_id UUID REFERENCES rate_plans(id),
  monthly_cost DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  user_name TEXT,
  custom_field_1_label TEXT,
  custom_field_1_value TEXT,
  custom_field_2_label TEXT,
  custom_field_2_value TEXT,
  custom_field_3_label TEXT,
  custom_field_3_value TEXT,
  custom_field_4_label TEXT,
  custom_field_4_value TEXT,
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create billing_data table
CREATE TABLE IF NOT EXISTS billing_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES subscribers(id),
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  phone_number TEXT,
  charges JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10,2) NOT NULL,
  custom_field_1_value TEXT,
  custom_field_2_value TEXT,
  custom_field_3_value TEXT,
  custom_field_4_value TEXT,
  raw_xml_data TEXT,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_data ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscribers policies
CREATE POLICY "Users can view own subscribers" ON subscribers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscribers" ON subscribers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscribers" ON subscribers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Billing data policies
CREATE POLICY "Users can view own billing data" ON billing_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all billing data" ON billing_data FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample data
INSERT INTO products (name, description, category, price, monthly_cost, features) VALUES
('iPhone 15 Pro', 'Latest iPhone with advanced features', 'phone', 999.99, 0, '["Face ID", "5G", "Pro Camera System"]'),
('Samsung Galaxy Tab S9', 'Premium Android tablet', 'tablet', 799.99, 0, '["11-inch Display", "S Pen", "5G Ready"]'),
('Verizon Jetpack MiFi', 'Portable 5G hotspot device', 'hotspot', 199.99, 0, '["5G Connectivity", "Up to 15 devices", "Long battery life"]'),
('IoT Sensor Module', 'Industrial IoT tracking device', 'iot', 99.99, 15.00, '["GPS Tracking", "Temperature Sensor", "Low Power"]');

INSERT INTO rate_plans (name, description, monthly_cost, data_limit, features) VALUES
('Unlimited Plus', 'Unlimited data with premium features', 85.00, 'Unlimited', '["5G Ultra Wideband", "Mobile Hotspot", "International Roaming"]'),
('Basic Plan', 'Essential connectivity plan', 35.00, '5GB', '["4G LTE", "Mobile Hotspot (2GB)"]'),
('Business Unlimited', 'Enterprise unlimited plan', 120.00, 'Unlimited', '["Priority Data", "Advanced Security", "Management Tools"]'),
('IoT Data Plan', 'Optimized for IoT devices', 10.00, '1GB', '["Low Latency", "Device Management", "API Access"]');