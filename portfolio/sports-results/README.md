# Sports Results Dashboard

An isolated portfolio snapshot of the maintained application source. React/Vite frontend with an Express/MySQL backend, plus Socket.IO for live updates.

## Run locally

1. Use Node.js 22 or newer and a local MySQL 8 database.
2. Import the schema-only files under `server/sql/` into an empty local database. They contain no user, session, order or payment records.
3. Copy `.env.example` to `.env`. Copy the `server/configs/*.env.example` files to their matching local `*.env` paths and provide your own database and authentication settings.
4. In the project root run `npm ci`, then `npm run dev`. In another terminal run `cd server`, `npm ci`, then `npm start`.
5. Use only synthetic records. Original photos are excluded and missing images use a neutral placeholder.

## Scope and attribution

Prepared from `SAB-Websites/ระบบคะแนนมหกรรมกีฬาสีเรียลไทม์` without inheriting the original repository history. Team contributions and existing third-party licenses retain their authorship; the snapshot does not assign ownership of every contribution to one person.

Credentials, customer/student records, uploads, exports, archives, compiled clients and original media are excluded. The source retains its original application structure; this is a code showcase, not a claim of production security or measured performance. The administrator token must be supplied by the local operator; an unset token is rejected.

## Resume angle

Describe the frontend/backend integration, database modeling, transactional result storage and real-time event flow, and clearly state your personal contribution. Add measured usage or performance only when supporting evidence is available.
