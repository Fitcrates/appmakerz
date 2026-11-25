# Mapa typów dokumentów

Źródło prawdy to pliki w `sanity.studio/schemas/` i wdrożony schemat (`get_schema`, `schema_type_get`). Ta mapa jest skrótem do szybkiej orientacji. Jeśli się z nimi nie zgadza, wygrywa schemat.

`L<string>` oznacza obiekt `{ "en": string, "pl": string }`. `L<PT>` oznacza `{ "en": PortableText[], "pl": PortableText[] }`.

## post (blog, `/pl/blog/<slug>`)

| Pole | Typ | Uwagi |
|---|---|---|
| `aiContext` | text | Brief, do 4000 znaków. |
| `title` | L<string> | Wymagany w obu językach. |
| `slug` | slug `{ "_type": "slug", "current": "..." }` | Wymagany. Z `title.en`, maks. 96 znaków. Nie zmieniaj w istniejącym wpisie. |
| `author` | reference do `author` | `{ "_type": "reference", "_ref": "<id>" }`. Pobierz id zapytaniem `*[_type == "author"]{_id, name}`. |
| `mainImage` | image z `alt` | Hotspot. `alt` wymagany. |
| `categories` | reference[] do `category` | Każdy element ma `_key`. |
| `tags` | string[] | Krótkie frazy. Przed dodaniem sprawdź, jakich tagów używają istniejące wpisy, i trzymaj się ich zapisu. |
| `relatedServices` | reference[] do `serviceLanding` | Maks. 3, bez duplikatów. Każda usługa omawiana we wpisie. |
| `publishedAt` | datetime | Nie ustawiaj bez prośby. Przy przyszłej dacie webhook pomija newsletter i nie wysyła go później. |
| `updatedAt` | datetime | Tylko przy istotnej aktualizacji treści, nie przy literówkach. |
| `excerpt` | L<text> | Do 300 znaków. Domyślny meta description. |
| `body` | L<PT> | Bloki: `block` (style `normal`, `h2`, `h3`, `h4`, `blockquote`; nie używaj `h1`), `image` (z `alt`, `caption`), `gallery`, `blogTable`, `code`. |
| `faq` | `{ en: Faq[], pl: Faq[] }` | `Faq = { _key, question, answer }`. |
| `seo.metaTitle` | L<string> | Do 60 znaków. |
| `seo.metaDescription` | L<text> | 120-160 znaków. |
| `seo.keywords` | string[] | Główne frazy. |
| `seo.ogImage` | image | Tylko gdy różny od `mainImage`. |

Nie ruszaj: `featured`, `featuredOrder`, `viewCount`, `seo.noIndex`, `seo.canonicalUrl`, `emailsSent`, `emailsSentAt`.

## serviceLanding (strona usługi, `/pl/uslugi/<slug>`)

Plik: `sanity.studio/schemas/documents/serviceLanding.ts`. Najważniejsze pola, wszystkie tekstowe w wersji L<...>:

- `aiGenerate`: miejsce na panel AI w Studio. Nie zapisuj tu niczego.
- `title`, `slug`, `layoutVariant` (`service` albo `hub`), `serviceType` (lista zamknięta, nie zmieniaj bez prośby), `city` i `isLocalLanding` (tylko dla stron lokalnych).
- Hero: `eyebrow`, `intro`, `heroImage`, `ctaLabel`, `ctaSecondaryLabel`, `stats` (maks. 4 pozycje `{ value, label }`).
- Sekcje: `problems`, `deliverables`, `processSteps`, `models` (2-3 modele dostarczenia), `capabilities` (tylko layout `hub`), `fitYes`, `fitNo`, `integrations`, `technologies`, `hubMedia`, `guideCta`, `faq`, `content` (PT).
- Powiązania: `relatedServices`, `relatedProjects`, `relatedPosts`.
- `seo`.

Pola `linkHref` w `models` i `capabilities` to ścieżki **bez** prefiksu języka, np. `/uslugi/marketplace-multi-vendor`.

Strony usług sprzedają. Pisz od potrzeby klienta, nie od listy technologii. Patrz zasady stylu w `SKILL.md`.

## project (case study, `/pl/project/<slug>`)

Plik: `sanity.studio/schemas/documents/project.ts`, sekcje w `sanity.studio/schemas/objects/project/sections.ts`.

- `aiGenerate`: miejsce na panel AI w Studio. Nie zapisuj tu niczego.
- `title`, `slug`, `description` (L<text>, wymagany, do 300 znaków), `mainImage`, `category` (L<string>, krótka etykieta), `year` (wymagany).
- Strona główna: `homepageTitle`, `homepageDescription`. `featured` i `homepageOrder` zmieniaj tylko na prośbę.
- `technologies` (string[]; pierwsze 8 widać w hero), `facts` (2-5 pozycji pod hero), `projectUrl`, `blogUrl`, `githubUrl`, `articleLinks` (publikacje na innych stronach).
- `sections`: tablica sekcji. Typy: `projectRichText`, `projectSplitFeature`, `projectBulletGrid`, `projectMediaBlock`, `projectMetricStrip`, `projectTimeline`, `projectTechStack`, `projectQuote`, `projectFaq`, `projectCtaBand`. Przed zapisem sprawdź pola wybranego typu przez `schema_type_get`.
- `body`: stare pole, renderowane tylko wtedy, gdy `sections` jest puste. Do nowych treści używaj `sections`.

## Pozostałe

- `category`: `title` (L<string>, wymagany), `slug`, `description` (L<text>), `color` (hex `#rrggbb`), `order` (liczba całkowita).
- `aboutMe`: strona „O mnie”. Zmieniaj tylko na wyraźną prośbę.
- `pages`: proste strony z `title` i `content` (L<PT>).
- `promoPopout`, `redirect`: konfiguracja strony. Zmieniaj tylko na wyraźną prośbę. Przekierowanie dodaj wtedy, gdy użytkownik zmienia slug opublikowanej strony.
- `subscriber`: dane osobowe. Nie czytaj, nie zmieniaj.
