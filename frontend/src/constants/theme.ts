export const THEME = {
  colors: {
    primary: {
      gradient: 'from-blue-500 to-indigo-500',
      text: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500',
    },
    success: {
      gradient: 'from-emerald-500 to-teal-500',
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500',
    },
    warning: {
      gradient: 'from-amber-500 to-orange-500',
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
    },
    info: {
      gradient: 'from-purple-500 to-pink-500',
      text: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500',
    },
  },
  animations: {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    popup: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    },
  },
  transitions: {
    default: { duration: 0.3 },
    fast: { duration: 0.2 },
    slow: { duration: 0.5 },
  },
};
