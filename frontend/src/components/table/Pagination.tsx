import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getPageNumbers = () => {
    const delta = isMobile ? 0 : 1;
    const range = [];
    const rangeWithDots = [];

    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    const uniqueRange = [...new Set(range)];

    let l;
    for (const i of uniqueRange) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const NavButton = ({ onClick, disabled, icon }: { onClick: () => void; disabled: boolean; icon: string }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative min-w-[36px] h-9 flex items-center justify-center
        text-sm font-medium rounded-lg
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
        border border-gray-200/50 dark:border-gray-700/50
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100/80 dark:hover:bg-gray-700/80
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      disabled={disabled}
      onClick={onClick}
    >
      <i className={`fas ${icon} text-xs`} />
    </motion.button>
  );

  const PageButton = ({ page, isActive }: { page: number | string; isActive: boolean }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative min-w-[36px] h-9 flex items-center justify-center
        text-sm font-medium rounded-lg
        backdrop-blur-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        ${isActive
          ? "bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white border-transparent"
          : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
        }`}
      onClick={() => typeof page === 'number' && onPageChange(page)}
    >
      {page}
    </motion.button>
  );

  return (
    <nav className="flex items-center gap-1 max-w-full overflow-x-auto py-1 px-0.5">
      <NavButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        icon="fa-chevron-left"
      />

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`dots-${index}`} className="w-6 text-center text-gray-500 dark:text-gray-400">
              {page}
            </span>
          ) : (
            <PageButton
              key={`page-${index}`}
              page={page}
              isActive={currentPage === page}
            />
          )
        ))}
      </div>

      <NavButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        icon="fa-chevron-right"
      />
    </nav>
  );
};

export default Pagination;
