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
  primary: 'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-200',
  secondary: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-purple-200',
  accent: 'bg-gradient-to-br from-rose-400 to-pink-400 text-white shadow-rose-200',
  success: 'bg-gradient-to-br from-fuchsia-500 to-pink-500 text-white shadow-fuchsia-200',
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
        'w-full p-6 rounded-2xl text-left transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-[0.98]',
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
          <p className="text-sm opacity-90 leading-snug">{description}</p>
        </div>
      </div>
    </motion.button>
  );
};
