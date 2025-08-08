export interface Product {
  id: string;
  name: string;
  description?: string;
  category: 'phone' | 'tablet' | 'hotspot' | 'iot';
  price: number;
  monthly_cost?: number;
  image_url?: string;
  features?: string[];
  active: boolean;
  created_at: string;
  // Backend integration attributes
  sku: string;
  external_product_id?: string;
  // Pricing options
  pricing_options: PricingOption[];
  // API mapping attributes
  api_mapping?: {
    vendor_sku?: string;
    carrier_product_code?: string;
    fulfillment_provider?: string;
  };
}

export interface PricingOption {
  id: string;
  name: string; // "Monthly Financed" or "Pay in Full"
  type: 'financed' | 'full_payment';
  down_payment: number;
  monthly_payment?: number;
  term_months?: number; // For financed options
  total_cost: number;
  is_default: boolean;
}

export interface RatePlan {
  id: string;
  name: string;
  description: string;
  monthly_cost: number;
  data_allowance?: string;
  voice_allowance?: string;
  text_allowance?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Backend integration attributes
  soc: string; // Service Order Code - unique identifier for rate plan
  external_plan_id?: string;
  // API mapping attributes
  api_mapping?: {
    carrier_plan_code?: string;
    billing_code?: string;
    provisioning_code?: string;
  };
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  monthly_cost: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Backend integration attributes
  soc: string; // Service Order Code for add-on/feature
  external_feature_id?: string;
  feature_type: 'addon' | 'service' | 'insurance' | 'accessory';
  // API mapping attributes
  api_mapping?: {
    carrier_feature_code?: string;
    billing_code?: string;
    provisioning_code?: string;
  };
}