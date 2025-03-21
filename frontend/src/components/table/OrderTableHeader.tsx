import { motion } from "framer-motion";

const TableHeader = ({ column, label, onSortChange, sortBy, descending }: { column: string; label: string; onSortChange: (column: string) => void; sortBy: string; descending: boolean }) => (
    <motion.th
      whileHover={{ backgroundColor: "rgba(var(--color-gray-200), 0.8)" }}
      className="px-6 py-4 cursor-pointer transition-all duration-200 whitespace-nowrap"
      onClick={() => onSortChange(column)}
    >
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <span>{label}</span>
        <div className="flex flex-col -space-y-1">
          <motion.i 
            className={`fas fa-chevron-up text-[0.6rem] ${
              sortBy === column && !descending 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-600'
            }`}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: sortBy === column ? 1 : 0.5,
              scale: sortBy === column && !descending ? 1.2 : 1
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.i 
            className={`fas fa-chevron-down text-[0.6rem] ${
              sortBy === column && descending 
                ? 'text-blue-500 dark:text-blue-400' 
                : 'text-gray-400 dark:text-gray-600'
            }`}
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: sortBy === column ? 1 : 0.5,
              scale: sortBy === column && descending ? 1.2 : 1
            }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </motion.th>
);

export default TableHeader;