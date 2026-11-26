// Dynamically imported so mammoth only loads for people who actually pick a
// .docx file, instead of bloating every visit to the upload page.
export async function extractDocxText(file: File): Promise<string> {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    return value.trim();
}
