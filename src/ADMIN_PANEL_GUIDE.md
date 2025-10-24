# Admin Panel Guide

## Quick Start

### Accessing the Admin Panel

1. **URL Method:** Add `#admin` to your portfolio URL
   - Example: `https://aristoteportfolio.figma.site//#admin`

2. **Keyboard Shortcut:** Press `Ctrl + Shift + A` from anywhere on your site

3. **Hidden Button:** Click the tiny invisible button in the bottom-right corner

### Login Credentials

- **Email:** `gahimaaristote1@gmail.com`
- **Password:** `Ari#toteprince1960`

**⚠️ IMPORTANT:** Change these credentials before deploying to production!

---

## Understanding the Modes

### 🟠 Local Mode (Default)
- Projects saved to your browser only
- Works immediately, no setup needed
- Data doesn't sync across devices
- Perfect for testing and development
- Projects survive page refreshes (stored in localStorage)

### 🟢 Connected Mode (Production)
- Projects saved to Supabase database
- Data syncs across all devices
- Persistent and secure
- Requires Edge Function deployment (see DEPLOYMENT_NOTES.md)

The admin panel automatically detects which mode to use. You'll see a badge in the top bar showing your current mode.

---

## Creating a Project

### Step 1: Create New Project
1. Click the **"New Project"** button
2. You'll see a clean, empty page (like Notion!)

### Step 2: Add Title
- Click on "Untitled" at the top
- Type your project name (e.g., "Mobile Banking App")

### Step 3: Add Content Blocks

The editor works just like Notion - add blocks of content:

#### **Text Block**
- Click **"+ Text"** button
- Start typing your content
- Write paragraphs, descriptions, insights, etc.
- The text auto-expands as you type
- Clean, minimal interface with hover controls

#### **Image Block**
- Click **"+ Image"** button
- Paste an image URL (from Unsplash, Imgur, etc.)
- The image appears instantly
- You can change the URL anytime

### Step 4: Organize Your Blocks
- Each block has controls that appear on hover:
  - **⋮⋮** (6 dots) - Drag to reorder blocks
  - **🗑️** (trash) - Delete the block

### Step 5: Save
- Click **"Save Project"** in the top-right
- Your project is now saved!
- If in Local Mode: Saved to browser storage
- If in Connected Mode: Saved to Supabase database

---

## Editing Projects

1. Return to the projects list (click "Back")
2. Click on any project to edit it
3. Make your changes
4. Click "Save Project"

---

## Deleting Projects

1. Open the project you want to delete
2. Click the **"Delete"** button in the top bar
3. Confirm the deletion
4. ⚠️ This cannot be undone!

---

## Best Practices

### Content Organization
- **Start with context:** Use the first text block to describe the project
- **Mix content types:** Alternate between text explanations and images
- **Keep it focused:** Each block should serve a purpose

### Writing Style
- Write as you would in Notion
- No need for special formatting
- Keep paragraphs concise and scannable
- Let the clean design speak for itself

### Images
- Use high-quality images
- Paste direct image URLs (must end in .jpg, .png, etc.)
- Recommended image hosting:
  - Unsplash (free, high-quality)
  - Imgur (simple, reliable)
  - Your own server/CDN

---

## Keyboard Shortcuts

While editing a project:
- **Tab** - Focus next block
- **Enter** (in empty block) - Create new block below
- **Backspace** (in empty block) - Delete the block
- **Ctrl/Cmd + S** - Save project (coming soon!)

---

## Troubleshooting

### "Local Mode" badge showing
- This is normal if you haven't deployed the Edge Function yet
- Your projects are still being saved (to your browser)
- See DEPLOYMENT_NOTES.md to enable Connected Mode

### "Failed to save project" error
**If in Local Mode:**
- Check browser console for errors
- Try clearing localStorage and reloading
- Make sure you're logged in

**If in Connected Mode:**
- Check that Edge Function is deployed
- Verify `ADMIN_KEY` environment variable is set correctly
- Check Supabase logs for errors
- Open browser console and look for detailed error messages

### Projects not appearing
**If in Local Mode:**
- Check that you're using the same browser
- localStorage is browser-specific
- Try logging out and back in

**If in Connected Mode:**
- Check internet connection
- Verify Edge Function is running
- Check Supabase dashboard for data

### Can't login
- Double-check your credentials (case-sensitive)
- Clear browser cache and cookies
- Make sure you're using the correct email/password from the code

---

## Security Reminders

### Before Going Live:

1. **Change Admin Credentials**
   - Edit `/components/AdminPanel.tsx`
   - Update `ADMIN_EMAIL` and `ADMIN_PASSWORD`

2. **Change Admin Key**
   - Set a new `ADMIN_KEY` in Supabase environment variables
   - Update the constant in `/components/AdminPanel.tsx`

3. **Deploy Edge Function**
   - Required for production
   - See DEPLOYMENT_NOTES.md

4. **Consider Additional Security**
   - IP whitelisting
   - Rate limiting
   - Two-factor authentication
   - Full Supabase Auth integration

---

## Tips & Tricks

1. **Plan before you create:** Sketch out your project structure first
2. **Use consistent naming:** Makes it easier to find projects later
3. **Test in Local Mode first:** Perfect your workflow before deploying
4. **Keep backups:** Export your localStorage or database regularly
5. **Clean design wins:** Less is more - the minimal editor encourages clarity

---

## Need Help?

- Check the browser console for detailed error messages
- Review DEPLOYMENT_NOTES.md for backend setup
- Check Supabase logs if using Connected Mode
- Make sure all environment variables are set correctly

---

**Happy project managing! 🎨**
