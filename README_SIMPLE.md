# 📱 SpendSmart - Expense Tracker App

A smart expense tracking app that helps you manage your finances with ease.

## ✨ Features
- 💰 Track expenses and manage budgets
- 📊 Visual analytics and insights
- 👤 Personal profile management
- 🌓 Dark/Light theme
- 📱 Mobile-ready (APK available)
- 💾 Local data storage for privacy

## 🚀 Get the App

### Option 1: Download APK (Easiest)
1. Go to [Releases](../../releases) page
2. Download the latest APK
3. Install on your Android device

### Option 2: Build from Source
```bash
# Clone the repo
git clone [your-repo-url]
cd expense-tracker

# Install dependencies
npm install

# Run locally
npm start
```

## 📱 Building APK (Automatic)

This project uses **GitHub Actions** to automatically build APKs - no Android Studio needed!

### How it Works:
1. **Push your code:**
   ```bash
   git push origin main
   ```

2. **GitHub builds APK automatically** (takes ~5-10 minutes)

3. **Download from Actions tab:**
   - Go to Actions → Latest workflow
   - Download from Artifacts section

### Create a Release:
```bash
git tag v1.0.0
git push origin v1.0.0
```
This creates a GitHub Release with APK attached.

## 🛠️ Development

### Prerequisites:
- Node.js 14+
- Git

### Setup:
```bash
npm install
npm start
```

### Technologies:
- React 19
- Tailwind CSS
- Capacitor (for mobile)
- GitHub Actions (for APK builds)

## 📂 Project Structure
```
expense-tracker/
├── src/              # React source code
├── public/           # Static assets
├── android/          # Android project (for GitHub Actions)
├── .github/          # GitHub Actions workflows
└── package.json      # Dependencies
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Push changes
4. GitHub Actions will automatically build and test

## 📄 License
MIT License - feel free to use for personal or commercial projects.

## 🆘 Support
- Check [GitHub Actions Guide](GITHUB_ACTIONS_APK_GUIDE.md) for APK building
- Open an issue for bugs or features

---
**Made with ❤️ using React and GitHub Actions**