import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedElement } from '../animation/AnimatedElement';

export const MetricsLoader: React.FC = () => {
  return (
    <AnimatedElement 
      animation="popup"
      className="h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col items-center">
        <div className="relative">
          <motion.div 
            className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500"
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1, 
              ease: "linear" 
            }}
          />

          <motion.div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
        </div>
        
        <div className="mt-6 flex flex-col items-center">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Carregando métricas
          </p>
          
          <div className="mt-2 flex space-x-1">
            <motion.div 
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.div 
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </div>
        </div>
        
        <div className="mt-8 max-w-md text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Estamos coletando dados de todos os serviços do sistema. Isso pode levar alguns segundos.</p>
        </div>
      </div>
    </AnimatedElement>
  );
};
