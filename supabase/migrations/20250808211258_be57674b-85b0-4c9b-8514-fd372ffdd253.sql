-- Update orders table with new status workflow and tracking fields
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('created', 'received', 'hold', 'submitted', 'in_fulfillment', 'shipped', 'completed', 'cancelled'));

-- Update default status
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'created';

-- Add new fields for order management
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS fulfillment_order_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS sap_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Update order_items table with device tracking fields
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS sim_number TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS imei TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS activation_date DATE;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS sap_number TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS device_tracking_number TEXT;

-- Create order_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  customer_facing_note TEXT,
  internal_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on order_status_history
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Create policies for order_status_history
CREATE POLICY "Users can view own order status history" ON public.order_status_history 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
);

CREATE POLICY "Admins can view all order status history" ON public.order_status_history 
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create trigger to log status changes
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (
      order_id, 
      previous_status, 
      new_status, 
      changed_by,
      customer_facing_note,
      internal_note
    ) VALUES (
      NEW.id, 
      OLD.status, 
      NEW.status, 
      auth.uid(),
      NEW.customer_notes,
      NEW.internal_notes
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON public.orders
  FOR each ROW
  EXECUTE FUNCTION public.log_order_status_change();

-- Update updated_at trigger for orders
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();