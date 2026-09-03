import * as React from "react";
import { Search } from "lucide-react";
import { Input, type InputProps } from "./input";
import { cn } from "../../lib/utils";

export interface SearchInputProps extends Omit<InputProps, "leftIcon" | "type"> {
  shortcutBadge?: string;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = "Szukaj...",
      shortcutBadge,
      clearable = true,
      onClear,
      onKeyDown,
      rightAction,
      className,
      inputVariant = "filled",
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        onClear?.();
      }
      onKeyDown?.(e);
    };

    const actionBadge = shortcutBadge ? (
      <div className="pointer-events-none flex items-center select-none">
        <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
          {shortcutBadge}
        </kbd>
      </div>
    ) : rightAction;

    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        clearable={clearable}
        onClear={onClear}
        onKeyDown={handleKeyDown}
        inputVariant={inputVariant}
        leftIcon={<Search className="h-4 w-4 text-slate-400" />}
        rightAction={actionBadge}
        className={cn("pr-2", className)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
