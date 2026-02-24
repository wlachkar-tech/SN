# QUICK START – Student Management App Deployment

## ⚡ For Immediate Use (Do This First)

### 1. **Install Git & Node.js** (If needed)

**Windows:**
- Download Git: https://git-scm.com/download/win
- Download Node.js LTS: https://nodejs.org (v18 or v20)
- Restart your terminal after installing

**Verify installation:**
```bash
git --version
node --version
npm --version
```

---

### 2. **Initialize Git Repository & Push to GitHub**

Run these commands in PowerShell:

```powershell
cd C:\Users\HUAWEI\Desktop\student

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit – Student Management App"

# Rename branch to main
git branch -M main

# Add remote (update URL if different)
git remote add origin https://github.com/wlachkar-tech/sm-.git

# Push to GitHub (you'll be prompted for GitHub PAT)
git push -u origin main
```

**If you need a GitHub Personal Access Token (PAT):**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select **repo** scope
4. Copy the token
5. When `git push` asks for password, paste the token

---

### 3. **Deploy to Vercel (Fastest Way)**

#### Step A: Connect to Vercel
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"New Project"**
4. Click **"Import Git Repository"**
5. Find and select: `wlachkar-tech/sm-`
6. Click **Import**

#### Step B: Set Environment Variables
In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

| Variable | Value | 
|----------|-------|
| `NEXTAUTH_URL` | `https://your-project-name.vercel.app` |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -hex 32` (see note below) |

**To generate NEXTAUTH_SECRET:**
- Open Git Bash or Terminal
- Run: `openssl rand -hex 32`
- Copy output and paste into Vercel

3. Click **Deploy**
4. Wait 3-5 minutes for build to complete

#### Step C: Test Your App
```
Visit: https://your-project-name.vercel.app
```

---

## 📁 Project File Structure

```
student/
├── backend/                    # Express + SQLite (optional, can deploy separately)
│   ├── database.js
│   ├── server.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── students.js
│   │   ├── courses.js
│   │   └── enrollments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── package.json
│   ├── .env.example
│   └── students.db
│
├── frontend/                   # Next.js + NextAuth (Vercel)
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.js       # NextAuth
│   │   │   ├── students/route.js                 # API Proxy
│   │   │   ├── courses/route.js                  # API Proxy
│   │   │   └── enrollments/route.js              # API Proxy
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── courses/
│   │   ├── enrollments/
│   │   └── admin/
│   ├── components/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.local.example
│
├── vercel.json                 # Vercel configuration
├── push_to_github.ps1          # Git push helper script
├── VERCEL_DEPLOYMENT.md        # Detailed Vercel guide
├── ARCHITECTURE.md
├── GETTING_STARTED.md
├── README.md
└── .gitignore

```

---

## 🚀 Features

✅ **Frontend (Next.js + React)**
- Modern UI with Tailwind CSS
- Pages: Login, Register, Dashboard, Profile, Courses, Enrollments
- Admin panel for managing students/courses
- Responsive design (mobile-friendly)

✅ **Backend (Express + SQLite)**
- RESTful API with JWT authentication
- Database: Users, Students, Courses, Enrollments
- Role-based access (Admin/Student)
- Password hashing with bcryptjs

✅ **Authentication (NextAuth)**
- Secure login with JWT tokens
- Session management
- Protected routes
- Logout functionality

✅ **Vercel Deployment Ready**
- Serverless functions (no cold-start issues)
- API routes as Next.js handlers
- Environment-based configuration
- Production-grade setup

---

## 🔧 Optional: Deploy Backend Separately

If you want to run the backend on a separate platform:

### Option 1: Railway (Recommended)
1. Go to https://railway.app
2. Create account → New Project
3. Deploy from GitHub (select backend folder)
4. Set environment variables (JWT_SECRET, etc.)
5. Copy backend URL (e.g., `https://api-xyz.railway.app`)
6. Update Vercel's `NEXT_PUBLIC_API_URL` environment variable

### Option 2: Heroku
1. Go to https://heroku.com
2. Create new app
3. Connect to GitHub
4. Deploy from main branch
5. Set environment variables in settings

### Option 3: Keep it Local
- Run backend locally on `http://localhost:5000`
- Update `NEXT_PUBLIC_API_URL` in `.env.local` to `http://localhost:5000/api`

---

## 🧪 Local Testing (Before Deploying)

### 1. **Install Dependencies**

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies (optional)
cd ../backend
npm install
```

### 2. **Set Environment Variables**

**Frontend (`frontend/.env.local`):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-for-testing
```

**Backend (`backend/.env`):**
```
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 3. **Run the App Locally**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev    # or: node server.js
```
Output should show: `Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Output should show: `Local: http://localhost:3000`

### 4. **Test in Browser**
```
http://localhost:3000
```

---

## 🔐 Security Checklist

- [ ] Generate strong NEXTAUTH_SECRET with `openssl rand -hex 32`
- [ ] Never commit `.env` files (use `.env.example` instead)
- [ ] Set NEXTAUTH_URL to your actual domain
- [ ] Enable HTTPS on production (Vercel does this automatically)
- [ ] Validate all API inputs
- [ ] Use secure JWT secrets (20+ characters)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "NEXTAUTH_URL is missing" | Add to Vercel Environment Variables |
| "Cannot find module 'next-auth'" | Run `npm install next-auth` in frontend folder |
| "API returns 500 error" | Check backend URL, ensure backend is running |
| Build fails on Vercel | Check logs in Vercel dashboard, ensure `package.json` is valid |
| "Git not recognized" | Install Git from https://git-scm.com/download/win |

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel build & deployment config |
| `frontend/next.config.js` | Next.js configuration |
| `frontend/app/api/auth/[...nextauth]/route.js` | NextAuth setup |
| `frontend/app/api/students/route.js` | Student API proxy |
| `frontend/app/api/courses/route.js` | Courses API proxy |
| `frontend/app/api/enrollments/route.js` | Enrollments API proxy |
| `VERCEL_DEPLOYMENT.md` | Detailed Vercel guide |
| `push_to_github.ps1` | Helper script for Git push |

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org
- **Express Docs**: https://expressjs.com
- **GitHub Help**: https://docs.github.com

---

## ✅ What You've Got

This project includes:
- ✅ Full-stack Student Management System
- ✅ Responsive UI with Tailwind CSS
- ✅ Secure authentication with NextAuth
- ✅ API routes (no external backend needed for Vercel)
- ✅ Database schema and migrations
- ✅ Admin panel
- ✅ Comprehensive documentation
- ✅ Production-ready config

---

## 🎯 Next Steps

1. **Install Git & Node.js** (if needed)
2. **Push to GitHub** (see section 2 above)
3. **Connect to Vercel** (see section 3 above)
4. **Set environment variables** and deploy
5. **Test your app** at `https://your-project.vercel.app`

**Estimated time: 10-15 minutes**

---

Generated: February 24, 2026
Email: w.lachkar@esisa.ac.ma
Repository: https://github.com/wlachkar-tech/sm-.git

