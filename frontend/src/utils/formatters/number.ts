/**
 * Formata um número como porcentagem
 * @param value Valor decimal (0-1)
 * @param decimals Número de casas decimais
 * @returns String formatada com símbolo de porcentagem
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Formata um número com separadores de milhar
 * @param value Número a ser formatado
 * @param locale Localização para formatação (padrão: pt-BR)
 * @returns String formatada
 */
export const formatNumber = (value: number, locale: string = 'pt-BR'): string => {
  return new Intl.NumberFormat(locale).format(Number(value.toFixed(2)));
};

/**
 * Formata um valor monetário
 * @param value Valor a ser formatado
 * @param locale Localização para formatação (padrão: pt-BR)
 * @param currency Moeda (padrão: BRL)
 * @returns String formatada com símbolo da moeda
 */
export const formatCurrency = (
  value: number, 
  locale: string = 'pt-BR', 
  currency: string = 'BRL'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};

export const formatTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(0)}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
};
