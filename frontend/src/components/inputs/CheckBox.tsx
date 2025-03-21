import { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  id: string;
}

export default function Checkbox({ 
  label, 
  id, 
  checked,
  onChange,
  className = '',
  ...props 
}: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={`w-4 h-4 border border-gray-300 rounded bg-gray-50 
          focus:ring-3 focus:ring-blue-300 
          dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 
          dark:ring-offset-gray-800 
          ${className}`}
        {...props}
      />
      <label
        htmlFor={id}
        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {label}
      </label>
    </div>
  );
}
