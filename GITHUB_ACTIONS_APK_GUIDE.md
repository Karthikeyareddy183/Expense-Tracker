# 🚀 GitHub Actions APK Build Guide

## Build APK Without Installing Anything!

GitHub Actions automatically builds your APK in the cloud - no Java or Android Studio needed on your computer!

## 🎯 Quick Start

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add GitHub Actions for APK building"
git push origin main
```

### Step 2: Watch Build Progress
1. Go to your GitHub repository
2. Click on **Actions** tab
3. Watch the build progress in real-time

### Step 3: Download APK
1. Once build completes (takes ~5-10 minutes)
2. Click on the completed workflow run
3. Scroll down to **Artifacts** section
4. Download `SpendSmart-[build-number]`

## 📱 Two Ways to Build

### 1. Automatic Builds (Every Push)
- **Triggers:** Every push to `main` branch
- **Output:** Debug APK
- **Download:** From Actions → Workflow Run → Artifacts

### 2. Release Builds (Version Tags)
```bash
# Create a version tag
git tag v1.0.0
git push origin v1.0.0
```
- **Triggers:** When you push a version tag (v1.0.0, v2.0.0, etc.)
- **Output:** Creates a GitHub Release with APK attached
- **Download:** From Releases page

## 🔧 Manual Build

### Trigger Build from GitHub:
1. Go to **Actions** tab
2. Select **Build APK** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

## 📦 What Gets Built

### Every Push Creates:
- `spendsmart-debug-apk` - Debug version for testing
- `SpendSmart-[build-number]` - Renamed with build number

### Version Tags Create:
- GitHub Release with:
  - `SpendSmart-v1.0.0-debug.apk`
  - `SpendSmart-v1.0.0-release-unsigned.apk`

## 🎨 Workflow Features

### Automatic Features:
- ✅ Installs all dependencies
- ✅ Sets up Java JDK 17
- ✅ Sets up Android SDK
- ✅ Builds React app
- ✅ Syncs Capacitor
- ✅ Generates APK
- ✅ Uploads as artifact
- ✅ Creates download summary

### Build Information:
- Build number in filename
- Commit SHA tracking
- 30-day artifact retention
- Automatic cleanup

## 📝 Creating Releases

### Method 1: Command Line
```bash
# Make changes
git add .
git commit -m "New features"

# Create and push tag
git tag v1.0.1
git push origin v1.0.1
```

### Method 2: GitHub UI
1. Go to **Releases** page
2. Click **Create a new release**
3. Enter tag version (e.g., v1.0.2)
4. GitHub Actions will build and attach APKs

## 🔍 Monitoring Builds

### Check Build Status:
- Green ✅ = Success
- Yellow 🟡 = In Progress
- Red ❌ = Failed

### View Build Logs:
1. Click on workflow run
2. Click on job name
3. Expand any step to see detailed logs

## 📊 Build Times

- **First Build:** ~8-10 minutes
- **Subsequent Builds:** ~5-7 minutes (with caching)
- **Artifacts Available:** Immediately after build

## 🛠️ Troubleshooting

### Build Failed?
1. Check the logs in Actions tab
2. Common issues:
   - Network timeout - Re-run the workflow
   - Dependency issues - Check package.json
   - Android build error - Check android folder

### Can't Download Artifacts?
- Must be logged into GitHub
- Artifacts expire after 30 days
- File size limit: 5GB

### APK Won't Install?
- Enable "Unknown Sources" on Android
- Uninstall previous version first
- Check minimum Android version (API 21+)

## 🔐 Signing APKs (Advanced)

To create signed APKs for Google Play:

1. **Generate Keystore:**
```bash
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

2. **Add Secrets to GitHub:**
- Go to Settings → Secrets → Actions
- Add:
  - `SIGNING_KEY` (base64 encoded keystore)
  - `KEY_ALIAS`
  - `KEY_PASSWORD`
  - `STORE_PASSWORD`

3. **Update Workflow:**
- Uncomment signing section in workflow
- APKs will be automatically signed

## 📈 Version Management

### Semantic Versioning:
- `v1.0.0` - Major.Minor.Patch
- `v1.0.0-beta` - Pre-release
- `v1.0.0+build123` - Build metadata

### Auto-increment Version:
Add to `package.json`:
```json
"scripts": {
  "version": "npm version patch && git push --tags"
}
```

## 🔄 Workflow Customization

### Change Build Frequency:
Edit `.github/workflows/build-apk.yml`:
```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
```

### Add Slack Notifications:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📋 Requirements Summary

### Your Computer Needs:
- ✅ Git
- ✅ Node.js
- ✅ GitHub account
- ❌ Java (not needed!)
- ❌ Android Studio (not needed!)

### GitHub Actions Provides:
- ✅ Ubuntu Linux environment
- ✅ Java JDK 17
- ✅ Android SDK
- ✅ Node.js 20 (LTS)
- ✅ Build tools

## 🎉 Benefits

- **No Local Setup:** Build APKs without installing Android tools
- **Automatic:** Builds on every push
- **Shareable:** Direct download links
- **Version Control:** Every build is tracked
- **Free:** 2000 minutes/month for private repos
- **Fast:** Parallel builds with caching

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)

## 🆘 Need Help?

1. Check workflow logs in Actions tab
2. Review this guide
3. Check BUILD_APK_GUIDE.md for local building
4. Open an issue on GitHub

---

**Remember:** First build takes ~10 minutes. Be patient! ⏱️

**Pro Tip:** Star ⭐ your repository to easily find it later!