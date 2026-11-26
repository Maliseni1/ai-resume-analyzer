import { afterEach, describe, expect, it, vi } from "vitest";
import { useToastStore } from "./toast";

afterEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useRealTimers();
});

describe("useToastStore", () => {
    it("adds a toast with a generated id and the given type", () => {
        useToastStore.getState().addToast("Saved!", "success");

        const { toasts } = useToastStore.getState();
        expect(toasts).toHaveLength(1);
        expect(toasts[0].message).toBe("Saved!");
        expect(toasts[0].type).toBe("success");
        expect(toasts[0].id).toBeTruthy();
    });

    it("defaults to the 'info' type when none is given", () => {
        useToastStore.getState().addToast("Heads up");
        expect(useToastStore.getState().toasts[0].type).toBe("info");
    });

    it("supports multiple toasts stacking in order", () => {
        useToastStore.getState().addToast("First");
        useToastStore.getState().addToast("Second");
        const { toasts } = useToastStore.getState();
        expect(toasts.map((t) => t.message)).toEqual(["First", "Second"]);
    });

    it("dismissToast removes only the matching toast", () => {
        useToastStore.getState().addToast("Keep me");
        useToastStore.getState().addToast("Remove me");
        const [, second] = useToastStore.getState().toasts;

        useToastStore.getState().dismissToast(second.id);

        const { toasts } = useToastStore.getState();
        expect(toasts).toHaveLength(1);
        expect(toasts[0].message).toBe("Keep me");
    });

    it("auto-dismisses a toast after its duration elapses", () => {
        vi.useFakeTimers();
        useToastStore.getState().addToast("Temporary");
        expect(useToastStore.getState().toasts).toHaveLength(1);

        vi.advanceTimersByTime(5000);

        expect(useToastStore.getState().toasts).toHaveLength(0);
    });
});
