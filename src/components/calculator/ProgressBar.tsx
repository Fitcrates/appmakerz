type ProgressBarProps = {
  current: number;
  total: number;
  label: string;
};

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const progress = total > 1 ? (current / (total - 1)) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.24em] text-white/45">
        <span>{label}</span>
        <span>{Math.min(current + 1, total)} / {total}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-teal-300 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
