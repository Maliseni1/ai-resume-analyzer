import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
}

const DURATION_MS = 5000;

interface ToastState {
    toasts: ToastItem[];
    addToast: (message: string, type?: ToastType) => void;
    dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
    toasts: [],

    addToast: (message, type = "info") => {
        const id = crypto.randomUUID();
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => get().dismissToast(id), DURATION_MS);
    },

    dismissToast: (id) => {
        set({ toasts: get().toasts.filter((toast) => toast.id !== id) });
    },
}));
