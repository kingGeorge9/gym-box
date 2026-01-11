# 🚀 Vercel Deployment Guide

## Prerequisites

- ✅ Convex account and deployment
- ✅ GitHub account
- ✅ Vercel account

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Vercel deployment"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New" → "Project"**
3. **Import your GitHub repository**
4. **Configure Project:**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`

5. **Add Environment Variables:**

   ```
   NEXT_PUBLIC_CONVEX_URL=https://academic-wildebeest-313.convex.cloud
   ```

6. **Click "Deploy"** 🎉

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add environment variables when asked
```

## Step 3: Set Production URL in Convex (Optional)

If you need to configure CORS or webhooks:

1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Navigate to your project settings
3. Add your Vercel URL: `https://your-app.vercel.app`

## Step 4: Test Your Deployment

Visit your Vercel URL and test:

- ✅ Home page loads
- ✅ Generate program page works
- ✅ Profile page displays correctly
- ✅ Anonymous UUID persists across sessions

## Required Environment Variables

Only **one** environment variable is required:

```bash
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
```

## Current Configuration

- ✅ **Authentication**: Disabled (UUID-based anonymous users)
- ✅ **Database**: Convex (already deployed)
- ✅ **Storage**: localStorage for user UUID
- ✅ **No signup required**: Users auto-assigned UUID on first visit

## Troubleshooting

### Build Fails

```bash
# Test build locally first
npm run build
```

### Environment Variables Missing

- Ensure `NEXT_PUBLIC_CONVEX_URL` is set in Vercel dashboard
- Variables starting with `NEXT_PUBLIC_` are exposed to the browser

### UUID Not Persisting

- Check browser console for localStorage errors
- Ensure cookies/localStorage not blocked

## Post-Deployment

1. **Test all features** in production
2. **Monitor Convex usage** in dashboard
3. **Check Vercel analytics** for errors
4. **Set up custom domain** (optional)

## Support

- Vercel Docs: https://vercel.com/docs
- Convex Docs: https://docs.convex.dev
- Next.js Docs: https://nextjs.org/docs
