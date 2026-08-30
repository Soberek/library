import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore, type ToastSeverity } from '../../stores';
import { cn } from '../../lib/utils';

const icons: Record<ToastSeverity, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
  error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
  info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
};

const styles: Record<ToastSeverity, string> = {
  success: 'border-emerald-200 bg-emerald-50/95 text-emerald-950 shadow-emerald-500/10',
  error: 'border-rose-200 bg-rose-50/95 text-rose-950 shadow-rose-500/10',
  warning: 'border-amber-200 bg-amber-50/95 text-amber-950 shadow-amber-500/10',
  info: 'border-indigo-200 bg-indigo-50/95 text-indigo-950 shadow-indigo-500/10',
};

export const Toaster: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <aside
      aria-label="Powiadomienia"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className={cn(
              'pointer-events-auto flex items-start justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-md',
              styles[t.severity],
            )}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5">{icons[t.severity]}</div>
              <div className="text-xs sm:text-sm font-semibold leading-snug break-words">
                {t.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="rounded-lg p-1 text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
              aria-label="Zamknij powiadomienie"
            >
              <X className="w-4 h-4 opacity-70" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
};

export default Toaster;
