# Chat Management Protocol

## Token Budget Monitoring
**Limit:** 190k tokens per chat
**Compact Trigger:** 120k tokens used (~63% capacity)
**Current Status:** ~78k tokens used

## Chat Roles (BadgerPhil System Adapted)

### Mission Control (This Chat)
**Purpose:** Strategic decisions, session planning, cross-workstream coordination
**Lifespan:** Entire project
**Compaction:** When reaching 120k tokens

### Feature Builder Chats (Created As Needed)
**Purpose:** Implement specific features
**Naming:** `[Session N] - [Feature Name]`
**Examples:**
- "Session 1 - Supabase Integration"
- "Session 11 - Leaderboard Calculations"

**Lifespan:** Single session or feature completion
**Compaction:** N/A - short-lived

### QA & Testing Chat (Future)
**Purpose:** Bug reports, testing results, fixes
**Lifespan:** Multi-session
**Compaction:** When reaching 120k tokens

## Handoff Process

### When Mission Control Reaches 120k Tokens:

1. **Create Handoff Document:**
```
/docs/handoffs/MISSION_CONTROL_HANDOFF_[DATE].md

Contents:
- Decisions made
- Current session number
- What's working
- What's blocked
- Next 3 sessions planned
- Open questions
```

2. **Archive This Chat:**
- Name it: "Mission Control 1 (Sessions 1-X)"
- Keep link in documentation

3. **Start New Mission Control:**
- Read handoff document
- Continue from current state
- Update docs/control/ files

### When Feature Builder Chat Completes:

1. **Create Session Summary:**
```
/docs/sessions/SESSION_[N]_[FEATURE].md

Contents:
- Feature completed
- Files changed
- How to test
- Known issues
- Next session requirements
```

2. **Archive Chat:**
- Name it: "Session N - [Feature]"
- Link in CURRENT_STATE.md

## Multi-Chat Coordination

### Starting a Feature Builder Chat:
**You say:** "Start Session [N] - [Feature Name]"

**I respond:**
1. Read current state docs
2. Read session plan for this feature
3. Confirm understanding
4. Begin implementation

### Context Files Every Chat Needs:
- `/docs/control/PROJECT_OBJECTIVE.md`
- `/docs/control/CURRENT_STATE.md`
- `/docs/control/IMPLEMENTATION_ROADMAP.md`
- Relevant `/docs/sessions/SESSION_[N-1]_*.md` (previous session)

## Repository Hygiene

### Branch Strategy:
```
main → production code (only merge when tested)
develop → active development
feature/[name] → individual features (optional)
```

### Commit Strategy:
- Commit after each working feature
- Meaningful commit messages
- Tag releases (v1.0, v1.1, etc.)

### File Organization:
```
/src
  /components (reusable UI)
  /pages (route pages)
  /lib (utilities, Supabase client)
  /hooks (custom React hooks)
  /assets (images, icons)
  
/docs
  /control (master docs)
  /sessions (per-session summaries)
  /architecture (tech decisions)
  /handoffs (chat transition docs)
  
/supabase
  /migrations (database changes)
```

## Clean-Up Tasks

### Weekly Review (Every 10 Sessions):
- [ ] Archive completed session docs
- [ ] Update CURRENT_STATE.md
- [ ] Review IMPLEMENTATION_ROADMAP.md
- [ ] Clean unused branches
- [ ] Optimize image assets

### Never Delete:
- Production migrations
- Control documents
- Session summaries
- Handoff documents

---
**Last Updated:** 2026-02-04
**Next Review:** After Session 10
