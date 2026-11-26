interface FloatingTextareaProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    disabled?: boolean;
    minHeight?: string;
}

const FloatingTextarea = ({ id, label, value, onChange, disabled, minHeight = "120px" }: FloatingTextareaProps) => (
    <div className="relative">
        <textarea
            id={id}
            placeholder=" "
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{ minHeight }}
            className="peer pt-6"
        />
        <label
            htmlFor={id}
            className="absolute left-4 top-4 text-ink-soft text-base transition-all duration-200 pointer-events-none
                peer-focus:top-0 peer-focus:left-3 peer-focus:px-1 peer-focus:text-xs peer-focus:text-link peer-focus:bg-surface
                peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:px-1 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-link peer-[&:not(:placeholder-shown)]:bg-surface"
        >
            {label}
        </label>
    </div>
);

export default FloatingTextarea;
