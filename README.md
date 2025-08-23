# 💰 Expense Tracker

A modern, feature-rich expense tracking application built with React. Track your spending, manage budgets, visualize your financial data, and gain insights into your spending habits - all with a beautiful, responsive interface.

![React](https://img.shields.io/badge/React-19.0.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📊 **Expense Management**
- **Add/Edit/Delete Expenses** - Full CRUD operations for expense entries
- **Categories** - Organize expenses into predefined categories (Food, Travel, Bills, Shopping, etc.)
- **Tags** - Add custom tags for better organization
- **Search & Filter** - Find expenses by amount, category, date, notes, or tags
- **Quick Actions** - One-tap buttons for frequent expenses (Coffee, Lunch, Transport, etc.)

### 💹 **Analytics & Insights**
- **Interactive Charts** - Visualize spending patterns with:
  - 6-month trend analysis
  - Category distribution pie charts
  - Daily spending bar charts
  - Top spending categories
- **Smart Insights** - AI-powered recommendations based on your spending patterns
- **Monthly/Yearly Views** - Switch between different time periods

### 🎯 **Budget Management**
- **Monthly Budget Setting** - Set and track your overall monthly budget
- **Category Budgets** - Assign specific budgets to each category
- **Real-time Tracking** - See remaining budget update as you add expenses
- **Visual Progress Bars** - Color-coded indicators (green/yellow/red) show budget status
- **Budget Alerts** - Get notified when approaching or exceeding limits

### 🔄 **Recurring Expenses**
- **Automated Tracking** - Set up recurring bills and subscriptions
- **Frequency Options** - Daily, weekly, monthly, or yearly
- **Auto-add Feature** - Automatically add recurring expenses on schedule

### 📱 **User Experience**
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Dark/Light Mode** - Toggle between themes for comfortable viewing
- **Smooth Animations** - Framer Motion powered transitions
- **Toast Notifications** - Real-time feedback for all actions
- **Multiple View Modes** - Grid, list, or card layouts

### 💾 **Data Management**
- **Local Storage** - All data saved locally in browser (no server needed)
- **CSV Export** - Download your expenses for backup or analysis
- **CSV Import** - Restore data from backups
- **Templates** - Save frequent expenses as reusable templates
- **Multi-currency Support** - INR (₹) as default, with USD, EUR, GBP, JPY options

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open in browser**
Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```
This creates an optimized production build in the `build` folder.

## 🎮 How to Use

### Adding Your First Expense
1. Click the **"Add Expense"** button or use Quick Actions
2. Enter the amount, select category, and add notes
3. Optionally add tags for better organization
4. Click **"Add Expense"** to save

### Setting Up Your Budget
1. Navigate to the **Budget Management** tab
2. Click the edit icon next to "Monthly Budget"
3. Enter your monthly budget amount
4. Set individual category budgets as needed
5. Watch the progress bars update as you add expenses

### Viewing Analytics
1. Go to the **Analytics** tab
2. Use the month selector to change time periods
3. Hover over charts for detailed information
4. Check the Insights panel for spending recommendations

### Managing Recurring Expenses
1. Open the **Recurring Expenses** tab
2. Click **"Add Recurring Expense"**
3. Set the amount, frequency, and start date
4. The app will automatically add these expenses

### Exporting/Importing Data
- **Export**: Click the export button in the header to download CSV
- **Import**: Use the import button to restore from a CSV file

## 📁 Project Structure

```
expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ExpenseTracker.js    # Main component with state management
│   │   ├── BudgetManager.js     # Budget tracking and management
│   │   ├── Charts.js            # Analytics and visualizations
│   │   ├── InsightsPanel.js     # AI-powered insights
│   │   ├── QuickActions.js      # Quick expense buttons
│   │   └── RecurringExpenses.js # Recurring expense management
│   ├── App.js                   # Root component
│   ├── App.css                  # Global styles
│   └── index.js                 # Entry point
├── tailwind.config.js           # Tailwind CSS configuration
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 💾 Data Storage

The app uses browser's **localStorage** for data persistence:

- **Automatic Saving** - Changes save instantly
- **No Account Needed** - Everything stays on your device
- **Privacy First** - Your data never leaves your browser
- **Persistent** - Data remains until you clear browser storage

### What Gets Saved:
- All expenses and transactions
- Budget settings (total and category-wise)
- User preferences (theme, currency)
- Custom tags and templates
- Recurring expense configurations

### Storage Limits:
- localStorage capacity: ~5-10MB
- Sufficient for thousands of expense entries
- Use CSV export for long-term backup

## 🛠️ Technologies Used

- **React 19** - Latest React with hooks
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive data visualization
- **React Hot Toast** - Beautiful notifications
- **date-fns** - Date manipulation
- **Lucide React** - Beautiful icons

## 🎨 Customization

### Changing Categories
Edit the categories array in `ExpenseTracker.js`:
```javascript
const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Healthcare', 'Education', 'Investment', 'Others'];
```

### Modifying Quick Actions
Update the default actions in `QuickActions.js`:
```javascript
const defaultQuickActions = [
  { icon: Coffee, label: 'Coffee', amount: 50, category: 'Food' },
  // Add your custom quick actions here
];
```

### Theme Colors
Modify Tailwind classes throughout components for custom color schemes.

## 🐛 Troubleshooting

### Data Not Persisting?
- Check if localStorage is enabled in your browser
- Ensure you're not in incognito/private mode
- Try clearing browser cache and reloading

### Charts Not Showing?
- Verify you have expenses added for the selected month
- Check browser console for any errors
- Ensure JavaScript is enabled

### Budget Not Updating?
- Refresh the page after setting budget
- Check if the budget value is greater than 0
- Verify localStorage is working

## 📈 Future Enhancements

- [ ] Cloud sync across devices
- [ ] Mobile app (React Native)
- [ ] Financial goals tracking
- [ ] Bill reminders and notifications
- [ ] Multiple account support
- [ ] Advanced analytics with ML predictions
- [ ] Integration with banking APIs
- [ ] Expense sharing for groups

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

---

**Made with ❤️ using React and modern web technologies**

*Start tracking your expenses today and take control of your financial future!*