import { describe, expect, it } from "vitest";
import { assertFeedbackShape, assertJobInfoShape } from "./groq.server";

function section() {
    return { score: 80, tips: [{ type: "good", tip: "Nice work" }] };
}

function validFeedback() {
    return {
        overallScore: 82,
        ATS: section(),
        toneAndStyle: section(),
        content: section(),
        structure: section(),
        skills: section(),
    };
}

describe("assertFeedbackShape", () => {
    it("accepts a well-formed feedback object", () => {
        expect(() => assertFeedbackShape(validFeedback())).not.toThrow();
    });

    it("rejects a missing overallScore", () => {
        const { overallScore, ...rest } = validFeedback();
        expect(() => assertFeedbackShape(rest)).toThrow(/overallScore/);
    });

    it("rejects a missing or malformed category section", () => {
        const feedback = validFeedback();
        // @ts-expect-error -- deliberately malformed for the test
        delete feedback.skills;
        expect(() => assertFeedbackShape(feedback)).toThrow(/skills/);
    });

    it("rejects a section whose tips aren't an array", () => {
        const feedback = validFeedback();
        // @ts-expect-error -- deliberately malformed for the test
        feedback.content.tips = "not an array";
        expect(() => assertFeedbackShape(feedback)).toThrow(/content/);
    });

    it("rejects null", () => {
        expect(() => assertFeedbackShape(null)).toThrow();
    });
});

describe("assertJobInfoShape", () => {
    it("accepts a full object", () => {
        const info = assertJobInfoShape({
            companyName: "Acme",
            jobTitle: "Engineer",
            jobDescription: "Build things.",
        });
        expect(info).toEqual({
            companyName: "Acme",
            jobTitle: "Engineer",
            jobDescription: "Build things.",
        });
    });

    it("normalizes missing companyName/jobTitle to undefined, not null", () => {
        const info = assertJobInfoShape({
            companyName: null,
            jobTitle: null,
            jobDescription: "Build things.",
        });
        expect(info.companyName).toBeUndefined();
        expect(info.jobTitle).toBeUndefined();
        expect(info.jobDescription).toBe("Build things.");
    });

    it("throws when jobDescription is missing", () => {
        expect(() => assertJobInfoShape({ companyName: "Acme" })).toThrow(/jobDescription/);
    });

    it("throws on null", () => {
        expect(() => assertJobInfoShape(null)).toThrow();
    });
});
