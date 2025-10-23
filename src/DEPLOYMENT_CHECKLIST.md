# 🚀 Complete Deployment Checklist

Follow this checklist to get your portfolio fully deployed and functional.

## ✅ Part 1: Supabase Database Setup (DONE)

- [x] Supabase project created
- [x] Project ID: `qiaichppehdzfhyvneoy`
- [x] API keys configured
- [x] Database connected

## ✅ Part 2: Deploy Edge Function

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

Or use npx:
```bash
npx supabase login
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref qiaichppehdzfhyvneoy
```

### 4. Set Environment Secrets

```bash
supabase secrets set ADMIN_KEY=admin_key_aristote_2025
```

*Optional: Add Resend API key for email notifications*
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### 5. Deploy the Function

```bash
supabase functions deploy make-server-583db2fc --project-ref qiaichppehdzfhyvneoy
```

### 6. Verify Deployment

Visit: `https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/make-server-583db2fc/health`

Should return: `{"status":"ok"}`

---

## ✅ Part 3: Set Up Image Storage

### 1. Create Storage Bucket

1. Go to: https://supabase.com/dashboard/project/qiaichppehdzfhyvneoy/storage/buckets
2. Click **"Create a new bucket"**
3. Settings:
   - **Name:** `project-images`
   - **Public bucket:** ✅ **YES** (IMPORTANT!)
   - Click **Create**

### 2. Verify Storage Policies

The bucket should have these policies automatically:
- ✅ Public read access (anyone can view images)
- ✅ Authenticated upload (only via admin panel)

### 3. Test Image Upload

1. Go to your portfolio `#admin`
2. Login with credentials
3. Create/edit a project
4. Upload a cover image
5. Should work! ✨

---

## ✅ Part 4: Test Admin Panel Features

Log in to `#admin` with:
- **Email:** `gahimaaristote1@gmail.com`
- **Password:** `Ari#toteprince1960`

### Test These Features:

- [ ] **Login works** - You can access the admin panel
- [ ] **"Connected" badge shows** - Green badge in top bar (not "Local Mode")
- [ ] **Create project** - Click "New Project" button
- [ ] **Upload cover image** - Drag/drop/paste/browse
- [ ] **Add project title** - Enter a title
- [ ] **Add description** - Enter short description
- [ ] **Add tags** - Type and press Enter
- [ ] **Choose card color** - Click a color swatch
- [ ] **Add text blocks** - Click "+ Text" button
- [ ] **Format text** - Select text to see toolbar (bold, italic, etc.)
- [ ] **Add image blocks** - Click "+ Image" button
- [ ] **Upload block images** - Drag/drop/paste images
- [ ] **Save project** - Click "Save Project"
- [ ] **View on portfolio** - Navigate to Projects section
- [ ] **Project appears** - Your saved project shows up!

---

## ✅ Part 5: Test Public Features

### 1. Comment System
- [ ] Visit your portfolio (not admin)
- [ ] Press `C` key to enter comment mode
- [ ] Click anywhere to add a comment
- [ ] Comment saves and appears
- [ ] Drag comment to reposition
- [ ] Reply to comment
- [ ] Resolve/delete comment

### 2. Contact Form
- [ ] Fill out contact form
- [ ] Submit form
- [ ] Should see success message
- [ ] (Optional) Check email if Resend is configured

### 3. Name Prompt
- [ ] Open portfolio in incognito/private window
- [ ] Should see name prompt dialog
- [ ] Enter your name
- [ ] Should see custom cursor with your name

### 4. Cursor Followers
- [ ] Open portfolio in two different browsers
- [ ] Enter different names in each
- [ ] Move mouse in one browser
- [ ] Should see cursor follower in other browser (if real-time sync is set up)

---

## ✅ Part 6: Optional - Email Notifications

### 1. Sign Up for Resend

1. Go to https://resend.com
2. Create account
3. Get API key from dashboard

### 2. Add Domain (Optional)

For production emails:
1. Add your domain in Resend dashboard
2. Add DNS records they provide
3. Verify domain

Or use `onboarding@resend.dev` for testing.

### 3. Configure in Supabase

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

Redeploy function:
```bash
supabase functions deploy make-server-583db2fc --project-ref qiaichppehdzfhyvneoy
```

### 4. Test Emails

- [ ] Submit contact form → Should receive email
- [ ] Add comment → Should receive email notification
- [ ] User joins (enters name) → Should receive notification

---

## ✅ Part 7: Deploy Your Portfolio Website

### Option A: Deploy to Netlify

1. Push your code to GitHub
2. Go to https://netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repo
5. Build settings:
   - **Build command:** (leave default or `npm run build`)
   - **Publish directory:** `dist` or `build`
6. Click "Deploy"

### Option B: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Add New" → "Project"
4. Import your GitHub repo
5. Click "Deploy"

### Option C: Deploy to Cloudflare Pages

1. Push your code to GitHub
2. Go to https://pages.cloudflare.com
3. Click "Create a project"
4. Connect your repo
5. Configure build settings
6. Deploy

### After Deployment:

- [ ] Visit your live URL
- [ ] Test all features still work
- [ ] Admin panel accessible at `yoursite.com#admin`
- [ ] Projects load from Supabase
- [ ] Comments work
- [ ] Contact form works

---

## 🎯 Final Checks

### Admin Panel
- [x] Can login
- [x] Connected to Supabase (green badge)
- [x] Can create projects
- [x] Can upload images
- [x] Rich text editor works
- [x] Projects save to database

### Public Portfolio
- [x] Projects display correctly
- [x] Images load
- [x] Comment system works
- [x] Contact form works
- [x] Navigation works
- [x] Responsive on mobile

### Performance
- [x] Images load quickly
- [x] No console errors
- [x] Animations smooth
- [x] Works on mobile

---

## 🆘 Common Issues

### Edge Function Not Accessible
**Problem:** Admin panel shows "Local Mode"
**Solution:**
1. Check function is deployed: Visit health endpoint
2. Check secrets are set correctly
3. Redeploy function
4. Hard refresh browser (Ctrl+Shift+R)

### Images Don't Upload
**Problem:** "Failed to upload image" error
**Solution:**
1. Check storage bucket exists: `project-images`
2. Check bucket is public
3. Check storage policies
4. See `SUPABASE_STORAGE_SETUP.md`

### Comments Don't Save
**Problem:** Comments disappear after refresh
**Solution:**
1. Check Edge Function is deployed
2. Check database has comments table
3. Check browser console for errors

### Projects Don't Appear
**Problem:** Created projects don't show on portfolio
**Solution:**
1. Check admin panel shows "Connected" (not Local Mode)
2. Check browser console for fetch errors
3. Verify project saved successfully

---

## 📚 Additional Resources

- **Supabase Setup:** See `SUPABASE_STORAGE_SETUP.md`
- **Email Setup:** See `EMAIL_NOTIFICATIONS_SETUP.md`
- **Admin Guide:** See `ADMIN_PANEL_GUIDE.md`
- **Function Notes:** See `DEPLOYMENT_NOTES.md`

---

## ✨ You're Done!

Once all checkboxes are complete, your portfolio is:
- ✅ Fully deployed
- ✅ Connected to Supabase
- ✅ Image uploads working
- ✅ Admin panel functional
- ✅ Public features working
- ✅ Ready for the world! 🚀

**Need help?** Check the troubleshooting sections or review the documentation files.
