# TrimTrack Frontend

## Phases 10–15

The frontend is a React 19, TypeScript, Vite, Tailwind CSS 4 application. It
uses React Router DOM 6 data routes, Axios with session credentials, and
TanStack Query 5 for server state.

The request direction is:

```text
page -> query/mutation hook -> API function -> Axios client -> REST API
```

Routes are lazy loaded beneath one protected application layout. The protected
loader resolves `/api/auth/me` before rendering the sidebar and child route.
Unauthenticated requests return to `/login`; login and logout update the
authentication query directly.

## Routes

| Route | Purpose |
| --- | --- |
| `/login` | Administrator session login |
| `/dashboard` | Totals, today's schedule, and recent appointments |
| `/customers` | Searchable customer management |
| `/customers/new` | Create customer |
| `/customers/:id` | Customer details and appointment history |
| `/customers/:id/edit` | Edit customer |
| `/services` | Service summary and management cards |
| `/services/new` | Create service |
| `/services/:id/edit` | Edit service |
| `/appointments` | Searchable/filterable appointment management |
| `/appointments/new` | Create appointment |
| `/appointments/:id` | Appointment details and quick status update |
| `/appointments/:id/edit` | Edit appointment |

Every data page has explicit loading, empty, error, and success handling.
Customer, service, and appointment deletions use an accessible confirmation
dialog and display backend constraint messages.

## Local configuration

Copy `.env.example` to `.env` only when the API is not served at the default:

```powershell
cd frontend
Copy-Item .env.example .env
pnpm.cmd install
pnpm.cmd dev
```

`VITE_API_URL` defaults to `http://localhost:3400/api`. The Axios client always
sends credentials so the backend's HTTP-only session cookie works on refresh.

## Verification

Run the normal package checks directly:

```powershell
cd frontend
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd build
```

The exported images listed in `docs/DESIGN_VALIDATION.md` remain the visual
comparison source. Unsupported export, revenue, payment, barber, notification,
and analytics controls are intentionally absent.
