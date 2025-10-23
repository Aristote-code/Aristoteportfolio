# Email Notifications System - Setup Guide

## ✅ What's Been Implemented

Your portfolio now has a **production-ready email notification system** that sends you emails for both comments and contact form submissions!

### Features Implemented:

✅ **Email notifications via Resend**
- Instant emails when visitors leave comments
- Instant emails when visitors reply to threads
- Instant emails when visitors submit the contact form
- Beautiful HTML emails with deep links and reply buttons

✅ **Deep linking**
- Every email includes a link that opens the exact comment thread
- URL format: `yoursite.com/?comment=123456`
- Auto-scrolls to and opens the specific comment

✅ **Security & Rate Limiting**
- Max 5 comments per minute per IP address
- Text sanitization (XSS protection)
- Character limits enforced (500 chars for comments, 50 for names)

✅ **Notification Logging**
- All email send attempts are logged in database
- Failed sends are tracked for retry
- Message IDs stored for debugging

✅ **Enhanced Comment System**
- Comments now require name (and optionally email)
- All comments persisted to Supabase database
- Replies also require name/email
- Comments survive page refreshes

---

## 🚀 Setup Instructions

### Step 1: Get Your Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Go to **API Keys** in the dashboard
4. Click **Create API Key**
5. Copy your API key (starts with `re_`)

### Step 2: Add the API Key

1. A modal should have appeared asking for your `RESEND_API_KEY`
2. Paste your Resend API key
3. Click Save

**Important:** The free tier of Resend allows:
- 100 emails/day
- 3,000 emails/month
- Perfect for a portfolio!

### Step 3: Configure Your Sender Email (Optional but Recommended)

By default, emails come from `onboarding@resend.dev`. To use your own domain:

1. In Resend dashboard, go to **Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Add the DNS records they provide (SPF, DKIM, DMARC)
4. Update line 107 in `/supabase/functions/server/comments.tsx`:
   ```tsx
   from: 'Portfolio Comments <noreply@yourdomain.com>',
   ```

---

## 📧 How It Works

### When a Visitor Submits the Contact Form:

1. **Visitor fills out** the contact form with:
   - Name (required, max 100 chars)
   - Email (required, validated)
   - Message (required, max 2000 chars)
2. **Form is submitted** to the backend
3. **Email is sent** to `gahimaaristote1@gmail.com`
4. **Email contains:**
   - Visitor's name and email
   - Full message text
   - Timestamp
   - **Reply button** that opens your email client with their address pre-filled
   - Their email is set as reply-to for easy responses
5. **Submission is logged** to database for your records

### When a Visitor Leaves a Comment:

1. **Visitor clicks** on your page (in comment mode, press 'C')
2. **Form appears** asking for:
   - Name (required)
   - Email (optional, for their own notifications)
   - Comment text (required, max 500 chars)
3. **Comment is saved** to Supabase database
4. **Email is sent** to `gahimaaristote1@gmail.com` (your admin email)
5. **Email contains:**
   - Comment text
   - Author name/email
   - Timestamp
   - **Deep link** to open that exact comment
   - Link to admin panel
   - Normalized coordinates for debugging

### When a Visitor Replies:

Same flow as above, but the email subject says "New reply on [page]"

---

## 🔗 Deep Link Magic

Every email includes a button: **"Open Comment Thread"**

Clicking it:
1. Opens your portfolio at the exact page
2. Scrolls to the comment location
3. Opens the comment thread automatically
4. Highlights it so you can respond

The deep link format is:
```
https://yoursite.com/?comment=1234567890-abc123
```

---

## 🎨 Email Design

The emails are beautifully designed with:
- Your portfolio's purple accent color (#8774ff)
- Clean, professional layout
- Mobile-responsive HTML
- Plain-text fallback for email clients that don't support HTML
- Footer links to admin panel and direct comment view

---

## 🔒 Security Features

### Rate Limiting
- **5 comments per minute** per IP address
- Prevents spam and abuse
- Returns a 429 error if exceeded

### Input Sanitization
- All HTML tags stripped from text
- Character limits strictly enforced:
  - Comments: 500 chars
  - Names: 50 chars
  - Emails: 100 chars
- SQL injection prevention via KV store

### Privacy
- Only admin (you) can delete comments
- Visitor emails are optional
- No tracking scripts or analytics
- IP addresses not stored (only used for rate limiting)

---

## 📝 Contact Form Features

Your contact form now includes:

- ✅ **Real-time validation** - All fields required and validated
- ✅ **Character limits** - Prevents spam (100 chars for name/email, 2000 for message)
- ✅ **Email validation** - Ensures valid email format
- ✅ **Success/Error feedback** - Visual confirmation after submission
- ✅ **Form reset** - Automatically clears after successful send
- ✅ **Reply-to support** - Your email client will reply directly to the sender
- ✅ **Submission logging** - All messages stored in database with timestamps
- ✅ **Rate limiting** - Uses same rate limit system as comments (5 per minute)
- ✅ **Security** - HTML tags stripped, XSS prevention, input sanitization

---

## 🛠 Troubleshooting

### Not Receiving Emails?

1. **Check spam folder** - First time senders often go to spam
2. **Verify API key** - Make sure you pasted the correct Resend key
3. **Check Resend dashboard** - View sent emails and delivery status
4. **Check server logs** - Look for errors in your Supabase Edge Function logs

### Deep Links Not Working?

1. Make sure the URL includes `?comment=xxxxx`
2. Wait for page to fully load (comments load from database)
3. Check browser console for errors

### Rate Limit Issues?

If legitimate users are being blocked:
- Edit `/supabase/functions/server/comments.tsx`
- Change line 28: `const RATE_LIMIT_MAX = 5;` to a higher number
- Or change line 27: `const RATE_LIMIT_WINDOW = 60000;` to a larger time window

---

## 📊 Viewing Notification Logs

All email notifications are logged to the database:

**Successful sends:**
```
Key: notification_log:{commentId}:sent
Value: { commentId, status: 'sent', messageId, timestamp }
```

**Failed sends:**
```
Key: notification_log:{commentId}:{timestamp}
Value: { commentId, status: 'failed', error, timestamp }
```

You can query these in your Supabase dashboard or via the KV store API.

---

## 🎯 Testing the System

### Test 1: Contact Form
1. Scroll to the "Let's talk" section
2. Fill in your name, email, and a test message
3. Click "Send"
4. Check for success message
5. Check your email inbox!

### Test 2: Leave a Comment
1. Open your portfolio
2. Press 'C' to enter comment mode
3. Click anywhere on the page
4. Fill in name and comment
5. Submit
6. Check your email!

### Test 3: Reply to a Comment
1. Click on an existing comment pin
2. Click in the reply box
3. Enter your name
4. Type a reply
5. Submit
6. Check your email!

### Test 4: Deep Link
1. Click the "Open Comment Thread" button in the email
2. Verify it opens the exact comment on your site

---

## 🚀 Advanced Configuration

### Change Admin Email

Edit line 5 in `/supabase/functions/server/comments.tsx`:
```tsx
const ADMIN_EMAIL = 'your-new-email@example.com';
```

### Customize Email Template

Edit the `sendEmailNotification` function in `/supabase/functions/server/comments.tsx`:
- HTML template starts at line 82
- Plain text template starts at line 125
- Subject line at line 72

### Add Email Batching (Reduce Noise)

To batch multiple replies into one email, you would:
1. Store pending notifications in the database
2. Use a cron job (Supabase Edge Functions supports scheduled jobs)
3. Send digest every N minutes
4. Clear the pending queue

---

## 📈 Future Enhancements

Ideas for extending the system:

- [ ] Daily digest emails (summary of all comments)
- [ ] Email notifications to comment authors when you reply
- [ ] Resolve/hide comments from email (signed action links)
- [ ] Comment moderation queue
- [ ] CAPTCHA/Turnstile for extra spam protection
- [ ] Slack/Discord notifications instead of/in addition to email
- [ ] Analytics dashboard for comment metrics

---

## 🎉 You're All Set!

Your FigJam-style commenting system now includes production-grade email notifications with:
- ✅ Beautiful HTML emails
- ✅ Deep linking to specific comments
- ✅ Rate limiting and security
- ✅ Persistent storage
- ✅ Notification logging
- ✅ Privacy-first design

Leave a test comment and watch the magic happen! 🚀
