import { useState, useEffect } from "react";

interface MoneyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const MoneyInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  error
}: MoneyInputProps) => {
  const [displayValue, setDisplayValue] = useState(formatCurrency(value));

  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function parseCurrency(value: string) {
    return Number(value.replace(/\D/g, "")) / 100;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = parseCurrency(rawValue);

    setDisplayValue(formatCurrency(numericValue));
    onChange(numericValue);
  };

  const inputClassNames = `block py-2.5 text-sm text-gray-900 dark:text-white
    border border-gray-200/50 dark:border-gray-700/50
    rounded-lg w-full
    bg-white/90 dark:bg-gray-800/90
    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
    dark:focus:border-blue-500/50 dark:placeholder-gray-400
    transition-all duration-200 ease-in-out
    hover:bg-white/95 dark:hover:bg-gray-700/95
    pl-10 pr-4
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${error ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50' : ''}
    shadow-sm hover:shadow-md
    dark:shadow-gray-900/10`;

  const labelClassNames = `block text-sm font-medium 
    ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'} 
    mb-1.5 transition-colors duration-200`;

  const iconClassNames = `absolute left-3 top-1/2 transform -translate-y-1/2 text-base
    ${error 
      ? 'text-red-600 dark:text-red-400' 
      : 'text-gray-700 dark:text-gray-300'
    }
    transition-colors duration-200
    ${disabled ? 'opacity-50' : ''}
    drop-shadow-sm`;

  return (
    <div className="relative w-full group">
      <label htmlFor={id} className={labelClassNames}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <span className={iconClassNames}>
          <i className="fa fa-money-bill-wave" />
        </span>
        <input
          id={id}
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={inputClassNames}
          disabled={disabled}
          required={required}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
          <i className="fas fa-exclamation-circle" />
          {error}
        </p>
      )}
    </div>
  );
};

export default MoneyInput;
