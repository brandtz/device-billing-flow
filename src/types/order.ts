import { Product, RatePlan, Feature } from './product';

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: Address;
  order_items: OrderItem[];
  tracking_number?: string;
  internal_order_number: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product;
  rate_plan_id?: string;
  rate_plan?: RatePlan;
  features: Feature[];
  quantity: number;
  unit_price: number;
  monthly_recurring_cost: number;
  device_details?: DeviceDetails;
}

export interface DeviceDetails {
  sim_number?: string;
  imei?: string;
  phone_number?: string;
  activation_date?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}