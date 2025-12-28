import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Smartphone, FileText, Mic, Trophy, Briefcase } from 'lucide-react';
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
    <div className="min-h-screen pb-24 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <motion.header
        className="px-6 pt-8 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <FinSakhiMascot size="sm" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              {t('dashboard.greeting')}
            </h1>
            <p className="text-gray-600 text-sm mt-1">{t('app.tagline')}</p>
          </div>
        </div>
      </motion.header>

      {/* Stats */}
      <div className="px-6 mb-8">
        <StatsBar />
      </div>

      {/* Daily Goal */}
      <motion.div
        className="mx-6 mb-8 p-5 rounded-3xl bg-white shadow-lg border border-pink-100"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <p className="text-sm font-semibold text-pink-600 mb-1">{t('dashboard.dailyGoal')}</p>
          <p className="font-bold text-gray-800 text-lg">{t('dashboard.goalText')}</p>
        </div>
      </motion.div>

      {/* Action Cards */}
      <div className="px-6 space-y-5">
        <h2 className="font-bold text-xl text-gray-800 mb-4">{t('dashboard.nextStep')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ActionCard
            title="Voice Assistant"
            description="Talk to FinSakhi with your voice"
            icon={Mic}
            variant="primary"
            onClick={() => navigate('/voice')}
            delay={0.25}
          />
          
          <ActionCard
            title="Quiz & Rewards"
            description="Test knowledge, earn badges"
            icon={Trophy}
            variant="primary"
            onClick={() => navigate('/quiz')}
            delay={0.3}
          />

          <ActionCard
            title="Livelihood Match"
            description="Find work that fits your skills"
            icon={Briefcase}
            variant="primary"
            onClick={() => navigate('/livelihoods')}
            delay={0.35}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            onClick={() => navigate('/simulations')}
            delay={0.5}
          />
          <ActionCard
            title={t('dashboard.govtSchemes')}
            description={t('dashboard.schemesDesc')}
            icon={FileText}
            variant="success"
            onClick={() => navigate('/schemes')}
            delay={0.6}
          />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
