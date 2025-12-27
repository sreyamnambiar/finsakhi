import { motion } from 'framer-motion';

interface FinSakhiMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  mood?: 'happy' | 'thinking' | 'celebrating';
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-32 h-32',
  xl: 'w-48 h-48',
};

export const FinSakhiMascot = ({
  size = 'md',
  animate = true,
  mood = 'happy',
}: FinSakhiMascotProps) => {
  const getMoodEmoji = () => {
    switch (mood) {
      case 'thinking':
        return '🤔';
      case 'celebrating':
        return '🎉';
      default:
        return '😊';
    }
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} relative flex items-center justify-center`}
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full gradient-primary opacity-30 blur-xl"
        animate={
          animate
            ? {
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Main mascot container */}
      <motion.div
        className="relative w-full h-full rounded-full gradient-primary flex items-center justify-center shadow-elevated"
        animate={
          animate && mood === 'celebrating'
            ? {
                rotate: [-5, 5, -5],
              }
            : animate
            ? {
                y: [0, -4, 0],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Inner circle */}
        <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
          {/* Face */}
          <span className={`${size === 'sm' ? 'text-2xl' : size === 'md' ? 'text-4xl' : size === 'lg' ? 'text-6xl' : 'text-8xl'}`}>
            {getMoodEmoji()}
          </span>
        </div>

        {/* Decorative elements */}
        {mood === 'celebrating' && (
          <>
            <motion.div
              className="absolute -top-2 -right-2 text-xl"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-2 text-xl"
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⭐
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
