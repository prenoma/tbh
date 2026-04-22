# CONTRACT.md — tbh Waiting List Landing Page

## Overview

A single-page "Coming Soon" waiting list website for **tbh**, a modern women's clothing brand. The experience features a GSAP-powered shimmer loading screen that fades into an elegant landing page with a bold hero tagline and a 3-field waitlist form (email, phone, comments) connected to Google Sheets.

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 (latest) | Framework, App Router, API Routes |
| React | 19 | UI rendering |
| Tailwind CSS | 4 | Styling (CSS-first config) |
| GSAP | 3.12+ | Loading animation, page transitions |
| Google Sheets API | v4 | Form submission storage |

---

## Design System

### Colors

```css
--color-lavender-light: #E8E2F4;   /* Page background */
--color-lavender-mid: #C9B9D6;     /* Cards, form container, accents */
--color-purple-deep: #4B388F;      /* Buttons, borders, secondary text */
--color-orange: #EF5D34;           /* Primary text, headlines, CTAs */
--color-white: #FFFFFF;            /* Text on dark backgrounds */
```

### Color Usage Rules

- **Background**: `#E8E2F4` — the entire page
- **Hero headline**: `#EF5D34` (orange)
- **Hero subtitle / body**: `#4B388F` (deep purple)
- **Form container background**: `#C9B9D6` with subtle glass/frosted effect
- **Form labels**: `#EF5D34`
- **Input fields**: White with `#C9B9D6` border, focus ring `#4B388F`
- **Submit button**: `#4B388F` bg, `#FFFFFF` text, hover: darken slightly
- **Footer text**: `#4B388F` muted

### Typography

- **Font**: Bastia Bold ONLY — loaded via `@font-face` from `public/fonts/Bastia-Bold-Regular.otf`
- **Source file**: `Bastia-Bold Regular/Bastia-Bold Regular.otf` (copy to `public/fonts/`)
- **Fallback**: Georgia, serif (if font fails to load)
- **Scale**:
  - Hero title: `text-6xl md:text-8xl` (large, impactful)
  - Section headings: `text-3xl md:text-4xl`
  - Body text: `text-lg md:text-xl`
  - Form labels: `text-sm uppercase tracking-wider`
  - Button: `text-lg uppercase tracking-widest`

---

## Component Specifications

### 1. Loader (`src/components/Loader.tsx`)

**Purpose**: Full-screen loading animation that plays on page load.

**Behavior**:
1. Full-screen overlay with `#4B388F` background
2. "tbh" text rendered with Bastia Bold, large centered
3. **Diamond/star shape** — render the decorative diamond/star shape seen in the tbh logo (a small 4-pointed star/diamond sparkle) as an SVG element positioned near or below the "tbh" text. This diamond should also receive the shimmer effect or a subtle pulse animation.
4. GSAP animation sequence:
   - "tbh" text and diamond/star appear
   - A gradient shimmer/glint sweeps left to right across the text using `clip-path` or a pseudo-element mask
   - The shimmer is a bright highlight (white-to-transparent gradient) that moves across both the text and the diamond
   - Duration: ~1.2s for the sweep
   - Hold for ~0.6s
   - Fade out entire loader: ~0.6s
5. After loader fades, the main page animates in (y: 30 → 0, opacity: 0 → 1, duration 0.8s, ease: power3.out)
6. Loader is removed from DOM after animation completes

**Diamond/Star SVG**: Create a simple 4-pointed sparkle/diamond shape as an inline SVG. It should be small (~16-24px), white or with a subtle gradient, positioned below or to the upper-right of the "tbh" text. This is a decorative element inspired by the tbh logo.

**GSAP Timeline**:
```
0.0s - 1.2s: Shimmer sweep (clip-path or mask gradient moves 0% → 100%)
1.2s - 1.8s: Hold
1.8s - 2.4s: Loader fades out (opacity 1 → 0)
2.4s - 3.2s: Page content reveals (staggered: hero → form → footer)
```

**Props**: `onComplete: () => void` — callback to signal loader finished

### 2. Hero (`src/components/Hero.tsx`)

**Purpose**: Bold brand statement and call-to-action.

**Content**:
```
[something cool is coming]

Drop your info and we'll get in touch with exclusive offers
when we launch our site.

Got questions? Leave them below — we'd love to hear from you.
```

**Layout**:
- Centered text, max-width container
- The "something cool is coming" text is the largest element on the page
- Subtitle below in deep purple, slightly smaller
- Subtle decorative element (thin line or dot separator) between title and subtitle

**Visual**:
- Optional: `tbh.png` logo rendered small above or beside the tagline
- Text color: `#EF5D34` for the main line, `#4B388F` for subtitle

### 3. WaitlistForm (`src/components/WaitlistForm.tsx`)

**Purpose**: Collect email, phone, and comments from interested customers.

**Fields**:
| Field | Type | Validation | Placeholder |
|-------|------|-----------|-------------|
| Email | `email` | Required, valid email format | "your@email.com" |
| Phone | `tel` | Required, with country code selector | Dynamic based on country |
| Comments/Questions | `textarea` | Optional, max 500 chars | "Any questions or comments..." |

**Phone Field — Country Code Selector**:
- Render a dropdown/select for country code next to the phone input
- **Default country**: India (`+91` 🇮🇳)
- Include top countries: India, US, UK, UAE, Canada, Australia, Singapore, plus an "Other" option
- The dropdown shows flag emoji + country code (e.g., "🇮🇳 +91", "🇺🇸 +1")
- Phone input field accepts the local number (without country code)
- Submitted value combines country code + number (e.g., "+919876543210")

**Layout**:
- Contained in a card with `#C9B9D6` background, rounded corners, subtle shadow
- Fields stacked vertically with generous spacing
- Labels in `#EF5D34`, uppercase, small, tracking-wider
- Submit button full-width, `#4B388F` background, white text, uppercase, tracking-widest
- Button text: "JOIN THE WAITLIST" or "DROP MY INFO"

**States**:
- **Default**: Form with empty fields
- **Submitting**: Button shows loading spinner, fields disabled
- **Success**: Form replaced with success message ("You're on the list! We'll be in touch ✨")
- **Error**: Inline error message, button re-enabled

**API Call**: `POST /api/submit` with JSON body `{ email, phone, comments }`

### 4. Footer (`src/components/Footer.tsx`)

**Purpose**: Minimal closing element.

**Content**: "© 2026 tbh. All rights reserved." centered, small text in muted `#4B388F`

---

## API Contract

### `POST /api/submit`

> **Note**: Google Sheets integration will be configured later. For now, the API route should log submissions to console and return a success response. The route structure should be ready for Google Sheets integration when credentials are provided.

**Request**:
```typescript
interface SubmitRequest {
  email: string;      // Required, valid email
  phone?: string;     // Optional
  comments?: string;  // Optional, max 500 chars
}
```

**Response — Success (200)**:
```typescript
interface SubmitResponse {
  success: true;
  message: "You're on the list!";
}
```

**Response — Validation Error (400)**:
```typescript
interface SubmitError {
  success: false;
  error: string; // "Valid email is required"
}
```

**Response — Server Error (500)**:
```typescript
interface SubmitError {
  success: false;
  error: "Something went wrong. Please try again.";
}
```

### Google Sheets Integration (`src/lib/google-sheets.ts`)

> **DEFERRED**: Google Sheets will be set up later. For now, `route.ts` should just log the submission and return success. Keep the `google-sheets.ts` file structure ready but with a placeholder implementation.

- Uses `googleapis` npm package (install but don't configure yet)
- Service account auth (credentials in `.env.local`) — to be added later
- Appends row to specified sheet with columns: `Timestamp | Email | Phone | Comments`
- Sheet ID configured via environment variable

**Environment Variables** (`.env.local`):
```
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id-here
```

---

## File Structure

```
tbh/
├── Bastia-Bold Regular/
│   └── Bastia-Bold Regular.otf       # Font source (existing)
├── tbh.png                            # Original logo (existing)
├── public/
│   ├── fonts/
│   │   └── Bastia-Bold-Regular.otf   # Copied from root font folder
│   └── images/
│       └── tbh-logo.png              # Logo for use in components
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout, metadata, font preloading
│   │   ├── page.tsx                    # Main page: Loader → Hero + Form + Footer
│   │   ├── globals.css                 # Tailwind 4 @import, @font-face, CSS vars
│   │   └── api/
│   │       └── submit/
│   │           └── route.ts            # POST endpoint (mock for now, Sheets later)
│   ├── components/
│   │   ├── Loader.tsx                  # GSAP loading screen (text + diamond)
│   │   ├── Hero.tsx                    # Hero tagline section
│   │   ├── WaitlistForm.tsx            # 3-field form with country code selector
│   │   ├── PhoneInput.tsx              # Country code dropdown + phone input
│   │   └── Footer.tsx                  # Minimal footer
│   └── lib/
│       └── google-sheets.ts            # Google Sheets client utility
├── next.config.ts
├── package.json
├── tsconfig.json
├── .env.local                          # Google API credentials (gitignored)
└── .gitignore
```

---

## Page Flow

```
[Page Load]
    │
    ▼
[Loader.tsx mounts]
    │ GSAP timeline plays:
    │ 1. "tbh" text appears
    │ 2. Shimmer glint sweeps L→R
    │ 3. Hold briefly
    │ 4. Loader fades out
    │
    ▼
[Main content reveals] (staggered fade-up)
    │
    ├── Hero.tsx
    │   "something cool is coming"
    │   Subtitle about exclusive offers
    │
    ├── WaitlistForm.tsx
    │   [Email] [Phone] [Comments] → [JOIN THE WAITLIST]
    │         │
    │         ▼ POST /api/submit
    │   Google Sheets row appended
    │         │
    │         ▼
    │   Success message shown
    │
    └── Footer.tsx
        © 2026 tbh
```

---

## Constraints & Requirements

1. **Performance**: First Contentful Paint < 2s (the loader masks load time)
2. **Responsive**: Must look great on mobile (375px) through desktop (1440px+)
3. **Accessibility**: Form inputs must have proper labels, contrast ratios meet WCAG AA
4. **No placeholder content**: All copy is final, production-ready
5. **Font**: Bastia Bold is the ONLY font — no system fonts as primary (only fallback)
6. **Animations**: GSAP only — no CSS animation library mixing
7. **SEO**: Basic meta tags (title, description, og:image using the logo)

---

## Implementation Notes

### Tailwind CSS 4 Setup
Tailwind v4 uses CSS-first configuration. Define custom colors and fonts in `globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-lavender-light: #E8E2F4;
  --color-lavender-mid: #C9B9D6;
  --color-purple-deep: #4B388F;
  --color-orange: #EF5D34;
  --font-bastia: "Bastia Bold", Georgia, serif;
}
```

### GSAP Registration
Register GSAP plugins in a client component:
```typescript
"use client";
import { gsap } from "gsap";
```

### Next.js 16 + React 19
- Use `"use client"` directive for interactive components (Loader, WaitlistForm)
- Server Component for layout and page shell
- API Routes use `NextRequest` / `NextResponse` from `next/server`

---

## Open Questions

1. ~~**Font file**~~: ✅ Provided — `Bastia-Bold Regular/Bastia-Bold Regular.otf`
2. ~~**Logo in loader**~~: ✅ Text "tbh" with Bastia Bold + diamond/star SVG shape
3. ~~**Phone format**~~: ✅ India default (+91) with country dropdown
4. **Google Sheets credentials**: DEFERRED — set up later, API route mocks success for now

---

## Acceptance Criteria

- [ ] Loading screen shows "tbh" TEXT with Bastia Bold + diamond/star SVG shape
- [ ] GSAP shimmer glint sweeps left-to-right across text and diamond
- [ ] Smooth transition from loader to main page
- [ ] Hero section with bold tagline in `#EF5D34`
- [ ] Form with 3 fields: email (required), phone with India default country code dropdown (required), comments (optional)
- [ ] Phone field has country code selector with flag emojis, India (+91) pre-selected
- [ ] Form submits to `/api/submit` (mocked success response for now)
- [ ] Success/error states shown without page reload
- [ ] Responsive on mobile through desktop
- [ ] Only Bastia Bold font used throughout (loaded from .otf file)
- [ ] Color palette matches spec exactly (#E8E2F4, #C9B9D6, #4B388F, #EF5D34)
- [ ] Clean, elegant, feminine aesthetic
- [ ] Diamond/star decorative element in loader matches tbh brand identity
