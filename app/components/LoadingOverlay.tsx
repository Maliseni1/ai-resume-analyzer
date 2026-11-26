const LoadingOverlay = ({ message }: { message: string }) => (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-surface rounded-3xl shadow-xl px-8 py-7 flex flex-col items-center gap-4 max-w-sm mx-4 text-center">
            <div className="w-10 h-10 border-4 border-line border-t-navy rounded-full animate-spin" />
            <p className="font-semibold text-ink">{message}</p>
        </div>
    </div>
);

export default LoadingOverlay;
