import LogoMark from "~/components/LogoMark";

const Splash = ({ visible }: { visible: boolean }) => (
    <div
        aria-hidden
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-navy transition-opacity duration-500 ${
            visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
    >
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
            <LogoMark className="w-14 h-14" />
            <div className="flex flex-col items-center gap-1">
                <p className="text-3xl font-bold text-white tracking-tight">EUKLEYA</p>
                <p className="text-sm text-slate-300">Let your work speak well of you.</p>
            </div>
        </div>
    </div>
);

export default Splash;
