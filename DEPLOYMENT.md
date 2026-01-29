# 🚀 Quick Deployment Guide

## Problem: App Won't Load When Opening `index.html`

If you downloaded this repository and tried to open `index.html` directly in your browser (you saw a URL like `file:///Users/...`), **it won't work!**

### Why?
This is a modern React application that requires a web server. Browsers block JavaScript modules loaded via `file://` protocol for security reasons.

---

## ✅ Solution: 3 Easy Ways to Run the App

### Method 1: Development Server (Easiest for Testing)

**What you need:** Node.js ([download here](https://nodejs.org/))

**Steps:**
```bash
# 1. Open Terminal/Command Prompt
# 2. Navigate to the downloaded folder
cd path/to/Auction-Academy-Test-Prep

# 3. Install dependencies (one time only)
npm install

# 4. Start the app
npm run dev
```

**Then:** Open your browser and go to `http://localhost:5173`

✅ **Done!** The app is now running.

---

### Method 2: Build + Python Server (No Node.js Required for Serving)

**Build once with Node.js:**
```bash
npm install
npm run build
```

**Then serve with Python (if you have Python installed):**
```bash
cd dist
python -m http.server 8000
```

Open: `http://localhost:8000`

---

### Method 3: Build + Upload to Web Hosting

**Build the app:**
```bash
npm install
npm run build
```

**Upload to hosting:**
- All files in the `dist/` folder → Upload to your web server
- Works with: Netlify, Vercel, GitHub Pages, cPanel, any web host

---

## 🆘 Still Having Issues?

### "I don't have Node.js"
1. Download from [nodejs.org](https://nodejs.org/)
2. Install it (choose LTS version)
3. Restart your terminal
4. Try again!

### "npm command not found"
- npm comes with Node.js. If it's not working, restart your terminal after installing Node.js

### "Port already in use"
- The app will automatically use a different port
- Check the terminal output for the actual URL

### "npm install fails"
- Check your internet connection
- Try: `npm cache clean --force` then `npm install` again

---

## 📱 Quick Summary

| Method | Need Node.js? | Best For | Command |
|--------|---------------|----------|---------|
| Dev Server | ✅ Yes | Testing, Development | `npm run dev` |
| Python Server | Only for build | Quick local testing | `python -m http.server` |
| Web Hosting | Only for build | Production, Sharing | Upload `dist/` folder |

---

## 💡 Pro Tip

If you just want to test the app quickly and have Node.js:

```bash
npm install && npm run dev
```

Wait 10 seconds, then open `http://localhost:5173` ✨
