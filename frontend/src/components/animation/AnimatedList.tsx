import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  delay = 0,
  stagger = 0.1
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};
