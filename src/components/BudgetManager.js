import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Edit3, Save, X, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const BudgetManager = ({ budgets, setBudgets, totalBudget, setTotalBudget, monthlyData, categories, formatCurrency }) => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [budgetValues, setBudgetValues] = useState(budgets);
  const [editingTotalBudget, setEditingTotalBudget] = useState(false);
  const [tempTotalBudget, setTempTotalBudget] = useState(totalBudget || 0);

  // Update local state when props change
  useEffect(() => {
    setTempTotalBudget(totalBudget || 0);
  }, [totalBudget]);

  useEffect(() => {
    setBudgetValues(budgets);
  }, [budgets]);

  const handleSaveBudget = (category) => {
    const newBudgets = { ...budgets, [category]: parseFloat(budgetValues[category] || 0) };
    setBudgets(newBudgets);
    setEditingCategory(null);
    toast.success(`Budget set for ${category}`);
  };

  const handleCancelEdit = (category) => {
    setBudgetValues({ ...budgetValues, [category]: budgets[category] || '' });
    setEditingCategory(null);
  };

  const calculateProgress = (category) => {
    const spent = monthlyData.byCategory[category] || 0;
    const budget = budgets[category] || 0;
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 90) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (percentage >= 75) return <TrendingUp className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const totalSpent = monthlyData.total;
  const totalProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Budget Management
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Budget</p>
            {editingTotalBudget ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempTotalBudget}
                  onChange={(e) => setTempTotalBudget(parseFloat(e.target.value) || 0)}
                  className="w-32 px-2 py-1 text-xl font-bold border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={() => {
                    const newBudget = parseFloat(tempTotalBudget) || 0;
                    setTotalBudget(newBudget);
                    setEditingTotalBudget(false);
                    localStorage.setItem('totalBudget', newBudget.toString());
                    toast.success('Monthly budget updated!');
                  }}
                  className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 p-1 rounded"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setTempTotalBudget(totalBudget);
                    setEditingTotalBudget(false);
                  }}
                  className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBudget)}</p>
                <button
                  onClick={() => {
                    setEditingTotalBudget(true);
                    setTempTotalBudget(totalBudget);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Budget Usage</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalSpent)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(totalProgress, 100)}%` }}
              transition={{ duration: 0.5 }}
              className={`h-3 rounded-full ${getProgressColor(totalProgress)}`}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {totalProgress.toFixed(1)}% of total budget used
          </p>
        </div>
      </div>

      {/* Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => {
          const spent = monthlyData.byCategory[category] || 0;
          const budget = budgets[category] || 0;
          const progress = calculateProgress(category);
          const remaining = budget - spent;
          const isEditing = editingCategory === category;

          return (
            <motion.div
              key={category}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
                  {getStatusIcon(progress)}
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSaveBudget(category)}
                      className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 p-1 rounded"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancelEdit(category)}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="mb-4">
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Budget Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetValues[category] || ''}
                    onChange={(e) => setBudgetValues({ ...budgetValues, [category]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Spent</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Budget</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {budget > 0 ? formatCurrency(budget) : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                      <span className={`font-medium ${remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(Math.abs(remaining))}
                        {remaining < 0 && ' over'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                      className={`h-2 rounded-full ${getProgressColor(progress)}`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {progress.toFixed(1)}% used
                  </p>
                </>
              )}

              {/* Recommendations */}
              {!isEditing && budget > 0 && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                  {progress >= 90 ? (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      ⚠️ Budget limit reached! Consider reviewing your spending.
                    </p>
                  ) : progress >= 75 ? (
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      ⚡ Approaching budget limit. Spend wisely!
                    </p>
                  ) : (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ✓ You're on track with your budget.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Budget Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💡 Budget Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
          <div>• Set realistic budgets based on past spending</div>
          <div>• Review and adjust budgets monthly</div>
          <div>• Aim to save 20% of your income</div>
          <div>• Track unusual expenses separately</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;