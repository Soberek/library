import React from 'react';
import { Loader2 } from 'lucide-react';

export const PageLoader: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-4">
    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center shadow-sm">
      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
    </div>
    <span className="text-xs font-semibold tracking-wider uppercase text-slate-400 animate-pulse">
      Ładowanie...
    </span>
  </div>
);

export default PageLoader;
