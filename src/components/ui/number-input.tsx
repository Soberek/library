import * as React from "react";
import { Plus, Minus, AlertCircle, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue" | "min" | "max" | "step"> {
  value?: number | string | null;
  defaultValue?: number | string | null;
  min?: number;
  max?: number;
  step?: number;
  allowEmpty?: boolean;
  allowDecimals?: boolean;
  clampOnBlur?: boolean;
  showSteppers?: boolean;
  onValueChange?: (value: number | null) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: React.ReactNode;
  labelRight?: React.ReactNode;
  error?: boolean | string;
  helperText?: React.ReactNode;
  leftIcon?: React.ReactNode;
  prefixText?: string;
  suffixText?: string;
  clearable?: boolean;
  inputSize?: "sm" | "default" | "lg";
  inputVariant?: "default" | "filled" | "flush";
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue,
      min,
      max,
      step = 1,
      allowEmpty = true,
      allowDecimals = false,
      clampOnBlur = true,
      showSteppers = true,
      onValueChange,
      onChange,
      onBlur,
      onKeyDown,
      disabled,
      required,
      id,
      label,
      labelRight,
      error,
      helperText,
      leftIcon,
      prefixText,
      suffixText,
      clearable = false,
      inputSize = "default",
      inputVariant = "default",
      placeholder,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const isControlled = controlledValue !== undefined;

    const toDisplayString = (val: number | string | null | undefined): string => {
      if (val === null || val === undefined || val === "") return "";
      return String(val);
    };

    const [internalValue, setInternalValue] = React.useState<string>(() =>
      toDisplayString(isControlled ? controlledValue : defaultValue)
    );

    // Keep internal state in sync with controlled value
    React.useEffect(() => {
      if (isControlled) {
        setInternalValue(toDisplayString(controlledValue));
      }
    }, [controlledValue, isControlled]);

    const numericValue = internalValue === "" ? null : Number(internalValue);

    // Trigger synthetic ChangeEvent for React Hook Form / native listeners
    const emitChange = (newStringValue: string) => {
      setInternalValue(newStringValue);

      const parsedNum = newStringValue === "" ? null : Number(newStringValue);
      onValueChange?.(parsedNum);

      if (inputRef.current) {
        // Set native value on the real input node
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        nativeInputValueSetter?.call(inputRef.current, newStringValue);

        const syntheticEvent = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(syntheticEvent);

        if (onChange) {
          const changeEvent = {
            ...syntheticEvent,
            target: inputRef.current,
            currentTarget: inputRef.current,
          } as unknown as React.ChangeEvent<HTMLInputElement>;
          onChange(changeEvent);
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      // Allow complete emptying
      if (raw === "") {
        emitChange("");
        return;
      }

      // Filter valid characters: digits, optionally minus (if min < 0), optionally dot/comma (if allowDecimals)
      let sanitized = raw.replace(/,/g, ".");
      if (allowDecimals) {
        sanitized = sanitized.replace(/[^0-9.-]/g, "");
      } else {
        sanitized = sanitized.replace(/[^0-9-]/g, "");
      }

      // Ensure single minus at start if min can be negative
      if (min !== undefined && min >= 0) {
        sanitized = sanitized.replace(/-/g, "");
      } else {
        sanitized = sanitized.replace(/(?!^)-/g, "");
      }

      // Ensure single decimal point
      if (allowDecimals) {
        const parts = sanitized.split(".");
        if (parts.length > 2) {
          sanitized = `${parts[0]}.${parts.slice(1).join("")}`;
        }
      }

      // Check max constraint if typed
      if (sanitized !== "" && sanitized !== "-" && max !== undefined) {
        const num = Number(sanitized);
        if (!isNaN(num) && num > max) {
          sanitized = String(max);
        }
      }

      emitChange(sanitized);
    };

    const handleStep = (direction: 1 | -1, multiplier = 1) => {
      if (disabled) return;

      const delta = step * multiplier * direction;
      let nextNum: number;

      if (numericValue === null || isNaN(numericValue)) {
        if (direction === 1) {
          nextNum = min !== undefined ? Math.max(min, 1) : 1;
        } else {
          nextNum = min !== undefined ? min : 0;
        }
      } else {
        nextNum = numericValue + delta;
      }

      // Decimal precision fix
      if (allowDecimals) {
        nextNum = parseFloat(nextNum.toFixed(4));
      }

      // Apply bounds
      if (min !== undefined && nextNum < min) {
        nextNum = min;
      }
      if (max !== undefined && nextNum > max) {
        nextNum = max;
      }

      emitChange(String(nextNum));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (clampOnBlur && internalValue !== "") {
        const num = Number(internalValue);
        if (!isNaN(num)) {
          let clamped = num;
          if (min !== undefined && clamped < min) clamped = min;
          if (max !== undefined && clamped > max) clamped = max;
          if (clamped !== num) {
            emitChange(String(clamped));
          }
        }
      }
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleStep(1, e.shiftKey ? 10 : 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleStep(-1, e.shiftKey ? 10 : 1);
      }
      onKeyDown?.(e);
    };

    const handleClear = () => {
      emitChange("");
      inputRef.current?.focus();
    };

    const canDecrement = !disabled && (numericValue === null || min === undefined || numericValue > min);
    const canIncrement = !disabled && (numericValue === null || max === undefined || numericValue < max);

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    const sizeClasses = {
      sm: "h-8 text-xs px-2.5",
      default: "h-10 text-sm px-3",
      lg: "h-12 text-base px-4",
    }[inputSize];

    const stepperBtnSizeClass = {
      sm: "w-6 h-6",
      default: "w-7 h-7",
      lg: "w-8 h-8",
    }[inputSize];

    const iconSizeClass = {
      sm: "w-3 h-3",
      default: "w-3.5 h-3.5",
      lg: "w-4 h-4",
    }[inputSize];

    const variantClasses = {
      default: "bg-white border-slate-200 shadow-2xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400",
      filled: "bg-slate-50 border-slate-200/80 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400",
      flush: "bg-transparent border-b border-slate-200 rounded-none px-0 shadow-none focus:border-indigo-500 focus:ring-0 text-slate-900 placeholder:text-slate-400",
    }[inputVariant];

    return (
      <div className="w-full space-y-1.5">
        {(label || labelRight) && (
          <div className="flex items-center justify-between gap-2">
            {label && (
              <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 select-none">
                {label}
                {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
              </label>
            )}
            {labelRight && <div className="text-xs">{labelRight}</div>}
          </div>
        )}

        <div className="relative flex items-center group">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center justify-center text-slate-400">
              {leftIcon}
            </div>
          )}

          {prefixText && (
            <span className="pointer-events-none absolute left-3 text-xs font-semibold text-slate-400 select-none">
              {prefixText}
            </span>
          )}

          <input
            ref={inputRef}
            id={inputId}
            type="text"
            inputMode={allowDecimals ? "decimal" : "numeric"}
            pattern={allowDecimals ? "[0-9]*[.,]?[0-9]*" : "[0-9]*"}
            role="spinbutton"
            aria-valuenow={numericValue ?? undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-invalid={hasError ? "true" : undefined}
            value={internalValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onWheel={(e) => e.currentTarget.blur()}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={cn(
              "w-full rounded-xl border transition-all duration-150 outline-none font-medium",
              sizeClasses,
              variantClasses,
              leftIcon && "pl-9",
              prefixText && "pl-8",
              (showSteppers || clearable || suffixText) && "pr-24",
              hasError && "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 placeholder:text-red-300",
              disabled && "opacity-50 cursor-not-allowed bg-slate-100",
              className
            )}
            {...props}
          />

          <div className="absolute right-1.5 flex items-center gap-1">
            {suffixText && (
              <span className="pointer-events-none text-xs font-semibold text-slate-400 select-none px-1">
                {suffixText}
              </span>
            )}

            {clearable && internalValue !== "" && !disabled && (
              <button
                type="button"
                tabIndex={-1}
                onClick={handleClear}
                aria-label="Wyczyść pole"
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {showSteppers && !disabled && (
              <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={!canDecrement}
                  onClick={() => handleStep(-1)}
                  aria-label="Zmniejsz wartość"
                  className={cn(
                    "flex items-center justify-center rounded text-slate-600 transition-all cursor-pointer",
                    stepperBtnSizeClass,
                    canDecrement
                      ? "hover:bg-white hover:text-slate-900 active:scale-95 shadow-2xs"
                      : "opacity-30 cursor-not-allowed text-slate-400"
                  )}
                >
                  <Minus className={iconSizeClass} />
                </button>
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={!canIncrement}
                  onClick={() => handleStep(1)}
                  aria-label="Zwiększ wartość"
                  className={cn(
                    "flex items-center justify-center rounded text-slate-600 transition-all cursor-pointer",
                    stepperBtnSizeClass,
                    canIncrement
                      ? "hover:bg-white hover:text-slate-900 active:scale-95 shadow-2xs"
                      : "opacity-30 cursor-not-allowed text-slate-400"
                  )}
                >
                  <Plus className={iconSizeClass} />
                </button>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 animate-in fade-in duration-150" role="alert">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {helperText && !errorMessage && (
          <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
export default NumberInput;
