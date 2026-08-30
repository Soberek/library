import React from "react";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  accent?: string;
  hint?: string;
  percentage?: number;
  progress?: number;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  accent = "#4f46e5",
  hint,
  percentage,
  progress,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        onClick && "cursor-pointer hover:border-indigo-300",
        className
      )}
    >
      {/* Top subtle colored edge */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
          {title}
        </span>
        {icon && (
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none font-display">
          {value}
        </span>
        {typeof percentage === "number" && (
          <span className="text-xs font-bold text-slate-400">
            ({Math.round(percentage)}%)
          </span>
        )}
      </div>

      {hint && (
        <span className="block text-[11px] text-slate-500 mt-2 font-medium">
          {hint}
        </span>
      )}

      {typeof progress === "number" && (
        <div className="mt-2.5">
          <Progress value={progress} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
