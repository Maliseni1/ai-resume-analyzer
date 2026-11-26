import { useToastStore, type ToastType } from "~/lib/toast";

const borderByType: Record<ToastType, string> = {
    success: "border-l-green-500",
    error: "border-l-red-500",
    info: "border-l-navy",
};

const ToastContainer = () => {
    const { toasts, dismissToast } = useToastStore();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`relative bg-surface text-ink rounded-xl shadow-lg border border-line border-l-4 ${borderByType[toast.type]} p-4 pr-9 animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                    <p className="text-sm">{toast.message}</p>
                    <button
                        type="button"
                        onClick={() => dismissToast(toast.id)}
                        aria-label="Dismiss"
                        className="absolute top-2.5 right-2.5 text-ink-soft hover:text-ink transition-colors cursor-pointer text-lg leading-none"
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
