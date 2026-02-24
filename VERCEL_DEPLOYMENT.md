# Vercel Deployment Guide – Student Management App

## Overview

This guide explains how to deploy the **Student Management App** frontend and backend to Vercel with **zero serverless issues**.

### Key Features
- ✅ **Unified Next.js Deployment**: Frontend + API proxy routes in a single Vercel project
- ✅ **No Cold-Start Delays**: All API routes inside Next.js (no external backend calls needed)
- ✅ **JWT Authentication**: Secure NextAuth integration with token-based auth
- ✅ **Scalable**: Auto-scaling Vercel serverless functions
- ✅ **Environment-Ready**: All configs for production

---

## Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend + API)         │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  Next.js Frontend (App Router)  │  │
│  │  - React Pages                  │  │
│  │  - Tailwind CSS Styling         │  │
│  └─────────────────────────────────┘  │
│                 ↓                       │
│  ┌─────────────────────────────────┐  │
│  │  NextAuth + API Routes          │  │
│  │  - /api/auth/[...nextauth]      │  │
│  │  - /api/students                │  │
│  │  - /api/courses                 │  │
│  │  - /api/enrollments             │  │
│  └─────────────────────────────────┘  │
│                 ↓                       │
└─────────────────────────────────────────┘
         ↓ (if external backend)
  ┌──────────────────────┐
  │ External Backend     │
  │ (Express + SQLite)   │
  │ (Optional)           │
  └──────────────────────┘
```

---

## Deployment Steps

### 1. **Prepare GitHub Repository**

```bash
cd C:\Users\HUAWEI\Desktop\student

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit – Student Management App"

# Add remote and push
git remote add origin https://github.com/wlachkar-tech/sm-.git
git branch -M main
git push -u origin main
```

**Note**: Use a GitHub Personal Access Token (PAT) if prompted:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Create a token with `repo` scope
3. Use token as password when pushing

---

### 2. **Connect Vercel to GitHub**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Select **Import Git Repository**
4. Choose your repo: `wlachkar-tech/sm-`
5. Click **Import**

---

### 3. **Configure Environment Variables**

In Vercel project settings:

| Variable | Value | Required |
|----------|-------|----------|
| `NEXTAUTH_URL` | `https://<your-vercel-domain>.vercel.app` | ✅ Yes |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -hex 32` | ✅ Yes |
| `NEXT_PUBLIC_API_URL` | `https://<backend-url>/api` (optional) | ❌ No |

**Steps in Vercel Dashboard:**
1. Go to **Settings** → **Environment Variables**
2. Add each variable above
3. Select **Production** for deployment
4. Click **Save**

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -hex 32
# Output: abc123def456...xyz789
# Copy this value into NEXTAUTH_SECRET
```

---

### 4. **Deploy**

1. In Vercel, click **Deploy**
2. Build will start automatically (takes 2-5 minutes)
3. Once complete, visit your live URL: `https://<your-project>.vercel.app`

---

## Testing the Deployment

### 1. **Test Frontend**
```bash
# Open in browser
https://<your-project>.vercel.app

# Should see:
# - Login page
# - Responsive design
# - No console errors
```

### 2. **Test NextAuth**
```bash
# Try login with test credentials (if available)
# Email: test@example.com
# Password: password123

# If successful:
# - Redirects to dashboard
# - Session created with JWT token
```

### 3. **Test API Routes**
```bash
# Open browser console (F12) and run:

# Test students endpoint
fetch('/api/students', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json()).then(console.log)

# Test courses endpoint
fetch('/api/courses', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json()).then(console.log)

# Test enrollments endpoint
fetch('/api/enrollments', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json()).then(console.log)
```

---

## Optional: Deploy Backend Separately

If you want to host the backend outside Vercel:

### Option A: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select the `backend` folder
4. Set environment variables (JWT_SECRET, PORT, etc.)
5. Deploy
6. Get backend URL and update Vercel's `NEXT_PUBLIC_API_URL`

### Option B: Heroku (free alternative)
1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect GitHub repo
4. Deploy from branch
5. Set environment variables in settings
6. Get backend URL

### Option C: Render
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub
4. Configure build command and environment
5. Deploy

---

## Environment Variables Reference

### Local Development (`frontend/.env.local`)
```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key
```

### Vercel Production (`vercel.json` + Vercel Dashboard)
```json
{
  "env": {
    "NEXTAUTH_URL": "https://yourdomain.vercel.app",
    "NEXTAUTH_SECRET": "<generate-with-openssl>",
    "NEXT_PUBLIC_API_URL": "https://api-backend.com/api"
  }
}
```

---

## Troubleshooting

### 1. **"NEXTAUTH_URL is missing"**
- Solution: Add `NEXTAUTH_URL` in Vercel Environment Variables
- Value: Your Vercel domain (e.g., `https://myapp.vercel.app`)

### 2. **"Cannot find module 'next-auth'"**
- Solution: Ensure `next-auth` is in `frontend/package.json`
- Run: `npm install next-auth`

### 3. **"API calls return 500 error"**
- Check backend URL in `NEXT_PUBLIC_API_URL`
- Verify backend is running and accessible
- Check CORS headers in backend

### 4. **Long build times**
- Caused by `npm install` on every deploy
- Solution: Use Vercel's build cache (Settings → General → Build & Development Settings)

### 5. **"Cold start" / slow first request**
- Normal for serverless; happens on first deployment
- Subsequent requests are fast
- Use regional endpoints to reduce latency

---

## Vercel Configuration Files

### `vercel.json` (Project Root)
- **Purpose**: Configures build, rewrites, headers, and regions
- **Key Settings**:
  - `framework`: "nextjs" (auto-detected)
  - `nodeVersion`: "18.x" (compatible with Next.js 14)
  - `functions`: API route settings (30s timeout, 1GB memory)
  - `rewrites`: Routes API calls to correct handlers
  - `headers`: Cache policy (API routes: no-cache)

### `next.config.js` (Frontend Root)
- **Purpose**: Next.js build configuration
- **Key Settings**:
  - `reactStrictMode`: true
  - `env`: Passes environment variables to client

---

## Performance Tips

1. **Enable ISR (Incremental Static Regeneration)**
   - Add `revalidate` to page exports
   - Reduces build times for changes

2. **Use API caching**
   - Set `Cache-Control` headers in API routes
   - Reduces database queries

3. **Optimize images**
   - Use `<Image>` component from next/image
   - Auto-optimizes for different devices

4. **Enable compression**
   - Vercel automatically compresses responses
   - Set `compress: true` in `next.config.js`

---

## Security Best Practices

1. **Never commit secrets**
   - Use `.env` files (added to `.gitignore`)
   - Set secrets in Vercel dashboard only

2. **Use HTTPS only**
   - Vercel enforces HTTPS automatically

3. **Validate all inputs**
   - Check API routes validate request data
   - Use validation libraries (zod, joi, etc.)

4. **Rate limiting**
   - Consider adding rate limiting middleware
   - Prevents abuse and DDoS attacks

---

## Monitoring and Logs

### View Logs in Vercel
1. Go to Vercel dashboard → Select project
2. Click **"Deployments"**
3. Click on a deployment → **"Logs"**
4. Filter by function or search for errors

### Real-time Monitoring
1. Use Vercel Analytics (Pro plan)
2. Monitor performance, errors, and usage
3. Get alerts for failed deployments

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Vercel project from GitHub
3. ✅ Set environment variables
4. ✅ Deploy
5. ✅ Test all features
6. ✅ Set up monitoring

---

**For questions or issues, refer to:**
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth Docs](https://next-auth.js.org)

