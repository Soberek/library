import * as React from "react";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

export interface RatingProps {
  value: number;
  max?: number;
  readOnly?: boolean;
  precision?: number;
  size?: "sm" | "md" | "lg";
  onChange?: (event: React.SyntheticEvent, value: number | null) => void;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  readOnly = false,
  size = "md",
  onChange,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={cn("inline-flex items-center gap-0.5 select-none", className)}
      onMouseLeave={() => !readOnly && setHoverValue(null)}
    >
      {Array.from({ length: max }, (_, index) => {
        const starIndex = index + 1;
        const isFilled = displayValue >= starIndex;
        const isHalf = !isFilled && displayValue >= starIndex - 0.5;

        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={(e) => {
              if (!readOnly && onChange) {
                const newValue = value === starIndex ? 0 : starIndex;
                onChange(e, newValue);
              }
            }}
            onMouseEnter={() => !readOnly && setHoverValue(starIndex)}
            className={cn(
              "p-0.5 transition-transform focus:outline-none",
              readOnly
                ? "cursor-default"
                : "cursor-pointer hover:scale-110 active:scale-95"
            )}
            aria-label={`${starIndex} gwiazdek`}
          >
            <Star
              className={cn(
                starSizes[size],
                "transition-colors",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : isHalf
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-transparent text-slate-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Rating;
