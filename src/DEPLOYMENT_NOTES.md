# Deployment Notes

## Important Setup Instructions

### Resume Download Setup

The "Download Resume" button in the About section downloads a file from `/public/resume.pdf`. 

**To add your resume:**
1. Replace the placeholder file at `/public/resume.pdf` with your actual resume PDF
2. Name it `resume.pdf` (or update the filename in `/components/AboutSection.tsx` if you prefer a different name)

## Supabase Edge Function Deployment

The portfolio uses a Supabase Edge Function for backend features including:
- Comment storage and retrieval
- Comment replies
- Comment position updates
- **Comment deletion (when resolving comments)**
- **User joined notifications**
- Email notifications via Resend

### Current Status

Due to environment restrictions, the Edge Function cannot be auto-deployed from this interface (403 permission error). The resolve feature currently works **client-side only** and will not persist across page refreshes until the backend is deployed.

### Manual Deployment Steps

To enable full backend persistence for all features including comment resolution:

1. **Via Supabase CLI:**
   ```bash
   cd supabase/functions
   supabase functions deploy make-server-583db2fc --project-ref Yi7Z8me9ImK1t8dlNVYCZh
   ```

2. **Via Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to Edge Functions
   - Find `make-server-583db2fc`
   - Click "Deploy new version"
   - Upload the contents of `/supabase/functions/server/`

### New Endpoints Added

The following endpoints need deployment:

**PATCH** `/comments/:id/resolve`
- Updates comment status between 'open', 'resolved', or 'hidden'
- Request body: `{ status: 'open' | 'resolved' | 'hidden' }`
- Returns the updated comment object

**POST** `/user-joined`
- Sends email notification when a visitor enters their name
- Request body: `{ userName: string, userEmail?: string, timestamp: string }`
- Returns success status

### Environment Variables Required

Make sure these are set in your Supabase project:

**Required for Admin Panel:**
- `ADMIN_KEY`: Authentication key for admin operations (default: `admin_key_aristote_2025`)
  - This is used instead of Supabase Auth for simpler admin authentication
  - The admin panel uses hardcoded credentials but sends this key to the server

**Required for Email Notifications:**
- `RESEND_API_KEY` - For email notifications
- `SUPABASE_URL` - Auto-set by Supabase
- `SUPABASE_ANON_KEY` - Auto-set by Supabase

### Comment Resolution Behavior

When you resolve a comment:
- The comment is **permanently deleted** from both the interface and database
- This cannot be undone
- This helps keep your portfolio clean after addressing feedback

### Graceful Degradation

The app is designed to work even if the backend deployment fails:
- Comment resolution will work client-side (not persistent across refreshes)
- All other features continue to function normally
- No error messages shown to users
- Console logs help with debugging

### New Features

**1. User Joined Notifications**
- When someone enters their name in the welcome dialog, you receive an email notification
- Beautiful HTML email with visitor name and timestamp
- Helps you track who's visiting your portfolio

**2. Enhanced Comment Emails**
- Comment notification emails now include the commenter's name
- Helps identify who's leaving feedback

**3. Resolved Comments Are Deleted**
- Clicking "Resolve" permanently deletes the comment
- Cannot be undone - comment is removed from both interface and database

### Admin Panel Access

The admin panel is accessible at `#admin` (e.g., `https://yoursite.com/#admin`).

**Credentials:**
- Email: `gahimaaristote1@gmail.com`
- Password: `Ari#toteprince1960`

**Keyboard shortcut:** `Ctrl + Shift + A` from anywhere on the site

#### Admin Panel Modes

The admin panel works in two modes:

**1. Local Mode** (Default - No deployment needed):
- Projects are saved to browser's localStorage only
- Data is not persistent across devices/browsers
- Shows "Local Mode" badge in the admin panel
- Perfect for testing and development
- **You can still create and edit projects!**

**2. Connected Mode** (Requires Edge Function deployment):
- Projects are saved to Supabase backend
- Data is persistent and accessible from any device
- Shows "Connected" badge in the admin panel
- Required for production use

The admin panel automatically detects which mode to use. If the Edge Function is not deployed, it will use Local Mode and all your projects will be stored in the browser.

**For production:** Deploy the Edge Function using the steps above to enable Connected Mode.

### Testing After Deployment

1. **Test Admin Panel:**
   - Navigate to `#admin`
   - Login with credentials
   - Create a new project
   - Check for "Connected" badge (server deployed) or "Local Mode" badge (local only)
   - Verify projects save and load correctly

2. **Test Comment Resolution:**
   - Add a comment
   - Click the "Resolve" button in the comment thread
   - Refresh the page
   - Verify the comment stays hidden

3. **Test User Joined Notification:**
   - Clear localStorage to reset
   - Refresh the page
   - Enter your name in the welcome popup
   - Check your email (gahimaaristote1@gmail.com) for the notification

4. **Test Comment Notifications:**
   - Add a comment
   - Check your email for the comment notification with sender name
   - Verify the notification includes commenter's name

5. Check Supabase logs for any errors

### Security Notes

**For production, you MUST:**
1. Change the `ADMIN_KEY` environment variable in Supabase to a secure random string
2. Update the `ADMIN_KEY` constant in `/components/AdminPanel.tsx` to match
3. Change the hardcoded admin credentials in `/components/AdminPanel.tsx`
4. Consider implementing proper authentication with Supabase Auth
5. Add IP restrictions or other security measures
