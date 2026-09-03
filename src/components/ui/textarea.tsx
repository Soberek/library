import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  labelRight?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean | string;
  containerClassName?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      labelRight,
      helperText,
      error,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || (label ? `textarea-${generatedId}` : undefined);
    const isError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : null;

    const textarea = (
      <textarea
        id={textareaId}
        ref={ref}
        aria-invalid={isError ? "true" : undefined}
        aria-describedby={errorMessage && textareaId ? `${textareaId}-error` : undefined}
        className={cn(
          "flex min-h-[90px] w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition-all duration-150 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          isError
            ? "border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15"
            : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15",
          className
        )}
        {...props}
      />
    );

    if (!label && !labelRight && !errorMessage && !helperText) {
      return textarea;
    }

    return (
      <div className={cn(fullWidth && "w-full", containerClassName)}>
        {(label || labelRight) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && (
              <label
                htmlFor={textareaId}
                className="block text-xs font-bold text-slate-700 select-none"
              >
                {label} {props.required && <span className="text-rose-500">*</span>}
              </label>
            )}
            {labelRight && <div className="text-xs">{labelRight}</div>}
          </div>
        )}

        {textarea}

        {errorMessage && (
          <p
            id={textareaId ? `${textareaId}-error` : undefined}
            role="alert"
            className="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1 animate-in fade-in-0 duration-150"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </p>
        )}

        {!errorMessage && helperText && (
          <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
