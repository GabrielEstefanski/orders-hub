import { useState, useEffect } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import CustomInput from './Custom';
import PasswordValidator from './PasswordValidator';

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error?: string;
  className?: string;
  required?: boolean;
  showPasswordRequirements?: boolean;
}

export default function PasswordInput({
  id,
  label,
  placeholder,
  register,
  error,
  className,
  required = false,
  showPasswordRequirements = true
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const inputElement = document.getElementById(id);
    
    if (inputElement) {
      const handleFocus = () => setIsFocused(true);
      const handleBlur = () => setIsFocused(false);
      
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
      
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            const target = mutation.target as HTMLInputElement;
            setPassword(target.value);
          }
        });
      });
      
      observer.observe(inputElement, { attributes: true, attributeFilter: ['value'] });
      
      return () => {
        inputElement.removeEventListener('focus', handleFocus);
        inputElement.removeEventListener('blur', handleBlur);
        observer.disconnect();
      };
    }
  }, [id]);
  
  useEffect(() => {
    const inputElement = document.getElementById(id);
    
    if (inputElement) {
      const handleInput = (e: Event) => {
        const target = e.target as HTMLInputElement;
        setPassword(target.value);
      };
      
      inputElement.addEventListener('input', handleInput);
      
      return () => {
        inputElement.removeEventListener('input', handleInput);
      };
    }
  }, [id]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <CustomInput
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        icon={<i className="fas fa-lock text-gray-400" />}
        className={className}
        required={required}
        register={register}
        error={error}
      />
      
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors focus:outline-none dark:hover:text-gray-300"
      >
        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
      </button>
      
      {showPasswordRequirements && isFocused && password && (
        <PasswordValidator password={password} visible={true} />
      )}
    </div>
  );
} 