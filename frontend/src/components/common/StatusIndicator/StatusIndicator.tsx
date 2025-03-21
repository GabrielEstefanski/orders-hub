import React from 'react';

interface StatusIndicatorProps {
  status: boolean;
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  label = status ? 'Online' : 'Offline' 
}) => (
  <div className={`flex items-center gap-2 px-3 py-1 rounded-full
    ${status 
      ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
      : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
    <div className={`w-2 h-2 rounded-full ${
      status ? 'bg-green-500 animate-pulse' : 'bg-red-500'
    }`} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);
