import React from 'react';
import { Grid } from '@mui/material';
import MetricCard from './MetricCard';
import StarIcon from '@mui/icons-material/Star';
import PagesIcon from '@mui/icons-material/Pages';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface AdditionalStats {
  averageRating: number;
  totalPages: number;
  readPages: number;
  progressRate: number;
}

interface MetricsGridProps {
  additionalStats: AdditionalStats;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ additionalStats }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Średnia ocena"
          value={additionalStats.averageRating > 0 ? additionalStats.averageRating.toFixed(1) : '0.0'}
          icon={<StarIcon sx={{ color: 'white', fontSize: 20 }} />}
          color="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
          delay={0}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Wszystkich stron"
          value={additionalStats.totalPages.toLocaleString()}
          icon={<PagesIcon sx={{ color: 'white', fontSize: 20 }} />}
          color="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
          delay={100}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Przeczytanych stron"
          value={additionalStats.readPages.toLocaleString()}
          icon={<AccessTimeIcon sx={{ color: 'white', fontSize: 20 }} />}
          color="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          delay={200}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <MetricCard
          title="Postęp ogólny"
          value={`${additionalStats.progressRate}%`}
          icon={<TrendingUpIcon sx={{ color: 'white', fontSize: 20 }} />}
          color="linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
          showProgress={true}
          progressValue={additionalStats.progressRate}
          delay={300}
        />
      </Grid>
    </Grid>
  );
};

export default MetricsGrid;
