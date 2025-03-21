import { useEffect } from 'react';
import { useDashboardStore } from '../services/dashboard';

export const useDashboard = (filter: string) => {
  const { data, fetchData, loading } = useDashboardStore();

  useEffect(() => {
    if (!data[filter]) {
      fetchData(filter);
    }
  }, [filter]);

  return {
    ...data[filter],
    loading
  };
};
