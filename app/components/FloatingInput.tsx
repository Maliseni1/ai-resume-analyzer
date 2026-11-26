import { useState } from "react";

const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.36 18.36 0 0 1 4.22-5.19M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );

interface FloatingInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    minLength?: number;
    disabled?: boolean;
}

const FloatingInput = ({ id, label, type = "text", value, onChange, required, minLength, disabled }: FloatingInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="relative">
            <input
                id={id}
                type={inputType}
                placeholder=" "
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                disabled={disabled}
                className={`peer pt-5 pb-3.5 ${isPassword ? "pr-12" : ""}`}
            />
            <label
                htmlFor={id}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft text-base transition-all duration-200 pointer-events-none
                    peer-focus:top-0 peer-focus:left-3 peer-focus:px-1 peer-focus:text-xs peer-focus:text-link peer-focus:bg-surface
                    peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:px-1 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-link peer-[&:not(:placeholder-shown)]:bg-surface"
            >
                {label}
            </label>
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors cursor-pointer"
                >
                    <EyeIcon open={showPassword} />
                </button>
            )}
        </div>
    );
};

export default FloatingInput;
