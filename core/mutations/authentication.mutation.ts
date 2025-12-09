import { useMutation } from "@tanstack/react-query";

import { LoginFormData } from "../schema";
import { APP_CHANGE_PASSWORD, APP_FORGOT_PASSWORD, APP_LOGIN, APP_RESEND_VERIFICATION, APP_RESET_PASSWORD, APP_SIGNUP, APP_VERIFY_EMAIL } from "../services/authentication.service";
import { ChangePasswordData, ForgotPasswordData, ResendVerificationData, ResetPasswordData, SignUpData } from "../types";

export const useLoginMutation = () => {
    return useMutation({
      mutationFn: async (data: LoginFormData) => await APP_LOGIN(data), });
  };

export const useSignupMutation = () => {
    return useMutation({
      mutationFn: async (data: SignUpData) => await APP_SIGNUP(data), });
  };

export const useForgotPasswordMutation = () => {
    return useMutation({
      mutationFn: async (data: ForgotPasswordData) => await APP_FORGOT_PASSWORD(data), });
  };

export const useResetPasswordMutation = () => {
    return useMutation({
      mutationFn: async (data: ResetPasswordData) => await APP_RESET_PASSWORD(data), });
  };

export const useChangePasswordMutation = () => {
    return useMutation({
      mutationFn: async (data: ChangePasswordData) => await APP_CHANGE_PASSWORD(data), });
  };

export const useVerifyEmailMutation = () => {
    return useMutation({
      mutationFn: async (token: string) => await APP_VERIFY_EMAIL(token), });
  };

export const useResendVerificationMutation = () => {
    return useMutation({
      mutationFn: async (data: ResendVerificationData) => await APP_RESEND_VERIFICATION(data), });
  };

