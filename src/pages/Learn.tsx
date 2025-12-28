import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { FinSakhiMascot } from '@/components/FinSakhiMascot';
import { BottomNav } from '@/components/BottomNav';

interface Module {
  id: number;
  title: string;
  description: string;
  color: string;
}

const modules: Module[] = [
  {
    id: 1,
    title: 'Saving Money - Overview',
    description: 'Learn effective saving strategies',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    title: 'UPI Transaction',
    description: 'Digital payment made easy',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 3,
    title: 'Home Loan Process',
    description: 'Step-by-step guide to home loans',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 4,
    title: 'How to open a bank account',
    description: 'Easy account opening process',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 5,
    title: 'What is a Secured Credit Card and how does it work?',
    description: 'Build your credit with secured cards',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 6,
    title: 'What is a Mutual Fund - Overview',
    description: 'Invest in mutual funds wisely',
    color: 'from-red-500 to-red-600',
  },
];

const Learn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header */}
      <motion.header
        className="px-6 pt-8 pb-6 flex items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/50 rounded-lg transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-800" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Learn
          </h1>
          <p className="text-sm text-gray-600">Watch videos & read tips</p>
        </div>
      </motion.header>

      {/* Modules List */}
      <div className="px-6 space-y-4">
        {modules.map((module, idx) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(`/learn/${module.id}`)}
            className="cursor-pointer group"
          >
            <div
              className={`bg-gradient-to-r ${module.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {module.title}
                  </h3>
                  <p className="text-sm text-white/90">{module.description}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-white flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default Learn;