import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Coffee, ShoppingCart, Car, Utensils, Home, Heart, Plus } from 'lucide-react';

const QuickActions = ({ templates, onUseTemplate, onAddExpense }) => {
  const defaultQuickActions = [
    { icon: Coffee, label: 'Coffee', amount: 50, category: 'Food', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    { icon: Utensils, label: 'Lunch', amount: 150, category: 'Food', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { icon: Car, label: 'Transport', amount: 100, category: 'Travel', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { icon: ShoppingCart, label: 'Groceries', amount: 500, category: 'Shopping', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { icon: Home, label: 'Utilities', amount: 1000, category: 'Bills', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { icon: Heart, label: 'Healthcare', amount: 300, category: 'Healthcare', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  ];

  const handleQuickAdd = (action) => {
    onUseTemplate({
      amount: action.amount,
      category: action.category,
      notes: action.label,
      tags: [action.label.toLowerCase()]
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">One-tap expense entry</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {defaultQuickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleQuickAdd(action)}
            className={`p-4 rounded-xl ${action.color} border border-current border-opacity-20 transition-all hover:shadow-md`}
          >
            <action.icon className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs font-medium">{action.label}</p>
            <p className="text-xs opacity-75">₹{action.amount}</p>
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddExpense}
          className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 transition-all hover:shadow-md"
        >
          <Plus className="w-6 h-6 mx-auto mb-2" />
          <p className="text-xs font-medium">Custom</p>
          <p className="text-xs opacity-75">Add</p>
        </motion.button>
      </div>

      {/* User Templates */}
      {templates.length > 0 && (
        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Your Templates</h4>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUseTemplate(template)}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                {template.name}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;