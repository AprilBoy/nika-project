# Design Guidelines: Home Cook Appointment Booking App

## Design Approach

**Selected Approach:** Design System (Modern Productivity)
- Primary inspiration: Calendly's booking simplicity + Linear's clean aesthetics + Google Calendar's familiarity
- Rationale: This is a utility-focused tool where efficiency, clarity, and learnability drive user success. Standard patterns reduce cognitive load for busy home cooks.

## Core Design Principles

1. **Clarity First:** Every interaction should be obvious - no guessing
2. **Information Density:** Pack data efficiently without feeling cramped
3. **Touch-Friendly:** All interactive elements sized for mobile use
4. **Scannable:** Quick visual hierarchy for busy professionals

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts) - clean, professional, excellent readability
- Fallback: system-ui, -apple-system, sans-serif

**Type Scale:**
- Hero/Page Titles: text-4xl font-bold (36px)
- Section Headers: text-2xl font-semibold (24px)
- Card Titles: text-lg font-medium (18px)
- Body Text: text-base (16px)
- Labels/Metadata: text-sm text-gray-600 (14px)
- Captions: text-xs (12px)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, gap-2 (8px)
- Standard spacing: p-4, gap-4 (16px)
- Section spacing: p-6, p-8 (24px, 32px)
- Page margins: p-12, p-16 (48px, 64px)

**Containers:**
- App shell: max-w-7xl mx-auto
- Content cards: max-w-4xl
- Forms: max-w-2xl
- Modals: max-w-lg

**Grid Systems:**
- Calendar grid: 7-column (days of week)
- Time slots: Single column stack on mobile, 2-3 columns on desktop
- Dashboard: Responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

## Component Library

### Navigation
**Top App Bar:**
- Fixed position with logo left, primary actions right
- Height: h-16 on mobile, h-20 on desktop
- Includes: Logo/brand, main nav links (Dashboard, Calendar, Settings), user profile dropdown
- Border bottom with subtle shadow

**Sidebar (Desktop):**
- Width: w-64, collapsible to w-16 (icon-only)
- Contains: Quick actions, upcoming appointments preview, availability status toggle

### Calendar Components

**Month View Calendar:**
- Full grid with day headers
- Each date cell shows: date number + appointment count indicator (small badge)
- Current day highlighted with distinct border
- Past dates muted (reduced opacity)
- Appointments as colored dots/bars within date cells

**Day/Week View:**
- Timeline on left (hourly blocks from 6am-10pm)
- Appointment blocks span time slots with client name + service
- Available slots shown with subtle background treatment
- Grid lines every 30 minutes

**Time Slot Selector (Public Booking):**
- Date picker at top (calendar icon + readable format)
- Available times as clean button grid below
- Each slot shows time in clear format (9:00 AM - 10:00 AM)
- Duration indicated for each service type

### Forms & Inputs

**Booking Form:**
- Step indicators if multi-step (progress dots at top)
- Form sections with clear labels above inputs
- Input fields: rounded-lg, border, p-3, focus:ring-2
- Dropdowns for service selection with descriptions
- Date/time inputs prominent with calendar/clock icons
- Text areas for special requests (rounded-lg, min-h-32)

**Client Information:**
- Name, email, phone in clear labeled fields
- Optional service notes textarea
- Checkbox for booking confirmation preferences

### Cards & Lists

**Appointment Cards:**
- Rounded-xl with border
- Padding: p-6
- Header with date/time (text-lg font-semibold)
- Client info section with avatar placeholder + name + contact
- Service type badge
- Action buttons footer (View Details, Reschedule, Cancel)
- Status indicator (upcoming/completed/cancelled)

**Upcoming Appointments List:**
- Chronologically sorted
- Each entry: date/time left, client name + service center, action menu right
- Dividers between entries
- Empty state with friendly illustration + CTA to set availability

### Buttons & Actions

**Primary Actions:** 
- Solid background, rounded-lg, px-6 py-3
- Font: font-medium
- Examples: "Confirm Booking", "Set Availability"

**Secondary Actions:**
- Border style, rounded-lg, px-4 py-2
- Examples: "Cancel", "View Calendar"

**Icon Buttons:**
- Square (w-10 h-10), rounded-lg
- Used for: edit, delete, more options menu
- Clear hover states

### Modals & Overlays

**Confirmation Dialogs:**
- Centered overlay with backdrop blur
- Card with rounded-2xl, p-8
- Clear title (text-2xl font-bold)
- Description text (text-base)
- Action buttons in footer (Cancel left, Confirm right)

**Booking Success:**
- Celebration checkmark icon
- Confirmation details summary
- Add to Calendar button
- Share booking link option

### Status Indicators

**Availability Badge:**
- Pill shape, rounded-full, px-3 py-1, text-sm
- States: Available Now, Busy, Off Hours

**Appointment Status:**
- Dot + text combination
- States: Confirmed, Pending, Completed, Cancelled

### Empty States
- Centered content with icon (size-16)
- Friendly message (text-xl font-medium)
- Helpful action button
- Examples: "No appointments yet", "Set your availability to start receiving bookings"

## Icons
**Library:** Heroicons (via CDN)
- Solid variant for filled states and primary actions
- Outline variant for secondary actions and navigation
- Common icons: calendar, clock, user, check, x-mark, cog, bell, plus

## Responsive Behavior

**Mobile (< 768px):**
- Hamburger menu for navigation
- Single column layouts
- Bottom navigation bar for primary actions
- Calendar switches to agenda/list view
- Full-screen modals

**Tablet (768px - 1024px):**
- Collapsible sidebar
- 2-column grids where appropriate
- Calendar shows week view default

**Desktop (> 1024px):**
- Full sidebar visible
- 3-column dashboard layouts
- Month view calendar default
- Split views (calendar left, details right)

## Accessibility
- All interactive elements min-h-11 (44px) for touch targets
- Focus indicators on all clickable elements (ring-2)
- Proper ARIA labels for calendar navigation
- Screen reader announcements for booking confirmations
- Keyboard navigation throughout (Tab, Enter, Escape)
- Form validation with clear error messages below fields

## Images
**Not Required:** This is a data-driven productivity app. No hero images needed. Focus on clean, functional interface with icons and data visualization.

## Animation Strategy
**Minimal & Purposeful:**
- Page transitions: Simple fade-in (200ms)
- Modal entry: Scale from 95% to 100% (150ms)
- Success states: Subtle bounce on checkmark
- NO scroll animations, parallax, or decorative motion