interface FunctionalityCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
}

const FunctionalityCard = ({ title, description, icon }: FunctionalityCardProps) => {
    return (
        <div className="relative w-full h-44 p-6 rounded-2xl 
            backdrop-blur-2xl bg-white/10 dark:bg-gray-800/20 
            border border-white/20 dark:border-gray-800/30 
            shadow-lg shadow-black/5 dark:shadow-black/20 
            overflow-hidden transition-all ease-in-out duration-300 group
            hover:bg-white/20 dark:hover:bg-gray-700/30 
            hover:border-white/30 dark:hover:border-gray-600/50 
            hover:shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 
                dark:from-blue-400/5 dark:via-purple-400/5 dark:to-pink-400/5 
                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute -inset-x-4 -inset-y-8 bg-gradient-to-b from-blue-500/20 to-transparent 
                dark:from-blue-400/10 dark:to-transparent 
                opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />

            <div className="absolute -bottom-8 -right-8 w-48 h-48 
                bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20
                dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10
                rounded-full blur-2xl opacity-50 pointer-events-none
                group-hover:opacity-75 transition-opacity duration-500" />

            <div className="relative flex flex-col h-full z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl
                        bg-gray-100/30 dark:bg-gray-700/30 
                        text-gray-700 dark:text-gray-200
                        group-hover:text-blue-500 dark:group-hover:text-blue-400 
                        transform group-hover:rotate-6 transition-all duration-300 text-xl">
                        {icon}
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200
                        group-hover:text-blue-500 dark:group-hover:text-blue-400">
                        {title}
                    </h2>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 
                    group-hover:text-gray-700 dark:group-hover:text-gray-200
                    leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default FunctionalityCard;
