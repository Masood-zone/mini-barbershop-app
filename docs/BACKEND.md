# TrimTrack Backend

## Phase 4 foundation

The backend is an Express 5 TypeScript application using ES modules,
`mysql2/promise`, session middleware, CORS, Zod environment validation, and one
shared JSON response envelope.

The request direction is:

```text
route -> middleware -> controller -> service -> repository -> MySQL
```

Routes declare paths and handlers. Controllers translate HTTP input and output.
Services coordinate business behavior. Repositories own SQL and database
mapping. The health endpoint follows this complete flow as the foundation
reference.

## Startup and shutdown

`src/index.ts` is the process entrypoint. It calls `startServer` from
`src/server.ts`, which verifies a MySQL connection before opening the HTTP
listener. If MySQL is unavailable, startup fails cleanly instead of accepting
requests in a broken state.

`SIGINT` and `SIGTERM` close the HTTP listener and MySQL pool. The application
object remains separate in `src/app.ts`, allowing Supertest to exercise the
middleware stack without binding a port.

## Middleware order

`src/app.ts` registers middleware in this order:

1. CORS with the configured frontend origin and credentials enabled.
2. JSON parsing with a 1 MB body limit.
3. Session middleware with an HTTP-only cookie.
4. `/api` routers.
5. The not-found handler.
6. The centralized four-argument error handler.

The default in-memory session store is for local scaffolding only. Persistent
session storage and authentication behavior belong to Phase 5.

## Phase 5 session authentication

Login validates credentials through a prepared user lookup and bcrypt. The
controller regenerates the session before storing only `userId`, then explicitly
saves it before responding. `/auth/me` reloads the safe user from MySQL, and
logout destroys the session and clears the cookie.

Customer and service routers apply the shared authentication middleware before
all CRUD handlers. Password hashes never leave the authentication repository.

The in-memory store remains acceptable only for this local version-one
application. It must be replaced before any deployment work expands the scope.

## Phases 6–7 CRUD

Customers and services each use matching route, controller, service, repository,
and type modules. Services own validation and not-found/conflict rules;
repositories use only `mysql2/promise.execute` placeholders and map snake_case
rows to camelCase API objects.

Customer listing supports an optional `search` query over name and phone.
Customer and service deletion return `409` when appointment foreign keys protect
the record.

## Health endpoint

`GET /api/health` checks MySQL and returns:

```json
{
  "success": true,
  "message": "TrimTrack API is healthy.",
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2026-07-27T00:00:00.000Z"
  }
}
```

A failed database check rejects through Express 5's promise-aware handler flow
and reaches the centralized error middleware.

## Errors

Unknown routes, malformed JSON, expected `ApiError` instances, and unexpected
server errors all use the shared API envelope. Unexpected errors are logged
server-side while the response remains:

```json
{
  "success": false,
  "message": "Internal server error."
}
```

## Local commands

Run commands from `backend/`:

```powershell
pnpm.cmd dev
pnpm.cmd lint
pnpm.cmd typecheck
pnpm.cmd test
pnpm.cmd build
pnpm.cmd foundation:verify
pnpm.cmd phases-5-7:verify
```

`foundation:verify` creates a disposable MySQL 9.4 instance, applies and checks
the Phase 3 database, starts the real API with a temporary least-privilege
database user, calls `/api/health`, and removes all temporary data and
processes.

`phases-5-7:verify` extends the disposable verification through real login,
session inspection, customer search/CRUD, service CRUD, conflict handling,
logout, and post-logout route protection.
