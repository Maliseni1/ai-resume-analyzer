export const SITE_URL = "https://eukleya.chizalabs.com";
export const SITE_NAME = "Eukleya";
export const SITE_TAGLINE = "Let your work speak well of you.";

export function absoluteUrl(path: string): string {
    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// React Router does NOT merge a parent route's meta() into a child route's
// -- each route's meta() fully replaces it unless explicitly merged. Every
// page route spreads this in so the shared OG/Twitter tags actually render,
// instead of only ever existing in root.tsx's (unreachable) meta.
export function defaultMeta() {
    return [
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:type", content: "website" },
        { property: "og:image", content: absoluteUrl("/og-image.png") },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: absoluteUrl("/og-image.png") },
    ];
}
