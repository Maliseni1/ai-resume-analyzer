// Red below 40, green above 90, a smooth spectrum in between -- the
// standard "worst to best" traffic-light read for a score gauge.
const RED_HUE = 0;
const GREEN_HUE = 120;
const LOW_CUTOFF = 40;
const HIGH_CUTOFF = 90;

export function scoreToColor(score: number): string {
    const clamped = Math.max(0, Math.min(100, score));
    let hue: number;
    if (clamped <= LOW_CUTOFF) {
        hue = RED_HUE;
    } else if (clamped >= HIGH_CUTOFF) {
        hue = GREEN_HUE;
    } else {
        hue = ((clamped - LOW_CUTOFF) / (HIGH_CUTOFF - LOW_CUTOFF)) * GREEN_HUE;
    }
    return `hsl(${hue}, 70%, 45%)`;
}

const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = score / 100;
    const strokeDashoffset = circumference * (1 - progress);
    const progressColor = scoreToColor(score);

    return (
        <div className="relative w-[100px] h-[100px]">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    style={{ stroke: "var(--color-line)" }}
                    strokeWidth={stroke}
                    fill="transparent"
                />
                {/* Progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    style={{ stroke: progressColor }}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Score and issues */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-semibold text-sm text-ink">{`${score}/100`}</span>
            </div>
        </div>
    );
};

export default ScoreCircle;