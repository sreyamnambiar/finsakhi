import { motion } from 'framer-motion';
import { Flame, Zap, Star } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';

export const StatsBar = () => {
  const { t } = useTranslation();
  const { progress } = useAppStore();

  const stats = [
    {
      icon: Flame,
      value: progress.streak,
      label: t('dashboard.streak'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Zap,
      value: progress.xp,
      label: t('dashboard.xp'),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Star,
      value: progress.level,
      label: t('dashboard.level'),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-3 gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="glass-card rounded-2xl p-4 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-2`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className="font-bold text-xl text-foreground">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};
