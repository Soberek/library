import * as React from "react";
import { cn } from "../../lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "destructive";
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const variantStyles = {
      default: "bg-gradient-to-r from-indigo-500 to-violet-600",
      success: "bg-gradient-to-r from-emerald-500 to-green-600",
      warning: "bg-gradient-to-r from-amber-500 to-orange-500",
      destructive: "bg-gradient-to-r from-red-500 to-rose-600",
    };

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-slate-100",
          className
        )}
        {...props}
      >
        <div
          className={cn("h-full transition-all duration-300 ease-out rounded-full", variantStyles[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export default Progress;
