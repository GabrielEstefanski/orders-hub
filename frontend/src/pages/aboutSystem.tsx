import FunctionalityCard from "../components/ui/FunctionalityCard";
import TechCard from "../components/ui/TechCard";
import { motion } from "framer-motion";

const AboutSystemPage = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={container}
            className="min-h-screen"
        >
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 
                    dark:from-blue-500/[0.03] dark:via-purple-500/[0.03] dark:to-pink-500/[0.03] backdrop-blur-sm" />
                
                <div className="relative max-w-5xl mx-auto text-center px-6 py-24">
                    <motion.div
                        variants={item}
                        className="inline-block mb-6 p-2 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
                            border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                    >
                        <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 
                            dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent px-3">
                            Sistema de Gerenciamento de Pedidos
                        </span>
                    </motion.div>

                    <motion.h1 
                        variants={item}
                        className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8
                            bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600
                            dark:from-blue-400 dark:via-purple-400 dark:to-pink-400
                            bg-clip-text text-transparent"
                    >
                        Orders Hub
                    </motion.h1>

                    <motion.p 
                        variants={item}
                        className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-12
                            bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6
                            border border-gray-200/50 dark:border-gray-700/50"
                    >
                        Uma plataforma moderna para gerenciar pedidos em tempo real, com atualização automática 
                        de status e suporte a grandes volumes de dados. Múltiplos usuários podem adicionar, 
                        editar e remover itens dinamicamente, além de acompanhar KPIs por meio de dashboards interativos.
                    </motion.p>

                    <motion.div 
                        variants={item}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <a href="https://github.com/GabrielEstefanski/orders-hub" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                                bg-gradient-to-r from-blue-600 to-purple-600 
                                hover:from-blue-700 hover:to-purple-700
                                text-white font-medium
                                transform hover:scale-105 transition-all duration-200
                                shadow-lg shadow-blue-500/25 hover:shadow-xl"
                        >
                            <i className="fab fa-github text-xl" />
                            <span>Ver no GitHub</span>
                        </a>
                        <a href="#demo" 
                           className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                                bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
                                text-gray-900 dark:text-white font-medium
                                border border-gray-200/50 dark:border-gray-700/50
                                hover:bg-gray-50 dark:hover:bg-gray-700/50
                                transform hover:scale-105 transition-all duration-200
                                shadow-lg hover:shadow-xl"
                        >
                            <i className="fas fa-play text-xl" />
                            <span>Ver Demo</span>
                        </a>
                    </motion.div>
                </div>
                
                <div className="absolute -top-20 -right-20 w-96 h-96 
                    bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20
                    dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10
                    rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 
                    bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20
                    dark:from-pink-400/10 dark:via-purple-400/10 dark:to-blue-400/10
                    rounded-full blur-3xl animate-pulse" />
            </div>

            <motion.div 
                variants={item}
                className="relative max-w-5xl mx-auto px-6 py-24"
            >
                <div className="flex flex-col items-center text-center mb-12">
                    <span className="inline-block px-4 py-2 rounded-xl bg-blue-500/10 dark:bg-blue-400/10
                        text-blue-600 dark:text-blue-400 font-medium mb-3">
                        TECNOLOGIAS UTILIZADAS
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 
                        dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Stack Tecnológica
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                        Construído com tecnologias modernas e robustas para garantir escalabilidade,
                        performance e uma excelente experiência do usuário.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <TechCard 
                        icon={<i className="fa fa-atom text-blue-500 dark:text-blue-400" />} 
                        title="React + TS" 
                    />
                    <TechCard 
                        icon={<i className="fa fa-cube text-purple-500 dark:text-purple-400" />} 
                        title=".NET Core" 
                    />
                    <TechCard 
                        icon={<i className="fa fa-share-nodes text-orange-500 dark:text-orange-400" />} 
                        title="RabbitMQ" 
                    />
                    <TechCard 
                        icon={<i className="fa fa-bolt text-yellow-500 dark:text-yellow-400" />} 
                        title="WebSockets" 
                    />
                    <TechCard 
                        icon={<i className="fa fa-database text-red-500 dark:text-red-400" />} 
                        title="Redis" 
                    />
                    <TechCard 
                        icon={<i className="fab fa-docker text-blue-600 dark:text-blue-500" />} 
                        title="Docker" 
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {['Nginx', 'Grafana', 'Prometheus', 'Entity Framework'].map((tech) => (
                        <span key={tech} className="px-4 py-2 rounded-xl text-sm
                            bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
                            border border-gray-200/50 dark:border-gray-700/50
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-50 dark:hover:bg-gray-700/50
                            transition-all duration-200">
                            {tech}
                        </span>
                    ))}
                </div>
            </motion.div>

            <motion.div 
                variants={item}
                className="relative max-w-7xl mx-auto px-6 py-24 
                    bg-white/80 dark:bg-gray-800/80 rounded-3xl mb-24
                    border border-gray-200/50 dark:border-gray-700/50
                    shadow-xl"
            >
                <div className="flex flex-col items-center text-center mb-12">
                    <span className="inline-block px-4 py-2 rounded-xl bg-purple-500/10 dark:bg-purple-400/10
                        text-purple-600 dark:text-purple-400 font-medium mb-3">
                        FUNCIONALIDADES
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 
                        dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
                        Recursos Principais
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                        Um conjunto completo de funcionalidades para gerenciar seus pedidos
                        de forma eficiente e escalável.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FunctionalityCard
                        icon={<i className="fa fa-sync-alt text-blue-500 dark:text-blue-400" />}
                        title="Tempo Real"
                        description="Acompanhe as atualizações de pedidos em tempo real, sem precisar recarregar a página, garantindo informações sempre atualizadas."
                    />
                    <FunctionalityCard
                        icon={<i className="fa fa-tachometer-alt text-purple-500 dark:text-purple-400" />}
                        title="Alta Performance"
                        description="Arquitetura otimizada para lidar com grandes volumes de dados, garantindo resposta rápida mesmo em operações complexas."
                    />
                    <FunctionalityCard
                        icon={<i className="fa fa-users text-green-500 dark:text-green-400" />}
                        title="Multi-usuário"
                        description="Suporte a múltiplos usuários trabalhando simultaneamente, com atualizações em tempo real e controle de conflitos."
                    />
                    <FunctionalityCard
                        icon={<i className="fa fa-chart-line text-yellow-500 dark:text-yellow-400" />}
                        title="Analytics"
                        description="Dashboards interativos com KPIs e métricas importantes para tomada de decisão baseada em dados."
                    />
                    <FunctionalityCard
                        icon={<i className="fa fa-shield-alt text-red-500 dark:text-red-400" />}
                        title="Segurança"
                        description="Sistema robusto de autenticação e autorização, garantindo que cada usuário acesse apenas os recursos permitidos."
                    />
                    <FunctionalityCard
                        icon={<i className="fa fa-clock text-indigo-500 dark:text-indigo-400" />}
                        title="Histórico"
                        description="Rastreamento completo de alterações e histórico de pedidos, permitindo auditoria e acompanhamento detalhado."
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AboutSystemPage;
