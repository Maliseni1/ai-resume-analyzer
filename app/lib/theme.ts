import { create } from "zustand";

export type Theme = "light" | "dark";

// Light is the default theme regardless of OS preference; dark is opt-in
// only, switched on explicitly via the navbar toggle and remembered after.
function getStoredTheme(): Theme {
    const stored = window.localStorage.getItem("theme");
    return stored === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
}

interface ThemeState {
    theme: Theme;
    init: () => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    theme: "light",

    init: () => {
        const theme = getStoredTheme();
        applyTheme(theme);
        set({ theme });
    },

    toggleTheme: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        applyTheme(next);
        window.localStorage.setItem("theme", next);
        set({ theme: next });
    },
}));
