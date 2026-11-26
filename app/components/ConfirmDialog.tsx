interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isConfirming?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    isConfirming = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200 p-4"
            onClick={onCancel}
        >
            <div
                className="bg-surface rounded-3xl shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="font-semibold text-lg text-ink">{title}</h3>
                <p className="text-sm text-ink-soft mt-2">{message}</p>
                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isConfirming}
                        className="secondary-button w-fit px-4"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className="danger-button w-fit"
                    >
                        {isConfirming ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
