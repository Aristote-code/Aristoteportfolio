# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

- **Install dependencies**: `npm i`
- **Start development server**: `npm run dev` (runs on port 3000)
- **Build for production**: `npm run build`

## Architecture Overview

This is a **React + Vite portfolio application** with a **Figma-to-code converted structure**. The codebase uses TypeScript and Tailwind CSS with a sophisticated design system imported from Figma.

### Key Architectural Patterns

**Component Structure:**
- **Main App Component** (`src/App.tsx`): Orchestrates the entire application, handles state management for comments, user interaction, navigation, and collaborative features
- **Section-based Layout**: Four main sections (Home, Projects, About, Contact) managed through refs and smooth scrolling
- **Figma Imports** (`src/imports/`): Auto-generated components from Figma design with precise styling and layouts
- **Reusable Components** (`src/components/`): Custom components for functionality like comments, navigation, admin panel

**State Management Pattern:**
- Uses React hooks (useState, useEffect) for local state management
- No external state management library - all state handled in App.tsx and passed down as props
- Real-time collaborative features managed through Supabase integration

**Data Layer:**
- **Supabase Integration**: Real-time database for comments, user tracking, and collaborative features
- **Server Functions** (`src/supabase/functions/server/`): Backend logic for comments, user management, and notifications
- **Utility Layer** (`src/utils/`): Helper functions for Supabase client, avatar generation, and user management

### File Organization

```
src/
├── App.tsx                    # Main application orchestrator
├── main.tsx                   # React root mounting
├── components/               # Reusable functional components
│   ├── *Section.tsx         # Page sections (Home, Projects, About, Contact)
│   ├── Comment*.tsx         # Comment system components
│   ├── Cursor*.tsx          # Collaborative cursor features
│   ├── AdminPanel.tsx       # Admin functionality
│   └── ui/                  # Shadcn/ui components
├── imports/                 # Figma-generated components
│   ├── Main.tsx            # Primary Figma layout component
│   └── *.tsx               # Individual Figma component exports
├── utils/
│   ├── supabase/           # Database configuration and helpers
│   └── avatarUtils.ts      # User avatar and identification utilities
├── assets/                 # Static images and resources
└── styles/                 # Additional styling files
```

## Development Guidelines

### Working with Figma Components
- Components in `src/imports/` are auto-generated from Figma
- These components use precise positioning, custom fonts (Solway, Gaegu, Poppins), and fixed dimensions
- Avoid modifying Figma components directly - create wrapper components in `src/components/` instead

### Comment System Architecture
- Comments are positioned using both absolute coordinates and normalized coordinates for responsive design
- Real-time updates managed through Supabase functions
- Comment threads support replies and collaborative features
- Admin panel accessible via URL hash `#admin` or keyboard shortcut `Ctrl+Shift+A`

### Collaborative Features
- User identification through localStorage and utility functions
- Real-time cursor tracking with color-coded user identification
- Name prompt system for user onboarding

### Styling Approach
- **Tailwind CSS** for utility-first styling
- **Custom CSS variables** for colors and theme consistency
- **Responsive design** using Tailwind's responsive utilities
- **Figma asset integration** through Vite's alias system

### Database Schema (Supabase)
The application expects these database structures:
- Comments table with fields: id, x, y, normalizedX, normalizedY, text, userId, authorName, timestamp, pagePath
- Replies as nested objects within comments
- User tracking for collaborative features

## Important Technical Details

- **Vite Configuration**: Extensive alias mapping for Figma assets and dependencies
- **TypeScript**: Strict typing throughout the application
- **Port Configuration**: Development server runs on port 3000 with auto-open
- **Asset Management**: Figma assets are imported through webpack aliases and stored in `src/assets/`