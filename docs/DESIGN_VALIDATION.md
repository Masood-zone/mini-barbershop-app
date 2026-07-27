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

