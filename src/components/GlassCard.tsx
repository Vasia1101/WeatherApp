export default function GlassCard({
  title,
  right,
  children,
  className = "",
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-40px_rgba(0,0,0,0.8)] " +
        className
      }
    >
      {(title || right) && (
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-slate-100/90">{title}</div>
          {right}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
