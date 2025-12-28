import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';

const fallbackQuestions = [
  { text: 'Why is saving money important?', options: [{ text: 'To spend more', isCorrect: false }, { text: 'For emergencies and future needs', isCorrect: true }, { text: 'To show others', isCorrect: false }, { text: 'To keep money idle', isCorrect: false }] },
  { text: 'Which is a good habit for saving money?', options: [{ text: 'Spending everything', isCorrect: false }, { text: 'Borrowing often', isCorrect: false }, { text: 'Saving a small amount regularly', isCorrect: true }, { text: 'Avoiding banks', isCorrect: false }] },
  { text: 'What is UPI mainly used for?', options: [{ text: 'Cooking food', isCorrect: false }, { text: 'Sending and receiving money digitally', isCorrect: true }, { text: 'Watching videos', isCorrect: false }, { text: 'Making phone calls', isCorrect: false }] },
  { text: 'Which device is needed to use UPI?', options: [{ text: 'Television', isCorrect: false }, { text: 'Radio', isCorrect: false }, { text: 'Mobile phone', isCorrect: true }, { text: 'Calculator', isCorrect: false }] },
  { text: 'What is a home loan used for?', options: [{ text: 'Buying clothes', isCorrect: false }, { text: 'Buying or building a house', isCorrect: true }, { text: 'Paying phone bills', isCorrect: false }, { text: 'Buying gold', isCorrect: false }] },
  { text: 'Who gives a home loan?', options: [{ text: 'Grocery shop', isCorrect: false }, { text: 'Bank or financial institution', isCorrect: true }, { text: 'School', isCorrect: false }, { text: 'Hospital', isCorrect: false }] },
  { text: 'What document is commonly needed to open a bank account?', options: [{ text: 'Movie ticket', isCorrect: false }, { text: 'ID proof (like Aadhaar)', isCorrect: true }, { text: 'Bus ticket', isCorrect: false }, { text: 'Newspaper', isCorrect: false }] },
  { text: 'Why do people open bank accounts?', options: [{ text: 'To keep money safe', isCorrect: true }, { text: 'To lose money', isCorrect: false }, { text: 'For decoration', isCorrect: false }, { text: 'For playing games', isCorrect: false }] },
  { text: 'What is required to get a secured credit card?', options: [{ text: 'Cash deposit as security', isCorrect: true }, { text: 'Gold ring', isCorrect: false }, { text: 'Phone number only', isCorrect: false }, { text: 'Passport', isCorrect: false }] },
  { text: 'What does a mutual fund do?', options: [{ text: 'Keeps money under the bed', isCorrect: false }, { text: 'Invests money in different places to grow it', isCorrect: true }, { text: 'Only stores money', isCorrect: false }, { text: 'Spends money', isCorrect: false }] },
];

const Quiz = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const translatedQuestions = useMemo(() => {
    if (!selectedLanguage) return [];
    const resources = i18n.getResourceBundle(selectedLanguage, 'translation');
    const questions = resources?.quiz?.questions;
    return questions || [];
  }, [selectedLanguage, i18n]);
  const quizQuestions = useMemo(() => {
    const questions = translatedQuestions?.length > 0 ? translatedQuestions : fallbackQuestions;
    
    // Normalize questions to have consistent format
    return questions.map((q: any, qIdx: number) => {
      // Get the correct answer index from fallback
      const fallbackQ = fallbackQuestions[qIdx];
      const correctIdx = fallbackQ.options.findIndex((opt: any) => opt.isCorrect);
      
      return {
        text: q.text,
        correctIndex: correctIdx,
        options: Array.isArray(q.options) ? q.options.map((opt: any) => 
          typeof opt === 'string' 
            ? { text: opt, isCorrect: false }
            : opt
        ) : []
      };
    });
  }, [translatedQuestions]);

  useEffect(() => {
    // Change i18n language and reset quiz when language changes
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
      setCurrentQuestion(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setQuizComplete(false);
    }
  }, [selectedLanguage]);

  const handleAnswerClick = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    const isCorrect = optionIndex === quizQuestions[currentQuestion].correctIndex;
    if (isCorrect) setScore(score + 1);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizComplete(false);
  };

  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-6">
        <motion.div className="text-center max-w-md" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('quiz.title')}</h1>
          <p className="text-xl text-gray-600 mb-12">Choose your preferred language</p>
          
          <div className="space-y-4">
            <motion.button
              onClick={() => changeLanguage('en')}
              className="w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl font-bold text-gray-800">English</div>
              <div className="text-sm text-gray-600 mt-2">Learn in English</div>
            </motion.button>

            <motion.button
              onClick={() => changeLanguage('hi')}
              className="w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl font-bold text-gray-800">हिंदी</div>
              <div className="text-sm text-gray-600 mt-2">हिंदी में सीखें</div>
            </motion.button>

            <motion.button
              onClick={() => changeLanguage('ta')}
              className="w-full p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl font-bold text-gray-800">தமிழ்</div>
              <div className="text-sm text-gray-600 mt-2">தமிழில் கற்றுக்கொள்ளவும்</div>
            </motion.button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="mt-8 text-gray-600 hover:text-gray-800 font-semibold transition"
          >
            ← Back to Dashboard
          </button>
        </motion.div>
        <BottomNav />
      </div>
    );
  }

  if (quizComplete) {
    const percentage = (score / quizQuestions.length) * 100;
    let badge = '🥇';
    let message = t('quiz.excellent');
    if (percentage >= 80) message = t('quiz.excellent');
    else if (percentage >= 60) { badge = '🥈'; message = t('quiz.good'); }
    else if (percentage >= 40) { badge = '🥉'; message = t('quiz.notBad'); }
    else { badge = '📚'; message = t('quiz.keepPracticing'); }

    return (
      <div className="min-h-screen pb-24 bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col items-center justify-center p-6">
        <motion.div className="text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-8xl mb-6">{badge}</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('quiz.quizComplete')}</h1>
          <div className="mb-6">
            <p className="text-6xl font-bold text-purple-600">{score}/{quizQuestions.length}</p>
            <p className="text-2xl text-gray-600 mt-2">{percentage.toFixed(0)}%</p>
          </div>
          <p className="text-xl text-gray-700 mb-8">{message}</p>
          <div className="space-y-4">
            <button onClick={resetQuiz} className="w-full max-w-sm bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition">{t('quiz.retakeQuiz')}</button>
            <button onClick={() => navigate('/')} className="w-full max-w-sm bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition">{t('quiz.goToDashboard')}</button>
          </div>
        </motion.div>
        <BottomNav />
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-blue-50 to-purple-50">
      <motion.header className="px-5 pt-6 pb-4 flex items-center justify-between relative z-40" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/')} className="p-2 hover:bg-muted rounded-lg transition"><ArrowLeft className="w-6 h-6 text-foreground" /></button>
        <div className="text-center flex-1">
          <h1 className="text-2xl font-bold text-foreground">{t('quiz.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {quizQuestions.length}</p>
        </div>
        <div className="w-8" />
      </motion.header>

      <div className="px-5 mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
            initial={{ width: 0 }} 
            animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }} 
            transition={{ duration: 0.5 }} 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentQuestion} className="px-5 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
          <h2 className="text-2xl font-bold text-foreground mb-8 leading-tight">{question.text}</h2>
          <div className="space-y-4 mb-8">
            {question.options.map((option: any, idx: number) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === question.correctIndex;
              let bgColor = 'bg-white hover:bg-gray-50';
              let borderColor = 'border-gray-200';
              if (isAnswered && isSelected) {
                bgColor = isCorrect ? 'bg-green-100' : 'bg-red-100';
                borderColor = isCorrect ? 'border-green-500' : 'border-red-500';
              } else if (isAnswered && !isSelected && isCorrect) {
                bgColor = 'bg-green-100';
                borderColor = 'border-green-500';
              }
              const optionText = typeof option === 'string' ? option : option.text;
              return (
                <motion.button 
                  key={idx} 
                  onClick={() => handleAnswerClick(idx)} 
                  className={`w-full p-4 border-2 rounded-lg text-left font-semibold transition flex items-center gap-4 ${bgColor} ${borderColor}`} 
                  disabled={isAnswered} 
                  whileHover={!isAnswered ? { scale: 1.02 } : {}} 
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                >
                  <span className="text-lg">{String.fromCharCode(65 + idx)}.</span>
                  <span className="flex-1">{optionText}</span>
                  {isAnswered && isSelected && (isCorrect ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />)}
                  {isAnswered && !isSelected && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {showResult && (
              <motion.div 
                className={`p-4 rounded-lg mb-6 ${selectedAnswer === question.correctIndex ? 'bg-green-100 border-2 border-green-500' : 'bg-red-100 border-2 border-red-500'}`} 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="font-bold text-lg">{selectedAnswer === question.correctIndex ? '✅ ' + t('quiz.correct') : '❌ ' + t('quiz.incorrect')}</p>
                <p className="text-sm mt-2">{selectedAnswer === question.correctIndex ? t('quiz.correct') : `${t('quiz.correctAnswer')} ${typeof question.options[question.correctIndex] === 'string' ? question.options[question.correctIndex] : question.options[question.correctIndex]?.text}`}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {isAnswered && (
            <motion.button onClick={handleNext} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {currentQuestion === quizQuestions.length - 1 ? t('quiz.seeResults') : t('quiz.next')}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="fixed top-20 right-5 bg-white rounded-lg shadow-lg p-4">
        <p className="text-sm text-muted-foreground">{t('quiz.score')}</p>
        <p className="text-3xl font-bold text-purple-600">{score}/{quizQuestions.length}</p>
      </div>
      <BottomNav />
    </div>
  );
};

export default Quiz;