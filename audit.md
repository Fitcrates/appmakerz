# Etap 1: Audyt Renderu i Hydracji — Raport z Wynikami

Pełny audyt kodu źródłowego pod kątem duplikacji treści w DOM, problemów z hydracją, oraz wzorców powodujących podwójne widzenie tekstu przez scraperów SEO.

## Podsumowanie: Znalezione Problemy

| Priorytet | Problem | Wpływ SEO | Fizycznie 2x w DOM? |
|-----------|---------|-----------|---------------------|
| 🔴 KRYTYCZNY | Podwójne zagnieżdżenie `NextProviders` | Pośredni | Tak (podwójne providery) |
| 🔴 KRYTYCZNY | `SpotlightText` renderuje tekst 2× | Tak | **Tak** |
| 🔴 KRYTYCZNY | `BurnSpotlightText` renderuje tekst 2-3× | Tak | **Tak** |
| 🟠 WYSOKI | `SolutionsNew` — desktop + mobile w DOM jednocześnie | Tak | **Tak** |
| 🟠 WYSOKI | `SolutionsNew` sr-only blok SEO — hardcoded EN | Tak | **Tak** |
| 🟡 ŚREDNI | `BlogIndexClient` / `about-me` — podwójne logo | Mały | Tak |
| 🟡 ŚREDNI | `ProjectsNew` — desktop/mobile arrow elementy | Minimalny | Tak |
| 🟢 NISKI | `TechStackNew` marquee — 4× duplikacja badge'ów | Minimalny | Tak (intencjonalnie) |
| ⚪ INFO | React Strict Mode ON — podwójne rendery w DEV | Brak w prod | Nie w prod |

---

## 🔴 Problem 1: Podwójne zagnieżdżenie NextProviders (KRYTYCZNY)

> [!CAUTION]
> `NextProviders` jest renderowany **DWUKROTNIE** — raz w root layout, raz w `[lang]/layout.tsx`. To powoduje podwójny `LanguageProvider`, `RouteTransitionProvider`, `GlobalRoutePrefetch` i `AnalyticsPageTracker`.

### Lokalizacja

#### [layout.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/app/layout.tsx#L135-L140) — Root Layout
```tsx
// Linia 135-140
<NextProviders>          {/* ← PIERWSZA instancja (bez initialLanguage!) */}
  {children}
  <CookieConsentNew />
  <ScrollBlurOverlay />
  <CursorAura />
</NextProviders>
```

#### [[lang]/layout.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/app/%5Blang%5D/layout.tsx#L21) — Lang Layout
```tsx
// Linia 21
return <NextProviders initialLanguage={lang as Language}>{children}</NextProviders>;
// ↑ DRUGA instancja (z initialLanguage)
```

### Co to powoduje
- Podwójny `LanguageProvider` — zewnętrzny (root) startuje z `DEFAULT_LANGUAGE`, wewnętrzny (`[lang]`) z URL-em. Komponenty czytają z **wewnętrznego** — więc język działa, ale:
  - Podwójny `GlobalRoutePrefetch` — prefetchuje routes 2×
  - Podwójny `AnalyticsPageTracker` — śledzi page views 2×
  - Podwójny `RouteTransitionProvider` — potencjalnie podwójne animacje

### Rekomendacja naprawy
Usunąć `NextProviders` z root `layout.tsx`. Przenieść `CookieConsentNew`, `ScrollBlurOverlay`, `CursorAura` do `[lang]/layout.tsx` lub renderować je bez wrappera providerów w root layout:

```diff
// src/app/layout.tsx
-<NextProviders>
   {children}
   <CookieConsentNew />
   <ScrollBlurOverlay />
   <CursorAura />
-</NextProviders>
+{children}
+<CookieConsentNew />
+<ScrollBlurOverlay />
+<CursorAura />
```

> [!WARNING]
> Trzeba sprawdzić, czy `CookieConsentNew`, `ScrollBlurOverlay`, `CursorAura` korzystają z `useLanguage()` — jeśli tak, muszą być w `[lang]/layout.tsx` wewnątrz `NextProviders`.

---

## 🔴 Problem 2: SpotlightText renderuje tekst DWUKROTNIE (KRYTYCZNY)

> [!CAUTION]
> Każdy tekst opakowany w `SpotlightText` istnieje **fizycznie 2 razy** w DOM. Scraperzy SEO (Screaming Frog, Sitebulb, Lighthouse) widzą oba egzemplarze.

### Lokalizacja: [SpotlightText.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/SpotlightText.tsx)

```tsx
// Linia 78 — KOPIA 1: tekst bazowy
<Component className={`text-white/90 ${className} ${baseClassName}`}>
  {content}                    {/* ← tekst w DOM */}
</Component>

// Linia 83-101 — KOPIA 2: warstwa glow (spotlight)
<span className="absolute -inset-6 p-6 pointer-events-none select-none z-20 block"
      aria-hidden="true">           {/* ← aria-hidden ale SCRAPER IGNORUJE */}
  <Component className={...} style={{ color: glowColor }}>
    {content}                  {/* ← TEN SAM tekst PONOWNIE w DOM */}
  </Component>
</span>
```

### Komponent jest używany masowo

Plik | Ile instancji | Przykład tekstu
-----|---------------|----------------
[HeroNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/HeroNew.tsx#L97-L103) | 1 | `t.subtitle`
[AboutNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/AboutNew.tsx#L111-L116) | 4 | opisy, statystyki
[ServicesNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/ServicesNew.tsx#L84-L98) | 8+ | tytuły i opisy usług
[SolutionsNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/SolutionsNew.tsx#L253-L259) | 5+ | opisy rozwiązań
[ContactNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/ContactNew.tsx) | wielokrotnie | nagłówki kontaktu
Strony `/uslugi/[slug]` | wielokrotnie | intro, CTA

### Wpływ SEO
Scraper widzi np.:
```
"I build online shops, landing pages, and AI-powered apps..."
"I build online shops, landing pages, and AI-powered apps..."
```
To jest klasyczny **duplicate content within page** — Google może zinterpretować to jako keyword stuffing lub thin content.

### Rekomendacja naprawy
Warstwa glow powinna **nie zawierać tekstu** w DOM, a zamiast tego używać efektu CSS na jednym elemencie:

**Opcja A — CSS `text-shadow` zamiast duplikacji:**
```tsx
// Zamiast drugiej kopii tekstu, zastosować CSS glow na oryginalnym elemencie
<Component className={className} style={{
  textShadow: `0 0 ${glowSize}px ${glowColor}`,
  // mask gradient applied via CSS custom property
}}>
  {content}
</Component>
```

**Opcja B — Zachować duplikat ale użyć `content: attr(data-text)` w CSS zamiast tekstu w DOM**

---

## 🔴 Problem 3: BurnSpotlightText renderuje tekst 2-3× (KRYTYCZNY)

> [!CAUTION]
> `BurnSpotlightText` duplikuje tekst jeszcze agresywniej — pre-mount 1×, post-mount base 1×, glow layer 1×, a podczas animacji każda litera ma 3 dodatkowe span'y blur.

### Lokalizacja: [BurnSpotlightText.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/BurnSpotlightText.tsx)

**Stan pre-mount (SSR)** — linia 170-179:
```tsx
// ← To jest to co scraper widzi! SSR renderuje to:
<Component className={className}>{textContent}</Component>
```

**Stan post-mount (client)** — linia 207-218:
```tsx
// KOPIA 1: Każda litera jako BurnChar
<Component className={className}>
  {textContent.split("").map((char) => <BurnChar ... />)}
</Component>
```

**Stan post-burn (po animacji)** — linia 222-234:
```tsx
// KOPIA 2: Warstwa glow z renderChars()
<span aria-hidden="true">
  <Component className={className}>
    {renderChars()}   {/* ← TRZECIA kopia tekstu */}
  </Component>
</span>
```

**Podczas burning** — każdy `BurnChar` (linia 86-103) dodaje 3 dodatkowe span'y z tym samym znakiem (blur, glow, spark) ale te mają krótki czas życia.

### Komponent używany w
Plik | Przykład
-----|--------
[HeroNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/HeroNew.tsx#L79-L88) | główny heading "ELECTRIFY YOUR BUSINESS ONLINE"
[AboutNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/AboutNew.tsx#L94-L102) | "Solutions that grow your business"
[ServicesNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/ServicesNew.tsx#L161-L169) | "What I Do" / "Co robię"
[SolutionsNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/SolutionsNew.tsx#L206-L214) | "How Can I Help?"
Strony `/uslugi/[slug]` | tytuł usługi (h1), nagłówki sekcji

### Rekomendacja naprawy
Taka sama jak dla SpotlightText — warstwa glow nie powinna zawierać tekstu w DOM.

---

## 🟠 Problem 4: SolutionsNew — podwójny layout desktop/mobile (WYSOKI)

> [!IMPORTANT]
> Komponent renderuje **KOMPLETNY zestaw treści 2 razy** — raz dla desktop, raz dla mobile. Oba są w DOM jednocześnie, ukryte przez CSS `hidden md:block` / `md:hidden`.

### Lokalizacja: [SolutionsNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/SolutionsNew.tsx#L222-L328)

```tsx
// Linia 222 — DESKTOP (5 solutions × title + problem + description)
<div className="solutions-scene__desktop hidden md:block">
  {solutions.map((solution) => (
    <article>
      <h3>{solution.title}</h3>         {/* ← KOPIA 1 */}
      <p>{solution.problem}</p>
      <p>{solution.description}</p>
    </article>
  ))}
</div>

// Linia 267-328 — MOBILE (te same 5 solutions)
<div className="solutions-scene__mobile md:hidden block">
  {solutions.map((solution) => (
    <article>
      <h3>{solution.title}</h3>         {/* ← KOPIA 2 */}
      <p>{solution.problem}</p>
      <p>{solution.description}</p>
    </article>
  ))}
</div>
```

### Wpływ
Scraper widzi **10 artykułów** zamiast 5. Każdy tytuł, problem i opis pojawia się 2×.

### Rekomendacja naprawy
**Opcja A (rekomendowana):** Renderowanie warunkowe na podstawie media query w JS (np. `useMediaQuery` hook) — renderować tylko jeden layout.

**Opcja B:** Użyć jednego layoutu responsywnego CSS grid/flex zamiast dwóch osobnych struktur DOM.

---

## 🟠 Problem 5: SolutionsNew sr-only SEO block — hardcoded EN (WYSOKI)

### Lokalizacja: [SolutionsNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/SolutionsNew.tsx#L357-L372)

```tsx
<div className="sr-only">
  <h2>Web Development Services - Hire a Developer</h2>   {/* ← ZAWSZE PO ANGIELSKU */}
  <p>Professional fullstack developer offering landing page development...</p>
  <ul>
    <li>Landing page developer - high-converting websites...</li>
    {/* ... */}
  </ul>
</div>
```

### Problemy
1. **Zawsze w języku angielskim** — nawet na stronie `/pl/`. Google może traktować to jako mixed-language content
2. **Duplikuje** treść z solutions items powyżej
3. **sr-only nie ukrywa przed scraperami** — scraperzy widzą ten tekst

### Rekomendacja naprawy
Usunąć ten blok — treść jest już w solutions items z proper `itemScope`/`itemType` schema.org markup. Lub przetłumaczyć go na odpowiedni język.

---

## 🟡 Problem 6: Podwójne logo ElectricLogo/ElectricLogoMobile

### Lokalizacja
- [BlogIndexClient.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/next/BlogIndexClient.tsx#L81-L94) — linie 81-94
- [about-me/page.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/app/%5Blang%5D/about-me/page.tsx#L126-L139) — linie 126-139

Oba renderują dwa różne komponenty logo, oba w DOM, ukryte CSS-em. Wpływ SEO minimalny (alt text logo 2×).

---

## 🟡 Problem 7: HeroNew — `sr-only` h1 + `aria-hidden` heading

### Lokalizacja: [HeroNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/HeroNew.tsx#L62-L89)

```tsx
// Linia 62 — SEO heading (sr-only, widoczny dla scraperów)
<h1 className="sr-only">{t.seoHeading}</h1>

// Linia 75-89 — wizualny heading (aria-hidden="true")
<div aria-hidden="true">
  <BurnSpotlightText as="div" ...>
    {t.heading}                {/* "ELECTRIFY YOUR BUSINESS ONLINE" */}
  </BurnSpotlightText>         {/* ← BurnSpotlightText sam duplikuje 2-3× */}
</div>
```

### Analiza
- `seoHeading` = "Fullstack Web Developer — React & Next.js Applications..."
- `heading` = "ELECTRIFY\nYOUR BUSINESS\nONLINE"
- To są **różne teksty** — więc to nie jest stricte duplikacja, to jest rozsądny wzorzec accessibility
- ALE `BurnSpotlightText` wewnątrz `aria-hidden` i tak duplikuje `heading` tekst w DOM (patrz Problem 3)

---

## 🟢 Problem 8: TechStackNew — 4× badge'ów (marquee)

### Lokalizacja: [TechStackNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/TechStackNew.tsx#L99-L199)

```tsx
const LOGICAL_SET = [...technologies, ...technologies]; // 2×
// ... dwa razy renderowane w DOM (linie 190-198) = 4× w sumie
```

To jest **intencjonalne** dla efektu marquee, ale scraperzy widzą każdą technologię 4×. Wpływ SEO minimalny (to nazwy technologii, nie content keywords).

---

## ⚪ React Strict Mode

[next.config.ts](file:///f:/StronyInternetowe/AppCrates/DevFiles/next.config.ts#L4): `reactStrictMode: true`

W **dev mode** powoduje podwójne wywołanie `useEffect`, co może wyglądać jak podwójny render w konsoli. W **production build** NIE ma wpływu. To NIE jest źródło problemu.

---

## ⚪ Hydration — brak istotnych problemów

- `LanguageContext` inicjalizuje się z `initialLanguage` z serwera (przekazane przez `[lang]/layout.tsx`)
- Nie ma flash PL→EN ani EN→PL
- `useEffect` w [LanguageContext.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/context/LanguageContext.tsx#L59-L64) porównuje `preferredLanguage` z `language` — jeśli URL mówi `/pl` a ktoś ma `localStorage: en`, nie zmieni na EN (bo `initialLanguage` ma priorytet)
- Brak ryzyka podwójnego renderowania treści w dwóch językach

---

## Proposed Changes — Plan Naprawy

### Priorytet 1: SpotlightText + BurnSpotlightText (eliminacja duplikacji tekstu)

#### [MODIFY] [SpotlightText.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/SpotlightText.tsx)
- Zastąpić drugą kopię tekstu (glow layer) efektem CSS `text-shadow` + mask
- Alternatywnie: użyć `::before` pseudo-element z `content: attr(data-text)` — scraperzy nie widzą pseudo-elementów

#### [MODIFY] [BurnSpotlightText.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/BurnSpotlightText.tsx)
- Usunąć `renderChars()` glow layer (linie 222-234)
- Zastąpić efektem CSS na istniejących elementach
- Burning state blur spans (linie 86-103) mają krótki czas życia, ale warto sprawdzić czy scraper je łapie

---

### Priorytet 2: Podwójne NextProviders

#### [MODIFY] [layout.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/app/layout.tsx)
- Usunąć `<NextProviders>` wrapper z root layout
- Zachować `CookieConsentNew`, `ScrollBlurOverlay`, `CursorAura` bezpośrednio w `<body>`

---

### Priorytet 3: SolutionsNew duplicate layouts

#### [MODIFY] [SolutionsNew.tsx](file:///f:/StronyInternetowe/AppCrates/DevFiles/src/components/new/SolutionsNew.tsx)
- Usunąć sr-only SEO block (linie 357-372) — redundantny z istniejącymi schema.org items
- Rozważyć useMediaQuery do warunkowego renderowania desktop/mobile zamiast CSS hide

---

### Priorytet 4: Drobne duplikacje
- Logo desktop/mobile — rozważyć responsive CSS na jednym komponencie
- ProjectsNew arrows — wpływ minimalny, nie wymaga pilnej naprawy

---

## Verification Plan

### Automated Tests
1. `npm run build` — sprawdzenie czy build przechodzi bez hydration warnings
2. `npm run start` — produkcyjny serwer
3. `curl http://localhost:3000/pl | grep -c "ELEKTRYZUJ"` — sprawdzenie ile razy heading pojawia się w SSR HTML
4. `curl http://localhost:3000/pl | grep -c "subtitle_text"` — analogicznie dla SpotlightText

### Manual Verification
1. DevTools → Elements → Ctrl+F → wyszukaj konkretne frazy → policz wystąpienia
2. `view-source:` porównanie z DOM po hydracji
3. Lighthouse audit → SEO score
4. Sprawdzenie konsoli przeglądarki na hydration warnings (produkcja)

## Open Questions

> [!IMPORTANT]
> **Pytanie 1:** Czy `CookieConsentNew`, `ScrollBlurOverlay` i `CursorAura` korzystają z `useLanguage()` hooka? Jeśli tak, muszą być w `[lang]/layout.tsx` wewnątrz providera, a nie w root layout. Proszę o potwierdzenie przed naprawą Problemu 1.

> [!IMPORTANT]
> **Pytanie 2:** Które problemy chcesz naprawić w pierwszej kolejności? Rekomendacja: SpotlightText + BurnSpotlightText (największy wpływ SEO, dają się naprawić bez ryzyka breaking changes) → NextProviders → SolutionsNew.

> [!IMPORTANT]
> **Pytanie 3:** Dla SpotlightText/BurnSpotlightText — wolisz podejście CSS `text-shadow` (prostsze, mniej kontroli nad efektem) czy `::before` pseudo-element z `attr()` (więcej kontroli, ale bardziej złożony CSS)?
