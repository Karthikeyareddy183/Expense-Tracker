import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6', '#6B7280'];

const Charts = ({ expenses, selectedMonth, setSelectedMonth }) => {
  // Prepare data for charts
  const monthlyTrends = React.useMemo(() => {
    const last6Months = [];
    const currentDate = new Date(selectedMonth);
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      const monthExpenses = expenses.filter(exp => exp.date.startsWith(monthStr));
      const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      last6Months.push({
        month: date.toLocaleDateString('en', { month: 'short' }),
        amount: total
      });
    }
    
    return last6Months;
  }, [expenses, selectedMonth]);

  const categoryData = React.useMemo(() => {
    const monthExpenses = expenses.filter(exp => exp.date.startsWith(selectedMonth));
    const byCategory = {};
    
    monthExpenses.forEach(exp => {
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(byCategory).map(([name, value]) => ({ name, value }));
  }, [expenses, selectedMonth]);

  const dailySpending = React.useMemo(() => {
    const monthExpenses = expenses.filter(exp => exp.date.startsWith(selectedMonth));
    const byDay = {};
    
    monthExpenses.forEach(exp => {
      const day = new Date(exp.date).getDate();
      byDay[day] = (byDay[day] || 0) + exp.amount;
    });
    
    return Array.from({ length: 31 }, (_, i) => ({
      day: i + 1,
      amount: byDay[i + 1] || 0
    }));
  }, [expenses, selectedMonth]);

  const stats = React.useMemo(() => {
    const monthExpenses = expenses.filter(exp => exp.date.startsWith(selectedMonth));
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const average = monthExpenses.length > 0 ? total / monthExpenses.length : 0;
    const highest = Math.max(...monthExpenses.map(exp => exp.amount), 0);
    const lowest = monthExpenses.length > 0 ? Math.min(...monthExpenses.map(exp => exp.amount)) : 0;
    
    return { total, average, highest, lowest, count: monthExpenses.length };
  }, [expenses, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Month Selector */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.total.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{stats.count} transactions</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.average.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">per transaction</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Highest</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{stats.highest.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">single expense</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">Lowest</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{stats.lowest.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">single expense</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">6-Month Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 lg:col-span-2"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Spending Pattern</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySpending}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Spending Categories</h3>
        <div className="space-y-3">
          {categoryData
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map((category, index) => {
              const percentage = (category.value / stats.total) * 100;
              return (
                <div key={category.name} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400 w-8">{index + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{category.value.toFixed(2)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </motion.div>
    </div>
  );
};

export default Charts;