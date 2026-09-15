# Tansol Treasure School

Production-oriented Next.js school website and portal foundation.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Neon PostgreSQL via `@neondatabase/serverless`
- Zod validation
- bcrypt password hashing
- signed HTTP-only session cookies

## Routes

Public: `/`, `/about`, `/why-us`, `/portal`, `/curriculum`, `/admission`, `/gallery`, `/blog`, `/contact`.

Portal: `/portal/student`, `/portal/student/dashboard`, `/portal/staff`, `/portal/admin`, `/portal/parent`.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to the Neon connection string for the Tansol project.
3. Set a long random `SESSION_SECRET`.
4. Install dependencies with `npm install`.
5. Run `npm run dev`.

To create the first administrator, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and optionally `ADMIN_NAME`, then run `npm run admin:create`.

## Database

The canonical migration is `database/migrations/001_initial.sql`. It has been applied to the supplied Neon project and includes users, students, staff, parents, academic sessions/terms, subjects, results, publication records, audit logs, and result lookup indexes.

## Security notes

- `DATABASE_URL` is server-only.
- Student result lookup derives student identity from the authenticated session; client-submitted Student IDs are not trusted for authorization.
- Results are returned only when `is_published = TRUE`.
- Passwords are stored as bcrypt hashes.
- Portal pages enforce role checks on the server.

## UI direction

The interface follows the requested Taste Skill direction: `DESIGN_VARIANCE: 8`, `VISUAL_DENSITY: 5`, editorial typography contrast, asymmetric composition, purposeful interactive states, and no generic purple-gradient/card-stack treatment.
