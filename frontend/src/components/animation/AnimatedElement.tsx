import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ANIMATIONS, TRANSITIONS } from '../../constants/animations';

type AnimationType = keyof typeof ANIMATIONS;
type TransitionType = keyof typeof TRANSITIONS;

interface AnimatedElementProps {
  children: React.ReactNode;
  animation?: AnimationType;
  customAnimation?: Variants;
  transition?: TransitionType;
  customTransition?: any;
  className?: string;
  delay?: number;
}

export const AnimatedElement: React.FC<AnimatedElementProps> = ({
  children,
  animation = 'fadeIn',
  customAnimation,
  transition = 'default',
  customTransition,
  className = '',
  delay = 0,
  ...props
}) => {
  const selectedAnimation = customAnimation || ANIMATIONS[animation];
  const selectedTransition = {
    ...TRANSITIONS[transition],
    delay,
    ...customTransition
  };

  return (
    <motion.div
      variants={selectedAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={selectedTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
