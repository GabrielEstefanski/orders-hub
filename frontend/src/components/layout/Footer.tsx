import { motion } from "framer-motion";

const socialLinks = [
  {
    name: 'LinkedIn',
    icon: 'fab fa-linkedin',
    url: 'https://linkedin.com/in/gabriel-braga-estefanski',
    color: 'hover:text-blue-600'
  },
  {
    name: 'GitHub',
    icon: 'fab fa-github',
    url: 'https://github.com/gabrielbragaestefanski',
    color: 'hover:text-gray-800 dark:hover:text-white'
  },
  {
    name: 'Email',
    icon: 'fas fa-envelope',
    url: 'mailto:gabrielbragaestefanski@gmail.com',
    color: 'hover:text-red-500'
  },
  {
    name: 'WhatsApp',
    icon: 'fab fa-whatsapp',
    url: 'https://wa.me/5547999999999',
    color: 'hover:text-green-500'
  }
];

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 border-t border-gray-200/50 dark:border-gray-700/50 mt-20"
    >
      <div className="max-w-8xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            >
              Orders Hub
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Desenvolvido por{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                Gabriel Braga Estefanski
              </span>
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs text-gray-500 dark:text-gray-500"
            >
              © {new Date().getFullYear()} Orders Hub. Todos os direitos reservados.
            </motion.p>
          </div>
          
          <div className="flex items-center gap-6">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`text-gray-500 dark:text-gray-400 transition-all duration-200 ${link.color} hover:shadow-lg`}
                title={link.name}
              >
                <i className={`${link.icon} text-2xl`} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;