import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface CustomInputProps {
  id: string;
  label?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  register?: UseFormRegisterReturn;
  error?: string;
}

const CustomInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  className,
  disabled = false,
  required = false,
  register,
  error,
}: CustomInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const inputClassNames = `block py-2.5 text-sm text-gray-900 dark:text-white
    border border-gray-200/50 dark:border-gray-700/50
    rounded-lg w-full
    bg-white/90 dark:bg-gray-800/90
    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
    dark:focus:border-blue-500/50 dark:placeholder-gray-400
    transition-all duration-200 ease-in-out
    hover:bg-white/95 dark:hover:bg-gray-700/95
    ${icon ? 'pl-10' : 'pl-4'} 
    ${className} 
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
      {label && (
        <label htmlFor={id} className={labelClassNames}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && <span className={iconClassNames}>{icon}</span>}
        <input
          id={id}
          type={type}
          value={register ? undefined : value}
          onChange={register ? undefined : handleChange}
          placeholder={placeholder}
          className={inputClassNames}
          disabled={disabled}
          required={required}
          {...register}
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

export default CustomInput;
