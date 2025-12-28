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
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
    },
    {
      icon: Zap,
      value: progress.xp,
      label: t('dashboard.xp'),
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      icon: Star,
      value: progress.level,
      label: t('dashboard.level'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-3 gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="bg-white rounded-2xl p-5 text-center shadow-lg border border-pink-100"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="font-bold text-2xl text-gray-800">{stat.value}</div>
          <div className="text-xs text-gray-600 font-medium mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};
