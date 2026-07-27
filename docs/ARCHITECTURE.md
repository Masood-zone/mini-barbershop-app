# TrimTrack Architecture

## Goal

TrimTrack uses the same explicit layering style as Atica CMS while keeping the
technology decisions in `PLAN.md`: a React/Vite client, an Express 5 REST API,
session authentication, and direct MySQL access through `mysql2/promise`.

Atica is a structural reference, not a source tree to copy. Its school/canteen
domains, JWT authentication, Prisma layer, secrets, generated files, and legacy
framework workarounds do not belong here.

## Runtime flow

```text
React page
  -> TanStack Query hook
    -> domain API function
      -> shared Axios client
        -> Express route
          -> middleware
            -> controller
              -> service
                -> repository
                  -> MySQL
```

Dependencies point only to the right in this diagram. A lower layer must not
import a higher layer.

## Backend

```text
backend/
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   └── queries.sql
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   └── routes/
│   ├── config/
│   ├── db/
│   │   └── repositories/
│   ├── middlewares/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   └── index.ts
├── tests/
├── .env.example
├── eslint.config.js
├── package.json
└── tsconfig.json
```

### Responsibilities

| Layer | Owns | Must not own |
| --- | --- | --- |
| route | URL, HTTP method, middleware order | SQL or business rules |
| controller | HTTP parsing, status, response envelope | database calls |
| service | validation beyond shape, business rules, transactions | Express objects |
| repository | prepared SQL and row mapping | HTTP behavior |
| middleware | authentication, request concerns, errors | domain workflows |

Every feature should use the same domain name at each layer:

```text
customer-routes.ts
customer-controller.ts
customer-service.ts
customer-repository.ts
```

The API base path is `/api`. Success and error payloads use:

```ts
type ApiResponse<T> = {
  success: boolean
  message: string
  data?: T
}
```

### Sessions

Authentication uses an HTTP-only session cookie because that is the project
decision in `PLAN.md`. CORS must allow credentials and the frontend Axios client
must set `withCredentials: true`.

The default in-memory session store is acceptable only for initial local
scaffolding. Before deployment, select a persistent MySQL-compatible session
store and document the decision.

## Frontend

```text
frontend/src/
├── assets/
├── components/
│   ├── layout/
│   ├── navbar/
│   ├── shared/
│   ├── sidebar/
│   ├── typography/
│   └── ui/
├── hooks/
├── lib/
├── pages/
│   ├── admin/
│   │   ├── appointments/
│   │   ├── customers/
│   │   ├── dashboard/
│   │   └── services/
│   ├── auth/
│   └── not-found/
├── routes/
├── services/
│   └── api/
│       ├── appointments/
│       ├── auth/
│       ├── customers/
│       ├── dashboard/
│       └── services/
├── store/
├── types/
└── utils/
```

Each data domain keeps transport functions and query behavior separate:

```text
services/api/customers/
├── customers.api.ts
├── customers.keys.ts
└── customers.queries.ts
```

- `*.api.ts` performs HTTP calls and returns typed data.
- `*.keys.ts` defines one query-key factory.
- `*.queries.ts` defines query and mutation hooks.
- Pages compose hooks and components; they do not call Axios directly.

Use React Router's data router with nested layouts and lazy route modules. Keep
authentication checks at the protected layout/loader boundary rather than
duplicating them in every page.

## Scope boundaries

Version one has one administrator role. The `frontend/DESIGN.md` discussion of
public customers, barbers, staff management, and advanced analytics describes a
possible larger product direction, not approved version-one scope. The exported
login/dashboard/customer/service/appointment screens and `PLAN.md` are the
implementation target.

## Change rule

An architectural change is allowed when it solves a concrete requirement, but
the same change must update this document, `AGENTS.md` if agent behavior changes,
and the relevant API/design documentation.

