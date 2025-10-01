import React from "react";

const StatisticsHeader: React.FC = () => {
  // Add safety check for SSR
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return null;
};

export default StatisticsHeader;
