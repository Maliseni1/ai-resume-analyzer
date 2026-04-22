import { create } from "zustand";
import { createSupabaseBrowserClient } from "./supabase";
import type { User, Provider } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const supabase = createSupabaseBrowserClient();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error };
    await supabase.auth.getUser();
    return { error: null };
  },

  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) return { error };
    return { error: null };
  },

  signInWithOAuth: async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
    if (error) return { error };
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  refreshUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    set({ user });
  },

  checkAuthStatus: async () => {
    set({ isLoading: true });
    const { data: { user } } = await supabase.auth.getUser();
    set({ user, isLoading: false });
  },
}));