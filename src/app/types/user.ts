export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  gender?: string;
  interested_courses?: any;
  nationality?: string;
  user_type?: number;
  role_id?: number;
  identity_type_id?: number;
  identity_reference: string;
  identity_reference_expiry_date?: Date;
  identity_reference_origin_country?: number;
  is_active: boolean;
  created_by?: number;
  status_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserResponse {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  gender?: string;
  nationality?: string;
  user_type?: number;
  role_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserResponse;
  token?: string;
}