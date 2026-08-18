import * as React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps {
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
}) => {
  const isRange = Array.isArray(value);

  if (isRange) {
    const [minVal, maxVal] = value;
    return (
      <div className={cn("relative flex items-center w-full py-2", className)}>
        <div className="relative w-full h-2 bg-slate-200 rounded-full">
          <div
            className="absolute h-2 bg-indigo-600 rounded-full"
            style={{
              left: `${((minVal - min) / (max - min)) * 100}%`,
              right: `${100 - ((maxVal - min) / (max - min)) * 100}%`,
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={minVal}
            disabled={disabled}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxVal);
              onChange([val, maxVal]);
            }}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer pointer-events-auto"
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxVal}
            disabled={disabled}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minVal);
              onChange([minVal, val]);
            }}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer pointer-events-auto"
          />
        </div>
      </div>
    );
  }

  const numValue = value as number;
  const percent = ((numValue - min) / (max - min)) * 100;

  return (
    <div className={cn("relative flex items-center w-full py-2", className)}>
      <div className="relative w-full h-2 bg-slate-200 rounded-full">
        <div
          className="absolute h-2 bg-indigo-600 rounded-full"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numValue}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-transparent appearance-none cursor-pointer focus:outline-none accent-indigo-600 relative z-10"
        />
      </div>
    </div>
  );
};

export default Slider;
