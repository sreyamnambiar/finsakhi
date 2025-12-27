import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, BookOpen, Smartphone, CreditCard, FileText, Trophy } from 'lucide-react';
import { FinSakhiMascot } from '@/components/FinSakhiMascot';
import { StatsBar } from '@/components/StatsBar';
import { ActionCard } from '@/components/ActionCard';
import { BottomNav } from '@/components/BottomNav';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateStreak } = useAppStore();

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <motion.header
        className="px-5 pt-6 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <FinSakhiMascot size="sm" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('dashboard.greeting')}</h1>
            <p className="text-muted-foreground">{t('app.tagline')}</p>
          </div>
        </div>
      </motion.header>

      {/* Stats */}
      <div className="px-5 mb-6">
        <StatsBar />
      </div>

      {/* Daily Goal */}
      <motion.div
        className="mx-5 mb-6 p-4 rounded-2xl glass-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t('dashboard.dailyGoal')}</p>
            <p className="font-bold text-foreground">{t('dashboard.goalText')}</p>
          </div>
          <div className="text-3xl">🎯</div>
        </div>
      </motion.div>

      {/* Action Cards */}
      <div className="px-5 space-y-4">
        <h2 className="font-bold text-lg text-foreground mb-3">{t('dashboard.nextStep')}</h2>
        
        <ActionCard
          title={t('dashboard.talkToFinSakhi')}
          description={t('dashboard.talkDesc')}
          icon={MessageCircle}
          variant="primary"
          onClick={() => navigate('/tutor')}
          delay={0.3}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            title={t('dashboard.learnLessons')}
            description={t('dashboard.learnDesc')}
            icon={BookOpen}
            variant="secondary"
            onClick={() => navigate('/learn')}
            delay={0.4}
          />
          <ActionCard
            title={t('dashboard.practiceUPI')}
            description={t('dashboard.practiceDesc')}
            icon={Smartphone}
            variant="accent"
            onClick={() => navigate('/practice')}
            delay={0.5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ActionCard
            title={t('dashboard.govtSchemes')}
            description={t('dashboard.schemesDesc')}
            icon={FileText}
            variant="success"
            onClick={() => navigate('/schemes')}
            delay={0.6}
          />
          <ActionCard
            title={t('dashboard.quiz')}
            description={t('dashboard.quizDesc')}
            icon={Trophy}
            variant="primary"
            onClick={() => navigate('/learn')}
            delay={0.7}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
