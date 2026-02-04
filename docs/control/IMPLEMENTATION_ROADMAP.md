# Implementation Roadmap

## Development Approach
**Strategy:** Micro-incremental builds. One complete, testable feature per session.

## Phase 1: Foundation (Weeks 1-2, Sessions 1-10)
**Goal:** Core functionality with Supabase integration

### Session 1 (Feb 4 - TONIGHT)
- [ ] Supabase client setup
- [ ] Environment variables configured
- [ ] Events list page (fetch from DB)
- [ ] Event detail page
- [ ] Recording mode selector in event creation
- **Deliverable:** Can view real events from database

### Session 2
- [ ] Event creation form (full fields)
- [ ] QR code generation
- [ ] Event code system
- **Deliverable:** Can create complete event in Supabase

### Session 3
- [ ] Public registration page
- [ ] Division selection (Open/Junior)
- [ ] Multi-entrant detection (same phone)
- **Deliverable:** Anyone can register for event

### Session 4-5
- [ ] Catch submission (Mode A: entrant)
- [ ] Photo upload to Supabase Storage
- [ ] Species/length/weight capture
- **Deliverable:** Entrants can log catches

### Session 6-7
- [ ] Judge submission flow (Mode B)
- [ ] Entrant selector in judge mode
- [ ] Toggle between modes per event
- **Deliverable:** Dual recording mode complete

### Session 8-9
- [ ] Catch verification workflow
- [ ] Approve/reject with reasons
- [ ] Verification status tracking
- **Deliverable:** Organizer can verify catches

### Session 10
- [ ] Basic leaderboard display
- [ ] Group by division
- [ ] Show verified catches only
- **Deliverable:** Simple leaderboard works

## Phase 2: Critical Fixes (Weeks 3-4, Sessions 11-20)
**Goal:** Fix testing feedback issues

### Session 11-13: Issue #3 - Leaderboard Calculations
- [ ] Prize category logic implementation
- [ ] total_length_cm (SUM)
- [ ] longest_cm (MAX)
- [ ] most_fish (COUNT)
- [ ] total_weight_g (SUM)
- [ ] heaviest_g (MAX)
- [ ] Test each calculation independently
- **Deliverable:** Leaderboard shows correct winners per category

### Session 14-15: Issue #1 - Multi-Person Catches
- [ ] Detect multiple entrants per phone
- [ ] Show entrant dropdown in catch submission
- [ ] Assign catch to selected entrant
- **Deliverable:** Parents can specify which child caught fish

### Session 16-17: Issue #2 - Edit Results
- [ ] Edit button on catch records
- [ ] Modal for editing species/length/weight
- [ ] Update with audit trail
- **Deliverable:** Organizers can fix mistakes

### Session 18-19: Issue #6 - Records Tab
- [ ] Rename Verify → Records
- [ ] Pending sub-tab
- [ ] All Results sub-tab with edit
- **Deliverable:** Better organization workflow

### Session 20: Buffer/Testing

## Phase 3: Polish (Weeks 5-6, Sessions 21-30)
**Goal:** Production-ready UX

### Session 21-25: Issue #4 - Mobile Responsive
- [ ] Table responsive patterns
- [ ] Modal sizing fixes
- [ ] Button tap targets (44px minimum)
- [ ] Test on iPhone/Android sizes
- **Deliverable:** Works on all screen sizes

### Session 26-28: Payment Tracking
- [ ] Payment status flags (unpaid/paid/waived)
- [ ] Payment method field
- [ ] Organizer payment summary view
- **Deliverable:** Can track who owes entry fees

### Session 29-30: Polish Pass
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Confirmation dialogs
- **Deliverable:** Professional feel

## Phase 4: Pre-Launch (Week 6.5, Sessions 31-35)
**Goal:** Beulah-ready

### Session 31-32: End-to-End Testing
- [ ] Complete competition flow test
- [ ] Performance testing
- [ ] Data integrity checks
- **Deliverable:** Confidence in launch

### Session 33-34: Beulah-Specific Setup
- [ ] Create Beulah event
- [ ] Test registration workflow
- [ ] Train organizers
- **Deliverable:** Event ready to go live

### Session 35: Launch Support & Hotfixes
- [ ] Available for real-time issues
- [ ] Quick patches if needed

## Buffer Sessions (36-45)
Reserved for:
- Unexpected complexity
- Feature cuts that need completion
- Post-launch fixes

---

## Decision Log

### 2026-02-04: Tech Stack Confirmation
**Decision:** Keep React 18 + Vite (no Next.js migration)
**Rationale:** Token constraints + timeline pressure. Existing prototype works. Migration = risky rewrite.

### 2026-02-04: Auth Strategy
**Decision:** Event codes initially, Supabase Auth post-launch
**Rationale:** Auth was previous blocker. Simple codes get us to launch. Can upgrade later.

### 2026-02-04: Payment Integration
**Decision:** Track status only, no payment processing
**Rationale:** External payment handling reduces scope. Can add Stripe/Square later if needed.

---
**Last Updated:** 2026-02-04
**Next Review:** After Session 5
