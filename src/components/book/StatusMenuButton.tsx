import React, { useState, useRef, useEffect } from "react";
import type { BookStatus } from "../../types/Book";
import { BOOK_STATUSES, BOOK_STATUS_LABELS } from "../../constants/bookStatus";
import { STATUS_STYLE, STATUS_PILL } from "../../constants/bookUi";
import { cn } from "../../lib/utils";

interface StatusMenuButtonProps {
  status: BookStatus;
  onSelect: (next: BookStatus) => void;
  variant?: "solid" | "pill";
  size?: "sm" | "md";
}

export const StatusMenuButton: React.FC<StatusMenuButtonProps> = ({
  status,
  onSelect,
  variant = "solid",
  size = "sm",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const style = STATUS_STYLE[status];
  const pill = STATUS_PILL[status];
  const StatusIcon = style.Icon;
  const isSolid = variant === "solid";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Status: ${BOOK_STATUS_LABELS[status]}. Kliknij, aby zmienić.`}
        title="Kliknij, aby zmienić status"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full font-bold transition-all hover:opacity-95 active:scale-95 cursor-pointer select-none border",
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
          isSolid ? "text-white shadow-xs border-transparent" : "shadow-none"
        )}
        style={{
          backgroundColor: isSolid ? style.bg : pill.bg,
          color: isSolid ? "#fff" : pill.color,
          borderColor: isSolid ? style.border : pill.border,
        }}
      >
        <StatusIcon size={size === "sm" ? 12 : 14} className="shrink-0" />
        <span>{isSolid ? style.short : BOOK_STATUS_LABELS[status]}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 z-50 mt-1.5 min-w-[190px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl transition-all animate-in fade-in-0 zoom-in-95"
        >
          {BOOK_STATUSES.map((option) => {
            const optionStyle = STATUS_STYLE[option];
            const OptionIcon = optionStyle.Icon;
            const selected = option === status;
            return (
              <button
                key={option}
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsOpen(false);
                  if (option !== status) onSelect(option);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors cursor-pointer select-none text-left",
                  selected
                    ? "bg-indigo-50 text-indigo-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: optionStyle.bg }}
                >
                  <OptionIcon size={11} />
                </div>
                <span>{BOOK_STATUS_LABELS[option]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StatusMenuButton;
