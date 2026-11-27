// Inline "reversed" variant of the Eukleya mark (paper + red strokes),
// meant for the navy chrome (navbar, splash) -- see /public/logo for the
// full asset set (favicons, app icons, mono/reversed variants).
const LogoMark = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
        <g transform="translate(3 0)">
            <path d="M86 24 H44 L30 38 V96 H90" fill="none" stroke="#F3F0E9" strokeWidth="12" strokeLinejoin="miter" />
            <path d="M44 68 L82 50" stroke="#D9462B" strokeWidth="12" strokeLinecap="round" />
        </g>
    </svg>
);

export default LogoMark;
