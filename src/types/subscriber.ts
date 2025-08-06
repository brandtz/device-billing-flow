import { RatePlan, Feature } from './product';

export interface Subscriber {
  id: string;
  user_id: string;
  phone_number: string;
  sim_number: string;
  imei: string;
  rate_plan_id: string;
  rate_plan: RatePlan;
  features: Feature[];
  status: 'active' | 'suspended' | 'cancelled';
  activation_date: string;
  
  // User customizable fields
  user_name?: string;
  custom_field_1_label?: string;
  custom_field_1_value?: string;
  custom_field_2_label?: string;
  custom_field_2_value?: string;
  custom_field_3_label?: string;
  custom_field_3_value?: string;
  custom_field_4_label?: string;
  custom_field_4_value?: string;
  
  // Billing information
  monthly_cost: number;
  last_bill_date?: string;
  next_bill_date?: string;
  
  created_at: string;
  updated_at: string;
}

export interface SubscriberFormData {
  user_name?: string;
  custom_field_1_label?: string;
  custom_field_1_value?: string;
  custom_field_2_label?: string;
  custom_field_2_value?: string;
  custom_field_3_label?: string;
  custom_field_3_value?: string;
  custom_field_4_label?: string;
  custom_field_4_value?: string;
}