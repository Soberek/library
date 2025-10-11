import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Zoom } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  chipLabel?: string;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  chipLabel,
  delay = 0,
}) => {
  // Add safety check for SSR
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Zoom in={mounted} timeout={900 + delay}>
      <Card
        sx={{
          background: color,
          color: 'white',
          borderRadius: 2,
          boxShadow: `0 4px 16px ${color.split('(')[1]?.split(',')[0] || 'rgba(102, 126, 234, 0.25)'}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 100,
          '&:hover': { 
            transform: 'translateY(-2px) scale(1.01)',
            boxShadow: `0 8px 24px ${color.split('(')[1]?.split(',')[0] || 'rgba(102, 126, 234, 0.35)'}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 1.5, px: 1.5, position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 0.25, textShadow: '0 1px 3px rgba(0,0,0,0.3)', lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.2 }}>
            {title}
          </Typography>
          {chipLabel && (
            <Chip
              label={chipLabel}
              size="small"
              sx={{
                mt: 0.25,
                bgcolor: 'rgba(255, 255, 255, 0.25)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 18,
                '& .MuiChip-label': {
                  px: 0.5,
                },
              }}
            />
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default StatCard;
