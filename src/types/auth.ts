export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}