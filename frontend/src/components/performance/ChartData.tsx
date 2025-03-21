import React from 'react';
import { AnimatedElement } from '../animation/AnimatedElement';

interface ChartCardProps {
  title: string;
  icon: string;
  subtitle?: string;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon, subtitle, delay, children, className = "" }) => {
  return (
    <AnimatedElement
      animation="fadeIn"
      delay={delay || 0}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full ${className}`}
    >
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
            <i className={`${icon} text-white`}></i>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-5 flex-grow">{children}</div>
    </AnimatedElement>
  );
};

export default ChartCard;