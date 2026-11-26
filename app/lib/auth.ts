import { create } from "zustand";
import { getSupabaseClient } from "./supabase";
import type { User, Provider } from "@supabase/supabase-js";

const TRIAL_DAYS = 3;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  trialDaysLeft: number | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: Provider) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const getSupabaseAuth = () => getSupabaseClient().auth;

export const getTrialDaysLeft = (user: User | null): number | null => {
  if (!user) return null;
  
  const trialEndDate = user.user_metadata?.trial_end_date;
  if (!trialEndDate) return TRIAL_DAYS;
  
  const end = new Date(trialEndDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  return daysLeft > 0 ? daysLeft : 0;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  trialDaysLeft: null,

  signIn: async (email: string, password: string) => {
    const { error, data } = await getSupabaseAuth().signInWithPassword({
      email,
      password,
    });
    if (error) return { error };
    
    const user = data.user;
    let trialDaysLeft = getTrialDaysLeft(user);
    
    if (!user?.user_metadata?.trial_end_date && user?.id) {
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
      
      await getSupabaseAuth().updateUser({
        data: { trial_end_date: trialEnd.toISOString() }
      });
      
      trialDaysLeft = TRIAL_DAYS;
    }
    
    set(state => ({ ...state, user, trialDaysLeft }));
    return { error: null };
  },

  signUp: async (email: string, password: string) => {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
    
    const { error } = await getSupabaseAuth().signUp({
      email,
      password,
      options: {
        data: { trial_end_date: trialEnd.toISOString() }
      }
    });
    if (error) return { error };
    return { error: null };
  },

  signInWithOAuth: async (provider: Provider) => {
    const { error } = await getSupabaseAuth().signInWithOAuth({
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
    await getSupabaseAuth().signOut();
    set({ user: null, trialDaysLeft: null });
  },

  refreshUser: async () => {
    try {
      const { data: { user }, error } = await getSupabaseAuth().getUser();
      if (error) throw error;
      set({ user, trialDaysLeft: getTrialDaysLeft(user) });
    } catch (err) {
      console.error("refreshUser failed:", err);
      set({ user: null, trialDaysLeft: null });
    }
  },

  checkAuthStatus: async () => {
    set({ isLoading: true });
    try {
      const { data: { user }, error } = await getSupabaseAuth().getUser();
      if (error) throw error;
      set({ user, trialDaysLeft: getTrialDaysLeft(user), isLoading: false });
    } catch (err) {
      console.error("checkAuthStatus failed:", err);
      set({ user: null, trialDaysLeft: null, isLoading: false });
    }
  },
}));