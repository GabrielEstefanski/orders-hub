import { motion } from 'framer-motion';
import formatNumber from '../../utils/formatNumber';

interface TooltipData {
  label?: string;
  value?: number | string;
  color?: string;
  subtitle?: string;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number | string) => string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  dataFormatter?: (payload: any) => TooltipData;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  dataFormatter 
}) => {
  if (!active || !payload || !payload.length || !dataFormatter) return null;

  const data = dataFormatter(payload[0].payload);

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
        {data.label && (
          <div className="flex items-center gap-2">
            {data.color && (
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: data.color }}
              />
            )}
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {data.label}
            </span>
          </div>
        )}
        
        <span className="text-gray-700 dark:text-gray-200 font-medium">
          {data.prefix && <span>{data.prefix}</span>}
          {data.formatter ? data.formatter(data.value as number) : formatNumber(data.value as number)}
          {data.suffix && <span>{data.suffix}</span>}
        </span>
        
        {data.subtitle && (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            {data.subtitle}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default CustomTooltip;