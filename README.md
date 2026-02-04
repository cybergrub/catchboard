# Catchboard - Fishing Competition Management

A modern web application for managing fishing competitions in Australia.

## Current Status

**Session 1 Complete** ✅
- Supabase integration
- Events list page (real data)
- Event detail page (real data)
- Event creation with recording modes
- Deployed to Vercel

**Live URL:** https://catchboard-nine.vercel.app

## Tech Stack

- **Frontend:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (CDN)
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Version Control:** GitHub

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env.local`:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Project Structure

```
/src
  /lib
    supabase.js          # Supabase client
  /pages
    EventsList.jsx       # Browse events
    EventDetail.jsx      # View event details
    CreateEvent.jsx      # Create new event
  App.jsx                # Main app with routing
  main.jsx               # React entry point

/docs
  /control               # Master project docs
  /sessions              # Per-session summaries
  /architecture          # Technical decisions
```

## Features

### ✅ Session 1
- View all events from database
- Event detail pages
- Create events with divisions (Open/Junior)
- Recording mode selection (Entrant/Judge)
- Responsive design

### 🔜 Session 2
- Full event creation form
- QR code generation
- Event code system

### 🔜 Session 3+
- Registration system
- Catch submission
- Verification workflow
- Leaderboard calculations
- Payment tracking

## Launch Target

**March 20, 2026** - Beulah Fishing Competition

## Documentation

See `/docs` folder for:
- Project objectives
- Implementation roadmap (45 sessions)
- Session summaries
- Technical decisions
- Chat management protocol

## License

Private project - All rights reserved
