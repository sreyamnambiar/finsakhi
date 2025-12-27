import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SafetyBannerProps {
  variant?: 'warning' | 'info';
}

export const SafetyBanner = ({ variant = 'warning' }: SafetyBannerProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className={`rounded-xl p-4 flex items-start gap-3 ${
        variant === 'warning' 
          ? 'bg-destructive/10 border border-destructive/20' 
          : 'bg-info/10 border border-info/20'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ShieldAlert className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
        variant === 'warning' ? 'text-destructive' : 'text-info'
      }`} />
      <p className={`text-sm font-medium leading-relaxed ${
        variant === 'warning' ? 'text-destructive' : 'text-info'
      }`}>
        {t('tutor.safetyBanner')}
      </p>
    </motion.div>
  );
};
