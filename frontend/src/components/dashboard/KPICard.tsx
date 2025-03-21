import { memo, useMemo } from 'react';
import formatCurrency from '../../utils/currency/formatCurrency';
import formatNumber from '../../utils/formatNumber';

interface KPICardProps {
    title: string;
    value: number;
    lastValue?: number;
    subtitle?: string;
    format?: (value: number) => string;
    icon?: React.ReactNode;
    loading?: boolean;
    isCurrency?: boolean;
    gradient?: string;
}

const KPICard = memo(({ 
    title, 
    value, 
    lastValue, 
    subtitle,
    format, 
    icon, 
    loading = false, 
    isCurrency = false, 
    gradient = "from-blue-500 to-indigo-500" 
}: KPICardProps) => {
    const formattedValue = useMemo(() => {
        if (format) return format(value);
        if (isCurrency) {
            if (value >= 1000) {
                return `R$ ${formatNumber(value)}`;
            }
            return formatCurrency(value);
        }
        return formatNumber(value);
    }, [value, format, isCurrency]);

    const percentageChange = useMemo(() => {
        if (lastValue === undefined || lastValue === 0) return null;
        return ((value - lastValue) / lastValue) * 100;
    }, [value, lastValue]);

    return (
        <div className="relative group">
            <div 
                className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 
                dark:from-gray-800/50 dark:to-gray-800/30 rounded-2xl blur-xl 
                group-hover:blur-2xl transition-all duration-300" 
            />
            <div className="relative bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 
                shadow-lg border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl 
                            bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                            {icon}
                        </div>
                        <div className="min-w-[120px]">
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {title}
                            </h3>
                            {loading ? (
                                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            ) : (
                                <>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
                                        {formattedValue}
                                    </p>
                                    {subtitle && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {subtitle}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    {percentageChange !== null && (
                        <div 
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs 
                                font-medium whitespace-nowrap ${
                                percentageChange >= 0 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                        >
                            <i className={`fas fa-${percentageChange >= 0 ? 'arrow-up' : 'arrow-down'}`} />
                            <span>{Math.abs(percentageChange).toFixed(1)}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

KPICard.displayName = 'KPICard';

export default KPICard;