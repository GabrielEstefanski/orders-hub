import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PasswordRequirement {
  id: string;
  text: string;
  validator: (password: string) => boolean;
}

interface PasswordValidatorProps {
  password: string;
  visible: boolean;
}

const PasswordValidator: React.FC<PasswordValidatorProps> = ({ password, visible }) => {
  const [requirements, setRequirements] = useState<(PasswordRequirement & { isValid: boolean })[]>([
    {
      id: "length",
      text: "Pelo menos 6 caracteres",
      validator: (password: string) => password.length >= 6,
      isValid: false,
    },
    {
      id: "uppercase",
      text: "Pelo menos uma letra maiúscula",
      validator: (password: string) => /[A-Z]/.test(password),
      isValid: false,
    },
    {
      id: "number",
      text: "Pelo menos um número",
      validator: (password: string) => /[0-9]/.test(password),
      isValid: false,
    },
    {
      id: "special",
      text: "Pelo menos um caractere especial",
      validator: (password: string) => /[^A-Za-z0-9]/.test(password),
      isValid: false,
    },
  ]);

  const [strength, setStrength] = useState(0);

  useEffect(() => {
    if (!password) {
      setRequirements(requirements.map(req => ({ ...req, isValid: false })));
      setStrength(0);
      return;
    }

    const newRequirements = requirements.map(req => ({
      ...req,
      isValid: req.validator(password),
    }));

    setRequirements(newRequirements);
    
    const validCount = newRequirements.filter(req => req.isValid).length;
    setStrength(validCount / newRequirements.length);
  }, [password]);

  const getStrengthColor = () => {
    if (strength <= 0.25) return "bg-red-500";
    if (strength <= 0.5) return "bg-orange-500";
    if (strength <= 0.75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (strength <= 0.25) return "Fraca";
    if (strength <= 0.5) return "Moderada";
    if (strength <= 0.75) return "Boa";
    return "Forte";
  };

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md"
    >
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Força da senha: {getStrengthText()}
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {Math.round(strength * 100)}%
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength * 100}%` }}
            className={`h-full rounded-full ${getStrengthColor()}`}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        {requirements.map((req) => (
          <div key={req.id} className="flex items-center gap-2">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: req.isValid ? '#10b981' : '#6b7280',
                borderColor: req.isValid ? '#10b981' : '#6b7280',
              }}
              className="w-4 h-4 rounded-full flex items-center justify-center border"
            >
              {req.isValid && (
                <motion.svg
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-2 h-2 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}
            </motion.div>
            <span className={`text-xs ${req.isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PasswordValidator; 