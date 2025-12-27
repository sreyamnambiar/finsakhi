import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  type: 'mic' | 'speaker';
  isActive?: boolean;
  isEnabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-16 h-16',
};

const iconSizes = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
};

export const VoiceButton = ({
  type,
  isActive = false,
  isEnabled = true,
  onClick,
  size = 'md',
  className,
}: VoiceButtonProps) => {
  const Icon = type === 'mic' 
    ? (isEnabled ? Mic : MicOff)
    : (isEnabled ? Volume2 : VolumeX);

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200',
        sizeClasses[size],
        isActive
          ? 'gradient-primary text-primary-foreground shadow-medium'
          : isEnabled
          ? 'bg-card border-2 border-primary text-primary hover:bg-primary/10'
          : 'bg-muted text-muted-foreground border-2 border-border',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
      transition={isActive ? { duration: 1, repeat: Infinity } : {}}
    >
      <Icon className={iconSizes[size]} />
      
      {/* Pulse ring when active */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};
