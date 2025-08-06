export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'phone' | 'tablet' | 'hotspot' | 'iot';
  price: number;
  image_url?: string;
  is_active: boolean;
  specifications: Record<string, any>;
  created_at: string;
  updated_at: string;
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
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  monthly_cost: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}