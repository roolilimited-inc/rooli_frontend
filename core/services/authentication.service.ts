import { client, Response } from "@/lib/api-client";
import { LoginFormData } from "../schema";
import { ChangePasswordData, ForgotPasswordData, LoginResponse, ResendVerificationData, ResetPasswordData, SignUpData } from "../types";

export const APP_LOGIN = async (data: LoginFormData) => {
  try {
    const response = await client.post<LoginResponse>(`/auth/login`, data) as LoginResponse;
    console.log(response)
    return response as LoginResponse;
  } catch (error) {
    throw error
  }
}

export const APP_SIGNUP = async (data: SignUpData) => {
  try {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...signupData } = data;
    const response = await client.post<Response<SignUpData>>(`/auth/signup`, signupData);
    return response;
  } catch (error) {
    throw error;
  }
}

export const APP_FORGOT_PASSWORD = async (data: ForgotPasswordData) => {
  try {
    const response = await client.post<Response<ForgotPasswordData>>(`/auth/forgot-password`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const APP_RESET_PASSWORD = async (data: ResetPasswordData) => {
  try {
    const response = await client.post<Response<ResetPasswordData>>(`/auth/reset-password`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const APP_CHANGE_PASSWORD = async (data: ChangePasswordData) => {
  try {
    const response = await client.post<Response<ChangePasswordData>>(`/auth/change-password`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const APP_VERIFY_EMAIL = async (token: string) => {
  try {
    const response = await client.get(`/auth/verify-email/${token}`);
    return response;
  } catch (error) {
    throw error;
  }
}

export const APP_RESEND_VERIFICATION = async (data: ResendVerificationData) => {
  try {
    const response = await client.post(`/auth/resend-verification`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const APP_GET_PROFILE = async () => {
  try {
    const response = await client.get(`/auth/me`);
    return response;
  } catch (error) {
    throw error;
  }
}

