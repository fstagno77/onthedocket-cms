# Netlify Deployment Guide

## ✅ What's Already Done
- GitHub repository created: https://github.com/fstagno77/onthedocket-cms
- All code pushed to GitHub
- `netlify.toml` configured with build settings
- `.nvmrc` set to Node 18.17.0

## 🚀 Deploy to Netlify (2 minutes)

### Step 1: Go to Netlify Dashboard
Visit: https://app.netlify.com

### Step 2: Create New Site
1. Click the **"Add new site"** button (top right)
2. Select **"Import an existing project"**

### Step 3: Connect GitHub
1. Click **"GitHub"** as the git provider
2. It will ask for authorization - **Click "Authorize Netlify by Netlify"**
3. Authorize the connection

### Step 4: Select Repository
1. Search for **`onthedocket-cms`**
2. Click to select it

### Step 5: Configure Build Settings
**The form should auto-populate, but verify:**

| Field | Value |
|-------|-------|
| **Branch to deploy** | `main` |
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |

✅ These are all correct because `netlify.toml` tells Netlify what to do

### Step 6: Deploy
Click the **"Deploy site"** button

---

## ✨ After Deployment

Netlify will:
1. Build your Next.js app
2. Deploy it to a live URL (like `https://onthedocket-cms-xxx.netlify.app`)
3. **Automatically redeploy** whenever you push to GitHub

---

## 🔗 Share Your Live URL
Once deployed, reply with the URL and I can verify everything works!

---

## 📝 Future Deployments
Every time you push code:
```bash
git add .
git commit -m "Your message"
git push
```

Netlify will automatically rebuild and redeploy! 🚀
