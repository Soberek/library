import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex flex-row flex-nowrap items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm hover:from-indigo-500 hover:to-violet-500 hover:shadow-md shadow-indigo-500/20 active:from-indigo-700 active:to-violet-700",
        primary:
          "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 border border-slate-200/80 shadow-2xs",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-500/20",
        danger:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-500/20",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 shadow-2xs hover:border-slate-300 active:bg-slate-100",
        ghost:
          "hover:bg-slate-100 active:bg-slate-200 text-slate-700 hover:text-slate-900",
        link:
          "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto font-semibold active:text-indigo-800",
        rose:
          "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm hover:from-rose-600 hover:to-pink-600 hover:shadow-md shadow-rose-500/20 active:from-rose-700 active:to-pink-700",
        emerald:
          "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 hover:shadow-md shadow-emerald-500/20 active:from-emerald-700 active:to-teal-700",
        success:
          "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-500 hover:to-teal-500 hover:shadow-md shadow-emerald-500/20 active:from-emerald-700 active:to-teal-700",
        amber:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:from-amber-600 hover:to-orange-600 hover:shadow-md shadow-amber-500/20 active:from-amber-700 active:to-orange-700",
        warning:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm hover:from-amber-600 hover:to-orange-600 hover:shadow-md shadow-amber-500/20 active:from-amber-700 active:to-orange-700",
        subtle:
          "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-100 shadow-2xs",
        glow:
          "relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        xs: "h-7 rounded-lg px-2.5 text-xs font-semibold",
        sm: "h-8 rounded-lg px-3 text-xs font-bold",
        default: "h-10 rounded-xl px-4 py-2",
        md: "h-10 rounded-xl px-4 py-2",
        lg: "h-12 rounded-2xl px-6 text-base font-bold",
        xl: "h-14 rounded-2xl px-8 text-lg font-bold",
        "icon-xs": "h-6 w-6 p-0 rounded-md",
        "icon-sm": "h-7 w-7 p-0 rounded-lg",
        icon: "h-9 w-9 p-0 rounded-xl",
        "icon-lg": "h-11 w-11 p-0 rounded-2xl",
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
  loading?: boolean;
  loadingText?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: "default" | "full" | "lg" | "none";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      rounded,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isIconOnly =
      size === "icon" ||
      size === "icon-sm" ||
      size === "icon-xs" ||
      size === "icon-lg";

    const roundedClass =
      rounded === "full"
        ? "rounded-full"
        : rounded === "lg"
        ? "rounded-2xl"
        : rounded === "none"
        ? "rounded-none"
        : undefined;

    const spinnerSizeClass =
      size === "xs" || size === "icon-xs"
        ? "h-3 w-3"
        : size === "sm" || size === "icon-sm"
        ? "h-3.5 w-3.5"
        : size === "lg" || size === "xl" || size === "icon-lg"
        ? "h-5 w-5"
        : "h-4 w-4";

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading ? "true" : undefined}
        className={cn(
          buttonVariants({ variant, size, className }),
          fullWidth && "w-full",
          roundedClass,
          loading && "opacity-80 cursor-wait pointer-events-none"
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn("animate-spin shrink-0", spinnerSizeClass)} />
            {loadingText ? (
              <span>{loadingText}</span>
            ) : isIconOnly ? null : (
              children
            )}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
