const formatNumber = (value: number): string => {
  if (value >= 1000000000000) {
    return `${(value / 1000000000000).toFixed(1)}T`;
  }

  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
};

export default formatNumber; 