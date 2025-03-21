const TechCard = ({ title, icon }: { title: string, icon: React.ReactNode }) => {
    return (
        <div className="relative p-3 rounded-2xl bg-white/10 dark:bg-gray-800/20 
            border border-white/20 dark:border-gray-800/30 
            shadow-lg shadow-black/5 dark:shadow-black/20 
            overflow-hidden flex items-center justify-center flex-col gap-3
            transition-all ease-in-out duration-300 group
            hover:bg-white/20 dark:hover:bg-gray-700/30 
            hover:scale-105 
            hover:border-white/30 dark:hover:border-gray-600/50 
            hover:shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 
                dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute -inset-x-2 -inset-y-4 bg-gradient-to-b from-blue-500/20 to-transparent 
                dark:from-blue-400/10 dark:to-transparent 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex flex-col items-center gap-2 z-10">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl
                    bg-gray-100/30 dark:bg-gray-700/30 
                    text-gray-700 dark:text-gray-200
                    group-hover:text-blue-500 dark:group-hover:text-blue-400 
                    transform group-hover:rotate-6 transition-all duration-300 text-xl">
                    {icon}
                </div>

                <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300
                    group-hover:text-blue-500 dark:group-hover:text-blue-400">
                    {title}
                </h2>
            </div>
        </div>
    );
};

export default TechCard;
