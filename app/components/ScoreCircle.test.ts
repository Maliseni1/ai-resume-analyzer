import { describe, expect, it } from "vitest";
import { scoreToColor } from "./ScoreCircle";

function hue(color: string): number {
    const match = color.match(/^hsl\((\d+(?:\.\d+)?),/);
    if (!match) throw new Error(`Not an hsl() color: ${color}`);
    return Number(match[1]);
}

describe("scoreToColor", () => {
    it("is pure red at or below the low cutoff", () => {
        expect(hue(scoreToColor(0))).toBe(0);
        expect(hue(scoreToColor(40))).toBe(0);
    });

    it("is pure green at or above the high cutoff", () => {
        expect(hue(scoreToColor(90))).toBe(120);
        expect(hue(scoreToColor(100))).toBe(120);
    });

    it("interpolates smoothly between the cutoffs", () => {
        const low = hue(scoreToColor(41));
        const mid = hue(scoreToColor(65));
        const high = hue(scoreToColor(89));

        expect(low).toBeGreaterThan(0);
        expect(high).toBeLessThan(120);
        expect(mid).toBeGreaterThan(low);
        expect(mid).toBeLessThan(high);
        // Halfway between the 40-90 cutoffs should be roughly halfway in hue.
        expect(mid).toBeCloseTo(60, 0);
    });

    it("clamps out-of-range scores instead of producing invalid colors", () => {
        expect(hue(scoreToColor(-20))).toBe(0);
        expect(hue(scoreToColor(500))).toBe(120);
    });
});
