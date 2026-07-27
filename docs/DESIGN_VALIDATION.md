# Design Validation Map

The `designs/` directory is the local export of the referenced TrimTrack App and
is the visual source of truth available to Codex.

## Screen map

| Product route or state | Visual reference |
| --- | --- |
| `/login` | `designs/Login/trimtrack_login/screen.png` |
| `/dashboard` | `designs/Admin Dashboard/dashboard/screen.png` |
| dashboard loading | `designs/Admin Dashboard/dashboard_loading_state/screen.png` |
| `/customers` | `designs/Admin Dashboard/customers/screen.png` |
| `/customers/new` | `designs/Admin Dashboard/add_customer/screen.png` |
| `/customers/:id` | `designs/Admin Dashboard/customer_profile/screen.png` |
| delete customer | `designs/Admin Dashboard/delete_customer_confirmation/screen.png` |
| `/services` | `designs/Admin Dashboard/services/screen.png` |
| `/appointments` | `designs/Admin Dashboard/appointments/screen.png` |
| `/appointments/new` | `designs/Admin Dashboard/create_appointment/screen.png` |

## Validation checklist

For every completed screen:

1. Compare the page at the reference desktop width.
2. Verify the same hierarchy at narrow mobile width; do not shrink the desktop
   table until it becomes unusable.
3. Check typography, gutters, section gaps, control height, borders, radii, and
   status treatment against the export.
4. Replace sample names, dates, totals, and statuses with API data.
5. Ensure every visible control either works or is deliberately removed.
6. Verify loading, empty, error, success, disabled, and destructive states.
7. Check keyboard navigation, focus return from dialogs, accessible names,
   contrast, zoom, and light/dark themes.

The exported `code.html` files may be inspected for measurements and intent, but
they are not React source and must not be pasted into the application.

## Version-one design reconciliation

Some exports show concepts beyond `PLAN.md`. Preserve their useful hierarchy and
spacing, but do not implement the following version-one features:

- staff or barber management and staff assignment;
- public customer booking or a client booking application;
- service categories, visibility, or staff-only services;
- revenue, payments, advanced analytics, notifications, or exports;
- appointment statuses other than `Scheduled`, `In Progress`, `Completed`, and
  `Cancelled`.

When each frontend phase is implemented, remove unsupported controls or replace
their content with approved data and record any non-obvious screen decision in
this document.

## Phase 10–15 reconciliation

- Dashboard revenue, analytics, notification, and staff-oriented controls are
  replaced by approved customer, service, appointment, and status information.
- Customer export and membership labels are omitted.
- Appointment price is displayed only as service context; no tax, payment, or
  revenue workflow is calculated.
- Appointment creation starts in `Scheduled`, while edit and quick-status
  controls expose only the four approved statuses.
- Desktop tables become structured cards at narrow widths rather than shrinking
  into horizontally unreadable rows.
