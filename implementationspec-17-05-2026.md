# Kalkulator Wyceny — Pełna Specyfikacja Implementacji

## Kontekst

Interaktywny kalkulator wyceny na landing page solo agencji web dev. Klient przechodzi przez wizard, wybiera usługę i opcje, dostaje orientacyjną wycenę w widełkach, a następnie wysyła zapytanie mailem. Mail trafia do dewelopera z pełnym podsumowaniem wyborów klienta — bez konieczności powtarzania ich na rozmowie.

---

## Stack

- **Framework:** Next.js 14+ (App Router)
- **Język:** TypeScript
- **Stylowanie:** Tailwind CSS
- **Animacje:** Framer Motion
- **Wysyłka maila:** Resend (`@resend/node`) — już skonfigurowany w projekcie
- **Konfiguracja cen:** `pricing-config.json` — jedyne miejsce do edycji cen i usług

---

## Cennik (realia początkującego solo deva, małe firmy PL, 2025)

### 🌐 Strona internetowa / Landing page

| Element | Min (zł) | Max (zł) |
|---|---|---|
| **Baza — szablon + customizacja** | 1 500 | 3 000 |
| **Baza — design od zera** | 3 000 | 6 000 |
| **Baza — mam gotowy design (Figma)** | 1 200 | 2 500 |
| Sanity CMS — form-based | 1 000 | 2 000 |
| Sanity CMS — visual editing | 2 000 | 4 000 |
| Blog | 800 | 1 500 |
| Wielojęzyczność (i18n) | 1 200 | 2 500 |
| Animacje / micro-interactions | 800 | 2 000 |
| Formularz kontaktowy + Resend | 300 | 500 |
| Newsletter (Resend) | 400 | 800 |

### 🛒 Sklep internetowy (Medusa.js)

| Element | Min (zł) | Max (zł) |
|---|---|---|
| **Baza — Medusa + Next.js storefront** | 7 000 | 14 000 |
| Stripe (payment intents, webhooki, checkout, return pages) | 2 000 | 4 000 |
| Przelewy24 / BLIK | 1 500 | 3 000 |
| Integracja wysyłki (Apaczka / Furgonetka) | 2 000 | 4 000 |
| Sanity CMS do treści sklepu | 2 000 | 3 500 |
| System rabatów i kuponów | 800 | 1 500 |
| Opinie i recenzje produktów | 1 000 | 2 000 |
| Wielojęzyczność + multi-currency | 2 000 | 4 000 |

### 🏪 Marketplace Multivendor (Medusa.js)

| Element | Min (zł) | Max (zł) |
|---|---|---|
| **Baza — multivendor setup, panel vendora, onboarding** | 20 000 | 40 000 |
| Stripe Connect Express (OAuth, webhooki, split payments) | 6 000 | 12 000 |
| System prowizji | 2 000 | 4 000 |
| Zaawansowany dashboard vendora | 4 000 | 8 000 |
| Wielojęzyczność | 2 500 | 5 000 |

### 🤖 Wdrożenie AI (małe firmy)

| Element | Min (zł) | Max (zł) |
|---|---|---|
| Chatbot (wrapper API, bez bazy wiedzy) | 2 000 | 4 000 |
| Chatbot + RAG (dokumenty firmy) | 4 000 | 8 000 |
| Integracja AI w CMS (generowanie treści) | 3 000 | 6 000 |
| Custom AI workflow / automatyzacja | 5 000 | 12 000 |

### ⚙️ Aplikacja webowa / SaaS

Brak stałej wyceny. Kalkulator zbiera odpowiedzi i wysyła do dewelopera jako lead — wycena indywidualnie po konsultacji.

### Mnożniki deadline

| Opcja | Mnożnik |
|---|---|
| Standardowy (6–8 tyg.) | ×1.0 |
| Przyspieszony (3–4 tyg.) | ×1.3 |
| Pilny (do 2 tyg.) | ×1.6 |

---

## Architektura plików

```
/src
  /app
    /kalkulator
      page.tsx                  ← strona kalkulatora
    /api
      /send-quote
        route.ts                ← endpoint Resend
  /components
    /calculator
      PricingCalculator.tsx     ← główny wizard (orkiestrator)
      StepServiceType.tsx       ← krok 0: wybór usługi
      StepBase.tsx              ← krok 1: baza (szablon / design od zera / itp.)
      StepCms.tsx               ← krok 2: CMS (tylko dla website/ecommerce)
      StepFeatures.tsx          ← krok 3: ficzery (multiselekcja)
      StepDeadline.tsx          ← krok 4: deadline
      StepContact.tsx           ← krok 5: formularz kontaktowy
      ResultDisplay.tsx         ← widok wyniku z widełkami
      ProgressBar.tsx           ← pasek postępu
  /lib
    /calculator
      useCalculator.ts          ← hook: stan, logika sumowania, mnożniki
      calculatePrice.ts         ← czysta funkcja: input → { min, max }
      types.ts                  ← typy TS dla konfiguracji i stanu
  /data
    pricing-config.json         ← JEDYNE miejsce edycji cen i usług
/emails
  QuoteEmail.tsx                ← szablon maila (React Email)
```

---

## `pricing-config.json` — pełna struktura

```json
{
  "services": {
    "website": {
      "label": "Strona internetowa / Landing page",
      "icon": "🌐",
      "steps": ["base", "cms", "features", "deadline"],
      "base": {
        "template":    { "label": "Szablon + customizacja",  "min": 1500, "max": 3000 },
        "custom":      { "label": "Design od zera",          "min": 3000, "max": 6000 },
        "have_design": { "label": "Mam gotowy design (Figma)","min": 1200, "max": 2500 }
      },
      "cms": {
        "none":          { "label": "Bez CMS",               "min": 0,    "max": 0 },
        "sanity_form":   { "label": "Sanity — form-based",   "min": 1000, "max": 2000 },
        "sanity_visual": { "label": "Sanity — visual editing","min": 2000, "max": 4000 }
      },
      "features": {
        "blog":         { "label": "Blog",                   "min": 800,  "max": 1500 },
        "i18n":         { "label": "Wielojęzyczność",        "min": 1200, "max": 2500 },
        "animations":   { "label": "Animacje",               "min": 800,  "max": 2000 },
        "contact_form": { "label": "Formularz kontaktowy",   "min": 300,  "max": 500  },
        "newsletter":   { "label": "Newsletter (Resend)",    "min": 400,  "max": 800  }
      }
    },
    "ecommerce": {
      "label": "Sklep internetowy",
      "icon": "🛒",
      "steps": ["base", "cms", "features", "deadline"],
      "base": {
        "medusa_basic": { "label": "Medusa.js + Next.js storefront", "min": 7000, "max": 14000 }
      },
      "cms": {
        "none":        { "label": "Bez CMS do treści",       "min": 0,    "max": 0    },
        "sanity_form": { "label": "Sanity — form-based",     "min": 2000, "max": 3500 }
      },
      "features": {
        "stripe":      { "label": "Stripe (płatności)",      "min": 2000, "max": 4000 },
        "p24":         { "label": "Przelewy24 / BLIK",       "min": 1500, "max": 3000 },
        "shipping":    { "label": "Integracja wysyłki",      "min": 2000, "max": 4000 },
        "discounts":   { "label": "Rabaty i kupony",         "min": 800,  "max": 1500 },
        "reviews":     { "label": "Opinie produktów",        "min": 1000, "max": 2000 },
        "i18n":        { "label": "Wielojęzyczność",         "min": 2000, "max": 4000 }
      }
    },
    "marketplace": {
      "label": "Marketplace Multivendor",
      "icon": "🏪",
      "steps": ["features", "deadline"],
      "base": {
        "medusa_marketplace": { "label": "Medusa.js multivendor — baza", "min": 20000, "max": 40000 }
      },
      "features": {
        "stripe_connect": { "label": "Stripe Connect Express", "min": 6000, "max": 12000 },
        "commissions":    { "label": "System prowizji",        "min": 2000, "max": 4000  },
        "vendor_dash":    { "label": "Dashboard vendora",      "min": 4000, "max": 8000  },
        "i18n":           { "label": "Wielojęzyczność",        "min": 2500, "max": 5000  }
      }
    },
    "ai": {
      "label": "Wdrożenie AI",
      "icon": "🤖",
      "steps": ["features", "deadline"],
      "base": {},
      "features": {
        "chatbot_basic": { "label": "Chatbot (wrapper API)",       "min": 2000, "max": 4000  },
        "chatbot_rag":   { "label": "Chatbot + RAG",               "min": 4000, "max": 8000  },
        "ai_cms":        { "label": "AI w CMS",                    "min": 3000, "max": 6000  },
        "ai_workflow":   { "label": "Custom AI workflow",          "min": 5000, "max": 12000 }
      }
    },
    "saas": {
      "label": "Aplikacja webowa / SaaS",
      "icon": "⚙️",
      "steps": ["saas_questions"],
      "noPrice": true,
      "ctaLabel": "Umów bezpłatną konsultację",
      "base": {},
      "features": {
        "auth":       { "label": "Autentykacja użytkowników", "min": 0, "max": 0 },
        "admin":      { "label": "Panel admina",              "min": 0, "max": 0 },
        "payments":   { "label": "Płatności / subskrypcje",   "min": 0, "max": 0 },
        "api":        { "label": "Integracje zewnętrzne",     "min": 0, "max": 0 },
        "have_design":{ "label": "Mam projekt / wireframe",   "min": 0, "max": 0 }
      }
    }
  },
  "multipliers": {
    "deadline": {
      "standard": { "label": "Standardowy (6–8 tyg.)", "value": 1.0 },
      "fast":     { "label": "Przyspieszony (3–4 tyg.)", "value": 1.3 },
      "urgent":   { "label": "Pilny (do 2 tyg.)", "value": 1.6 }
    }
  },
  "disclaimer": "To orientacyjna wycena na podstawie typowych projektów. Ostateczna cena zależy od szczegółów i zostanie ustalona po bezpłatnej konsultacji."
}
```

---

## Logika kalkulatora (`calculatePrice.ts`)

```ts
import config from '@/data/pricing-config.json'

export type Selection = {
  service: string
  base?: string
  cms?: string
  features: string[]
  deadline: string
}

export type PriceResult = {
  min: number
  max: number
}

export function calculatePrice(selection: Selection): PriceResult {
  const service = config.services[selection.service as keyof typeof config.services]
  if (!service || service.noPrice) return { min: 0, max: 0 }

  let min = 0
  let max = 0

  // Baza
  if (selection.base && service.base[selection.base as keyof typeof service.base]) {
    const b = service.base[selection.base as keyof typeof service.base]
    min += b.min
    max += b.max
  }

  // CMS
  if (selection.cms && 'cms' in service) {
    const cms = (service as any).cms[selection.cms]
    if (cms) { min += cms.min; max += cms.max }
  }

  // Ficzery
  for (const feat of selection.features) {
    const f = (service as any).features?.[feat]
    if (f) { min += f.min; max += f.max }
  }

  // Mnożnik deadline
  const multiplier = config.multipliers.deadline[selection.deadline as keyof typeof config.multipliers.deadline]?.value ?? 1.0
  min = Math.round(min * multiplier / 100) * 100
  max = Math.round(max * multiplier / 100) * 100

  return { min, max }
}
```

---

## API endpoint (`/api/send-quote/route.ts`)

```ts
import { Resend } from '@resend/node'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, message, selection, priceMin, priceMax } = body

  const selectionText = formatSelection(selection)

  await resend.emails.send({
    from: 'kalkulator@twojadomena.pl',
    to: 'ty@twojadomena.pl',
    subject: `Nowe zapytanie — ${selection.serviceLabel}`,
    html: `
      <h2>Nowe zapytanie z kalkulatora</h2>
      <p><strong>Imię:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone || '—'}</p>
      <hr />
      <h3>Wybrane opcje:</h3>
      ${selectionText}
      <p><strong>Orientacyjna wycena:</strong> ${priceMin.toLocaleString('pl-PL')} – ${priceMax.toLocaleString('pl-PL')} zł</p>
      <hr />
      <p><strong>Wiadomość:</strong> ${message || '—'}</p>
    `
  })

  // Potwierdzenie dla klienta
  await resend.emails.send({
    from: 'kontakt@twojadomena.pl',
    to: email,
    subject: 'Otrzymałem Twoje zapytanie!',
    html: `
      <p>Cześć ${name},</p>
      <p>Dostałem Twoje zapytanie i odezwę się w ciągu 24 godzin roboczych.</p>
      <p>Dla przypomnienia, oto co wybrałeś/aś:</p>
      ${selectionText}
      <p>Orientacyjna wycena: <strong>${priceMin.toLocaleString('pl-PL')} – ${priceMax.toLocaleString('pl-PL')} zł</strong></p>
      <br />
      <p>Do zobaczenia!</p>
    `
  })

  return NextResponse.json({ ok: true })
}

function formatSelection(selection: any): string {
  const lines = [
    `<p><strong>Usługa:</strong> ${selection.serviceLabel}</p>`,
    selection.baseLabel   ? `<p><strong>Baza:</strong> ${selection.baseLabel}</p>` : '',
    selection.cmsLabel    ? `<p><strong>CMS:</strong> ${selection.cmsLabel}</p>` : '',
    selection.featuresLabels?.length
      ? `<p><strong>Funkcje:</strong> ${selection.featuresLabels.join(', ')}</p>` : '',
    `<p><strong>Deadline:</strong> ${selection.deadlineLabel}</p>`,
  ]
  return lines.filter(Boolean).join('\n')
}
```

---

## Integracja z chatbotem

Chatbot przeprowadza wywiad i przekazuje zebrane dane do kalkulatora przez `sessionStorage` lub URL params. Kalkulator odczytuje dane przy montowaniu i pre-filluje kroki — klient widzi od razu wynik.

```ts
// Chatbot po zakończeniu wywiadu:
const quoteData = {
  service: 'website',
  base: 'custom',
  cms: 'sanity_visual',
  features: ['blog', 'i18n'],
  deadline: 'standard'
}
sessionStorage.setItem('calculatorPrefill', JSON.stringify(quoteData))
router.push('/kalkulator')

// Kalkulator przy montowaniu:
useEffect(() => {
  const prefill = sessionStorage.getItem('calculatorPrefill')
  if (prefill) {
    const data = JSON.parse(prefill)
    setSelection(data)
    setStep('result') // pokaż wynik od razu
    sessionStorage.removeItem('calculatorPrefill')
  }
}, [])
```

Ważne: logika cenowa żyje wyłącznie w kalkulatorze / `calculatePrice.ts`. Chatbot przekazuje tylko klucze wyborów — nie liczy ceny samodzielnie. Dzięki temu zmiana ceny w JSONie automatycznie działa i w kalkulatorze, i po przejściu z chatbota.

---

## UX kalkulatora

- **Pasek postępu** z numerem kroku i etykietą
- **Animowane przejścia** między krokami (Framer Motion slide)
- **Przycisk Wstecz** na każdym kroku
- **Wynik w widełkach**, np. `4 800 – 9 500 zł`
- **Disclaimer** pod wynikiem (z JSONa)
- **Formularz kontaktowy** pojawia się pod wynikiem, nie na osobnej stronie
- **Kalkulator SaaS/wycena indywidualna** — zamiast widełek wyświetla CTA "Umów konsultację" + formularz zbiera odpowiedzi
- Na mobile: kroki jako full-screen cards

---

## Checklist implementacji

- [ ] Skopiować `pricing-config.json` do `/src/data/`
- [ ] Zaimplementować typy TS (`types.ts`)
- [ ] Napisać `calculatePrice.ts` i przetestować jednostkowo
- [ ] Zbudować `useCalculator.ts` (hook zarządzający stanem kroków)
- [ ] Zbudować komponenty kroków (StepServiceType → ... → StepContact)
- [ ] Zbudować `ResultDisplay.tsx`
- [ ] Zbudować `PricingCalculator.tsx` jako orkiestrator
- [ ] Stworzyć `/kalkulator/page.tsx`
- [ ] Napisać szablon maila (`QuoteEmail.tsx` w React Email)
- [ ] Napisać endpoint `/api/send-quote/route.ts`
- [ ] Dodać zmienne środowiskowe (`RESEND_API_KEY`, `QUOTE_TO_EMAIL`)
- [ ] Dodać obsługę prefill z chatbota (`sessionStorage`)
- [ ] Przetestować na mobile
- [ ] Dodać link do kalkulatora w nawigacji i sekcji usług

---

## Prompt dla AI (do budowy kalkulatora)

> Patrz sekcja poniżej.

---

# Prompt dla AI — Budowa kalkulatora wyceny

Skopiuj poniższy prompt do Cursor / Claude / Windsurf i podaj mu ten plik jako kontekst.

---

```
Zbuduj interaktywny kalkulator wyceny w Next.js 14 (App Router, TypeScript, Tailwind CSS, Framer Motion).

## Kontekst
Kalkulator na landing page solo agencji web dev. Klient przechodzi przez wizard krok po kroku, wybiera usługę i opcje, dostaje orientacyjną wycenę w widełkach, a następnie wypełnia formularz kontaktowy. Dane (wybory + wycena) są wysyłane mailem do dewelopera przez istniejący endpoint Resend.

## Pliki wejściowe
- `pricing-config.json` — pełna konfiguracja cen i usług (dostarczona)
- Istniejący projekt Next.js z Tailwind i Resend

## Wymagania techniczne

### Struktura plików
Stwórz następujące pliki:
- `/src/data/pricing-config.json` — skopiuj z konfiguracji
- `/src/lib/calculator/types.ts` — typy TS
- `/src/lib/calculator/calculatePrice.ts` — czysta funkcja licząca cenę
- `/src/lib/calculator/useCalculator.ts` — hook stanu
- `/src/components/calculator/PricingCalculator.tsx` — główny wizard
- `/src/components/calculator/StepServiceType.tsx`
- `/src/components/calculator/StepBase.tsx`
- `/src/components/calculator/StepCms.tsx`
- `/src/components/calculator/StepFeatures.tsx`
- `/src/components/calculator/StepDeadline.tsx`
- `/src/components/calculator/StepContact.tsx`
- `/src/components/calculator/ResultDisplay.tsx`
- `/src/components/calculator/ProgressBar.tsx`
- `/src/app/kalkulator/page.tsx`
- `/src/app/api/send-quote/route.ts`

### Logika cen
- Ceny czytaj wyłącznie z `pricing-config.json`
- Wzór: `(baza + cms + suma_ficzerów) × mnożnik_deadline`
- Zaokrąglaj do 100 zł
- Wyświetlaj jako widełki: min – max zł
- Usługa "saas" ma flagę `noPrice: true` — wyświetl wtedy CTA zamiast ceny

### Wizard — kroki
0. Wybór usługi (kafelki z ikoną i nazwą)
1. Wybór bazy (radio, opcje z JSONa dla wybranej usługi)
2. Wybór CMS (radio, jeśli usługa ma klucz "cms" w JSONie)
3. Wybór ficzerów (checkbox, multiselekcja)
4. Deadline (radio + info o mnożniku)
5. Wynik + formularz kontaktowy (imię, email, telefon opcjonalny, wiadomość opcjonalna)

Każdy krok renderuj dynamicznie na podstawie tablicy `steps` z JSONa dla wybranej usługi.

### Animacje
Używaj Framer Motion: slide-in z prawej przy przejściu do przodu, slide-in z lewej przy cofaniu.

### Formularz i wysyłka
Po wypełnieniu formularza POST na `/api/send-quote` z:
```json
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "message": "...",
  "selection": {
    "serviceLabel": "...",
    "baseLabel": "...",
    "cmsLabel": "...",
    "featuresLabels": ["..."],
    "deadlineLabel": "..."
  },
  "priceMin": 4800,
  "priceMax": 9500
}
```
Endpoint wysyła dwa maile przez Resend:
1. Do dewelopera — pełne podsumowanie wyborów i danych kontaktowych
2. Do klienta — potwierdzenie z podsumowaniem wyborów i widełkami

Klucze środowiskowe: `RESEND_API_KEY`, `QUOTE_FROM_EMAIL`, `QUOTE_TO_EMAIL`.

### Prefill z chatbota
W `PricingCalculator.tsx` przy montowaniu sprawdź `sessionStorage.getItem('calculatorPrefill')`. Jeśli dane istnieją, wczytaj je do stanu i pokaż od razu ekran wyniku. Usuń klucz z sessionStorage po odczytaniu.

### Disclaimer
Pobieraj tekst z `pricing-config.json` (`disclaimer`). Wyświetlaj pod wynikiem szarym małym tekstem.

### Mobile
Na mobile kroki jako full-screen cards. Pasek postępu na górze. Przyciski Wstecz / Dalej na dole fixed.

## Czego NIE rób
- Nie hardkoduj żadnych cen ani etykiet w komponentach — wszystko z JSONa
- Nie twórz osobnej strony dla wyniku — formularz kontaktowy i wynik są na jednym ekranie
- Nie używaj żadnej zewnętrznej biblioteki formularzy (plain React state wystarczy)
```