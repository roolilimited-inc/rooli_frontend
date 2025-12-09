export interface SignUpData {
  email: string;
  password: string;
  name: string;
  confirmPassword?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified?: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  bio?: string;
  avatar?: string;
  website?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  lastLoginAt?: Date | string | null;
  [key: string]: unknown;
}

