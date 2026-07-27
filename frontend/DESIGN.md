# Mini Barbershop Frontend Design

## Purpose

This document defines the product and interface direction for the mini barbershop
frontend. It is the shared reference for layout, visual language, components,
interaction behavior, accessibility, and implementation decisions.

The application should make the most common barbershop tasks feel immediate:

- Customers can understand the offer and book an appointment quickly.
- Staff can see the day's work and update appointment status with little effort.
- Owners can maintain services, staff, schedules, and bookings without needing a
  complex back-office system.

The interface should feel polished and confident, but compact enough for a small
business. Avoid generic admin-dashboard density and decorative elements that do
not help a user complete a task.

## Current State

The frontend is an early scaffold rather than a finished product interface.

- React 19, TypeScript, and Vite provide the application foundation.
- Tailwind CSS 4 is the styling system.
- shadcn/ui with Base UI primitives provides accessible component foundations.
- Lucide is the icon library.
- `ThemeProvider` supports light, dark, and system themes. Pressing `d` toggles
  light and dark mode when focus is not inside an editable field.
- Inter is configured for interface text and Raleway for display headings.
- The only product component currently installed is `Button`.

The sections below describe the intended design. They are guidance for future
implementation, not a claim that the corresponding screens already exist.

## Product Experience

### Primary audiences

**Customer**

Needs to compare services, choose a barber and time, enter contact details, and
receive a clear confirmation. The booking path should work especially well on a
phone.

**Barber**

Needs a focused view of today's appointments, customer notes, service duration,
and status. Routine actions should be possible in one or two taps.

**Owner or manager**

Needs a broader view of bookings, services, prices, staff availability, and basic
business performance.

### Experience principles

1. **Booking is the primary path.** A customer should never need to search for
   the next step.
2. **Show decisions progressively.** Ask for service, professional, time, and
   customer details in understandable stages instead of showing one long form.
3. **Make time visible.** Durations, available slots, opening hours, and
   appointment status must be easy to scan.
4. **Prefer reassurance over novelty.** Price, duration, cancellation rules, and
   confirmation details should be explicit.
5. **Design for the counter and the phone.** Staff may use the application on a
   desktop at the shop, while customers will commonly use a narrow viewport.

## Information Architecture

### Customer-facing routes

| Route | Purpose | Primary action |
| --- | --- | --- |
| `/` | Brand introduction, services preview, opening hours, location | Book now |
| `/services` | Full service and price list | Choose service |
| `/book` | Guided booking flow | Confirm booking |
| `/booking/:id` | Confirmation or appointment details | Manage appointment |

If the first release is intentionally small, `/services` can be a section on the
home page and the booking flow can remain a single route with internal steps.

### Staff and owner routes

| Route | Purpose | Primary action |
| --- | --- | --- |
| `/admin` | Today overview and useful business summary | View schedule |
| `/admin/appointments` | Calendar/list of bookings | Add appointment |
| `/admin/services` | Service, duration, and price management | Add service |
| `/admin/staff` | Team and availability management | Add staff member |
| `/admin/settings` | Shop details, hours, policies, and appearance | Save changes |

Administrative routes should use a persistent navigation shell on desktop and a
compact drawer or bottom navigation on small screens.

## Visual Direction

The existing green primary palette is the product's strongest visual cue. Use it
as a calm, reliable accent rather than flooding every surface with green. Neutral
backgrounds, strong typography, restrained borders, and spacious service cards
should make the product feel contemporary and local rather than clinical.

Recommended brand characteristics:

- clean and well-groomed;
- warm but not playful;
- direct and trustworthy;
- premium without appearing expensive or exclusive.

Photography, when introduced, should show real people, the shop, or close detail
of the craft. Avoid stock imagery that looks like a luxury salon unrelated to the
business. Every image needs meaningful alt text unless it is purely decorative.

## Design Tokens

Tokens live in `src/index.css` and are exposed to Tailwind through
`@theme inline`. Components must use semantic classes such as `bg-primary`,
`text-muted-foreground`, and `border-border` instead of copying raw color values.

### Color roles

| Token | Intended use |
| --- | --- |
| `background` / `foreground` | Page canvas and default text |
| `card` / `card-foreground` | Raised or grouped content |
| `primary` / `primary-foreground` | Main calls to action, selected states, brand emphasis |
| `secondary` / `secondary-foreground` | Lower-emphasis controls and supporting surfaces |
| `muted` / `muted-foreground` | Subtle sections, metadata, hints, and disabled context |
| `accent` / `accent-foreground` | Hover and contextual highlight states |
| `destructive` | Cancellation, deletion, and irreversible warnings |
| `border`, `input`, `ring` | Boundaries, form controls, and keyboard focus |
| `chart-1` through `chart-5` | Ordered data-series colors only |

Do not use color alone to communicate appointment status. Pair it with a label
and, where helpful, an icon.

Suggested status semantics:

| Status | Presentation |
| --- | --- |
| Pending | Neutral or amber-tinted badge with text |
| Confirmed | Primary green-tinted badge with text |
| In progress | Blue-tinted badge with text |
| Completed | Muted badge with check icon and text |
| Cancelled | Destructive-tinted badge with text |
| No-show | High-contrast neutral badge with text |

Status-specific colors should be added as semantic CSS variables if they are used
in more than one component.

### Typography

- **Interface and body:** Inter Variable (`font-sans`)
- **Display headings:** Raleway Variable (`font-heading`)
- **Technical or fixed-width values:** system monospace only when the distinction
  is meaningful

Use Raleway selectively for page titles, hero text, and major section headings.
Use Inter for controls, forms, tables, prices, dates, and body copy.

Recommended type scale:

| Role | Suggested classes |
| --- | --- |
| Hero | `font-heading text-4xl font-semibold tracking-tight md:text-6xl` |
| Page title | `font-heading text-3xl font-semibold tracking-tight` |
| Section title | `font-heading text-2xl font-semibold tracking-tight` |
| Card title | `text-base font-semibold` |
| Body | `text-sm leading-6` or `text-base leading-7` |
| Supporting text | `text-sm text-muted-foreground` |
| Label / metadata | `text-xs font-medium` |

Do not use uppercase text for paragraphs or full button labels. It is acceptable
for very short metadata when letter spacing is increased.

### Shape and elevation

The global radius is `0.875rem`, with derived radius sizes available through
Tailwind. Use:

- `rounded-md` for inputs and compact controls;
- `rounded-lg` for cards and panels;
- `rounded-xl` or `rounded-2xl` for prominent customer-facing sections;
- a subtle border before a shadow for ordinary content grouping.

The current `Button` intentionally uses square corners (`rounded-none`). Keep that
choice only if it becomes a deliberate brand signature across primary actions.
Otherwise, align buttons with the shared radius before expanding the component
library. Mixing square buttons with rounded inputs and cards without a clear
reason will look accidental.

### Spacing and layout

Use Tailwind's four-pixel spacing rhythm. Prefer `gap-*` on layout containers
instead of individual margins.

- Customer content width: `max-w-7xl`
- Reading/form width: `max-w-xl` to `max-w-2xl`
- Admin content width: fluid, with a sensible maximum around `max-w-[1600px]`
- Page gutters: `px-4 sm:px-6 lg:px-8`
- Section spacing: `py-12 md:py-16 lg:py-24`
- Card padding: `p-4` for compact admin cards, `p-6` for standard cards

Desktop layouts may use multiple columns, but preserve task order when columns
collapse. The mobile source order must remain logical for screen readers and
keyboard users.

## Core Screens

### Home

The first viewport should answer four questions: what the shop offers, where it
is, whether it is open, and how to book.

Recommended order:

1. Compact header with brand, essential navigation, and **Book now**.
2. Hero with concise value proposition, location/opening cue, and booking CTA.
3. Popular services with name, duration, and price.
4. Shop or team introduction.
5. Opening hours and location/contact details.
6. Final booking CTA and footer.

On mobile, keep a visible booking action without obscuring content. A sticky
bottom CTA is appropriate during the customer journey, but it must account for
safe-area insets.

### Booking flow

Use four understandable steps:

1. **Service** — show name, short description, duration, and price.
2. **Professional and time** — allow “any available barber” and group slots by
   date.
3. **Your details** — collect only information required to complete and contact
   the customer.
4. **Review and confirm** — summarize the selection, total, shop location, and
   relevant policy before submission.

The current selection should remain visible in a summary card on desktop. On
mobile, use a compact summary that can expand. Preserve entered values when the
user moves backward.

After confirmation, present a distinct success state with appointment date/time,
service, barber, location, and reference. Do not rely on a toast as the only
confirmation.

### Admin overview

Prioritize operational information over charts:

- current date and shop status;
- next appointment;
- today's appointment count;
- pending confirmations or conflicts;
- chronological schedule;
- compact totals only when they lead to an action.

The schedule should have a list view that works on narrow screens. A graphical
calendar can be added later, but should not be the only way to access bookings.

### Management pages

Services, staff, and settings should use consistent patterns:

- page title, short context, and one primary action;
- search/filter only when the amount of data justifies it;
- cards on mobile and a table or structured list on larger screens;
- create/edit forms in a dedicated panel, dialog, or page depending on length;
- destructive actions separated visually from routine edits.

## Components

Use shadcn/ui components as accessible foundations, then apply the application's
tokens and density. Add components only when a screen needs them.

### Shared product components

- `AppHeader` and `AdminSidebar`
- `PageHeader`
- `ServiceCard`
- `StaffCard`
- `Price`
- `Duration`
- `StatusBadge`
- `AppointmentCard`
- `AppointmentList`
- `TimeSlotPicker`
- `BookingSummary`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`

Product components belong under `src/components/`. Low-level reusable primitives
belong under `src/components/ui/`.

### Buttons and actions

- One primary action per panel or task region.
- Use the default variant for the action that advances or commits the task.
- Use secondary or outline for safe alternatives.
- Use ghost for compact row or toolbar actions.
- Use destructive only for actions with destructive meaning.
- Icon-only buttons require an accessible name and a tooltip when the icon may be
  unfamiliar.
- Loading buttons retain their width, communicate progress, and prevent duplicate
  submission.

### Forms

- Place visible labels above controls.
- Use placeholders as examples, not as replacements for labels.
- Put help text and validation messages close to the related control.
- Mark required fields in a consistent way.
- Validate after blur or submission; do not show errors before the user has had a
  chance to interact.
- Keep the user's input after a recoverable server or network error.
- Use native input types and autocomplete attributes for names, phone numbers,
  emails, dates, and times.

### Feedback

Use the smallest feedback mechanism that fully explains the result:

- inline message for field-level problems;
- alert/banner for page-level or persistent conditions;
- toast for short, non-critical acknowledgement;
- dialog for confirmation of high-impact actions;
- dedicated result state for booking success or failure.

Skeletons should resemble the final layout. Avoid indefinite spinners for content
that occupies a meaningful portion of the page.

## Interaction and Motion

Motion should clarify state change rather than decorate the interface.

- Keep control transitions near 150–200 ms.
- Use small opacity and position changes for panels, menus, and step transitions.
- Avoid motion on every card or list item.
- Respect `prefers-reduced-motion`.
- Never delay navigation or form completion to finish an animation.

Keyboard focus must remain visible through the existing `ring` token. Opening a
dialog or drawer should move focus inside it; closing it should return focus to
the trigger.

## Responsive Behavior

Start with the narrow layout, then enhance it at Tailwind breakpoints.

| Width | Expected behavior |
| --- | --- |
| Base | One-column content, full-width form controls, card-based data |
| `sm` | Improved horizontal padding and occasional paired controls |
| `md` | Two-column booking/service layouts where useful |
| `lg` | Persistent admin navigation and richer schedule layout |
| `xl` | Wider operational views without stretching reading content |

Avoid device-specific assumptions. Test at content-driven widths, including long
service names, large prices, and browser zoom.

## Accessibility Requirements

Target WCAG 2.2 AA.

- Use semantic landmarks and a logical heading hierarchy.
- Provide a skip link when persistent navigation is introduced.
- All functionality must work with a keyboard.
- Maintain at least a 44 by 44 CSS pixel touch target for primary mobile actions
  and frequently used controls.
- Ensure normal text reaches a 4.5:1 contrast ratio and large text reaches 3:1.
- Announce asynchronous form errors and booking results appropriately.
- Associate validation text with inputs through accessible descriptions.
- Never hide focus indicators.
- Provide text alternatives for meaningful images and visible labels for icons
  whose meaning is not obvious.
- Dates and times should be readable, localized, and include the timezone when a
  user could misunderstand it.

Both light and dark modes must be checked independently; passing in one theme
does not imply passing in the other.

## Content Guidelines

Use concise, conversational language.

- Prefer “Book an appointment” over “Initiate booking”.
- Label actions with verbs: “Choose time”, “Confirm booking”, “Save service”.
- Display price and duration together wherever a customer makes a service choice.
- Use specific errors: “That time was just booked. Choose another time.”
- Avoid blame: “We couldn't save your changes” rather than “You submitted an
  invalid request.”
- Confirm destructive outcomes explicitly, including what will happen to related
  appointments or availability.

Use one date and time style consistently throughout a view. Format values through
`Intl.DateTimeFormat` rather than assembling strings manually.

## Frontend Architecture

Keep route-level screens, product components, UI primitives, and data access
separate as the application grows. A suitable structure is:

```text
src/
  components/
    ui/                 # shadcn/Base UI primitives
    booking/            # booking-specific composed components
    admin/              # administrative composed components
  features/
    appointments/
    services/
    staff/
  hooks/
  lib/
    api/
    utils.ts
  pages/
  App.tsx
  index.css
  main.tsx
```

This structure is a direction, not a requirement to create empty directories.
Co-locate feature-specific types, validation, and queries with their feature.
Keep genuinely shared primitives small and independent of business data.

Implementation rules:

- Use TypeScript types at API and component boundaries.
- Keep server data in a query/cache layer once data fetching is introduced; do
  not duplicate it across unrelated component state.
- Represent loading, empty, error, and success states explicitly.
- Prefer composition to large components with many boolean display props.
- Use `cn()` for conditional class merging.
- Use semantic tokens instead of arbitrary colors.
- Do not add a state library until application complexity demonstrates the need.

## Theme Behavior

The root `ThemeProvider` defaults to system preference and stores the user's
choice in local storage. Future theme controls should offer Light, Dark, and
System choices rather than only a binary toggle.

The existing `d` shortcut is useful during development. Before public release,
either document it in an accessible shortcut/help surface or remove the
customer-facing hint so an unexplained global shortcut does not become part of
the product by accident.

## Definition of Done for UI Work

A screen or significant component is complete when:

- the primary task can be completed at narrow and wide widths;
- loading, empty, error, success, disabled, and destructive states are covered
  where relevant;
- keyboard navigation and focus behavior are correct;
- labels, accessible names, landmarks, and headings are present;
- light and dark themes have been visually checked;
- content does not break with long names, localized dates, or large values;
- TypeScript, lint, and production build checks pass;
- interaction behavior is covered by an appropriate test when the test setup is
  available.

## Near-Term Design Priorities

1. Decide whether square buttons are a deliberate brand choice and make control
   radii consistent.
2. Build the customer home page and service card.
3. Establish the guided booking shell and booking summary.
4. Add form primitives and documented validation behavior.
5. Build the mobile-first appointment list before adding a complex calendar.
6. Add real shop content, photography, opening hours, and policies.
7. Verify accessibility and responsive behavior before expanding admin features.
