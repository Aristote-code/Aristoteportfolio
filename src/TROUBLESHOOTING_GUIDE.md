# 🔧 Troubleshooting Guide - Commenting & Email Issues

## Problem: Commenting and Email Notifications Not Working

This guide will help you diagnose and fix issues with the commenting system and email notifications.

---

## Step 1: Check Browser Console 🔍

Open your browser's Developer Tools (F12 or right-click → Inspect) and go to the Console tab.

### What to Look For:

When you try to:
- **Add a comment**: Look for logs starting with 🔵, 📦, 📬, 📄
- **Submit contact form**: Similar logs will appear
- **Enter your name**: Look for user-joined logs

### Expected Output (Success):
```
🔵 Posting comment to: https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/comments
📦 Payload: {x: 100, y: 200, ...}
📬 Response status: 200 OK
📄 Response data: {comment: {...}, success: true}
✅ Comment posted successfully
```

### Error Indicators:
- ❌ symbols indicate failures
- Status codes other than 200 (e.g., 403, 404, 500)
- CORS errors
- Network errors

---

## Step 2: Verify Edge Function Deployment 🚀

### Check if Edge Function is Deployed:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select project: **qiaichppehdzfhyvneoy**
3. Navigate to: **Edge Functions** (left sidebar)
4. Check if **server** function is listed and deployed

### Expected Status:
- ✅ Function name: `server`
- ✅ Status: Active/Deployed
- ✅ Last deployed: Recent date

### If Not Deployed:
Run this command in your terminal:
```bash
npx supabase functions deploy server --project-ref qiaichppehdzfhyvneoy
```

---

## Step 3: Verify Environment Variables 🔐

The Edge Function needs these environment variables to work:

### Required Variables:

1. **RESEND_API_KEY** - For sending emails
2. **SUPABASE_URL** - Auto-set by Supabase
3. **SUPABASE_SERVICE_ROLE_KEY** - Auto-set by Supabase
4. **ADMIN_KEY** (optional) - For admin authentication

### How to Check:

1. Go to Supabase Dashboard
2. Click on your project
3. Go to: **Project Settings** → **Edge Functions** → **Secrets**
4. Verify `RESEND_API_KEY` exists

### If Missing RESEND_API_KEY:

1. Get your API key from: https://resend.com/api-keys
2. Add it to Supabase:
   ```bash
   npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx --project-ref qiaichppehdzfhyvneoy
   ```
3. Redeploy the function after adding secrets

---

## Step 4: Test Endpoints Directly 🧪

### Test Comment Endpoint:

Open a new browser tab and paste this in the console:

```javascript
fetch('https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/comments', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWljaHBwZWhkemZoeXZuZW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDYzNDAsImV4cCI6MjA3NjMyMjM0MH0.YVROD96sRl1Hs_ng8D01vwCiod4FTx4MRnCvb1-HIAA'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Comments:', data))
.catch(err => console.error('❌ Error:', err));
```

**Expected Result**: `{comments: [...]}`

---

## Step 5: Check CORS Issues 🌐

### Common CORS Error:
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

### Solution:
The Edge Function already includes CORS middleware (`app.use('*', cors())`), but you may need to redeploy:

```bash
npx supabase functions deploy server --project-ref qiaichppehdzfhyvneoy
```

---

## Step 6: Verify Email Configuration 📧

### Test Email Endpoint:

```javascript
fetch('https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/user-joined', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYWljaHBwZWhkemZoeXZuZW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDYzNDAsImV4cCI6MjA3NjMyMjM0MH0.YVROD96sRl1Hs_ng8D01vwCiod4FTx4MRnCvb1-HIAA',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userName: 'Test User',
    timestamp: new Date().toISOString()
  })
})
.then(r => r.json())
.then(data => console.log('✅ Email response:', data))
.catch(err => console.error('❌ Error:', err));
```

### Check Resend Dashboard:
1. Go to: https://resend.com/emails
2. Check if test email was sent
3. Look for any errors or bounces

---

## Common Issues & Solutions 💡

### Issue 1: "Failed to fetch" Error
**Cause**: Edge Function not deployed or wrong URL
**Solution**: Redeploy function and verify URL

### Issue 2: "Rate limit exceeded"
**Cause**: Too many comments posted quickly
**Solution**: Wait 1 minute and try again

### Issue 3: Email not sending
**Possible Causes**:
- RESEND_API_KEY not set
- Invalid API key
- Resend account not verified
**Solution**: Check environment variables and Resend account status

### Issue 4: 403 Forbidden
**Cause**: CORS or authentication issue
**Solution**: 
- Make sure you're using the public anon key, not service role key
- Redeploy Edge Function with CORS enabled

### Issue 5: Comments appear but emails don't send
**Cause**: RESEND_API_KEY missing or invalid
**Solution**: 
1. Verify API key in Supabase secrets
2. Check Resend dashboard for errors
3. Ensure sending email is verified in Resend

---

## Quick Fix Checklist ✅

- [ ] Edge Function is deployed
- [ ] RESEND_API_KEY is set in Supabase secrets
- [ ] Browser console shows detailed logs (🔵, 📬, ✅, ❌)
- [ ] No CORS errors in console
- [ ] Endpoint URLs are correct (https://qiaichppehdzfhyvneoy.supabase.co/functions/v1/server/...)
- [ ] Resend account is active and verified
- [ ] Test endpoints work when called directly

---

## Still Having Issues? 🆘

1. **Check the Edge Function logs** in Supabase Dashboard → Edge Functions → server → Logs
2. **Clear browser cache** and hard reload (Ctrl+Shift+R)
3. **Try in incognito mode** to rule out extension issues
4. **Check network tab** in Developer Tools for failed requests

---

## Contact Information

If issues persist after following this guide:
- Review the detailed console logs (all messages with 🔵, 📬, ❌)
- Check Supabase Edge Function logs
- Verify all environment variables are set correctly
