# TrimTrack Codex Instructions

These instructions apply to the entire repository.

## Mission

Build TrimTrack as the small administrator-facing barber management system
defined in `PLAN.md`. Preserve the architecture and naming habits used in
`../atica-cms`, while using the current dependencies and APIs already selected
for this repository.

Do not turn this project into a generic booking SaaS, a multi-tenant platform, or
a public customer marketplace.

## Source-of-truth order

When references disagree, use this order:

1. `PLAN.md` for version-one scope, data rules, API behavior, and delivery phases.
2. `designs/**/screen.png` for screen composition and visual validation.
3. `designs/**/code.html` for design intent only, never as production code to
   paste verbatim.
4. `designs/Design System/DESIGN.md` and `frontend/DESIGN.md` for tokens,
   interaction, responsive behavior, and accessibility.
5. `docs/ARCHITECTURE.md` for folder ownership and dependency direction.
6. `../atica-cms` for structural conventions and naming patterns.
7. Current official library documentation for framework APIs.

If a design shows a value or affordance outside the version-one scope, preserve
the layout but do not invent the unsupported feature. Use real in-scope data or
remove the affordance only after documenting the decision.

## Fixed version-one scope

The authenticated administrator can:

- log in, inspect the current session, and log out;
- view dashboard totals and recent/today appointments;
- create, read, update, search, filter, and delete customers;
- create, read, update, and delete services;
- create, read, update, filter, and delete appointments;
- change appointment status.

Do not add staff management, online customer booking, payments, inventory,
multi-shop tenancy, analytics dashboards, cloud deployment, password reset, or
role systems unless the user explicitly expands the scope.

## Architecture rules

### Backend

Keep the Atica-style request flow:

```text
route -> middleware -> controller -> service -> repository -> MySQL
```

- Routes declare paths and middleware only.
- Controllers translate HTTP input/output and call one service operation.
- Services own business rules and transaction boundaries.
- Repositories contain SQL and database mapping only.
- Controllers never import the database pool.
- Routes never contain SQL or business logic.
- Repositories never depend on Express request/response objects.
- Use `mysql2/promise` prepared statements or `execute` for every value supplied
  by a user.
- Use Express 5 promise-aware async handlers. Do not recreate Atica's
  `catchAsync` helper.
- Put the centralized error handler after all routes.
- Return the shared API envelope described in `PLAN.md`.
- Session authentication is the project decision. Do not silently replace it
  with JWT authentication because Atica used JWT.

### Frontend

Keep the Atica-style feature separation:

```text
page -> query/mutation hook -> API function -> shared Axios client -> REST API
```

- `components/ui` contains shadcn/Base UI primitives only.
- `components/shared` contains reusable product components.
- `components/layout`, `navbar`, and `sidebar` contain application chrome.
- `pages` contains route-level composition, grouped by domain and action.
- `services/api/<domain>` keeps `<domain>.api.ts` separate from
  `<domain>.queries.ts`.
- `routes` owns route declarations and protection.
- Server state belongs to TanStack Query.
- Local cross-page authentication state may use Zustand. Do not mirror API
  collections into Zustand.
- Use TanStack Query v5 object syntax. Query callbacks such as `onError` are not
  valid on `useQuery`; render/query errors at the page boundary or use the global
  query cache where appropriate.
- Query keys must be created by per-domain key factories and invalidated after
  mutations.
- Use `@/` imports for frontend source files.

## Naming

- Source filenames use kebab-case: `customer-service.ts`,
  `customer-repository.ts`, `create-customer.tsx`.
- React components and TypeScript types use PascalCase.
- Functions, variables, hooks, and object instances use camelCase.
- Database tables and columns use snake_case.
- REST resources use plural kebab-case nouns.
- Keep domain words consistent across SQL, backend, API responses, and frontend.
  Do not alternate between `client` and `customer`; this project uses
  `customer`.

## Design fidelity

- Validate each implemented screen against its matching
  `designs/**/screen.png`.
- Reproduce information hierarchy, spacing, density, responsive behavior, and
  states; do not merely copy colors.
- Use semantic Tailwind tokens from `frontend/src/index.css`, not raw colors in
  product components.
- Use Raleway for display headings and Inter for interface/body text.
- Preserve the green brand palette, restrained borders, tonal surfaces, and
  rounded control language defined by the design system.
- Every data screen must support loading, empty, error, and success states.
- Every destructive action requires confirmation and explains the effect.
- Target WCAG 2.2 AA, visible focus, meaningful labels, keyboard access, and
  touch targets of at least 44 CSS pixels for frequent mobile actions.
- Check light and dark themes independently.

## Working method

1. Read the relevant section of `PLAN.md`, the matching screen export, and the
   adjacent Atica feature before changing a module.
2. Implement one vertical slice at a time.
3. Complete and verify SQL before repository code.
4. Verify the backend endpoint before connecting a frontend query.
5. Do not create speculative abstractions or unrelated features.
6. Update documentation when a contract or architectural decision changes.
7. Never copy Atica secrets, `.env` files, generated `dist` output, databases, or
   domain-specific school/canteen code.

## Verification

Run checks from the package being changed.

Frontend:

```powershell
cd frontend
pnpm lint
pnpm typecheck
pnpm build
```

Backend:

```powershell
cd backend
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For UI work, also run the app and compare the implemented route at narrow and
wide viewports with the matching exported screen. A feature is not complete
until its loading, empty, error, success, disabled, and destructive states have
been considered.

