import { Product, RatePlan, Feature, PricingOption } from './product';

export interface CartItem {
  id: string;
  product: Product;
  selected_rate_plan?: RatePlan;
  selected_features: Feature[];
  selected_pricing_option: PricingOption;
  quantity: number;
  custom_configuration?: Record<string, any>;
}

export interface Cart {
  items: CartItem[];
  total_due_now: number;
  total_monthly_charges: number;
  subtotal: number;
  taxes: number;
  fees: number;
}

export interface Address {
  id?: string;
  type: 'shipping' | 'billing' | 'ppu' | 'e911';
  street_address: string;
  street_address_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default?: boolean;
}

export interface CheckoutData {
  cart: Cart;
  addresses: {
    shipping: Address;
    billing: Address;
    ppu: Address; // Principal Place of Use
    e911: Address; // Emergency 911 Address
  };
  customer_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  use_shipping_for_ppu: boolean;
  use_shipping_for_e911: boolean;
  use_shipping_for_billing: boolean;
  payment_method?: string;
  special_instructions?: string;
}