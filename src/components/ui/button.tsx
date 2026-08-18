import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 hover:shadow-md shadow-indigo-500/20",
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200/80 shadow-2xs",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-500/20",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-2xs hover:border-slate-300",
        ghost:
          "hover:bg-slate-100 text-slate-700 hover:text-slate-900",
        link:
          "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto font-semibold",
        rose:
          "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm hover:from-rose-600 hover:to-pink-600 hover:shadow-md shadow-rose-500/20",
        emerald:
          "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 hover:shadow-md shadow-emerald-500/20",
        amber:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:from-amber-600 hover:to-orange-600 hover:shadow-md shadow-amber-500/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs font-bold",
        lg: "h-12 rounded-2xl px-6 text-base font-bold",
        icon: "h-9 w-9 p-0 rounded-xl",
        "icon-sm": "h-7 w-7 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
