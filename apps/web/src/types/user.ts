export interface User {
  id: string;
  email: string;
  role: 'patient' | 'provider' | 'doctor' | 'admin';
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  profileImage?: string;
  specialization?: string; // For providers
  licenseNumber?: string; // For providers
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: 'patient' | 'provider';
  phone?: string;
}
