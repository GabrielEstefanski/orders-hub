/**
 * @param milliseconds Tempo em milissegundos
 * @returns String formatada (ex: "2.5s" ou "150ms")
 */
export const formatTime = (milliseconds: number): string => {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(0)}ms`;
  }
  
  const seconds = milliseconds / 1000;
  if (seconds < 60) {
    return `${seconds.toFixed(2)}s`;
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return `${hours}h ${remainingMinutes}m ${remainingSeconds.toFixed(0)}s`;
};

/**
 * @param seconds Tempo em segundos
 * @returns String formatada 
 */
export const formatTimeFromSeconds = (seconds: number): string => {
  return formatTime(seconds * 1000);
};
