import axiosInstance from "./axiosInstance";
import type { User, SignupPayload, LoginPayload } from "../types/auth.types";

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const signupRequest = (payload: SignupPayload) =>
  axiosInstance.post<AuthResponse>("/auth/signup", payload).then((r) => r.data);

export const loginRequest = (payload: LoginPayload) =>
  axiosInstance.post<AuthResponse>("/auth/login", payload).then((r) => r.data);

export const logoutRequest = () => axiosInstance.post("/auth/logout");