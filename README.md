# 🐾 Dog Watch

A shared PWA for your family to track whether the dogs are inside or outside.

---

## Setup (one-time, ~10 minutes)

### Step 1 — Create a free JSONBin account (shared storage)

1. Go to [jsonbin.io](https://jsonbin.io) and sign up free
2. Click **"Create a Bin"**
3. Paste this as the bin content:
   ```json
   { "inside": true, "updatedAt": "" }
   ```
4. Save it — copy the **Bin ID** from the URL (the long string after `/b/`)
5. Go to **API Keys** in your account → copy your **Master Key**

### Step 2 — Add your keys to the app

Open `src/App.jsx` and replace these two lines near the top:

```js
const BIN_ID  = 'YOUR_BIN_ID_HERE'
const API_KEY = 'YOUR_API_KEY_HERE'
```

### Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "init dog watch"
git remote add origin https://github.com/YOUR_USERNAME/dog-watch.git
git push -u origin main
```

### Step 4 — Deploy on Netlify

1. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Connect your GitHub repo
3. Build settings are auto-detected from `netlify.toml`
4. Click **Deploy** — you'll get a URL like `dog-watch.netlify.app`

### Step 5 — Share with family

Send everyone the Netlify URL. On iPhone:
- Open in Safari → tap the Share icon → **Add to Home Screen**
- It'll appear as a real app icon 🐾

---

## Local development

```bash
npm install
npm run dev
```
