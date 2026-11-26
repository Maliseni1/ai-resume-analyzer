import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useThemeStore } from "./theme";

beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
    useThemeStore.setState({ theme: "light" });
});

afterEach(() => {
    window.localStorage.clear();
    document.documentElement.classList.remove("dark");
});

describe("useThemeStore", () => {
    it("defaults to light with no stored preference, regardless of OS setting", () => {
        useThemeStore.getState().init();
        expect(useThemeStore.getState().theme).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
    });

    it("init() picks up a previously stored dark preference", () => {
        window.localStorage.setItem("theme", "dark");
        useThemeStore.getState().init();
        expect(useThemeStore.getState().theme).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("ignores a garbage stored value and falls back to light", () => {
        window.localStorage.setItem("theme", "sepia");
        useThemeStore.getState().init();
        expect(useThemeStore.getState().theme).toBe("light");
    });

    it("toggleTheme flips the theme, the <html> class, and persists the choice", () => {
        useThemeStore.getState().init();

        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().theme).toBe("dark");
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(window.localStorage.getItem("theme")).toBe("dark");

        useThemeStore.getState().toggleTheme();
        expect(useThemeStore.getState().theme).toBe("light");
        expect(document.documentElement.classList.contains("dark")).toBe(false);
        expect(window.localStorage.getItem("theme")).toBe("light");
    });
});
