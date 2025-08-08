// Temporary database types until Supabase types sync
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'customer' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'customer' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: 'phone' | 'tablet' | 'hotspot' | 'iot';
          price: number;
          monthly_cost: number;
          image_url: string;
          active: boolean;
          features: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: 'phone' | 'tablet' | 'hotspot' | 'iot';
          price: number;
          monthly_cost: number;
          image_url: string;
          active?: boolean;
          features: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: 'phone' | 'tablet' | 'hotspot' | 'iot';
          price?: number;
          monthly_cost?: number;
          image_url?: string;
          active?: boolean;
          features?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      rate_plans: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          monthly_cost: number;
          data_limit: string | null;
          active: boolean;
          features: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          monthly_cost: number;
          data_limit?: string | null;
          active?: boolean;
          features?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          monthly_cost?: number;
          data_limit?: string | null;
          active?: boolean;
          features?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      features: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}