---
name: TrimTrack Design System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#404940'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707a6f'
  outline-variant: '#bfc9bd'
  surface-tint: '#1f6c3a'
  primary: '#004c22'
  on-primary: '#ffffff'
  primary-container: '#166534'
  on-primary-container: '#93e0a2'
  inverse-primary: '#8bd79b'
  secondary: '#5a5f62'
  on-secondary: '#ffffff'
  secondary-container: '#dce0e4'
  on-secondary-container: '#5e6367'
  tertiary: '#004565'
  on-tertiary: '#ffffff'
  tertiary-container: '#005e87'
  on-tertiary-container: '#9dd5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a6f4b5'
  primary-fixed-dim: '#8bd79b'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005226'
  secondary-fixed: '#dfe3e7'
  secondary-fixed-dim: '#c3c7cb'
  on-secondary-fixed: '#171c1f'
  on-secondary-fixed-variant: '#43474b'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  status-pending: '#f59e0b'
  status-confirmed: '#22c55e'
  status-in-progress: '#3b82f6'
  status-cancelled: '#ef4444'
  status-no-show: '#64748b'
typography:
  hero:
    fontFamily: Raleway
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  hero-mobile:
    fontFamily: Raleway
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  page-title:
    fontFamily: Raleway
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  section-title:
    fontFamily: Raleway
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  card-title:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  admin-max: 1600px
  reading-max: 672px
  gutter-sm: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  section-gap: 4rem
---

## Brand & Style

The brand personality is **Professional, Clean, and Trustworthy**, embodying a "well-groomed" aesthetic that mirrors the precision of a master barber. It balances the warmth of a local shop with the efficiency of a high-end service provider. The target audience includes both style-conscious customers seeking a seamless booking experience and barbershop owners requiring a robust utility tool.

The design style is **Corporate / Modern** with a focus on **Polished Professionalism**. It utilizes a systematic approach to whitespace and hierarchy to reduce cognitive load. The UI prioritizes reassurance through clarity, using progressive disclosure to guide users through complex workflows like multi-step booking. The visual language is "neatly trimmed"—avoiding unnecessary decorative flourishes in favor of structural integrity and functional elegance.

## Colors

The palette is anchored by a **Green Primary Palette** which serves as the core brand identifier, evoking a sense of calm and growth. The system supports Light, Dark, and System modes using a semantic token structure.

- **Primary**: A deep, sophisticated green used for main CTAs, active states, and brand emphasis.
- **Secondary**: A soft neutral used for lower-emphasis controls and background surfaces that require subtle separation.
- **Tertiary**: A professional blue used specifically for "In Progress" status and supporting data visualizations.
- **Neutral**: Deep slates and greys provide the foundation for text and structural boundaries.

Status semantics use tinted backgrounds with high-contrast text to ensure legibility. For example, a "Confirmed" appointment uses a primary green tint, while "Cancelled" uses a destructive red tint.

## Typography

This design system employs a dual-font strategy to balance character with utility. 

**Raleway** is used for all display and heading roles. It provides a distinct, "premium" feel that sets the brand apart from generic SaaS tools. **Inter** is used for the interface, body copy, and metadata, chosen for its exceptional legibility at small sizes and its systematic, neutral tone.

Uppercase styling is strictly reserved for short metadata and labels (using `label-md`) to ensure the interface doesn't feel aggressive. Paragraphs and buttons must always use sentence or title case.

## Layout & Spacing

The layout follows a **4px (0.25rem) rhythm** based on a fluid grid model. 

- **Desktop**: A 12-column grid is used for the main dashboard. The layout is constrained by a `max-w-7xl` container for customer-facing views, while admin views expand to `1600px` to accommodate data-heavy tables.
- **Sidebar**: Desktop features a persistent sidebar (280px) for navigation. On mobile, this transitions into a bottom-anchored drawer or a side-drawer triggered by a hamburger menu.
- **Spacing Strategy**: Use `gap` properties on flex and grid containers rather than individual margins to maintain a consistent 4px rhythm. Standard card padding is `1.5rem` (p-6), while compact admin rows use `1rem` (p-4).

## Elevation & Depth

This design system prioritizes **Tonal Layers** and **Restrained Outlines** over heavy shadows. Visual hierarchy is achieved through:

1.  **Subtle Borders**: Content grouping is primarily defined by `1px` borders using the `border` token. 
2.  **Surface Tiers**: The `card` background is slightly elevated from the `background` color through a subtle shift in tone (lighter in light mode, slightly lighter/elevated in dark mode).
3.  **Soft Ambient Shadows**: Use only for high-elevation components like Dialogs, Popovers, and Drawers. Shadows should be highly diffused with low opacity (e.g., `shadow-sm` or `shadow-md` equivalents).
4.  **Focus States**: Interactive elements use a primary-tinted `ring` to indicate keyboard focus, ensuring high accessibility without cluttering the static UI.

## Shapes

The shape language is defined by a **0.875rem (14px) base radius**, creating a friendly yet structured appearance.

- **Input Fields & Buttons**: Use `rounded-md` (0.375rem) to maintain a crisp, functional look for interactive elements.
- **Standard Components**: Use `rounded-lg` (0.5rem) for standard UI elements.
- **Large Containers/Cards**: Use `rounded-xl` (0.75rem) or `rounded-2xl` (1rem) for customer-facing service cards and landing page sections to emphasize the premium, approachable brand feel.

## Components

Components follow the **shadcn/ui** pattern: clean, unstyled logic paired with precise Tailwind styling.

- **Buttons**: High-contrast primary green for main actions. Contrary to some patterns, buttons in this system should adopt the `rounded-lg` style to align with the global shape language, moving away from `rounded-none`.
- **Inputs**: Use a standard `rounded-md` with a subtle `1px` border. On focus, the border transitions to the primary green with a soft ring glow.
- **Cards**: Use `rounded-xl` or `2xl`. Cards should prioritize white space and use `Raleway` for titles to inject brand character into data-heavy screens.
- **Status Badges**: Small, `rounded-md` tags with high-contrast text on a lightened background of the status color (e.g., a "Confirmed" badge uses a light green background with dark green text).
- **Navigation**: 
    - **Sidebar**: Minimalist with clear icon + label pairings. Active states use a subtle primary background tint.
    - **Drawer**: Bottom-sheet style for mobile booking to feel native and easy to use with one hand.
- **Service Lists**: Clean horizontal rows with high-contrast pricing and duration metadata using `text-xs font-medium`.