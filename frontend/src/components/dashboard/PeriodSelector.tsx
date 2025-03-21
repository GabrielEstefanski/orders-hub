import React from 'react';

interface PeriodSelectorProps {
  current: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ current, onChange, options }) => (
    <div className="flex bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/20 dark:border-gray-700/20 overflow-hidden">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            current === option.value
              ? "bg-blue-500 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
);

export default PeriodSelector;