import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, 
  Edit3, Save, X, Camera, Settings, TrendingUp,
  DollarSign, Target, Bell, Shield, Download, 
  ChevronRight, Award, CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile = ({ profile, setProfile, totalBudget, expenses, formatCurrency, currency, currencies, setCurrency }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [activeSection, setActiveSection] = useState('personal');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Calculate user statistics
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const averageDaily = expenses.length > 0 ? totalSpent / 30 : 0;
  const totalTransactions = expenses.length;
  const memberSince = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : new Date().toLocaleDateString();
  
  // Calculate spending streak (days with expenses)
  const uniqueDays = new Set(expenses.map(exp => exp.date)).size;
  
  // Get most used category
  const categoryCount = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + 1;
    return acc;
  }, {});
  const favoriteCategory = Object.keys(categoryCount).reduce((a, b) => 
    categoryCount[a] > categoryCount[b] ? a : b, 'None'
  );

  // Avatar options
  const avatarColors = [
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
    'bg-gradient-to-br from-teal-400 to-teal-600',
  ];

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (color) => {
    const updatedProfile = { ...editedProfile, avatarColor: color };
    setEditedProfile(updatedProfile);
    setProfile(updatedProfile);
    setShowAvatarModal(false);
    toast.success('Avatar updated!');
  };

  const exportProfileData = () => {
    const profileData = {
      profile: profile,
      statistics: {
        totalSpent,
        totalTransactions,
        averageDaily,
        favoriteCategory,
        memberSince
      },
      preferences: {
        currency,
        totalBudget
      }
    };
    
    const dataStr = JSON.stringify(profileData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile_${profile.name.replace(/\s/g, '_')}.json`;
    a.click();
    
    toast.success('Profile data exported successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 md:p-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className={`w-32 h-32 rounded-full ${editedProfile.avatarColor || 'bg-gradient-to-br from-blue-400 to-blue-600'} flex items-center justify-center text-white shadow-lg`}>
              {editedProfile.profileImage ? (
                <img src={editedProfile.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-4xl font-bold">
                  {editedProfile.name ? editedProfile.name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {editedProfile.name || 'Your Name'}
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {editedProfile.bio || 'Add a bio to tell us about yourself'}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Member since {memberSince}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {uniqueDays} active days
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Level {Math.floor(totalTransactions / 50) + 1} Saver
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-2 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['personal', 'statistics', 'preferences', 'notifications'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all ${
              activeSection === section
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {section}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Personal Information */}
        {activeSection === 'personal' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {profile.name || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="your@email.com"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {profile.email || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+91 98765 43210"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {profile.phone || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {profile.location || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Briefcase className="w-4 h-4 inline mr-1" />
                  Occupation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.occupation}
                    onChange={(e) => setEditedProfile({ ...editedProfile, occupation: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Your profession"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {profile.occupation || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Financial Goal
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.financialGoal}
                    onChange={(e) => setEditedProfile({ ...editedProfile, financialGoal: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="e.g., Save for vacation"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {profile.financialGoal || 'Not set'}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows="3"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {profile.bio || 'Not set'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        {activeSection === 'statistics' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-white">
                      {formatCurrency(totalSpent)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-white">
                      {totalTransactions}
                    </p>
                  </div>
                  <CreditCard className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Daily Average</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-white">
                      {formatCurrency(averageDaily)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </motion.div>
            </div>

            {/* Achievement Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'First Expense', icon: '🎯', unlocked: totalTransactions >= 1 },
                  { name: 'Budget Setter', icon: '💰', unlocked: totalBudget > 0 },
                  { name: 'Week Streak', icon: '🔥', unlocked: uniqueDays >= 7 },
                  { name: 'Category Master', icon: '📊', unlocked: Object.keys(categoryCount).length >= 5 },
                  { name: '100 Transactions', icon: '💯', unlocked: totalTransactions >= 100 },
                  { name: 'Money Saver', icon: '🏦', unlocked: totalSpent < totalBudget },
                  { name: 'Data Explorer', icon: '📈', unlocked: true },
                  { name: 'Profile Complete', icon: '✨', unlocked: profile.name && profile.email },
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
                    className={`text-center p-4 rounded-lg border-2 ${
                      badge.unlocked 
                        ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' 
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className={`text-xs font-medium ${
                      badge.unlocked 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {badge.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Spending Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Spending Profile
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Favorite Category</span>
                  <span className="font-medium text-gray-900 dark:text-white">{favoriteCategory}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Active Days</span>
                  <span className="font-medium text-gray-900 dark:text-white">{uniqueDays} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Saver Level</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Level {Math.floor(totalTransactions / 50) + 1}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Budget Discipline</span>
                  <span className={`font-medium ${
                    totalSpent <= totalBudget 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {totalSpent <= totalBudget ? 'On Track' : 'Over Budget'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences */}
        {activeSection === 'preferences' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Preferences
            </h3>
            
            <div className="space-y-6">
              {/* Currency Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => {
                    setCurrency(e.target.value);
                    toast.success('Currency updated!');
                  }}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {currencies.map(curr => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name} ({curr.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <select
                  value={editedProfile.dateFormat || 'DD/MM/YYYY'}
                  onChange={(e) => {
                    const updated = { ...editedProfile, dateFormat: e.target.value };
                    setEditedProfile(updated);
                    setProfile(updated);
                    toast.success('Date format updated!');
                  }}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              {/* Week Start */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Week Starts On
                </label>
                <select
                  value={editedProfile.weekStart || 'monday'}
                  onChange={(e) => {
                    const updated = { ...editedProfile, weekStart: e.target.value };
                    setEditedProfile(updated);
                    setProfile(updated);
                    toast.success('Week start day updated!');
                  }}
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </select>
              </div>

              {/* Privacy Settings */}
              <div className="border-t dark:border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Privacy & Security
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedProfile.showProfile !== false}
                      onChange={(e) => {
                        const updated = { ...editedProfile, showProfile: e.target.checked };
                        setEditedProfile(updated);
                        setProfile(updated);
                      }}
                      className="rounded"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Show profile picture in header
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedProfile.autoBackup !== false}
                      onChange={(e) => {
                        const updated = { ...editedProfile, autoBackup: e.target.checked };
                        setEditedProfile(updated);
                        setProfile(updated);
                      }}
                      className="rounded"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Enable automatic data backup reminders
                    </span>
                  </label>
                </div>
              </div>

              {/* Export Data */}
              <div className="border-t dark:border-gray-700 pt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Data Management
                </h4>
                <button
                  onClick={exportProfileData}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Profile Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeSection === 'notifications' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get notified when approaching budget limits' },
                { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Receive weekly spending summaries' },
                { key: 'monthlyReport', label: 'Monthly Reports', desc: 'Get detailed monthly expense reports' },
                { key: 'savingsTips', label: 'Savings Tips', desc: 'Receive personalized saving recommendations' },
                { key: 'recurringReminders', label: 'Recurring Expense Reminders', desc: 'Remind about upcoming recurring expenses' },
                { key: 'achievements', label: 'Achievement Notifications', desc: 'Celebrate when you unlock new achievements' },
              ].map(notification => (
                <div key={notification.key} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{notification.label}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{notification.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedProfile.notifications?.[notification.key] !== false}
                      onChange={(e) => {
                        const updated = {
                          ...editedProfile,
                          notifications: {
                            ...editedProfile.notifications,
                            [notification.key]: e.target.checked
                          }
                        };
                        setEditedProfile(updated);
                        setProfile(updated);
                        toast.success(`${notification.label} ${e.target.checked ? 'enabled' : 'disabled'}`);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
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
            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Choose Avatar Color
              </h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {avatarColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarChange(color)}
                  className={`w-full aspect-square rounded-full ${color} flex items-center justify-center text-white text-2xl font-bold hover:scale-110 transition-transform`}
                >
                  {editedProfile.name ? editedProfile.name.charAt(0).toUpperCase() : 'U'}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;