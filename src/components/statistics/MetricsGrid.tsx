import React from "react";
import MetricCard from "./MetricCard";
import { Star, BookOpen, Layers, TrendingUp } from "lucide-react";

interface AdditionalStats {
  averageRating: number;
  totalPages: number;
  readPages: number;
  progressRate: number;
}

interface MetricsGridProps {
  additionalStats: AdditionalStats;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ additionalStats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
      <MetricCard
        title="Średnia ocena"
        value={
          additionalStats.averageRating > 0
            ? `${additionalStats.averageRating.toFixed(1)} / 10`
            : "0.0 / 10"
        }
        icon={<Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
        accent="#d97706"
      />
      <MetricCard
        title="Wszystkich stron"
        value={additionalStats.totalPages.toLocaleString()}
        icon={<Layers className="w-4 h-4" />}
        accent="#4f46e5"
      />
      <MetricCard
        title="Przeczytanych stron"
        value={additionalStats.readPages.toLocaleString()}
        icon={<BookOpen className="w-4 h-4" />}
        accent="#059669"
      />
      <MetricCard
        title="Postęp czytania"
        value={`${additionalStats.progressRate}%`}
        icon={<TrendingUp className="w-4 h-4" />}
        accent="#0284c7"
        showProgress
        progressValue={additionalStats.progressRate}
      />
    </div>
  );
};

export default MetricsGrid;
