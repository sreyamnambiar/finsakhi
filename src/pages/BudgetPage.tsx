import { useState } from 'react';
import BudgetCalculator from '../components/BudgetCalculator';

type Language = 'en' | 'hi' | 'ta';

const BudgetPage = () => {
  const [language, setLanguage] = useState<Language>('en');

  const translations = {
    en: { selectLanguage: 'Select Language' },
    hi: { selectLanguage: 'भाषा चुनें' },
    ta: { selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <div className="bg-white p-3 rounded-lg shadow-md">
            <label className="mr-3 font-semibold text-gray-700">
              {translations[language].selectLanguage}:
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>

        <BudgetCalculator language={language} />
      </div>
    </div>
  );
};

export default BudgetPage;