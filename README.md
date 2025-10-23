# 🎨 Aristote Portfolio

A modern, interactive portfolio application built with React, TypeScript, and Supabase. Features real-time collaboration, commenting system, project management, and a beautiful FigJam-inspired design.

![Portfolio Banner](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?logo=supabase&logoColor=white)

## 🌟 Features

### Core Features
- **📱 Responsive Design** - Fully responsive layout that works seamlessly across all devices
- **🎯 Smooth Navigation** - Section-based smooth scrolling with active state indicators
- **🎨 FigJam-Inspired UI** - Beautiful design converted from Figma with custom fonts and styling
- **⚡ Fast Performance** - Built with Vite for lightning-fast development and optimized production builds

### Interactive Features
- **💬 Comment System** - Click anywhere on the page to leave comments with nested replies
- **👥 Real-time Collaboration** - See other users' cursors in real-time with color-coded identification
- **✏️ Drawing Mode** - Free-hand drawing capabilities for creative annotations
- **📧 Contact Form** - Integrated email notifications via Resend API
- **🔔 User Join Notifications** - Get notified when users visit your portfolio

### Admin Features
- **🎛️ Admin Panel** - Comprehensive dashboard for managing projects and content
- **📊 Project Management** - Create, update, and delete projects with rich media support
- **🖼️ Image Upload** - Integrated with Supabase Storage for project images
- **🎨 Rich Text Editor** - Full-featured editor for project descriptions and content
- **🔐 Secure Authentication** - Admin key-based authentication with Supabase Auth support

## 🏗️ Architecture

### Tech Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **Email Service**: Resend API
- **Deployment**: Vercel (Frontend) + Supabase (Backend)

### Project Structure
```
├── src/
│   ├── App.tsx                 # Main application orchestrator
│   ├── main.tsx               # React root entry point
│   ├── components/            # Reusable React components
│   │   ├── HomeSection.tsx    # Landing section
│   │   ├── ProjectsSection.tsx # Projects showcase
│   │   ├── AboutSection.tsx   # About me section
│   │   ├── ContactSection.tsx # Contact form
│   │   ├── CommentSystem.tsx  # Comment management
│   │   ├── AdminPanel.tsx     # Admin dashboard
│   │   ├── CollaborativeCursors.tsx # Real-time cursors
│   │   ├── DrawingCanvas.tsx  # Free-hand drawing
│   │   └── ui/               # shadcn/ui components
│   ├── imports/              # Figma-generated components
│   ├── utils/
│   │   ├── supabase/        # Supabase client & config
│   │   └── avatarUtils.ts   # User identification utilities
│   ├── assets/              # Static images and resources
│   └── styles/              # Additional styling files
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.ts      # Main API server (Hono)
│           ├── comments.tsx  # Comment CRUD operations
│           └── kv_store.tsx  # Key-value storage utilities
├── public/                  # Public static assets
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies and scripts
└── vercel.json            # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- Resend API key (optional, for email notifications)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Aristote-code/Aristoteportfolio.git
cd Aristoteportfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Supabase**

Update `/src/utils/supabase/info.tsx` with your Supabase credentials:
```typescript
export const projectId = "your-project-id"
export const publicAnonKey = "your-anon-key"
```

4. **Set up Supabase Backend**

Deploy the backend functions to Supabase:
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Deploy functions
supabase functions deploy server
```

5. **Configure Environment Variables (Supabase)**

Set these secrets in your Supabase project:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set ADMIN_KEY=your_secure_admin_key
```

6. **Set up Supabase Storage**

Create a storage bucket named `project-images`:
- Go to Supabase Dashboard → Storage
- Create new bucket: `project-images`
- Set to Public
- Configure CORS for your domain

### Development

Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

Build output will be in the `/build` directory.

## 🔒 Security Best Practices

### Current Security Measures
- ✅ **Input Sanitization** - All user inputs are sanitized to prevent XSS attacks
- ✅ **CORS Protection** - Configured CORS headers for authorized origins only
- ✅ **Rate Limiting** - Protected API endpoints with rate limiting
- ✅ **Authentication** - Admin routes protected with secure key authentication
- ✅ **File Upload Validation** - Image type and size validation (5MB max)
- ✅ **Email Validation** - Regex-based email validation for contact form

### Important Security Notes

⚠️ **Admin Key Configuration**
- The default admin key fallback (`admin_key_aristote_2025`) is weak
- **Action Required**: Set a strong, unique admin key in Supabase secrets:
  ```bash
  supabase secrets set ADMIN_KEY=your_very_secure_random_key
  ```

⚠️ **Email Configuration**
- Email notifications are sent to a hardcoded address in `supabase/functions/server/index.ts`
- **Action Required**: Update lines 300 and 441 with your email address or use environment variables

⚠️ **Public Anon Key**
- The Supabase anon key in `src/utils/supabase/info.tsx` is intentionally public
- This is safe - Row Level Security (RLS) policies protect your data
- **Never commit** service role keys to version control

### Recommended Actions
1. ✅ Store sensitive config in environment variables (`.env.local`)
2. ✅ Use strong, randomly generated admin keys
3. ✅ Enable Row Level Security (RLS) on all Supabase tables
4. ✅ Regularly rotate API keys and admin credentials
5. ✅ Review CORS settings for production domains

## 📝 API Documentation

### Public Endpoints
- `GET /server/projects` - Get all projects
- `GET /server/health` - Health check
- `POST /server/contact` - Submit contact form
- `POST /server/user-joined` - User notification

### Admin Endpoints (Requires Authentication)
- `POST /server/admin/projects` - Create project
- `PUT /server/admin/projects/:id` - Update project
- `DELETE /server/admin/projects/:id` - Delete project
- `POST /server/upload-image` - Upload project images

### Comment Endpoints
- Defined in `/supabase/functions/server/comments.tsx`
- Full CRUD operations for comments and replies

## 🎨 Customization

### Styling
- Colors and theme: Edit Tailwind config and CSS variables in `src/index.css`
- Fonts: Using Solway, Gaegu, and Poppins (loaded via CSS)

### Content
- Update sections in respective component files (`HomeSection.tsx`, `AboutSection.tsx`, etc.)
- Figma-generated components are in `/src/imports` - avoid modifying directly

### Admin Access
- Access admin panel via `?admin=true` URL parameter
- Or press `Ctrl+Shift+A` (keyboard shortcut)

## 🐛 Troubleshooting

### Common Issues

**Comments not appearing:**
- Check Supabase backend is deployed
- Verify CORS settings include your domain
- Check browser console for API errors

**Images not uploading:**
- Ensure `project-images` bucket exists in Supabase Storage
- Verify bucket is set to Public
- Check file size is under 5MB

**Build errors:**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version (18+ required)

## 📦 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Vite configuration
4. Deploy!

**Live URL**: https://aristoteportfolio.vercel.app

### Backend (Supabase)
Backend functions are automatically deployed to Supabase Edge Functions.

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use!

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Design**: Original Figma design from [Creative Portfolio Design](https://www.figma.com/design/Yi7Z8me9ImK1t8dlNVYCZh/Creative-Portfolio-Design)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)

## 📞 Contact

For questions or feedback, use the contact form on the portfolio or reach out directly.

---

**Built with ❤️ by Aristote**