import { motion } from 'framer-motion';
import { useAppStore, Language } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const languages: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
];

interface LanguageSelectorProps {
  variant?: 'buttons' | 'dropdown';
}

export const LanguageSelector = ({ variant = 'buttons' }: LanguageSelectorProps) => {
  const { settings, setLanguage } = useAppStore();
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  if (variant === 'buttons') {
    return (
      <div className="flex gap-3">
        {languages.map((lang, index) => (
          <motion.button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              'flex-1 py-4 px-4 rounded-2xl font-semibold text-center transition-all duration-200',
              settings.language === lang.code
                ? 'gradient-primary text-primary-foreground shadow-medium'
                : 'bg-card text-foreground border-2 border-border hover:border-primary'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-lg">{lang.nativeLabel}</div>
            <div className={cn(
              'text-xs mt-1',
              settings.language === lang.code ? 'opacity-80' : 'text-muted-foreground'
            )}>
              {lang.label}
            </div>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={settings.language}
      onChange={(e) => handleLanguageChange(e.target.value as Language)}
      className="bg-card border-2 border-border rounded-xl px-4 py-2 font-medium text-foreground focus:outline-none focus:border-primary"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeLabel}
        </option>
      ))}
    </select>
  );
};
