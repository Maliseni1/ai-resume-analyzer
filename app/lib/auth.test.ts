import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTrialDaysLeft } from "./auth";
import type { User } from "@supabase/supabase-js";

function userWithTrialEnd(trialEndDate?: string): User {
    return { user_metadata: trialEndDate ? { trial_end_date: trialEndDate } : {} } as unknown as User;
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T00:00:00.000Z"));
});

afterEach(() => {
    vi.useRealTimers();
});

describe("getTrialDaysLeft", () => {
    it("returns null when there's no user", () => {
        expect(getTrialDaysLeft(null)).toBeNull();
    });

    it("returns the full trial length when no trial_end_date is set yet", () => {
        expect(getTrialDaysLeft(userWithTrialEnd())).toBe(3);
    });

    it("counts the days remaining up to a future trial_end_date", () => {
        const twoDaysOut = new Date("2026-06-17T00:00:00.000Z").toISOString();
        expect(getTrialDaysLeft(userWithTrialEnd(twoDaysOut))).toBe(2);
    });

    it("returns 0 once the trial_end_date is in the past, never negative", () => {
        const lastWeek = new Date("2026-06-08T00:00:00.000Z").toISOString();
        expect(getTrialDaysLeft(userWithTrialEnd(lastWeek))).toBe(0);
    });
});
