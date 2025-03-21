import { ReactNode, useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  customContent?: ReactNode;
  className?: string;
  clickable?: boolean;
  transparent?: boolean;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const Tooltip = ({ 
  children, 
  content, 
  position = 'top', 
  clickable = false, 
  customContent, 
  className = '', 
  transparent = false,
  isOpen: externalIsOpen,
  onToggle
}: TooltipProps) => {
  const [internalIsVisible, setInternalIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const isControlled = externalIsOpen !== undefined && onToggle !== undefined;
  const isVisible = isControlled ? externalIsOpen : internalIsVisible;

  const updateVisibility = (visible: boolean) => {
    if (isControlled) {
      onToggle(visible);
    } else {
      setInternalIsVisible(visible);
    }
  };

  useEffect(() => {
    if (!isVisible || !clickable) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        childrenRef.current &&
        !childrenRef.current.contains(event.target as Node)
      ) {
        updateVisibility(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, clickable, isControlled]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (isMobile && !clickable) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    updateVisibility(true);
  };

  const handleMouseLeave = () => {
    if (clickable) return;
    
    timeoutRef.current = setTimeout(() => {
      updateVisibility(false);
    }, 100);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!clickable) return;
    
    e.stopPropagation();
    updateVisibility(!isVisible);
  };

  const getPositionStyles = () => {
    if (isMobile) {
      return 'left-1/2 -translate-x-1/2 top-full mt-2';
    }

    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
    }
  };

  const tooltipAnimation = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.15 }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      ref={childrenRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          className={`fixed sm:absolute z-[999] ${getPositionStyles()}`}
          initial={tooltipAnimation.initial}
          animate={tooltipAnimation.animate}
          exit={tooltipAnimation.exit}
          transition={tooltipAnimation.transition}
        >
          <div className="relative">
            <div className={`px-3 py-2 text-sm font-medium rounded-lg shadow-lg
              ${isMobile ? 'w-[calc(100vw-32px)] max-w-md' : 'max-w-sm'}
              ${transparent 
                ? 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-900 dark:text-white border border-white/20 dark:border-gray-700/20' 
                : 'bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm text-white'}`}
            >
              {content}
              {customContent}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Tooltip;