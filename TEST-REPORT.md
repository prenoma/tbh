# TBH Landing Page — QA Test Report

**Date:** 2026-04-22  
**Tester:** QA Agent (automated via agent-browser)  
**URL:** http://localhost:3000  
**Screenshots:** `/test-screenshots/`

---

## PASS Items

### Loading Screen
| # | Check | Result |
|---|-------|--------|
| 1 | Loader background is deep purple `#4B388F` | PASS — `style={{ backgroundColor: "#4B388F" }}` confirmed in source |
| 2 | "tbh" rendered as TEXT, not image/PNG | PASS — plain text `"tbh"` in a `<div>`, not an `<img>` |
| 3 | Bastia Bold font used for loader text | PASS — `fontFamily: '"Bastia Bold", Georgia, serif'` |
| 4 | 4-pointed diamond/star SVG present | PASS — SVG with 4 polygon points + center diamond in `Loader.tsx:96-149` |
| 5 | GSAP shimmer/glint animation | PASS — GSAP timeline with `clipPath` sweep left-to-right in `Loader.tsx:27-38` |
| 6 | Loader fades out after ~2-3s | PASS — timeline: 1.2s shimmer + 0.6s hold + 0.6s fade = ~2.4s total |
| 7 | Loader unmounts and reveals page content | PASS — `setIsVisible(false)` + `onComplete()` callback |

### Hero Section
| # | Check | Result |
|---|-------|--------|
| 8 | Headline "something cool is coming" | PASS — exact text confirmed |
| 9 | Headline color `#EF5D34` (warm orange) | PASS — computed style `#ef5d34` |
| 10 | Subtitle text correct | PASS — "Drop your info and we'll get in touch with exclusive offers when we launch our site." |
| 11 | Subtitle color `#4B388F` (deep purple) | PASS — computed style `#4b388f` |
| 12 | Supporting text correct | PASS — "Got questions? Leave them below — we'd love to hear from you." |

### Waitlist Form
| # | Check | Result |
|---|-------|--------|
| 13 | Form card background `#C9B9D6` (lavender) | PASS — `backgroundColor: "#C9B9D6"` on `<form>` |
| 14 | Email field present with type="email" | PASS |
| 15 | Phone field with country code dropdown | PASS — `PhoneInput.tsx` component |
| 16 | India +91 default pre-selected | PASS — `useState("+91")` in `PhoneInput.tsx:27` |
| 17 | Flag emojis for all 7 countries | PASS — 🇮🇳🇺🇸🇬🇧🇦🇪🇨🇦🇦🇺🇸🇬 + 🌍 Other |
| 18 | Comments textarea, optional, max 500 chars | PASS — `maxLength={500}`, counter shows `X/500` |
| 19 | Submit button text "JOIN THE WAITLIST" | PASS — "Join the Waitlist" (title case variant) |
| 20 | Submit button background `#4B388F` | PASS — `backgroundColor: "#4B388F"` |
| 21 | Submit button white text | PASS — `color: "white"` |
| 22 | Form validation works (empty email) | PASS — Shows "Email is required" error |
| 23 | Form validation (invalid email) | PASS — Regex validation in `WaitlistForm.tsx:42` |
| 24 | Phone number required validation | PASS — `WaitlistForm.tsx:47` |
| 25 | Success message after submission | PASS — "You're on the list! We'll be in touch ✨" |
| 26 | API endpoint `/api/submit` validates & responds | PASS — Returns 200 with success message |

### Page Design
| # | Check | Result |
|---|-------|--------|
| 27 | Page background `#E8E2F4` (light lavender) | PASS — computed style `#e8e2f4` |
| 28 | Bastia Bold as primary/only font | PASS — All elements use `"Bastia Bold", Georgia, serif` |
| 29 | @font-face declaration correct | PASS — `globals.css:3-9`, loads from `/fonts/Bastia-Bold-Regular.otf` |
| 30 | Footer present | PASS — `© 2026 tbh. All rights reserved.` |
| 31 | Page title correct | PASS — `"tbh – Something Cool is Coming"` |
| 32 | OG meta tags present | PASS — OpenGraph with title, description, image |

### Responsive
| # | Check | Result |
|---|-------|--------|
| 33 | Mobile layout at 375px renders | PASS — Page loads and all elements visible at 375x812 |
| 34 | Responsive typography (text-6xl → text-8xl) | PASS — `md:` breakpoints used |

---

## FAIL Items

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Phone placeholder hardcoded to "10 digit number"** | Medium | `PhoneInput.tsx:26` — `placeholder = "10 digit number"`. This is India-specific. When user selects US (+1), UK (+44), or any other country, the placeholder still says "10 digit number" which is incorrect for those countries. Should adapt to selected country or use a generic placeholder like "Phone number". |
| 2 | **Duplicate `+1` values in country dropdown** | Medium | `PhoneInput.tsx:13,16` — Both US and Canada use `value="+1"`. The `<select>` uses `value` to determine selection, so selecting Canada will visually show the US option instead (since they share the same value). The `key` uses `code + name` which avoids React warnings, but the select element can't distinguish between the two at the DOM level. |

---

## WARN Items

| # | Issue | Details |
|---|-------|---------|
| 1 | **Hero has tiny decorative dot not in contract** | A 1px × 1px purple circle (`w-1 h-1 rounded-full`) sits between headline and subtitle in `Hero.tsx:19-24`. Not mentioned in the contract. Nearly invisible — consider removing or replacing with something intentional. |
| 2 | **Footer text exceeds contract spec** | Contract says `"© 2026 tbh"` style. Actual text is `"© 2026 tbh. All rights reserved."` — the "All rights reserved." is extra. Minor deviation. |
| 3 | **Email input missing `required` HTML attribute** | Validation is custom JS, but the `<input>` has no `required` attribute. Browser-native validation (floating tooltip) won't trigger. The custom validation works, but adding `required` would provide a better UX with the browser's built-in tooltip. |
| 4 | **`backdrop-filter: blur(10px)` on opaque form** | `WaitlistForm.tsx:135` applies `backdropFilter: "blur(10px)"` but the background is fully opaque `#C9B9D6`. The blur has no visual effect. Should either remove it or add transparency for a glassmorphism effect. |
| 5 | **Geist font loaded but unused** | Network requests show `__nextjs_font/geist-latin.woff2` being fetched (Next.js default). Since only Bastia Bold is used, this is wasted bytes (~15-20KB). Can be removed from the layout. |
| 6 | **No way to re-submit after success** | After successful submission, the form is replaced entirely by the success card. No "Submit another" or "Go back" option. If someone wants to sign up a second person, they must reload. |
| 7 | **Success card is same lavender as form** | The success state reuses the same `#C9B9D6` background. Consider differentiating it visually (e.g., adding a checkmark icon, animation, or slightly different color). |
| 8 | **No loading state visual on button** | The button shows "Submitting..." text when loading, but has no spinner or animation. The `disabled:opacity-60` class does dim it, which is good. |
| 9 | **Phone value combines country code + number** | `PhoneInput.tsx:44` sends `${countryCode}${number}` as a single string. The server receives `"+911234567890"` with no delimiter. Consider storing country code and number separately or using a separator. |
| 10 | **API only logs to console** | `route.ts:43-49` — Submissions are only `console.log`-ed. The TODO comment mentions Google Sheets integration. Data will be lost on server restart. This is expected for MVP but worth noting. |

---

## Color Accuracy Summary

| Element | Expected | Actual | Match? |
|---------|----------|--------|--------|
| Page background | `#E8E2F4` | `#e8e2f4` | YES |
| Hero headline | `#EF5D34` | `#ef5d34` | YES |
| Subtitle text | `#4B388F` | `#4b388f` | YES |
| Form card | `#C9B9D6` | `#c9b9d6` | YES |
| Submit button | `#4B388F` | `#4b388f` | YES |
| Loader background | `#4B388F` | `#4B388F` | YES |

---

## Test Screenshots

| File | Description |
|------|-------------|
| `01-initial-state.png` | Desktop view after page load (post-loader) |
| `02-empty-submit.png` | Form validation error on empty submit |
| `03-filled-form.png` | Form filled with valid test data (US country code selected) |
| `04-after-submit.png` | Success message after form submission |
| `05-mobile-375.png` | Mobile viewport (375x812) |
| `06-mobile-full-page.png` | Full page mobile screenshot |
| `07-desktop-full-page.png` | Full page desktop screenshot |

> **Note:** Screenshots were captured but could not be visually inspected during this automated test session (model limitation). Visual review of screenshots is recommended for spacing, alignment, and rendering quality.

---

## Overall Quality Score: 7.5 / 10

**Strengths:**
- All contract-specified colors are pixel-perfect
- Loader implementation is complete with GSAP shimmer, SVG diamond, and proper timing
- Form validation is thorough (email regex, phone required, character limit)
- Font loading and application is correct across all elements
- Mobile-responsive with proper breakpoints
- API endpoint validates input and returns appropriate responses

**Deductions:**
- -1.0: Phone input placeholder is hardcoded to "10 digit number" regardless of country
- -0.5: Duplicate `+1` value for US/Canada causes select behavior bug
- -0.5: Minor issues: unused Geist font, opaque backdrop-filter, no re-submit option
- -0.5: Could not visually verify screenshots (model limitation)

---

## Recommended Fixes (Priority Order)

1. **Fix duplicate +1 values** — Use unique values like `+1-US` and `+1-CA` internally, or combine US/Canada into one option
2. **Adapt phone placeholder to country** — Show "10 digit number" for India, "Phone number" for others
3. **Remove unused Geist font import** — Saves ~15-20KB on initial load
4. **Remove or fix `backdrop-filter: blur(10px)`** — Either remove it or add transparency for glassmorphism
5. **Add `required` attribute to email input** — Better native browser UX
