import * as React from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  label?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  onChange,
  disabled = false,
  className,
  id,
  label,
}) => {
  const handleChange = () => {
    const next = !checked;
    if (onCheckedChange) onCheckedChange(next);
    if (onChange) onChange(next);
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex items-center gap-2.5 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={handleChange}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          checked
            ? "bg-indigo-600"
            : "bg-slate-200"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch;
