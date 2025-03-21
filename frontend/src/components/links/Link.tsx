import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export function Link({ children, href, className = '' }: LinkProps) {
  const baseStyles = 'font-medium text-blue-600 hover:underline dark:text-blue-500';
  
  return (
    <RouterLink 
      to={href} 
      className={`${baseStyles} ${className}`}
    >
      {children}
    </RouterLink>
  );
}
