interface PickGroupByDateProps {
  onChange: (value: string) => void;
  currentFilter: string;
}

const PickGroupByDate = ({ onChange, currentFilter }: PickGroupByDateProps) => {
  const options = [
    { value: 'TUDO', label: 'Máximo', icon: 'fa-infinity' },
    { value: 'ANO', label: '1 Ano', icon: 'fa-calendar-days' },
    { value: 'MES', label: '1 Mês', icon: 'fa-calendar' }
  ];

  return (
    <div className="flex items-center">
      <div className="hidden lg:flex bg-white/80 dark:bg-gray-800/80 rounded-xl p-1 shadow-lg
        border border-white/20 dark:border-gray-700/20">
        {options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${currentFilter === option.value 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/50'
              }
              ${index !== options.length - 1 ? 'mr-1' : ''}`}
          >
            <i className={`fa ${option.icon} text-xs`} />
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      <div className="lg:hidden">
        <select
          value={currentFilter}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white/80 dark:bg-gray-800/80 rounded-lg px-3 py-2 text-sm
            border border-white/20 dark:border-gray-700/20 shadow-lg
            text-gray-900 dark:text-white"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PickGroupByDate;
