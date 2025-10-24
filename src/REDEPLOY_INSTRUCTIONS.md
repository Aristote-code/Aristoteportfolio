# 🔄 Redeploy Edge Function

All endpoints have been updated to use the `/server` function. You need to redeploy to apply these changes.

## Quick Redeploy

Run this command from your project root:

```bash
supabase functions deploy server --project-ref qiaichppehdzfhyvneoy
```

## Verify Deployment

After deploying, test the health endpoint:

```
https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/health
```

Should return: `{"status":"ok"}` ✅

## What Changed?

All routes now use clean paths without the old `make-server-583db2fc` prefix:

### Old Routes → New Routes

**Public Routes:**
- ❌ `/make-server-583db2fc/projects` → ✅ `/server/projects`
- ❌ `/make-server-583db2fc/comments` → ✅ `/server/comments`
- ❌ `/make-server-583db2fc/contact` → ✅ `/server/contact`
- ❌ `/make-server-583db2fc/user-joined` → ✅ `/server/user-joined`
- ❌ `/make-server-583db2fc/health` → ✅ `/server/health`
- ❌ `/make-server-583db2fc/upload-image` → ✅ `/server/upload-image`

**Admin Routes:**
- ❌ `/make-server-583db2fc/admin/projects` → ✅ `/server/admin/projects`
- ❌ `/make-server-583db2fc/admin/projects/:id` → ✅ `/server/admin/projects/:id`

## What's Updated?

✅ **App.tsx** - All comment routes  
✅ **ProjectsSection.tsx** - Project fetching  
✅ **ContactSection.tsx** - Contact form  
✅ **AdminPanel.tsx** - All admin routes  
✅ **ImageUpload.tsx** - Image upload route  
✅ **Edge Function** - All route definitions  

## After Deployment

1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Check admin panel** - Should show "Connected" badge
3. **Test image upload** - Create/edit project and upload cover image
4. **Test all features**:
   - [ ] Create new project
   - [ ] Upload images
   - [ ] Save project
   - [ ] View on portfolio
   - [ ] Add comments
   - [ ] Submit contact form

Everything should work with the cleaner `/server` endpoint! 🚀
