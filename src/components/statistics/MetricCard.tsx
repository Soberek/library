import React from "react";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: string;
  showProgress?: boolean;
  progressValue?: number;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  accent = "#4f46e5",
  showProgress = false,
  progressValue = 0,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all",
        className
      )}
    >
      {icon && (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight font-display">
          {value}
        </div>
        <div className="text-xs font-semibold text-slate-500 truncate mt-0.5">
          {title}
        </div>
        {showProgress && (
          <div className="mt-2">
            <Progress value={progressValue} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
