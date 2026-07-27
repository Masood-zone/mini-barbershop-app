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
- MySQL Community Server 8

Frontend:

```powershell
cd frontend
pnpm install
Copy-Item .env.example .env
pnpm dev
```

Backend:

```powershell
cd backend
pnpm install
Copy-Item .env.example .env
pnpm dev
```

Create the database with `backend/database/schema.sql`, then add local seed data
as needed. Never commit real credentials or production data.

## Delivery order

Follow the phases in `PLAN.md`: database first, then one backend vertical slice,
then the matching frontend slice. Do not build all UI screens against invented
data and connect them later.

