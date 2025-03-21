import { Variants } from 'framer-motion';

export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  } as Variants,
  
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  } as Variants,
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  } as Variants,
  
  popup: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  } as Variants,
  
  spin: {
    animate: { rotate: 360 },
    transition: { 
      repeat: Infinity, 
      duration: 1, 
      ease: "linear" 
    }
  } as Variants
};

export const TRANSITIONS = {
  default: { duration: 0.3 },
  fast: { duration: 0.2 },
  slow: { duration: 0.5 },
  staggerChildren: { staggerChildren: 0.1 },
  delayed: { delay: 0.2, duration: 0.3 }
};