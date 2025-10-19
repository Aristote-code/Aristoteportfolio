# 🚀 Quick Start Guide

Your portfolio is ready! Just follow these simple steps to get everything working.

## ✅ Step 1: Redeploy Edge Function (2 minutes)

The function routes have been updated to use `/server`. Redeploy:

```bash
supabase functions deploy server --project-ref qiaichppehdzfhyvneoy
```

**Verify it worked:**  
Visit: https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/health  
Should see: `{"status":"ok"}`

---

## ✅ Step 2: Create Storage Bucket (2 minutes)

1. **Go to Supabase Storage:**  
   https://supabase.com/dashboard/project/qiaichppehdzfhyvneoy/storage/buckets

2. **Click "Create a new bucket"**

3. **Configure:**
   - **Name:** `project-images`
   - **Public bucket:** ✅ **YES** (IMPORTANT!)
   - Click **Create**

---

## ✅ Step 3: Test Your Admin Panel (5 minutes)

1. **Open your portfolio**

2. **Access admin panel:** Add `#admin` to URL or press `Ctrl+Shift+A`

3. **Login:**
   - Email: `gahimaaristote1@gmail.com`
   - Password: `Ari#toteprince1960`

4. **Should see "Connected" badge** (green) in top bar

5. **Create your first project:**
   - Click **"New Project"**
   - **Upload cover image** - Try all three methods:
     - Drag a file from desktop
     - Copy an image and press `Ctrl+V`
     - Click to browse
   - Fill in title and description
   - Add some tags (press Enter after each)
   - Choose a card color
   - Add text and image blocks
   - **Save**

6. **View on portfolio:** Navigate to Projects section - your project should appear!

---

## 🎉 You're Done!

Your portfolio now has:

- ✅ **Professional image uploads** (drag/drop/paste)
- ✅ **Project management system** (saved to Supabase)
- ✅ **Rich text editor** (select text to format)
- ✅ **Comment system** (press `C` to add comments)
- ✅ **Contact form** (with email notifications)
- ✅ **Collaborative features** (cursor followers)

---

## 📖 Additional Resources

- **Complete deployment guide:** `DEPLOYMENT_CHECKLIST.md`
- **Storage setup details:** `SUPABASE_STORAGE_SETUP.md`
- **Admin panel features:** `ADMIN_PANEL_NEW_FEATURES.md`
- **Email notifications:** `EMAIL_NOTIFICATIONS_SETUP.md`

---

## 🆘 Troubleshooting

### Admin panel shows "Local Mode"
- Redeploy function: `supabase functions deploy server --project-ref qiaichppehdzfhyvneoy`
- Hard refresh browser: `Ctrl+Shift+R`
- Check health endpoint is working

### Images don't upload
- Create storage bucket named `project-images`
- Make sure it's **public**
- Redeploy function after creating bucket

### Projects don't save
- Check admin panel shows "Connected" (not "Local Mode")
- Check browser console for errors
- Verify function is deployed

---

## 🎨 Start Creating!

Your FigJam-style portfolio is ready for your projects. Login to the admin panel and start showcasing your work! ✨
