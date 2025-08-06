export interface BillingReport {
  id: string;
  user_id: string;
  billing_period_start: string;
  billing_period_end: string;
  total_charges: number;
  line_items: BillingLineItem[];
  xml_file_source: string;
  processed_date: string;
  created_at: string;
}

export interface BillingLineItem {
  id: string;
  billing_report_id: string;
  phone_number: string;
  subscriber_id?: string;
  line_description: string;
  charge_type: 'recurring' | 'one_time' | 'usage' | 'fee';
  amount: number;
  quantity?: number;
  unit_cost?: number;
  
  // Custom field values for filtering
  custom_field_1_value?: string;
  custom_field_2_value?: string;
  custom_field_3_value?: string;
  custom_field_4_value?: string;
  
  created_at: string;
}

export interface BillingFilter {
  date_range?: {
    start: string;
    end: string;
  };
  charge_type?: string[];
  custom_field_filter?: {
    field: 'custom_field_1' | 'custom_field_2' | 'custom_field_3' | 'custom_field_4';
    value: string;
  };
  phone_numbers?: string[];
}