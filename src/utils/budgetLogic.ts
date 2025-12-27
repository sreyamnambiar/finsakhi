export interface Expense {
    id: string;
    category: string;
    amount: number;
    description: string;
  }
  
  export const expenseCategories = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Utilities',
    'Education',
    'Other'
  ];
  
  export const calculateTotalExpenses = (expenses: Expense[]): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };
  
  export const calculateRemainingBalance = (income: number, totalExpenses: number): number => {
    return income - totalExpenses;
  };
  
  export const getSpendingSuggestions = (income: number, remainingBalance: number): string[] => {
    const suggestions: string[] = [];
    const percentageLeft = (remainingBalance / income) * 100;
  
    if (remainingBalance < 0) {
      suggestions.push("⚠️ You're overspending! Consider reducing expenses.");
      suggestions.push("💡 Review your largest expense categories for potential cuts.");
    } else if (percentageLeft < 10) {
      suggestions.push("⚡ You're close to your budget limit. Be cautious with spending.");
      suggestions.push("💰 Consider setting aside emergency funds.");
    } else if (percentageLeft < 30) {
      suggestions.push("✅ Good budget management! You're on track.");
      suggestions.push("📈 Consider investing your remaining balance.");
    } else {
      suggestions.push("🎉 Excellent! You have plenty of room in your budget.");
      suggestions.push("💎 Consider increasing your savings or investments.");
      suggestions.push("🎯 You could allocate more to long-term goals.");
    }
  
    return suggestions;
  };