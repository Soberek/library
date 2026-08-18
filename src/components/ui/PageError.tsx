import React from "react";
import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
  message: string;
  title?: string;
}

export const PageError: React.FC<PageErrorProps> = ({
  message,
  title = "Nie udało się załadować danych",
}) => (
  <div className="py-6 w-full">
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-200 bg-red-50 text-red-900 shadow-sm">
      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
    </div>
  </div>
);

export default PageError;
