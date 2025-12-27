import { useState } from 'react';
import { Expense, expenseCategories, calculateTotalExpenses, calculateRemainingBalance, getSpendingSuggestions } from '../utils/budgetLogic';

type Language = 'en' | 'hi' | 'ta';

interface BudgetCalculatorProps {
  language: Language;
}

const translations = {
  en: {
    title: '💰 Budget Calculator',
    monthlyIncome: 'Monthly Income',
    enterIncome: 'Enter your monthly income',
    addExpense: 'Add Expense',
    amount: 'Amount',
    description: 'Description',
    addButton: 'Add Expense',
    yourExpenses: 'Your Expenses',
    remove: 'Remove',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    remainingBalance: 'Remaining Balance',
    smartSuggestions: '💡 Smart Suggestions',
    categories: {
      'Food & Dining': 'Food & Dining',
      'Transportation': 'Transportation',
      'Housing': 'Housing',
      'Entertainment': 'Entertainment',
      'Healthcare': 'Healthcare',
      'Shopping': 'Shopping',
      'Utilities': 'Utilities',
      'Education': 'Education',
      'Other': 'Other'
    }
  },
  hi: {
    title: '💰 बजट कैलकुलेटर',
    monthlyIncome: 'मासिक आय',
    enterIncome: 'अपनी मासिक आय दर्ज करें',
    addExpense: 'खर्च जोड़ें',
    amount: 'राशि',
    description: 'विवरण',
    addButton: 'खर्च जोड़ें',
    yourExpenses: 'आपके खर्चे',
    remove: 'हटाएं',
    totalIncome: 'कुल आय',
    totalExpenses: 'कुल खर्च',
    remainingBalance: 'शेष राशि',
    smartSuggestions: '💡 स्मार्ट सुझाव',
    categories: {
      'Food & Dining': 'भोजन और डाइनिंग',
      'Transportation': 'परिवहन',
      'Housing': 'आवास',
      'Entertainment': 'मनोरंजन',
      'Healthcare': 'स्वास्थ्य देखभाल',
      'Shopping': 'खरीदारी',
      'Utilities': 'उपयोगिताएँ',
      'Education': 'शिक्षा',
      'Other': 'अन्य'
    }
  },
  ta: {
    title: '💰 பட்ஜெட் கால்குலேட்டர்',
    monthlyIncome: 'மாதாந்திர வருமானம்',
    enterIncome: 'உங்கள் மாதாந்திர வருமானத்தை உள்ளிடவும்',
    addExpense: 'செலவைச் சேர்க்கவும்',
    amount: 'தொகை',
    description: 'விளக்கம்',
    addButton: 'செலவைச் சேர்க்கவும்',
    yourExpenses: 'உங்கள் செலவுகள்',
    remove: 'அகற்று',
    totalIncome: 'மொத்த வருமானம்',
    totalExpenses: 'மொத்த செலவுகள்',
    remainingBalance: 'மீதமுள்ள தொகை',
    smartSuggestions: '💡 ஸ்மார்ட் பரிந்துரைகள்',
    categories: {
      'Food & Dining': 'உணவு மற்றும் உணவருந்துதல்',
      'Transportation': 'போக்குவரத்து',
      'Housing': 'வீடு',
      'Entertainment': 'பொழுதுபோக்கு',
      'Healthcare': 'சுகாதாரம்',
      'Shopping': 'ஷாப்பிங்',
      'Utilities': 'பயன்பாடுகள்',
      'Education': 'கல்வி',
      'Other': 'மற்றவை'
    }
  }
};

const BudgetCalculator = ({ language }: BudgetCalculatorProps) => {
  const [income, setIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: expenseCategories[0],
    amount: 0,
    description: ''
  });

  const t = translations[language];
  const totalExpenses = calculateTotalExpenses(expenses);
  const remainingBalance = calculateRemainingBalance(income, totalExpenses);
  const suggestions = getSpendingSuggestions(income, remainingBalance);

  const addExpense = () => {
    if (newExpense.amount > 0 && newExpense.description.trim()) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: newExpense.amount,
        description: newExpense.description
      };
      setExpenses([...expenses, expense]);
      setNewExpense({
        category: expenseCategories[0],
        amount: 0,
        description: ''
      });
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        {t.title}
      </h1>

      <div className="mb-6 p-4 bg-green-50 rounded-lg">
        <label className="block text-lg font-semibold mb-2 text-green-800">
          {t.monthlyIncome}
        </label>
        <input
          type="number"
          value={income || ''}
          onChange={(e) => setIncome(Number(e.target.value) || 0)}
          placeholder={t.enterIncome}
          className="w-full p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">{t.addExpense}</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newExpense.category}
            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
            className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {expenseCategories.map(category => (
              <option key={category} value={category}>
                {t.categories[category as keyof typeof t.categories]}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={newExpense.amount || ''}
            onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value) || 0})}
            placeholder={t.amount}
            className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
            placeholder={t.description}
            className="p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addExpense}
            className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            {t.addButton}
          </button>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.yourExpenses}</h2>
          <div className="space-y-2">
            {expenses.map(expense => (
              <div key={expense.id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                <div>
                  <span className="font-semibold text-gray-800">
                    {t.categories[expense.category as keyof typeof t.categories]}
                  </span>
                  <span className="text-gray-600 ml-2">- {expense.description}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-red-600">₹{expense.amount}</span>
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    {t.remove}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 bg-green-100 rounded-lg text-center">
          <h3 className="font-semibold text-green-800">{t.totalIncome}</h3>
          <p className="text-2xl font-bold text-green-600">₹{income}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg text-center">
          <h3 className="font-semibold text-red-800">{t.totalExpenses}</h3>
          <p className="text-2xl font-bold text-red-600">₹{totalExpenses}</p>
        </div>
        <div className={`p-4 rounded-lg text-center ${remainingBalance >= 0 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
          <h3 className={`font-semibold ${remainingBalance >= 0 ? 'text-blue-800' : 'text-yellow-800'}`}>
            {t.remainingBalance}
          </h3>
          <p className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-blue-600' : 'text-yellow-600'}`}>
            ₹{remainingBalance}
          </p>
        </div>
      </div>

      {income > 0 && (
        <div className="p-4 bg-purple-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-3 text-purple-800">{t.smartSuggestions}</h2>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-purple-700 bg-white p-3 rounded-md shadow-sm">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BudgetCalculator;