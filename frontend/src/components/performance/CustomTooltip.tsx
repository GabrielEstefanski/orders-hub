import React from 'react';
import { motion } from 'framer-motion';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden
          bg-white/80 dark:bg-gray-800/80
          border border-gray-100/50 dark:border-gray-700/50
          shadow-lg shadow-gray-200/20 dark:shadow-gray-900/30
          p-3"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 
          dark:from-blue-400/[0.03] dark:via-purple-400/[0.03] dark:to-pink-400/[0.03]" />
        
        <div className="relative z-10 flex flex-col gap-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }
  return null;
};
