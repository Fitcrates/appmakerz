# Update: Featured Projects powered by Sanity

**Date:** 2026-05-13  
**Scope:** Sanity schema, server queries, homepage (`ProjectsNew`), types  
**Author:** Cascade

---

## 1. Goal

Replace the hardcoded project list in `ProjectsNew` with live data from Sanity, while keeping the existing hardcoded projects as a **fallback** in case Sanity is unreachable or returns no featured projects.

---

## 2. Files Changed

### 2.1 Sanity Studio — Schema
**File:** `sanity.studio/schemas/documents/project.ts`

Added three new fields to the `project` document type:

| Field      | Type     | Group   | Description                                  |
|-----------|----------|---------|----------------------------------------------|
| `category`| `{en,pl}`| content | Short category label shown on the homepage   |
| `year`    | `string` | content | Release / completion year (e.g. "2024")        |
| `featured`| `boolean`| content | Whether to show this project on the homepage |

- `category` and `year` are **required**.
- `featured` defaults to `false`.

**Behavior in Studio:**
- Editors can now check "Featured on Homepage" for any project.
- The homepage will display only projects where `featured == true`.

---

### 2.2 Server-side Sanity Queries
**File:** `src/lib/sanity.server.ts`

Added:

```ts
export async function getFeaturedProjects() { ... }
```

- Queries: `*[_type == "project" && featured == true && defined(slug.current) && (!defined(seo.noIndex) || seo.noIndex != true)]`
- Sorts by `publishedAt desc`.
- Returns full project payload including the new `category` and `year` fields.

---

### 2.3 TypeScript Types
**File:** `src/types/sanity.types.ts`

Extended the `Project` interface:

```ts
export interface Project {
  // ... existing fields ...
  category?: { en: string; pl: string };
  year?: string;
  featured?: boolean;
}
```

---

### 2.4 Homepage Server Component
**File:** `src/app/page.tsx`

Changed from a synchronous component to an `async` server component:

- Calls `await getFeaturedProjects()`.
- Wraps the call in `try/catch`. If Sanity fails, an empty array is passed.
- Passes the result to `<HomePageClient projects={featuredProjects} />`.

This means:
- **No client-side loading spinners** for the project list.
- Data is fetched at request time (with Next.js caching via `sanity.server.ts` revalidate = 1h).

---

### 2.5 Homepage Client Component
**File:** `src/components/next/HomePageClient.tsx`

- Added `projects?: Project[]` prop.
- Forwards it to `<ProjectsNew sanityProjects={projects} />`.

---

### 2.6 Projects Section Component
**File:** `src/components/new/ProjectsNew.tsx`

Major refactor:

1. **New imports:**
   - `urlFor` from `@/lib/sanity.image` — to build image URLs from Sanity assets.
   - `Project` type from `@/types/sanity.types`.

2. **New props:**
   ```ts
   interface ProjectsNewProps {
     sanityProjects?: Project[];
   }
   ```

3. **Mapping helper:** `mapSanityToLocal(...)`
   - Converts Sanity project shape into the local `Project` shape used by the UI.
   - Selects localized fields based on current language (`en` | `pl`).
   - Generates the image URL via `urlFor(p.mainImage).url()`.
   - Falls back to `publishedAt` year if `year` is missing.

4. **Fallback logic:**
   ```ts
   const projects = sanityProjects?.length
     ? mapSanityToLocal(sanityProjects, language)
     : getProjects(t); // hardcoded fallback
   ```

**Expected runtime behavior:**
- If Sanity is healthy and at least one project is marked `featured`, the homepage shows **live Sanity data**.
- If Sanity is down, returns an error, or no project is featured, the homepage silently falls back to the **original hardcoded list** (`getProjects(t)`).
- The visual appearance (hover image, layout, animations) is unchanged.

---

## 3. How to Use (Content Admin)

1. Open Sanity Studio.
2. Go to any existing **Project** document (or create a new one).
3. Fill in the new fields:
   - **Category** (English + Polish)
   - **Year**
   - Check **Featured on Homepage**
4. Publish.
5. The homepage will reflect the change within the revalidation window (1 hour) or immediately after a Next.js revalidation trigger.

---

## 4. Fallback Behavior Summary

| Scenario                              | Result                               |
|---------------------------------------|--------------------------------------|
| Sanity OK + featured projects exist   | Shows live Sanity projects           |
| Sanity OK + no featured projects      | Shows hardcoded fallback projects    |
| Sanity error / timeout                | Shows hardcoded fallback projects    |

---

## 5. Notes / Follow-ups

- Existing project pages (`/project/[slug]`) are unaffected; they still use the full `project` schema.
- The `handleSanityQuery` Netlify function and any Vite-era client-side fetch code remain untouched; this migration uses the Next.js App Router server component path.
