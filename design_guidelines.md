# Design Guidelines: Nika Shikhlinskaya Consulting Landing Page

## Design Approach

**Selected Approach:** Reference-Based (Premium Professional Services)
- Primary inspiration: McKinsey's authority + Stripe's restraint + Apple's minimalism
- Rationale: Consulting landing pages require immediate trust establishment through refined aesthetics. Visual sophistication signals expertise while warmth creates approachability.

## Core Design Principles

1. **Premium Simplicity:** Generous whitespace, refined typography, restrained elegance
2. **Strategic Hierarchy:** Guide visitors through value proposition → credibility → action
3. **Warmth Through Humanity:** Personal photos, authentic testimonials, conversational tone
4. **Confident Authority:** Bold statements, clear positioning, no hedging

## Typography System

**Font Stack:**
- Primary: Montserrat (via Google Fonts) - sophisticated, confident
- Secondary: Open Sans - warm, readable for body text
- Fallback: system-ui, sans-serif

**Type Scale:**
- Hero Headline: text-5xl md:text-6xl font-bold leading-tight
- Section Headers: text-3xl md:text-4xl font-semibold
- Subheadings: text-xl md:text-2xl font-medium
- Body Text: text-lg leading-relaxed
- Labels/Captions: text-base
- Accent Text: text-sm uppercase tracking-wide

## Layout System

**Spacing Primitives:** Tailwind units of 4, 8, 12, 16, 20, 24
- Section vertical padding: py-20 md:py-32
- Container horizontal padding: px-6 md:px-12
- Element spacing: gap-8, gap-12, gap-16
- Micro spacing: p-4, p-6

**Containers:**
- Hero: Full-width with inner max-w-7xl mx-auto
- Content sections: max-w-6xl mx-auto
- Text-focused sections: max-w-4xl mx-auto

## Component Library

### Hero Section (Full viewport height - 85vh)
**Layout:** Split-screen on desktop, stacked on mobile
- Left side (55%): Headline + compelling subheadline + primary CTA + trust indicators ("15+ лет опыта" badge)
- Right side (45%): Large professional portrait image with subtle shadow treatment
- Buttons with backdrop-blur-sm bg-white/90 when overlaying images
- Scroll indicator at bottom (animated downward chevron)

### About Section
**Layout:** Two-column on desktop (40% image, 60% content)
- Professional candid photo (office/consultation setting)
- Text content: Personal story opening, expertise breakdown, philosophy statement
- Timeline visualization showing career milestones
- Signature or personal touch element

### Process Visualization Section
**Layout:** Horizontal step flow with numbered cards
- 4-5 process steps in responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Each card: Large number (text-6xl font-bold opacity-20), step title, brief description, icon
- Connecting lines/arrows between steps (hidden on mobile)
- Section intro: Centered heading + descriptive paragraph

### Services Section
**Layout:** Three-column card grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each service card: Icon header, service name, detailed description, benefits list, "Узнать больше" link
- Cards with border, rounded-2xl, p-8
- Hover states with subtle lift (transform translate-y)

### Testimonials Section
**Layout:** Masonry-style cards with staggered positioning
- 3 testimonial cards in asymmetric grid
- Each card: Client photo (rounded-full, w-16 h-16), quote text (text-lg italic), client name + title + company
- Cards: rounded-xl, p-8, shadow-lg
- Background: Subtle gradient or pattern treatment

### Call-to-Action Section
**Layout:** Centered content with strong visual contrast
- Headline emphasizing transformation/results
- Two-option CTA: Primary ("Записаться на консультацию") + Secondary ("Скачать кейс-стади")
- Contact methods row (email, phone, Telegram) with icons

### Footer
**Layout:** Multi-column grid (grid-cols-1 md:grid-cols-4)
- Column 1: Logo/brand + tagline
- Column 2: Quick links (О методе, Услуги, Кейсы)
- Column 3: Contact info with icons
- Column 4: Social media links + newsletter signup
- Bottom bar: Copyright, privacy policy, terms
- Total footer padding: py-16

## Icons
**Library:** Heroicons (outline variant for lightness)
- Key icons: chart-bar (analytics), users (team), lightbulb (strategy), arrow-trending-up (growth)

## Images

**Hero Section:**
- Large professional portrait of Nika (high-quality, natural lighting, confident but approachable expression)
- Setting: Office/consultation environment with soft bokeh background
- Dimensions: Portrait orientation, optimized for right 45% of hero section
- Treatment: Subtle shadow, sharp focus

**About Section:**
- Candid working photo (consulting session, presenting, or thoughtful moment)
- Lifestyle feel, not overly posed
- Dimensions: Square or portrait, 600x800px minimum

**Testimonial Cards:**
- Client headshots (3 professional photos, diverse representation)
- Round crop, 128x128px minimum
- High quality with good lighting

**Background Treatments:**
- Subtle geometric patterns or gradients where appropriate
- No stock photography - all images should feel authentic

**Image Strategy:** Hero image establishes immediate personal connection. About image reinforces humanity. No decorative imagery - every photo serves trust-building purpose.

## Responsive Behavior

**Mobile (< 768px):**
- Hero: Stacked layout, image reduced to 50vh
- Process: Single column cards
- Services: Single column cards
- Testimonials: Vertical stack
- Footer: Single column stack

**Tablet (768px - 1024px):**
- Hero: Maintained split but adjusted ratios (60/40)
- Services: 2-column grid
- Process: 2-column grid

**Desktop (> 1024px):**
- Full multi-column layouts active
- Maximum content width enforced
- Generous whitespace on ultra-wide screens

## Accessibility
- All CTAs minimum h-12 with clear hover states
- Focus indicators: ring-2 ring-offset-2
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images emphasizing professional context
- Contrast ratios meeting WCAG AA standards
- Keyboard navigation throughout
- Russian language attributes (lang="ru")