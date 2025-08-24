import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Calendar, DollarSign, TrendingUp, Receipt, Trash2, Edit3, 
  Search, Filter, Download, Moon, Sun, X, ChevronDown, Camera,
  BarChart3, AlertCircle,
  Settings, User, Bell
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { format, subMonths, isWithinInterval } from 'date-fns';
import Charts from './Charts';
import BudgetManager from './BudgetManager';
import InsightsPanel from './InsightsPanel';
import QuickActions from './QuickActions';
import RecurringExpenses from './RecurringExpenses';
import Profile from './Profile';

const ExpenseTracker = () => {
  // Core States
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // Feature States
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [budgets, setBudgets] = useState({});
  const [totalBudget, setTotalBudget] = useState(0); // No default budget - user must set it
  const [currency, setCurrency] = useState('INR'); // Changed to INR
  const [tags, setTags] = useState([]);
  const [recurringExpenses, setRecurringExpenses] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, cards
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    occupation: '',
    bio: '',
    avatarColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    financialGoal: '',
    createdAt: new Date().toISOString(),
    showProfile: true,
    notifications: {},
    dateFormat: 'DD/MM/YYYY',
    weekStart: 'monday'
  });
  
  const categories = useMemo(() => ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Petrol', 'Investment', 'Others'], []);
  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];

  const categoryColors = {
    'Food': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    'Travel': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
    'Bills': 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    'Shopping': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
    'Entertainment': 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800',
    'Healthcare': 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    'Petrol': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    'Education': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
    'Investment': 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
    'Others': 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800'
  };

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const savedBudgets = JSON.parse(localStorage.getItem('budgets') || '{}');
    const savedTotalBudget = parseFloat(localStorage.getItem('totalBudget') || '0');
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');
    const savedCurrency = localStorage.getItem('currency') || 'INR';
    const savedTags = JSON.parse(localStorage.getItem('tags') || '[]');
    const savedRecurring = JSON.parse(localStorage.getItem('recurringExpenses') || '[]');
    const savedTemplates = JSON.parse(localStorage.getItem('templates') || '[]');
    
    setExpenses(savedExpenses);
    setBudgets(savedBudgets);
    setTotalBudget(savedTotalBudget);
    setDarkMode(savedDarkMode);
    setCurrency(savedCurrency);
    setTags(savedTags);
    setRecurringExpenses(savedRecurring);
    setTemplates(savedTemplates);
    
    // Show prompt to set budget if not set
    if (savedTotalBudget === 0) {
      setTimeout(() => {
        toast('💡 Set your monthly budget to track spending!', {
          duration: 5000,
          icon: '💰',
          style: {
            background: '#3B82F6',
            color: '#fff',
          },
        });
      }, 1000);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('totalBudget', totalBudget.toString());
  }, [totalBudget]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem('recurringExpenses', JSON.stringify(recurringExpenses));
  }, [recurringExpenses]);

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
    tags: [],
    receipt: null,
    isRecurring: false,
    recurringFrequency: 'monthly'
  });

  // Filter and search logic
  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(expense => 
        expense.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.amount.toString().includes(searchQuery) ||
        expense.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }
    
    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return isWithinInterval(expenseDate, {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end)
        });
      });
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [expenses, searchQuery, filterCategory, dateRange]);

  // Monthly data calculation
  const monthlyData = useMemo(() => {
    const filtered = expenses.filter(expense => expense.date.startsWith(selectedMonth));
    const total = filtered.reduce((sum, expense) => sum + expense.amount, 0);
    const byCategory = {};
    
    categories.forEach(cat => {
      byCategory[cat] = filtered
        .filter(expense => expense.category === cat)
        .reduce((sum, expense) => sum + expense.amount, 0);
    });

    // Calculate previous month for comparison
    const prevMonth = format(subMonths(new Date(selectedMonth), 1), 'yyyy-MM');
    const prevFiltered = expenses.filter(expense => expense.date.startsWith(prevMonth));
    const prevTotal = prevFiltered.reduce((sum, expense) => sum + expense.amount, 0);
    
    const change = prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : 0;

    return { 
      total, 
      byCategory, 
      count: filtered.length,
      prevTotal,
      change,
      filtered
    };
  }, [expenses, selectedMonth, categories]);

  // Recent expenses
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }, [expenses]);

  // Calculate total spent and remaining balance
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const remainingBalance = useMemo(() => {
    return totalBudget - totalSpent;
  }, [totalBudget, totalSpent]);

  const balancePercentage = useMemo(() => {
    return totalBudget > 0 ? (remainingBalance / totalBudget) * 100 : 0;
  }, [totalBudget, remainingBalance]);

  // Format currency
  const formatCurrency = (amount) => {
    const curr = currencies.find(c => c.code === currency);
    return `${curr.symbol}${amount.toFixed(2)}`;
  };

  // Handle expense submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.date) return;

    const expense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
      notes: formData.notes,
      tags: formData.tags,
      receipt: formData.receipt,
      currency: currency,
      timestamp: editingExpense ? editingExpense.timestamp : new Date().toISOString()
    };

    if (editingExpense) {
      setExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? expense : exp));
      toast.success('Expense updated successfully!');
      setEditingExpense(null);
    } else {
      setExpenses(prev => [...prev, expense]);
      const newBalance = totalBudget - (totalSpent + expense.amount);
      
      // Show balance notification
      if (newBalance >= 0) {
        toast.success(
          <div>
            <div>Expense added successfully!</div>
            <div className="text-sm mt-1">Remaining balance: {formatCurrency(newBalance)}</div>
          </div>,
          { duration: 4000 }
        );
      } else {
        toast.error(
          <div>
            <div>Budget exceeded!</div>
            <div className="text-sm mt-1">Over budget by: {formatCurrency(Math.abs(newBalance))}</div>
          </div>,
          { duration: 5000 }
        );
      }
      
      // Check budget alerts
      checkBudgetAlert(expense);
    }

    // Save as template if it's a frequent expense
    if (formData.saveAsTemplate) {
      const template = {
        id: Date.now(),
        name: formData.templateName || `${formData.category} - ${formData.amount}`,
        amount: formData.amount,
        category: formData.category,
        notes: formData.notes,
        tags: formData.tags
      };
      setTemplates(prev => [...prev, template]);
    }

    // Handle recurring expense
    if (formData.isRecurring) {
      const recurring = {
        id: Date.now(),
        ...expense,
        frequency: formData.recurringFrequency,
        nextDate: calculateNextDate(formData.date, formData.recurringFrequency)
      };
      setRecurringExpenses(prev => [...prev, recurring]);
    }

    setFormData({ 
      amount: '', 
      category: 'Food', 
      date: new Date().toISOString().slice(0, 10), 
      notes: '',
      tags: [],
      receipt: null,
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
    setShowAddForm(false);
  };

  // Calculate next recurring date
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

  // Check budget alerts
  const checkBudgetAlert = (expense) => {
    const categoryBudget = budgets[expense.category];
    if (categoryBudget) {
      const categoryTotal = monthlyData.byCategory[expense.category] + expense.amount;
      const percentage = (categoryTotal / categoryBudget) * 100;
      
      if (percentage >= 90) {
        toast.error(`⚠️ You've reached ${percentage.toFixed(0)}% of your ${expense.category} budget!`, {
          duration: 5000,
          icon: '💸'
        });
      } else if (percentage >= 75) {
        toast.warning(`You've used ${percentage.toFixed(0)}% of your ${expense.category} budget`, {
          duration: 4000,
          icon: '⚡'
        });
      }
    }
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    toast.success('Expense deleted');
  };

  // Edit expense
  const startEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
      notes: expense.notes,
      tags: expense.tags || [],
      receipt: expense.receipt,
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
    setShowAddForm(true);
  };

  // Export to CSV - Complete expense history
  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Category', 'Amount', 'Currency', 'Notes', 'Tags', 'Month', 'Year'];
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date));
    
    const data = sortedExpenses.map(exp => {
      const expDate = new Date(exp.timestamp || exp.date);
      return [
        exp.date,
        expDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        exp.category,
        exp.amount.toFixed(2),
        exp.currency || currency,
        exp.notes || '',
        exp.tags?.join('; ') || '',
        expDate.toLocaleDateString('en-US', { month: 'long' }),
        expDate.getFullYear()
      ];
    });
    
    // Add summary at the top
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const summaryRows = [
      ['EXPENSE HISTORY REPORT'],
      [`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`],
      [`Total Expenses: ${expenses.length}`],
      [`Total Amount: ${formatCurrency(totalAmount)}`],
      [`Date Range: ${sortedExpenses.length > 0 ? sortedExpenses[sortedExpenses.length - 1].date + ' to ' + sortedExpenses[0].date : 'No expenses'}`],
      [''],  // Empty row for spacing
    ];
    
    const csvContent = [
      ...summaryRows.map(row => row.join(',')),
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `expense_history_${dateStr}.csv`;
    a.click();
    
    toast.success(`Exported ${expenses.length} expenses successfully!`);
  };

  // Removed import functionality as requested

  // Use template
  const useTemplate = (template) => {
    setFormData({
      ...formData,
      amount: template.amount.toString(),
      category: template.category,
      notes: template.notes,
      tags: template.tags || []
    });
    setShowAddForm(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <img src="/logo.png" alt="SpendSmart" className="w-8 h-8 md:w-10 md:h-10" />
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-500">
                SpendSmart
              </span>
            </h1>
            
            {/* Budget Balance Display */}
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-lg border-2 ${
                  totalBudget === 0
                    ? 'bg-gray-50 border-gray-500 dark:bg-gray-900/30 dark:border-gray-400'
                    : remainingBalance > totalBudget * 0.3 
                    ? 'bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-400' 
                    : remainingBalance > 0 
                    ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/30 dark:border-yellow-400'
                    : 'bg-red-50 border-red-500 dark:bg-red-900/30 dark:border-red-400'
                } cursor-pointer`}
                onClick={() => setShowBudgetModal(true)}
              >
                {totalBudget === 0 ? (
                  <>
                    <div className="text-xs text-gray-600 dark:text-gray-400">No Budget Set</div>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      Click to Set
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Balance</div>
                    <div className={`text-lg font-bold ${
                      remainingBalance > totalBudget * 0.3 
                        ? 'text-green-700 dark:text-green-400' 
                        : remainingBalance > 0 
                        ? 'text-yellow-700 dark:text-yellow-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      {formatCurrency(remainingBalance)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      of {formatCurrency(totalBudget)}
                    </div>
                  </>
                )}
              </motion.div>
              
              {/* Profile Avatar */}
              {profile.showProfile !== false && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className="relative group"
                >
                  <div className={`w-10 h-10 rounded-full ${profile.avatarColor || 'bg-gradient-to-br from-blue-400 to-blue-600'} flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow`}>
                    {profile.profileImage ? (
                      <img src={profile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </button>
              )}
              
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
              
              {/* Settings */}
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 py-4">
          {['dashboard', 'expenses', 'analytics', 'budgets', 'insights', 'profile'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <AnimatePresence>
        {(activeTab === 'expenses' || activeTab === 'dashboard') && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                {/* Date Range */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-white flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Export */}
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
              
              {/* Advanced Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t dark:border-gray-700"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Start Date</label>
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">End Date</label>
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => {
                            setDateRange({ start: '', end: '' });
                            setFilterCategory('all');
                            setSearchQuery('');
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Stats Cards */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Remaining Balance */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                        <p className={`font-bold text-2xl ${
                          remainingBalance > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>{formatCurrency(remainingBalance)}</p>
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                balancePercentage > 30 ? 'bg-green-500' : 
                                balancePercentage > 0 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.max(0, balancePercentage)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Total Expenses */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                        <p className="font-bold text-2xl dark:text-white">{expenses.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">All time</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Average Daily */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Daily Average</p>
                        <p className="font-bold text-2xl dark:text-white">
                          {formatCurrency(monthlyData.total / 30)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This month</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Highest Expense */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Highest</p>
                        <p className="font-bold text-2xl dark:text-white">
                          {formatCurrency(Math.max(...(monthlyData.filtered.map(e => e.amount) || [0])))}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">This month</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-3">
                <QuickActions 
                  templates={templates}
                  onUseTemplate={useTemplate}
                  onAddExpense={() => setShowAddForm(true)}
                />
              </div>

              {/* Recent Expenses & Category Summary */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700"
                >
                  <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Recent Expenses</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Last 5 transactions</span>
                  </div>
                  <div className="divide-y dark:divide-gray-700 max-h-96 overflow-y-auto">
                    {recentExpenses.length > 0 ? (
                      recentExpenses.map((expense, index) => (
                        <motion.div
                          key={expense.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 md:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${categoryColors[expense.category]}`}>
                              {expense.category}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{expense.date}</p>
                              {expense.tags?.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {expense.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(expense)}
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                        <Receipt className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No expenses yet</p>
                        <p className="text-sm mt-1">Add your first expense to get started!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Mini Charts */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4">Category Distribution</h3>
                  <div className="space-y-3">
                    {categories.map(category => {
                      const amount = monthlyData.byCategory[category];
                      const percentage = monthlyData.total > 0 ? (amount / monthlyData.total) * 100 : 0;
                      
                      return amount > 0 ? (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                            <span className="text-sm font-medium dark:text-white">{formatCurrency(amount)}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Expenses Tab */}
          {activeTab === 'expenses' && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* View Mode Toggle */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing {filteredExpenses.length} of {expenses.length} expenses
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                  >
                    <Receipt className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Expenses Grid/List */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${categoryColors[expense.category]}`}>
                          {expense.category}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(expense)}
                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-xl text-gray-900 dark:text-white mb-1">{formatCurrency(expense.amount)}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {expense.date}
                        </p>
                        {expense.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">{expense.notes}</p>
                        )}
                        {expense.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {expense.tags.map(tag => (
                              <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {expense.receipt && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Camera className="w-3 h-3" />
                            Receipt attached
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-16 text-center text-gray-500 dark:text-gray-400">
                      <Receipt className="w-20 h-20 mx-auto mb-4 opacity-50" />
                      <p className="text-xl font-medium">No expenses found</p>
                      <p className="text-sm mt-2">Try adjusting your filters or add new expenses</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Charts expenses={expenses} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
            </motion.div>
          )}

          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <motion.div
              key="budgets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BudgetManager 
                budgets={budgets} 
                setBudgets={setBudgets}
                totalBudget={totalBudget}
                setTotalBudget={setTotalBudget}
                monthlyData={monthlyData}
                categories={categories}
                formatCurrency={formatCurrency}
              />
            </motion.div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InsightsPanel 
                expenses={expenses}
                monthlyData={monthlyData}
                formatCurrency={formatCurrency}
              />
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Profile 
                profile={profile}
                setProfile={setProfile}
                totalBudget={totalBudget}
                expenses={expenses}
                formatCurrency={formatCurrency}
                currency={currency}
                currencies={currencies}
                setCurrency={setCurrency}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {!showAddForm && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddForm(true)}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 md:px-6 md:py-4 rounded-full shadow-lg flex items-center gap-2 group"
          >
            <PlusCircle className="w-6 h-6" />
            <span className="hidden md:inline">Add Expense</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Add/Edit Expense Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingExpense(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                    <input
                      type="text"
                      placeholder="Enter tags separated by commas"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      })}
                      className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add a note..."
                  />
                </div>

                {/* Additional Options */}
                <div className="space-y-3 pt-4 border-t dark:border-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Make this a recurring expense</span>
                  </label>

                  {formData.isRecurring && (
                    <select
                      value={formData.recurringFrequency}
                      onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saveAsTemplate}
                      onChange={(e) => setFormData({ ...formData, saveAsTemplate: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Save as template for quick access</span>
                  </label>

                  {formData.saveAsTemplate && (
                    <input
                      type="text"
                      placeholder="Template name"
                      value={formData.templateName}
                      onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingExpense(null);
                    }}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all"
                  >
                    {editingExpense ? 'Update' : 'Add'} Expense
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recurring Expenses Manager */}
      <RecurringExpenses 
        recurringExpenses={recurringExpenses}
        setRecurringExpenses={setRecurringExpenses}
        setExpenses={setExpenses}
        formatCurrency={formatCurrency}
      />

      {/* Budget Settings Modal */}
      <AnimatePresence>
        {showBudgetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Budget Settings
                </h2>
                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Total Budget Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Total Monthly Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your monthly budget"
                    step="100"
                  />
                </div>

                {/* Budget Summary */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Budget</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(totalBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Spent</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(totalSpent)}
                    </span>
                  </div>
                  <div className="border-t pt-3 dark:border-gray-600">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Remaining Balance</span>
                      <span className={`font-bold text-lg ${
                        remainingBalance > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(remainingBalance)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Budget Usage</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {((totalSpent / totalBudget) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                      className={`h-4 rounded-full ${
                        (totalSpent / totalBudget) > 0.9 
                          ? 'bg-red-500' 
                          : (totalSpent / totalBudget) > 0.7 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Alert Messages */}
                {remainingBalance < 0 && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-sm text-red-700 dark:text-red-400">
                      ⚠️ You've exceeded your budget by {formatCurrency(Math.abs(remainingBalance))}
                    </p>
                  </div>
                )}
                {remainingBalance > 0 && remainingBalance < totalBudget * 0.2 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      ⚡ Low balance! Only {formatCurrency(remainingBalance)} remaining.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setShowBudgetModal(false)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comprehensive Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
            >
              {/* Settings Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Settings className="w-7 h-7" />
                    <h2 className="text-2xl font-bold">Settings</h2>
                  </div>
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Settings Content */}
              <div className="flex flex-col md:flex-row h-[calc(90vh-100px)]">
                {/* Settings Sidebar */}
                <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700 p-4">
                  <nav className="space-y-2">
                    {[
                      { id: 'general', label: 'General', icon: Settings },
                      { id: 'profile', label: 'Profile', icon: User },
                      { id: 'budget', label: 'Budget', icon: DollarSign },
                      { id: 'appearance', label: 'Appearance', icon: Moon },
                      { id: 'notifications', label: 'Notifications', icon: Bell },
                      { id: 'data', label: 'Data & Export', icon: Download }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSettingsTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeSettingsTab === tab.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Settings Panel */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {/* General Settings */}
                  {activeSettingsTab === 'general' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">General Settings</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          {currencies.map(curr => (
                            <option key={curr.code} value={curr.code}>
                              {curr.symbol} {curr.name} ({curr.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Date Format
                        </label>
                        <select
                          value={profile.dateFormat || 'DD/MM/YYYY'}
                          onChange={(e) => setProfile({ ...profile, dateFormat: e.target.value })}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Week Starts On
                        </label>
                        <select
                          value={profile.weekStart || 'monday'}
                          onChange={(e) => setProfile({ ...profile, weekStart: e.target.value })}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="sunday">Sunday</option>
                          <option value="monday">Monday</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Profile Settings */}
                  {activeSettingsTab === 'profile' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Settings</h3>
                      
                      <div className="flex items-center gap-6 mb-6">
                        <div className={`w-20 h-20 rounded-full ${profile.avatarColor || 'bg-gradient-to-br from-blue-400 to-blue-600'} flex items-center justify-center text-white text-2xl font-bold`}>
                          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <button
                            onClick={() => setActiveTab('profile')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            Edit Full Profile
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={profile.name || ''}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Your name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={profile.email || ''}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile.showProfile !== false}
                            onChange={(e) => setProfile({ ...profile, showProfile: e.target.checked })}
                            className="rounded"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            Show profile avatar in header
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Budget Settings */}
                  {activeSettingsTab === 'budget' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Budget Settings</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Monthly Budget
                        </label>
                        <input
                          type="number"
                          value={totalBudget}
                          onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Enter your monthly budget"
                          step="100"
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Total Spent</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(totalSpent)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Remaining</span>
                          <span className={`font-medium ${
                            remainingBalance > 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {formatCurrency(remainingBalance)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('budgets')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Manage Category Budgets
                      </button>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeSettingsTab === 'appearance' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                          Theme
                        </label>
                        <div className="flex gap-4">
                          <button
                            onClick={() => setDarkMode(false)}
                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                              !darkMode 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                            <p className="font-medium">Light</p>
                          </button>
                          <button
                            onClick={() => setDarkMode(true)}
                            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                              darkMode 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' 
                                : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <Moon className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                            <p className="font-medium">Dark</p>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Default View Mode
                        </label>
                        <select
                          value={viewMode}
                          onChange={(e) => setViewMode(e.target.value)}
                          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <option value="grid">Grid View</option>
                          <option value="list">List View</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeSettingsTab === 'notifications' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get notified when approaching budget limits' },
                          { key: 'weeklyReport', label: 'Weekly Summary', desc: 'Receive weekly spending summaries' },
                          { key: 'savingsTips', label: 'Savings Tips', desc: 'Get personalized saving recommendations' },
                          { key: 'achievements', label: 'Achievements', desc: 'Celebrate when you unlock new achievements' }
                        ].map(notification => (
                          <div key={notification.key} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{notification.label}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{notification.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={profile.notifications?.[notification.key] !== false}
                                onChange={(e) => setProfile({
                                  ...profile,
                                  notifications: {
                                    ...profile.notifications,
                                    [notification.key]: e.target.checked
                                  }
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data & Export Settings */}
                  {activeSettingsTab === 'data' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data & Export</h3>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Export Data</h4>
                        <div className="space-y-3">
                          <button
                            onClick={exportToCSV}
                            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-5 h-5" />
                            Export All Expenses as CSV
                          </button>
                          <button
                            onClick={() => {
                              const allData = {
                                expenses,
                                profile,
                                budgets,
                                totalBudget,
                                recurringExpenses,
                                templates
                              };
                              const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `spendsmart_backup_${new Date().toISOString().split('T')[0]}.json`;
                              a.click();
                              toast.success('Backup created successfully!');
                            }}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-5 h-5" />
                            Create Full Backup (JSON)
                          </button>
                        </div>
                      </div>

                      <div className="border-t dark:border-gray-700 pt-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Data Storage</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          All your data is stored locally in your browser. No data is sent to any server.
                        </p>
                        <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <p className="text-sm text-yellow-700 dark:text-yellow-400">
                            ⚠️ Clearing browser data will permanently delete all your expenses and settings.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Footer */}
              <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      toast.success('Settings saved successfully!');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseTracker;