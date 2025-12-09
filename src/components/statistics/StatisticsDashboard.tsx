import React, { useState } from 'react';
import { Box, Fade, Collapse, IconButton, Typography } from '@mui/material';
import StatisticsHeader from './StatisticsHeader';
import StatisticsGrid from './StatisticsGrid';
import MetricsGrid from './MetricsGrid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AnalyticsIcon from '@mui/icons-material/Analytics';

interface BooksStats {
  total: number;
  read: number;
  inProgress: number;
  dropped: number;
  wantToRead: number;
}

interface AdditionalStats {
  averageRating: number;
  totalPages: number;
  readPages: number;
  progressRate: number;
  completionRate: number;
}

interface StatisticsDashboardProps {
  booksStats: BooksStats;
  additionalStats: AdditionalStats;
}

const StatisticsDashboard: React.FC<StatisticsDashboardProps> = ({
  booksStats,
  additionalStats,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ mb: 4 }}>
        <StatisticsHeader />
        
        {/* Main Statistics - Hidden by default */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <StatisticsGrid booksStats={booksStats} additionalStats={additionalStats} />
        </Collapse>
        
        {/* Collapsible Section */}
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              },
            }}
            onClick={toggleExpanded}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: 2,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AnalyticsIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: '1rem',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Statystyki
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                color: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                },
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'all 0.3s ease',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
          
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ mt: 2 }}>
              <MetricsGrid additionalStats={additionalStats} />
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Fade>
  );
};

export default StatisticsDashboard;
