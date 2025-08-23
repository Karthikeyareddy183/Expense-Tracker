import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Calendar, Trash2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RecurringExpenses = ({ recurringExpenses, setRecurringExpenses, setExpenses, formatCurrency }) => {
  // Check and process due recurring expenses
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    
    recurringExpenses.forEach(recurring => {
      if (recurring.nextDate <= today && !recurring.processed) {
        // Add the expense
        const newExpense = {
          id: Date.now() + Math.random(),
          amount: recurring.amount,
          category: recurring.category,
          date: today,
          notes: `${recurring.notes} (Recurring)`,
          tags: [...(recurring.tags || []), 'recurring'],
          timestamp: new Date().toISOString()
        };
        
        setExpenses(prev => [...prev, newExpense]);
        
        // Update next date
        const updatedRecurring = {
          ...recurring,
          lastProcessed: today,
          nextDate: calculateNextDate(today, recurring.frequency)
        };
        
        setRecurringExpenses(prev => 
          prev.map(r => r.id === recurring.id ? updatedRecurring : r)
        );
        
        toast.success(`Recurring expense "${recurring.notes}" added automatically`, {
          icon: '🔄'
        });
      }
    });
  }, [recurringExpenses, setRecurringExpenses, setExpenses]);

  const calculateNextDate = (date, frequency) => {
    const current = new Date(date);
    switch(frequency) {
      case 'daily':
        current.setDate(current.getDate() + 1);
        break;
      case 'weekly':
        current.setDate(current.getDate() + 7);
        break;
      case 'monthly':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'yearly':
        current.setFullYear(current.getFullYear() + 1);
        break;
      default:
        break;
    }
    return current.toISOString().slice(0, 10);
  };

  const deleteRecurring = (id) => {
    setRecurringExpenses(prev => prev.filter(r => r.id !== id));
    toast.success('Recurring expense deleted');
  };

  const processNow = (recurring) => {
    const newExpense = {
      id: Date.now(),
      amount: recurring.amount,
      category: recurring.category,
      date: new Date().toISOString().slice(0, 10),
      notes: `${recurring.notes} (Manual)`,
      tags: [...(recurring.tags || []), 'recurring'],
      timestamp: new Date().toISOString()
    };
    
    setExpenses(prev => [...prev, newExpense]);
    
    // Update next date
    const updatedRecurring = {
      ...recurring,
      lastProcessed: new Date().toISOString().slice(0, 10),
      nextDate: calculateNextDate(new Date().toISOString().slice(0, 10), recurring.frequency)
    };
    
    setRecurringExpenses(prev => 
      prev.map(r => r.id === recurring.id ? updatedRecurring : r)
    );
    
    toast.success('Expense added manually');
  };

  if (recurringExpenses.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-6 md:bottom-24 md:right-8 max-w-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Repeat className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Recurring Expenses</h3>
            <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
              {recurringExpenses.length}
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recurringExpenses.map((recurring) => {
              const isDue = new Date(recurring.nextDate) <= new Date();
              
              return (
                <motion.div
                  key={recurring.id}
                  layout
                  className={`p-3 rounded-lg border ${
                    isDue 
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {recurring.notes || recurring.category}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatCurrency(recurring.amount)} • {recurring.frequency}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Next: {recurring.nextDate}
                        </span>
                        {isDue && (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                            Due now!
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {isDue && (
                        <button
                          onClick={() => processNow(recurring)}
                          className="p-1 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteRecurring(recurring.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RecurringExpenses;