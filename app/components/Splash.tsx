const Splash = ({ visible }: { visible: boolean }) => (
    <div
        aria-hidden
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-navy transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
        <p className="text-3xl font-bold text-white tracking-tight animate-in fade-in zoom-in-95 duration-700">
            RESUMIND
        </p>
    </div>
);

export default Splash;
