# Catchboard - Project Objective

## Mission
Build a fishing competition management platform for Australian fishing clubs, launching at Beulah competition on March 20, 2026.

## Business Context
- **Operator:** Steve Gruebner (non-technical founder)
- **Strategy:** Systems-based income, reducing personal labor dependency
- **Market:** VIC/QLD fishing clubs, charter operations
- **Success Metric:** Operational tool that runs competitions without Steve's constant presence

## Technical Constraints
- **Development Window:** 2 hours/evening, 6.5 weeks (45 sessions)
- **Token Limits:** Context loss after ~100k tokens requires chat compaction
- **Infrastructure:** Supabase (DB), Vercel (hosting), GitHub (version control)
- **Stack:** React 18 + Vite (keeping existing prototype foundation)

## Launch Requirements (Beulah - March 20)
- **Divisions:** Open, Junior (under 16)
- **Recording Modes:** Both entrant self-submit AND judge-only modes
- **Payment:** Track status (unpaid/paid/waived) outside app, manual reconciliation
- **Critical Features:** Event creation, registration, catch submission, verification, leaderboard with correct calculations

## Non-Negotiables
- No data loss (Supabase integration required)
- Mobile-responsive (competitions happen in field)
- Works offline-capable where possible
- Simple event codes (no complex auth initially)

## Post-Launch Evolution
- Proper Supabase Auth (after March 20)
- SMS/email notifications
- Advanced analytics
- Multi-event season management

---
**Last Updated:** 2026-02-04
**Status:** Active Development - Session 1
