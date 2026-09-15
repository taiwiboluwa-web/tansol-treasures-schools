# Tansol Treasure School Portal — Design Specification

## Goal
Build a production-ready multi-page Tansol Treasure School website and role-based school portal using Next.js App Router, Tailwind CSS, and Neon PostgreSQL.

## Architecture
Use a single Next.js application for public pages and portal workflows. Keep database access server-only through `@neondatabase/serverless`, with focused domain modules rather than arbitrary SQL from UI code. Use secure HTTP-only cookie sessions and server-side role checks for student, staff, admin, and parent areas.

## Routes
Public: `/`, `/about`, `/why-us`, `/portal`, `/curriculum`, `/admission`, `/gallery`, `/blog`, `/contact`.
Portal: `/portal/student`, `/portal/student/dashboard`, `/portal/staff`, `/portal/admin`, `/portal/parent`.

## Database
Use the supplied `users`, `students`, and `results` foundation, extended with the minimum relational structures needed for parents, staff, academic sessions/terms, result publication, and auditability. Results are only visible to authenticated students/parents when published. Add indexes for student/result lookup and uniqueness constraints for academic records.

## Security
Passwords are hashed and never stored in plaintext. Sessions are HTTP-only, secure in production, SameSite-protected cookies. Authorization is enforced on the server, not by route visibility. A student cannot submit another student's ID to retrieve their records. Validate request bodies with Zod. Never expose `DATABASE_URL` to the client.

## Result workflow
Staff enter and update CA/exam marks. Results remain unpublished until an admin publishes the applicable session/term. Students see only their own published result. Parent access is limited to explicitly linked students. Result sheets support print-friendly rendering.

## UI direction
Apply Taste Skill principles with `DESIGN_VARIANCE: 8` and `VISUAL_DENSITY: 5`: intentional asymmetric layouts, custom typography contrast, strong editorial hierarchy, restrained palette, meaningful hover/focus states, and no generic purple gradient blobs, centered hero + three identical cards, or floating placeholder graphics. Responsive behavior is designed from mobile upward without reducing the desktop experience to stacked cards.

## Initial implementation scope
Deliver the core application shell, all requested routes, Neon connection layer, migration SQL, secure authentication/session foundation, student result API and dashboard, role-protected portal shells, and public-site visual system. Keep content/data editable through focused server-side modules so later admin CRUD can extend the same architecture.
