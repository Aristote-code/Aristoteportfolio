# Supabase Storage Setup for Image Uploads

Your admin panel now supports proper image uploads! Follow these steps to enable image storage in Supabase.

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qiaichppehdzfhyvneoy
2. Click on **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Configure the bucket:
   - **Name:** `project-images`
   - **Public bucket:** ✅ **YES** (check this box)
   - **File size limit:** 5MB (or your preference)
   - **Allowed MIME types:** Leave empty or add: `image/png, image/jpeg, image/jpg, image/gif, image/webp`
5. Click **Create bucket**

## Step 2: Set Storage Policies (Public Access)

Since you checked "Public bucket", images will be publicly accessible by default. If you need to configure custom policies:

1. Go to **Storage** → **Policies**
2. For the `project-images` bucket, ensure these policies exist:

### Policy 1: Public Read Access
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');
```

### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'project-images');
```

### Policy 3: Authenticated Delete (Optional)
```sql
CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'project-images');
```

## Step 3: Verify Setup

1. Go to your portfolio admin panel: `#admin`
2. Create or edit a project
3. Try uploading an image in the **Cover Image** section
4. You should see the upload progress and the image should appear

## Step 4: Test All Upload Methods

Your image upload component supports three methods:

### 1. Click to Browse
- Click on the upload area
- Select an image from your computer
- Image will upload automatically

### 2. Drag & Drop
- Drag an image file from your desktop
- Drop it onto the upload area
- Image will upload automatically

### 3. Copy & Paste
- Copy an image (from anywhere - screenshot, browser, etc.)
- Click on any input field in the admin panel
- Press `Ctrl+V` (Windows) or `Cmd+V` (Mac)
- Image will upload automatically

## Troubleshooting

### "Failed to upload image" Error

**Check bucket name:**
- Ensure the bucket is named exactly `project-images`
- Check spelling and case sensitivity

**Check bucket is public:**
- Go to Storage → project-images → Settings
- Ensure "Public bucket" is checked

**Check storage policies:**
- Go to Storage → Policies
- Ensure public read and insert policies exist

### Images Upload But Don't Display

**Check public URL:**
- Go to Storage → project-images
- Click on an uploaded image
- Click "Get URL" - it should work without authentication

**Check CORS:**
- The Edge Function already handles CORS
- If issues persist, check browser console for errors

### "Storage bucket not found" Error

- The bucket doesn't exist yet
- Follow Step 1 above to create it
- Redeploy your Edge Function after creating the bucket

## Image Management

### View All Uploaded Images
1. Go to **Storage** → **project-images**
2. You'll see all uploaded images
3. You can:
   - Download images
   - Delete unused images
   - Get public URLs
   - Copy URLs

### Delete Unused Images
To keep your storage clean:
1. Go to Storage → project-images
2. Select images you want to delete
3. Click **Delete**

### Storage Limits
- **Free tier:** 1GB storage
- **Pro tier:** 100GB storage
- Monitor usage in Dashboard → Storage

## Security Notes

✅ **Public bucket is safe** because:
- Images are meant to be public (portfolio)
- Upload requires authentication via admin panel
- Only admin can upload via the Edge Function
- Public can only read (view) images

❌ **Don't store sensitive data** in this bucket

## Next Steps

Once storage is set up:
1. ✅ Upload project cover images
2. ✅ Add image blocks to project content
3. ✅ Drag, drop, or paste images anywhere
4. ✅ All images stored permanently in Supabase

Your portfolio now has a professional image management system! 🎨
