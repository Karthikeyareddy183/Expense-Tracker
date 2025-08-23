import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Lightbulb, Award, Target, Zap } from 'lucide-react';

const InsightsPanel = ({ expenses, monthlyData, formatCurrency }) => {
  // Calculate insights
  const insights = React.useMemo(() => {
    const insights = [];
    
    // Get current and previous month data
    const currentMonth = new Date().toISOString().slice(0, 7);
    const prevMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
    
    const currentExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    const prevExpenses = expenses.filter(e => e.date.startsWith(prevMonth));
    
    const currentTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
    const prevTotal = prevExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Spending trend
    if (prevTotal > 0) {
      const change = ((currentTotal - prevTotal) / prevTotal) * 100;
      if (change > 20) {
        insights.push({
          type: 'warning',
          icon: TrendingUp,
          title: 'Spending Increase Alert',
          description: `Your spending increased by ${change.toFixed(1)}% compared to last month.`,
          action: 'Review your expenses to identify areas to cut back.'
        });
      } else if (change < -10) {
        insights.push({
          type: 'success',
          icon: TrendingDown,
          title: 'Great Savings!',
          description: `You saved ${Math.abs(change).toFixed(1)}% compared to last month.`,
          action: 'Keep up the good spending habits!'
        });
      }
    }
    
    // Category analysis
    const categoryTotals = {};
    currentExpenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    
    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const topCategory = sortedCategories[0];
      const topPercentage = (topCategory[1] / currentTotal) * 100;
      
      if (topPercentage > 40) {
        insights.push({
          type: 'info',
          icon: AlertCircle,
          title: 'High Category Spending',
          description: `${topCategory[0]} accounts for ${topPercentage.toFixed(1)}% of your spending.`,
          action: 'Consider if this aligns with your financial goals.'
        });
      }
    }
    
    // Daily average
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const dailyAverage = currentTotal / daysInMonth;
    const currentDay = new Date().getDate();
    const projectedTotal = dailyAverage * daysInMonth;
    
    insights.push({
      type: 'neutral',
      icon: Zap,
      title: 'Spending Projection',
      description: `At current rate, you'll spend ${formatCurrency(projectedTotal)} this month.`,
      action: `Daily average: ${formatCurrency(dailyAverage)}`
    });
    
    // Weekend vs weekday spending
    const weekendExpenses = currentExpenses.filter(e => {
      const day = new Date(e.date).getDay();
      return day === 0 || day === 6;
    });
    const weekdayExpenses = currentExpenses.filter(e => {
      const day = new Date(e.date).getDay();
      return day > 0 && day < 6;
    });
    
    const weekendAvg = weekendExpenses.length > 0 ? 
      weekendExpenses.reduce((sum, e) => sum + e.amount, 0) / weekendExpenses.length : 0;
    const weekdayAvg = weekdayExpenses.length > 0 ?
      weekdayExpenses.reduce((sum, e) => sum + e.amount, 0) / weekdayExpenses.length : 0;
    
    if (weekendAvg > weekdayAvg * 1.5) {
      insights.push({
        type: 'info',
        icon: Lightbulb,
        title: 'Weekend Spending Pattern',
        description: 'You tend to spend more on weekends.',
        action: 'Plan weekend activities that align with your budget.'
      });
    }
    
    // Unusual expenses
    const avgExpense = currentTotal / currentExpenses.length;
    const unusualExpenses = currentExpenses.filter(e => e.amount > avgExpense * 3);
    
    if (unusualExpenses.length > 0) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'Unusual Expenses Detected',
        description: `${unusualExpenses.length} expense(s) significantly above average.`,
        action: 'Review large expenses to ensure they were necessary.'
      });
    }
    
    // Savings opportunity
    const foodExpenses = currentExpenses.filter(e => e.category === 'Food');
    const foodTotal = foodExpenses.reduce((sum, e) => sum + e.amount, 0);
    const foodCount = foodExpenses.length;
    
    if (foodCount > 15) {
      insights.push({
        type: 'tip',
        icon: Lightbulb,
        title: 'Dining Out Frequency',
        description: `You've eaten out ${foodCount} times this month.`,
        action: `Consider meal prep to save money. Potential savings: ${formatCurrency(foodTotal * 0.3)}`
      });
    }
    
    return insights;
  }, [expenses, monthlyData, formatCurrency]);

  // Achievement badges
  const achievements = React.useMemo(() => {
    const badges = [];
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
    
    // Frugal badge
    if (currentExpenses.filter(e => e.amount < 10).length > 10) {
      badges.push({
        name: 'Frugal Spender',
        description: 'Made 10+ small purchases',
        icon: '💰'
      });
    }
    
    // Consistent tracker
    const daysWithExpenses = new Set(currentExpenses.map(e => e.date)).size;
    if (daysWithExpenses > 20) {
      badges.push({
        name: 'Consistent Tracker',
        description: 'Logged expenses for 20+ days',
        icon: '📊'
      });
    }
    
    // Budget conscious
    const hasAllBudgets = monthlyData.byCategory && Object.values(monthlyData.byCategory).every(v => v > 0);
    if (hasAllBudgets) {
      badges.push({
        name: 'Budget Conscious',
        description: 'Active in all categories',
        icon: '🎯'
      });
    }
    
    return badges;
  }, [expenses, monthlyData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Smart Insights</h2>
        </div>
        <p className="text-purple-100">
          AI-powered analysis of your spending patterns and personalized recommendations
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Spending Score</span>
            <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {Math.max(0, 100 - (monthlyData.change || 0)).toFixed(0)}
            </span>
            <span className="text-sm text-gray-500">/100</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, 100 - (monthlyData.change || 0))}%` }}
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</span>
            <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {Math.max(0, monthlyData.change < 0 ? Math.abs(monthlyData.change) : 0).toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Compared to last month
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Tracker Streak</span>
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {new Set(expenses.map(e => e.date)).size}
            </span>
            <span className="text-sm text-gray-500">days</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Keep tracking daily!
          </p>
        </motion.div>
      </div>

      {/* Insights Cards */}
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 ${
              insight.type === 'warning' ? 'border-l-yellow-500' :
              insight.type === 'success' ? 'border-l-green-500' :
              insight.type === 'info' ? 'border-l-blue-500' :
              insight.type === 'tip' ? 'border-l-purple-500' :
              'border-l-gray-500'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${
                insight.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                insight.type === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                insight.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/30' :
                insight.type === 'tip' ? 'bg-purple-100 dark:bg-purple-900/30' :
                'bg-gray-100 dark:bg-gray-900/30'
              }`}>
                <insight.icon className={`w-5 h-5 ${
                  insight.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  insight.type === 'success' ? 'text-green-600 dark:text-green-400' :
                  insight.type === 'info' ? 'text-blue-600 dark:text-blue-400' :
                  insight.type === 'tip' ? 'text-purple-600 dark:text-purple-400' :
                  'text-gray-600 dark:text-gray-400'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{insight.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.description}</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{insight.action}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{badge.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Personalized Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Set up automatic savings by creating a budget for each category
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Track receipts for tax deductions and warranty claims
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Review your subscriptions monthly to cancel unused services
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-blue-600 dark:text-blue-400">•</span>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;