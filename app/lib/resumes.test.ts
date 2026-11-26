import { describe, expect, it } from "vitest";
import { mapRow, type ResumeRow } from "./resumes";

function row(overrides: Partial<ResumeRow> = {}): ResumeRow {
    return {
        id: "r1",
        user_id: "u1",
        company_name: "Acme",
        job_title: "Engineer",
        job_description: "Build things",
        resume_path: "u1/r1/resume.pdf",
        image_path: "u1/r1/image.png",
        status: "completed",
        feedback: null,
        created_at: "2026-01-01T00:00:00.000Z",
        ...overrides,
    };
}

describe("mapRow", () => {
    it("maps DB snake_case columns to the camelCase Resume shape", () => {
        const resume = mapRow(row());
        expect(resume).toEqual({
            id: "r1",
            companyName: "Acme",
            jobTitle: "Engineer",
            jobDescription: "Build things",
            imagePath: "u1/r1/image.png",
            resumePath: "u1/r1/resume.pdf",
            status: "completed",
            feedback: null,
        });
    });

    it("converts null optional text columns to undefined, not null", () => {
        const resume = mapRow(row({ company_name: null, job_title: null, job_description: null }));
        expect(resume.companyName).toBeUndefined();
        expect(resume.jobTitle).toBeUndefined();
        expect(resume.jobDescription).toBeUndefined();
    });

    it("keeps a null image_path as null (storage path, not optional text)", () => {
        const resume = mapRow(row({ image_path: null }));
        expect(resume.imagePath).toBeNull();
    });

    it("passes through the feedback object as-is when present", () => {
        const feedback = { overallScore: 90 } as unknown as Feedback;
        const resume = mapRow(row({ feedback }));
        expect(resume.feedback).toBe(feedback);
    });
});
