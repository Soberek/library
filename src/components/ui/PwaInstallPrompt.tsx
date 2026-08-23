import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';
import { Button } from './button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_STORAGE_KEY = 'pwa_prompt_dismissed_at';
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed / running standalone
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        Boolean((window.navigator as unknown as { standalone?: boolean }).standalone));

    setIsStandalone(isRunningStandalone);
    if (isRunningStandalone) return;

    // Check if user recently dismissed the prompt
    const dismissedAt = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (dismissedAt) {
      const timeSinceDismiss = Date.now() - Number(dismissedAt);
      if (timeSinceDismiss < DISMISS_DURATION_MS) {
        return;
      }
    }

    setIsDismissed(false);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsDismissed(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsDismissed(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  if (isStandalone || isDismissed || (!deferredPrompt && !isIOS)) {
    return null;
  }

  return (
    <>
      <aside
        aria-label="Powiadomienie o instalacji aplikacji"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 p-3.5 rounded-2xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white font-display">
              Zainstaluj MyLibrary
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Zainstaluj aplikację na telefonie, aby otwierać ją jak natywną apkę bez paska przeglądarki.
            </p>

            <div className="flex items-center gap-2 mt-2.5">
              <Button
                size="sm"
                onClick={() => void handleInstallClick()}
                className="h-7 px-3 text-[11px] font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Zainstaluj</span>
              </Button>

              <button
                type="button"
                onClick={handleDismiss}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-200 px-2 py-1 transition-colors cursor-pointer"
              >
                Później
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Zamknij"
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* iOS Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 text-slate-900">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-3 right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 border border-indigo-200/60 shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-center font-display mb-1">
              Instalacja na iOS (Safari)
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              Dodaj aplikację do ekranu początkowego w 2 prostych krokach:
            </p>

            <ol className="space-y-2.5 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  1
                </span>
                <span>
                  Kliknij ikonę <strong className="text-indigo-600">Udostępnij</strong>{' '}
                  <Share className="w-3.5 h-3.5 inline -mt-0.5" /> na dolnym pasku Safari.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  2
                </span>
                <span>
                  Wybierz opcję <strong className="text-indigo-600">Do ekranu początkowego</strong>{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline -mt-0.5" />.
                </span>
              </li>
            </ol>

            <Button
              className="w-full mt-4 h-9 rounded-xl font-bold text-xs"
              onClick={() => setShowIOSGuide(false)}
            >
              Rozumiem
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallPrompt;
