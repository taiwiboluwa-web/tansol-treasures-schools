# Tansol Treasure School Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Tansol Treasure School public website and secure school portal in the empty GitHub repository, connected to the supplied Neon project.

**Architecture:** Next.js App Router with Tailwind CSS, server-only Neon access, focused domain database modules, secure HTTP-only cookie sessions, server-side RBAC, and a publish-controlled academic result workflow.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, `@neondatabase/serverless`, Zod, bcryptjs, ESLint.

**Spec:** `docs/superpowers/specs/2026-09-15-tansol-school-portal-design.md`

## Global Constraints

- Preserve the requested route structure exactly.
- Keep `DATABASE_URL` server-only.
- Never authorize a student from a client-supplied student ID alone.
- Results must be unpublished until an admin publishes them.
- Apply Taste Skill: `DESIGN_VARIANCE: 8`, `VISUAL_DENSITY: 5`.
- Avoid centered hero + three identical cards, generic purple gradients, and placeholder graphics.
- Use responsive, accessible, production-oriented UI.

---

## Task 1 — Application foundation

- [ ] Create `package.json`, TypeScript config, Next config, Tailwind/PostCSS config, ESLint config, `.gitignore`, `.env.example`.
- [ ] Create `app/layout.tsx`, global styles, shared navigation/footer, and reusable UI primitives.
- [ ] Add a restrained school visual system with typography contrast and asymmetric layout utilities.
- [ ] Verify TypeScript and lint configuration are internally consistent.

## Task 2 — Database and migration

- [ ] Create `lib/db/client.ts` around `@neondatabase/serverless`.
- [ ] Create domain modules for users, students, results, staff, and parents.
- [ ] Add `database/migrations/001_initial.sql` based on the supplied schema plus academic/session, parent/staff relationship, publication, and audit structures.
- [ ] Add indexes and constraints for common result lookups.
- [ ] Apply the migration to the supplied Neon production branch only after confirming the SQL is non-destructive to this newly-created database.

## Task 3 — Authentication and authorization

- [ ] Add password hashing utilities using bcryptjs.
- [ ] Add signed/encrypted session-cookie utilities and server-side session lookup.
- [ ] Add Zod schemas for authentication and result requests.
- [ ] Add role guards for student, staff, admin, and parent routes.
- [ ] Add login/logout route handlers without exposing credentials or database details.

## Task 4 — Public website

- [ ] Build `/`, `/about`, `/why-us`, `/curriculum`, `/admission`, `/gallery`, `/blog`, and `/contact`.
- [ ] Build `/portal` as the portal hub.
- [ ] Ensure navigation works on desktop and mobile.
- [ ] Use meaningful content hierarchy and accessible interactive states.

## Task 5 — Student result workflow

- [ ] Build `/portal/student` login interface.
- [ ] Implement authenticated student result lookup using session identity rather than trusting submitted student IDs.
- [ ] Implement `/portal/student/dashboard` result sheet rendering.
- [ ] Show only published results for the authenticated student.
- [ ] Add print-friendly result presentation.

## Task 6 — Staff, admin, and parent shells

- [ ] Build protected `/portal/staff` workspace shell.
- [ ] Build protected `/portal/admin` control-center shell.
- [ ] Build protected `/portal/parent` monitoring shell.
- [ ] Add clear role-specific empty/loading/error states.
- [ ] Keep CRUD boundaries ready for subsequent content/result management features.

## Task 7 — Quality and verification

- [ ] Add unit tests for validation, grade calculation, and authorization helpers.
- [ ] Add route-level tests for protected result access where the environment supports them.
- [ ] Run lint and TypeScript checks.
- [ ] Review responsive states and accessibility semantics.
- [ ] Review database migration and indexes.
- [ ] Only report completion after verification evidence is available.
