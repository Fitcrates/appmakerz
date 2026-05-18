# i18n Code Review & Cleanup Summary

## Date: 2026-05-17

## Context
During the migration to a Next.js App Router with file-based i18n (`[lang]` routes), both the old root-level pages and the new localized pages co-existed, creating structural duplication, inconsistent SEO metadata, and missing UI enhancements that had been implemented only in the old root pages.

---

## 1. Redirect Root `/` → `/pl`

**Why:** The application treats Polish (`pl`) as the default language. Keeping a separate root `page.tsx` that duplicated `/pl` content would create canonical/duplicate-content issues for search engines.

**What was done:**
- Replaced `src/app/page.tsx` with a permanent redirect to `/pl`.
- This ensures a single canonical homepage at `/pl` and eliminates root-level duplicate content.

```tsx
// src/app/page.tsx
import { permanentRedirect } from 'next/navigation';
export default function HomePage() {
  permanentRedirect('/pl');
}
```

---

## 2. Removed Old Non-Localized Duplicates

**Why:** After the i18n migration, the root-level pages outside `[lang]` were redundant. They would compete with their `[lang]` counterparts for indexing and confuse the routing structure.

**Deleted directories:**
- `src/app/about-me/`
- `src/app/blog/` (including `[slug]`)
- `src/app/faq/`
- `src/app/privacy-policy/`
- `src/app/project/` (including `[slug]`)
- `src/app/uslugi/` (including `[slug]`)
- `src/app/unsubscribe/`
- `src/app/kalkulator/` (empty folder)

**Result:** The entire public routing is now strictly under `src/app/[lang]/`, making the i18n boundary unambiguous.

---

## 3. Added Missing `keywords` to Localized Pages

**Why:** The new `[lang]` pages were missing the `keywords` array that existed in the old root pages. Keywords remain a lightweight SEO signal and ensure parity with the previous setup.

**Pages updated:**
| Page | Polish keywords | English keywords |
|------|-----------------|------------------|
| `[lang]/page.tsx` | strony internetowe landing page, platformy internetowe, aplikacje ai, … | landing pages, web platforms, ai applications, … |
| `[lang]/blog/page.tsx` | blog, web development, next.js, react, ai, aplikacje webowe, appcrates | blog, web development, next.js, react, ai, web applications, appcrates |
| `[lang]/faq/page.tsx` | faq, często zadawane pytania, web development, appcrates | faq, frequently asked questions, web development, appcrates |
| `[lang]/privacy-policy/page.tsx` | polityka prywatności, rodo, gdpr, appcrates | privacy policy, gdpr, appcrates |
| `[lang]/kalkulator/page.tsx` | kalkulator wyceny, cena strony www, koszt sklepu internetowego, wycena projektu, appcrates | pricing calculator, website cost, ecommerce price, project estimate, appcrates |

Dynamic pages (`blog/[slug]`, `project/[slug]`, `uslugi/[slug]`, `about-me`) already pull keywords from Sanity (`seo.keywords`), so no static list was added there.

---

## 4. Ported Latest UI Enhancements to Localized Pages

### `[lang]/about-me/page.tsx`
- **Hover effects** on the specializations list (red corner accents, glowing numbers, gradient bottom line).
- **SpotlightText** wrappers on section headings.
- **Bottom CTA** section: "Zainteresowany współpracą? / Interested in working together?" with a styled `PrefetchLink`.

### `[lang]/uslugi/[slug]/page.tsx`
- **Stats bar** below hero (localizable `value` + `label` pairs from Sanity).
- **Problems grid** — "Problems I solve" section with animated red corner accents, pulsing numbers, and bottom glow.
- **Secondary CTA** in hero: "Zobacz projekty / View projects".
- **Enhanced bottom CTA** with `BurnSpotlightText`, subtext, and teal glow hover shadow.

These enhancements existed only in the old root pages and were lost during the initial i18n migration.

---

## 5. Minor Fixes

- `[lang]/uslugi/[slug]/page.tsx`: removed unused `ArrowUpRight` import.
- `[lang]/kalkulator/page.tsx`: removed an empty noise-background `div`.

---

## Resulting `src/app/` Structure

```
src/app/
├── [lang]/              # All localized pages (pl + en)
│   ├── about-me/
│   ├── blog/
│   ├── faq/
│   ├── kalkulator/
│   ├── privacy-policy/
│   ├── project/
│   ├── unsubscribe/
│   └── uslugi/
├── api/                 # API routes
├── layout.tsx           # Root layout (metadata, GTM, schemas)
├── page.tsx             # Redirects / → /pl
├── not-found.tsx
├── loading.tsx
├── globals.css
├── robots.ts
└── sitemap.ts
```

There are no longer any root-level pages competing with `[lang]` routes.

---

## SEO Checklist Post-Cleanup

- [x] No duplicate content between `/` and `/pl`
- [x] `keywords` present on all static localized pages
- [x] Dynamic pages use Sanity-driven `seo.keywords`
- [x] `alternates` (canonical + language versions) on every page
- [x] `openGraph` and `twitter` cards on homepage
- [x] `robots.ts` and `sitemap.ts` at root level
- [x] BreadcrumbList + FAQPage structured data on service landings
- [x] BlogPosting structured data on blog posts
- [x] Person + WebSite schemas in root layout
