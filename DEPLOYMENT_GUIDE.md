# Deployment Guide - CORS Fixed

## ✅ What Was Fixed

### CORS Configuration
- **Problem**: The OPTIONS handler was using `Access-Control-Allow-Origin: *` with `credentials: true`, which is invalid
- **Solution**: Removed the conflicting OPTIONS handler and improved the CORS middleware to dynamically handle origins
- **Result**: Proper CORS support for Vercel deployments, localhost, and preview branches

### Configuration Updates
- Updated `vercel.json` with proper build settings and security headers
- CORS now properly handles all Vercel preview deployments with regex pattern matching

---

## 🚀 Step 1: Deploy Supabase Edge Function

### Install Supabase CLI (if not already installed)

```bash
# macOS
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

### Login to Supabase

```bash
supabase login
```

### Link Your Project

```bash
cd /Users/apple/projects/Aristoteportfolio
supabase link --project-ref YOUR_PROJECT_REF
```

**To find your project ref:**
1. Go to https://app.supabase.com/
2. Select your project
3. The project ref is in the URL: `https://app.supabase.com/project/YOUR_PROJECT_REF`

### Deploy the Edge Function

```bash
supabase functions deploy server
```

### Set Environment Variables (Required)

```bash
# Set the Supabase URL (automatically available in edge functions)
# Set the service role key
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Set admin key for authentication
supabase secrets set ADMIN_KEY="admin_key_aristote_2025"

# Set Resend API key for email notifications
supabase secrets set RESEND_API_KEY="your-resend-api-key"
```

**To find your service role key:**
1. Go to Project Settings > API
2. Copy the `service_role` key (keep this secret!)

### Verify Deployment

```bash
# Check function logs
supabase functions logs server

# Test health endpoint
curl https://YOUR_PROJECT_REF.supabase.co/functions/v1/server/health
```

---

## 🌐 Step 2: Deploy Frontend to Vercel

### Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy to Production

```bash
cd /Users/apple/projects/Aristoteportfolio
vercel --prod
```

### Set Environment Variables in Vercel

After deployment, you need to add your environment variables:

```bash
# Or use the Vercel dashboard:
# 1. Go to your project on vercel.com
# 2. Settings > Environment Variables
# 3. Add these variables:
```

**Required Environment Variables:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

**Note**: If your app uses these variables, make sure they're set in Vercel dashboard.

---

## 🔧 Step 3: Update Allowed Origins (if needed)

If you get a new Vercel URL, update the allowed origins in the edge function:

Edit `/supabase/functions/server/index.ts`:

```typescript
const allowedOrigins = [
  'https://aristoteportfolio-fq729pf8n-aristote-codes-projects.vercel.app',
  'https://aristoteportfolio.vercel.app',
  'https://YOUR-NEW-DEPLOYMENT.vercel.app', // Add your new URL here
  'http://localhost:3000',
  'http://localhost:5173',
];
```

Then redeploy the edge function:

```bash
supabase functions deploy server
```

---

## 🧪 Testing CORS

### Test from localhost

```bash
# Start your dev server
npm run dev

# The app should now connect to your Supabase edge function without CORS errors
```

### Test from Vercel

After deploying to Vercel, visit your site and check the browser console. You should see no CORS errors.

### Manual CORS Test

```bash
# Test with curl (replace with your URLs)
curl -X OPTIONS https://YOUR_PROJECT_REF.supabase.co/functions/v1/server/health \
  -H "Origin: https://YOUR-VERCEL-APP.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

You should see:
- `Access-Control-Allow-Origin: https://YOUR-VERCEL-APP.vercel.app`
- `Access-Control-Allow-Credentials: true`
- Status: 204 or 200

---

## 📝 Common Issues & Solutions

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**: Make sure your Vercel domain is in the `allowedOrigins` array and redeploy the edge function.

### Issue: "CORS policy: Credentials flag is true, but Access-Control-Allow-Credentials is not"

**Solution**: This is already fixed in the new CORS configuration. Redeploy the edge function.

### Issue: Supabase CLI commands not working

**Solution**: 
- Make sure you're linked to the correct project: `supabase projects list`
- Re-link if needed: `supabase link --project-ref YOUR_PROJECT_REF`

### Issue: TypeScript error "Cannot find name 'Deno'"

**Solution**: This is a false positive - ignore it. The code runs in a Deno runtime where `Deno` is globally available. Your IDE just doesn't know about it.

---

## 🎯 Quick Deployment Commands

```bash
# Deploy edge function
supabase functions deploy server

# Deploy frontend to Vercel
vercel --prod

# View logs
supabase functions logs server --follow
```

---

## ✨ Your CORS Configuration Features

✅ Support for multiple production domains  
✅ Automatic support for all Vercel preview deployments  
✅ Local development support (localhost:3000, localhost:5173)  
✅ Credentials support for authenticated requests  
✅ Proper preflight request handling  
✅ 10-minute preflight cache for performance  

---

## 📚 Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Hono CORS Middleware](https://hono.dev/middleware/builtin/cors)

---

**Need help?** Check the function logs with `supabase functions logs server`
