import * as React from "react";
import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ToastProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  message: React.ReactNode;
  severity?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  open,
  isOpen,
  onClose,
  message,
  severity = "info",
  duration = 4000,
}) => {
  const isVisible = open ?? isOpen ?? false;

  useEffect(() => {
    if (!isVisible || duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-indigo-200 bg-indigo-50 text-indigo-900",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in fade-in-0 slide-in-from-bottom-5 duration-300">
      <div
        className={cn(
          "flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md",
          borders[severity]
        )}
      >
        <div className="flex items-center gap-3">
          {icons[severity]}
          <div className="text-sm font-medium">{message}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer"
          aria-label="Zamknij powiadomienie"
        >
          <X className="w-4 h-4 opacity-70" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
