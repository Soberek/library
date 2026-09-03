import * as React from "react";
import { Eye, EyeOff, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  labelRight?: React.ReactNode;
  helperText?: React.ReactNode;
  error?: boolean | string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  showPasswordToggle?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  loading?: boolean;
  prefixText?: string;
  suffixText?: string;
  inputSize?: "sm" | "default" | "md" | "lg";
  inputVariant?: "default" | "filled" | "flush";
  containerClassName?: string;
  inputClassName?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      inputClassName,
      type = "text",
      label,
      labelRight,
      helperText,
      error,
      leftIcon,
      rightIcon,
      rightAction,
      showPasswordToggle = false,
      clearable = false,
      onClear,
      loading = false,
      prefixText,
      suffixText,
      inputSize = "default",
      inputVariant = "default",
      fullWidth = true,
      disabled,
      id,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || (label ? `input-${generatedId}` : undefined);
    const [showPassword, setShowPassword] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
      value !== undefined ? value : defaultValue !== undefined ? defaultValue : ""
    );
    const innerRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;
    const isError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      if (innerRef.current) {
        innerRef.current.value = "";
        // Trigger React synthetic change event for form libraries
        const event = new Event("input", { bubbles: true });
        innerRef.current.dispatchEvent(event);
        innerRef.current.focus();
      }
      onClear?.();
    };

    const hasValue = internalValue !== "" && internalValue !== undefined && internalValue !== null;

    // Size mappings
    const sizeClasses = {
      sm: "h-8 text-xs rounded-lg px-2.5",
      default: "h-10 text-sm rounded-xl px-3.5",
      md: "h-10 text-sm rounded-xl px-3.5",
      lg: "h-12 text-base rounded-2xl px-4",
    }[inputSize];

    // Variant base styles
    const variantClasses = {
      default: "bg-white border-slate-200 hover:border-slate-300",
      filled: "bg-slate-50/90 border-slate-200/80 hover:bg-white hover:border-slate-300",
      flush: "bg-transparent border-0 border-b border-slate-200 rounded-none shadow-none px-0",
    }[inputVariant];

    // Focus and error styles
    const stateClasses = isError
      ? "border-rose-400 text-slate-900 focus-within:border-rose-500 focus-within:ring-3 focus-within:ring-rose-500/15"
      : inputVariant === "flush"
      ? "focus-within:border-indigo-500"
      : "focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-500/15 focus-within:bg-white";

    const content = (
      <div
        className={cn(
          "relative flex items-center transition-all duration-150 border shadow-2xs",
          sizeClasses,
          variantClasses,
          stateClasses,
          disabled && "opacity-60 cursor-not-allowed bg-slate-50 hover:border-slate-200",
          fullWidth && "w-full",
          className
        )}
      >
        {/* Left Icon */}
        {leftIcon && (
          <span className="pointer-events-none flex items-center shrink-0 pr-2 text-slate-400">
            {leftIcon}
          </span>
        )}

        {/* Prefix Text */}
        {prefixText && (
          <span className="pointer-events-none flex items-center shrink-0 pr-1.5 text-xs font-semibold text-slate-400 select-none">
            {prefixText}
          </span>
        )}

        {/* Native Input */}
        <input
          ref={innerRef}
          id={inputId}
          type={actualType}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          aria-invalid={isError ? "true" : undefined}
          aria-describedby={errorMessage && inputId ? `${inputId}-error` : undefined}
          className={cn(
            "w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed",
            inputClassName
          )}
          {...props}
        />

        {/* Suffix Text */}
        {suffixText && (
          <span className="pointer-events-none flex items-center shrink-0 pl-1.5 text-xs font-semibold text-slate-400 select-none">
            {suffixText}
          </span>
        )}

        {/* Clear Button */}
        {clearable && hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            tabIndex={-1}
            aria-label="Wyczyść pole"
            className="flex items-center shrink-0 pl-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Password Toggle Button */}
        {isPassword && showPasswordToggle && !disabled && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
            className="flex items-center shrink-0 pl-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}

        {/* Loading Spinner */}
        {loading && (
          <span className="flex items-center shrink-0 pl-1.5 text-indigo-600">
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}

        {/* Right Icon */}
        {rightIcon && !loading && (
          <span className="pointer-events-none flex items-center shrink-0 pl-2 text-slate-400">
            {rightIcon}
          </span>
        )}

        {/* Right Action */}
        {rightAction && (
          <span className="flex items-center shrink-0 pl-2">
            {rightAction}
          </span>
        )}
      </div>
    );

    // If no label, error message, or helper text, return the input directly
    if (!label && !labelRight && !errorMessage && !helperText) {
      return content;
    }

    return (
      <div className={cn(fullWidth && "w-full", containerClassName)}>
        {(label || labelRight) && (
          <div className="flex items-center justify-between mb-1.5">
            {label && (
              <label
                htmlFor={inputId}
                className="block text-xs font-bold text-slate-700 select-none"
              >
                {label} {props.required && <span className="text-rose-500">*</span>}
              </label>
            )}
            {labelRight && <div className="text-xs">{labelRight}</div>}
          </div>
        )}

        {content}

        {errorMessage && (
          <p
            id={inputId ? `${inputId}-error` : undefined}
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

Input.displayName = "Input";

export default Input;
