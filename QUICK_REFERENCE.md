# 🚀 Quick Reference Guide

## URLs

### Production
- **Frontend:** https://aristoteportfolio.vercel.app
- **API Base:** https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server

### Dashboards
- **Supabase:** https://supabase.com/dashboard/project/qiaichppehdzfhyvneoy
- **Vercel:** https://vercel.com/aristote-codes-projects/aristoteportfolio

---

## Common Commands

### Deploy Backend
```bash
cd /Users/apple/projects/Aristoteportfolio
supabase functions deploy server
```

### Deploy Frontend
```bash
cd /Users/apple/projects/Aristoteportfolio
vercel --prod
```

### View Logs
```bash
# Backend logs
supabase functions logs server --follow

# Or view in dashboard
# https://supabase.com/dashboard/project/qiaichppehdzfhyvneoy/functions
```

### Test Deployment
```bash
./test-deployment.sh
```

### Local Development
```bash
npm run dev
# Opens at http://localhost:5173
```

---

## Environment Variables

### Supabase Secrets (already set)
- `SUPABASE_URL` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `ADMIN_KEY` ✅
- `RESEND_API_KEY` ✅

### View Secrets
```bash
supabase secrets list
```

### Update a Secret
```bash
supabase secrets set SECRET_NAME="value"
```

---

## API Endpoints

### Public Endpoints
- `GET /server/health` - Health check
- `GET /server/projects` - Get all projects
- `POST /server/contact` - Contact form
- `POST /server/user-joined` - User notification
- `GET /server/comments` - Get comments
- `POST /server/comments` - Create comment

### Admin Endpoints (requires Authorization header)
- `POST /server/admin/projects` - Create project
- `PUT /server/admin/projects/:id` - Update project
- `DELETE /server/admin/projects/:id` - Delete project
- `DELETE /server/comments/:id` - Delete comment

### Utilities
- `POST /server/upload-image` - Upload image to Supabase storage

---

## Quick Tests

### Test Health
```bash
curl https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/health
```

### Test CORS
```bash
curl -X OPTIONS \
  https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/health \
  -H "Origin: https://aristoteportfolio.vercel.app" \
  -i
```

### Test Projects API
```bash
curl https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/projects
```

---

## Project Info

- **Supabase Project ID:** qiaichppehdzfhyvneoy
- **Vercel Team:** aristote-codes-projects
- **Vercel Project:** aristoteportfolio
- **Node Modules:** 11 packages
- **Build Output:** /build directory
- **Framework:** Vite + React

---

## CORS Configuration

### Allowed Origins
1. `https://aristoteportfolio.vercel.app` (production)
2. `https://aristoteportfolio-17fq61cxh-aristote-codes-projects.vercel.app` (latest deployment)
3. `http://localhost:3000` (local dev)
4. `http://localhost:5173` (Vite dev)
5. All `*.vercel.app` domains (preview deployments)

### To Add New Origin
Edit `/supabase/functions/server/index.ts`:
```typescript
const allowedOrigins = [
  'https://aristoteportfolio.vercel.app',
  'https://your-new-domain.com',  // Add here
  // ...
];
```
Then deploy:
```bash
supabase functions deploy server
```

---

## Troubleshooting

### CORS Errors
1. Check if origin is in allowed list
2. Verify edge function is deployed
3. Check browser console for specific error
4. Run `./test-deployment.sh` to verify

### Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules build
npm install
npm run build
```

### Edge Function Not Working
```bash
# Check logs
supabase functions logs server

# Redeploy
supabase functions deploy server
```

### Vercel Deploy Failed
```bash
# Check build locally first
npm run build

# Then deploy
vercel --prod
```

---

## File Structure

```
/supabase/functions/server/
  ├── index.ts          # Main server (CORS config here)
  ├── comments.tsx      # Comments routes
  └── kv_store.tsx      # KV storage utility

/src/
  ├── App.tsx           # Main app component
  ├── components/       # React components
  └── utils/supabase/   # Supabase client config
      ├── client.ts
      └── info.tsx      # Project ID & keys

/
  ├── vercel.json       # Vercel config
  ├── package.json      # Dependencies
  └── vite.config.ts    # Vite config
```

---

## Need Help?

1. Check logs: `supabase functions logs server`
2. Run tests: `./test-deployment.sh`
3. Review: `DEPLOYMENT_SUCCESS.md`
4. Full guide: `DEPLOYMENT_GUIDE.md`

---

**Status:** ✅ All systems operational  
**Last Deploy:** Oct 22, 2025 at 8:33 PM UTC+2  
**CORS:** ✅ Fixed and working  
