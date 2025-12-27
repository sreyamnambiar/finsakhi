import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  delay?: number;
  className?: string;
}

const variantStyles = {
  primary: 'gradient-primary text-primary-foreground',
  secondary: 'gradient-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
  success: 'bg-success text-success-foreground',
};

export const ActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'primary',
  delay = 0,
  className,
}: ActionCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-2xl text-left transition-all duration-300 shadow-card hover:shadow-elevated active:scale-[0.98]',
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight">{title}</h3>
          <p className="text-sm opacity-90 mt-1 leading-snug">{description}</p>
        </div>
      </div>
    </motion.button>
  );
};
