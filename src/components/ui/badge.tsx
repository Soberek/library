import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-50 text-indigo-800 border border-indigo-200/70",
        secondary:
          "bg-slate-100 text-slate-700 border border-slate-200",
        destructive:
          "bg-red-50 text-red-700 border border-red-200",
        outline:
          "text-slate-700 border border-slate-200 bg-white",
        success:
          "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
        warning:
          "bg-amber-50 text-amber-800 border border-amber-200/80",
        info:
          "bg-blue-50 text-blue-800 border border-blue-200",
        rose:
          "bg-rose-50 text-rose-800 border border-rose-200/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export default Badge;
