import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, SignupPayload, LoginPayload } from "../types/auth.types";
import { signupRequest, loginRequest, logoutRequest } from "../api/auth.api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signup: (payload: SignupPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      signup: async (payload) => {
        set({ isLoading: true });
        try {
          const { user, accessToken } = await signupRequest(payload);
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      login: async (payload) => {
        set({ isLoading: true });
        try {
          const { user, accessToken } = await loginRequest(payload);
          set({ user, accessToken, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        await logoutRequest();
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    { name: "eventful-auth", partialize: (state) => ({ user: state.user, accessToken: state.accessToken }) }
  )
);