import { motion } from 'framer-motion';
import { Home, BookOpen, Smartphone, FileText, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, labelKey: 'nav.home' },
  { path: '/learn', icon: BookOpen, labelKey: 'nav.learn' },
  { path: '/practice', icon: Smartphone, labelKey: 'nav.practice' },
  { path: '/schemes', icon: FileText, labelKey: 'nav.schemes' },
  { path: '/tutor', icon: MessageCircle, labelKey: 'nav.tutor' },
];

export const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -inset-2 rounded-xl bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={cn('w-6 h-6 relative z-10', isActive && 'text-primary')} />
              </div>
              <span className={cn('text-[10px] mt-1 font-medium', isActive && 'text-primary')}>
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};
