import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Volume2, Mic, ShieldCheck, ChevronRight } from 'lucide-react';
import { FinSakhiMascot } from '@/components/FinSakhiMascot';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const Onboarding = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { settings, setVoiceMode, setReadAloud, setLearningLevel, completeOnboarding } = useAppStore();

  const handleComplete = () => {
    completeOnboarding();
    navigate('/');
  };

  const steps = [
    // Language Selection
    <motion.div key="lang" className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center">
        <FinSakhiMascot size="lg" mood="happy" />
        <h1 className="text-3xl font-bold text-foreground mt-6">{t('onboarding.welcome')}</h1>
        <p className="text-muted-foreground mt-2">{t('onboarding.subtitle')}</p>
      </div>
      <div>
        <p className="font-semibold text-foreground mb-4 text-center">{t('onboarding.chooseLanguage')}</p>
        <LanguageSelector variant="buttons" />
      </div>
    </motion.div>,

    // Voice Settings
    <motion.div key="voice" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center mb-4">
          <Mic className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.voiceMode')}</h2>
      </div>
      
      <div className="space-y-4">
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Mic className="w-6 h-6 text-primary" />
            <div>
              <p className="font-semibold text-foreground">{t('onboarding.voiceMode')}</p>
              <p className="text-sm text-muted-foreground">{t('onboarding.voiceModeDesc')}</p>
            </div>
          </div>
          <Switch checked={settings.voiceMode} onCheckedChange={setVoiceMode} />
        </div>
        
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Volume2 className="w-6 h-6 text-secondary" />
            <div>
              <p className="font-semibold text-foreground">{t('onboarding.readAloud')}</p>
              <p className="text-sm text-muted-foreground">{t('onboarding.readAloudDesc')}</p>
            </div>
          </div>
          <Switch checked={settings.readAloud} onCheckedChange={setReadAloud} />
        </div>
      </div>
    </motion.div>,

    // Level Selection
    <motion.div key="level" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.level')}</h2>
      </div>
      
      <div className="space-y-4">
        {(['beginner', 'intermediate'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setLearningLevel(level)}
            className={cn(
              'w-full p-5 rounded-2xl text-left transition-all duration-200',
              settings.learningLevel === level
                ? 'gradient-primary text-primary-foreground shadow-medium'
                : 'bg-card border-2 border-border hover:border-primary'
            )}
          >
            <p className="font-bold text-lg">{t(`onboarding.${level}`)}</p>
            <p className={cn('text-sm mt-1', settings.learningLevel === level ? 'opacity-90' : 'text-muted-foreground')}>
              {t(`onboarding.${level}Desc`)}
            </p>
          </button>
        ))}
      </div>
    </motion.div>,

    // Privacy Warning
    <motion.div key="privacy" className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-destructive/10 mx-auto flex items-center justify-center mb-4">
          <ShieldCheck className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">{t('onboarding.privacyTitle')}</h2>
      </div>
      
      <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5">
        <p className="text-destructive font-medium leading-relaxed">{t('onboarding.privacyWarning')}</p>
      </div>
      
      <FinSakhiMascot size="md" mood="thinking" />
    </motion.div>,
  ];

  return (
    <div className="min-h-screen flex flex-col px-5 py-8">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((_, i) => (
          <div key={i} className={cn('w-2 h-2 rounded-full transition-all', i === step ? 'w-6 bg-primary' : 'bg-muted')} />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">{steps[step]}</div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {step > 0 && (
          <Button variant="outline" size="lg" onClick={() => setStep(step - 1)} className="flex-1">
            {t('common.back')}
          </Button>
        )}
        <Button
          variant="hero"
          size="lg"
          onClick={step === steps.length - 1 ? handleComplete : () => setStep(step + 1)}
          className="flex-1"
        >
          {step === steps.length - 1 ? t('onboarding.continue') : t('common.next')}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
