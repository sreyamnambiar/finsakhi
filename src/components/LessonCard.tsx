import { motion } from 'framer-motion';
import { Check, Lock, Play } from 'lucide-react';
import { Lesson, getLessonContent } from '@/data/lessons';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

interface LessonCardProps {
  lesson: Lesson;
  index: number;
  isUnlocked: boolean;
  onClick?: () => void;
}

export const LessonCard = ({ lesson, index, isUnlocked, onClick }: LessonCardProps) => {
  const { settings, progress } = useAppStore();
  const content = getLessonContent(lesson, settings.language);
  const isCompleted = progress.completedLessons.includes(lesson.id);

  return (
    <motion.button
      onClick={isUnlocked ? onClick : undefined}
      disabled={!isUnlocked}
      className={cn(
        'w-full p-4 rounded-2xl text-left transition-all duration-300',
        isUnlocked
          ? 'bg-card shadow-card hover:shadow-elevated cursor-pointer'
          : 'bg-muted/50 cursor-not-allowed opacity-60'
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={isUnlocked ? { x: 4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
    >
      <div className="flex items-center gap-4">
        {/* Level badge */}
        <div
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
            isCompleted
              ? 'bg-success/20'
              : isUnlocked
              ? 'bg-primary/10'
              : 'bg-muted'
          )}
        >
          {isCompleted ? (
            <Check className="w-7 h-7 text-success" />
          ) : !isUnlocked ? (
            <Lock className="w-6 h-6 text-muted-foreground" />
          ) : (
            <span>{lesson.icon}</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'text-xs font-bold px-2 py-0.5 rounded-full',
              isCompleted
                ? 'bg-success/20 text-success'
                : 'bg-primary/10 text-primary'
            )}>
              Level {lesson.level}
            </span>
            <span className="text-xs text-muted-foreground">
              +{lesson.xpReward} XP
            </span>
          </div>
          <h3 className="font-bold text-foreground truncate">{content.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{content.description}</p>
        </div>

        {/* Action */}
        {isUnlocked && !isCompleted && (
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
            <Play className="w-5 h-5 text-primary-foreground fill-current" />
          </div>
        )}
      </div>
    </motion.button>
  );
};
