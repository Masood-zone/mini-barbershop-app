# TrimTrack

TrimTrack is a small administrator-facing barbershop management system for
customers, services, appointments, and a daily dashboard.

This repository deliberately follows the split application style used by
`../atica-cms`:

```text
mini-barbershop-app/
├── backend/       # Express 5 + TypeScript + mysql2 REST API
├── frontend/      # React 19 + Vite + Tailwind + shadcn application
├── database/      # Reserved for project-level database artifacts if needed
├── designs/       # Exported TrimTrack screens and design system
├── docs/          # Architecture and validation guidance
├── AGENTS.md      # Binding project instructions for Codex
└── PLAN.md        # Version-one product and delivery plan
```

The frontend and backend are intentionally independent pnpm packages, matching
Atica CMS. Run package commands inside the relevant directory.

## Source of truth

- `PLAN.md` defines version-one behavior and scope.
- `designs/` defines the intended interface.
- `docs/ARCHITECTURE.md` defines code ownership and dependency direction.
- `AGENTS.md` tells Codex how to work in this repository without drifting.

## Local setup

Requirements:

- Node.js 22 or newer
- pnpm 11
- MySQL Community Server 9.4 locally; SQL remains MySQL 8-compatible where
  practical
- MySQL Workbench 8

Frontend:

```powershell
cd frontend
pnpm.cmd install
pnpm.cmd dev
```

Backend:

```powershell
cd backend
pnpm.cmd install
Copy-Item .env.example .env
pnpm.cmd dev
```

Create the database with `backend/database/schema.sql`, then follow
`docs/DATABASE.md` for the least-privilege local user, sample data, and secure
administrator seed. Never commit real credentials or production data.

## Foundation status

- Phase 1: requirements and business process documented
- Phase 2: local environment and Git repository initialized
- Phase 3: canonical database scripts and verification added
- Phase 4: Express 5 backend foundation and readiness verification added
- Phase 5: session authentication and protected routes added
- Phase 6: customer backend CRUD and search added
- Phase 7: service backend CRUD and referenced-delete handling added
- Phase 8: joined appointment CRUD, filters, and status updates added
- Phase 9: dashboard aggregates and joined schedule data added
- Phase 10: React Router, Axios, TanStack Query, and design primitives added
- Phase 11: session login, protected nested routes, and app shell added
- Phase 12: API-backed dashboard states and appointment summaries added
- Phase 13: customer frontend CRUD, search, details, and confirmations added
- Phase 14: service frontend CRUD, pricing, duration, and confirmations added
- Phase 15: appointment frontend CRUD, filters, details, and quick status added

The next planned milestone is Phase 16 responsive and accessibility hardening.

## Delivery order

Continue numerically from Phase 16 in `PLAN.md`. The Phase 10–15 interfaces are
connected to the real API rather than local placeholder collections.
