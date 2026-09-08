# AppCrates — architektura SEO / MedusaJS: plan zweryfikowany

Wersja robocza z ChatGPT (`appcrates-medusajs-seo-plan.md`) skonfrontowana z kodem,
schematami Sanity i produkcją (8.09.2026). Strategia zachowana, diagnoza stanu
obecnego poprawiona.

---

## 0. Kierunek strategiczny (bez zmian)

AppCrates → MedusaJS → custom commerce → marketplace → integracje → production engineering.

Priorytet: Europa przez treści EN, Wrocław jako sygnał encji a nie rynek docelowy,
zero doorway pages, zero masowej produkcji generycznych artykułów. Medusa Experts
odłożone do momentu, aż pojawi się projekt naturalnie osadzony na Medusa Cloud.

To wszystko z oryginału zostaje w mocy.

---

## 1. Weryfikacja: co w oryginalnym planie było nieaktualne

Oryginał zakłada stan zerowy w obszarach, które są już wdrożone.

| Sekcja oryginału | Stan faktyczny |
|---|---|
| §12 lokalizowane SEO metadata | **Gotowe.** `seo.metaTitle.{en,pl}`, `seo.metaDescription.{en,pl}` + `keywords`, `canonicalUrl`, `ogImage`, `noIndex` w `project`, `serviceLanding`, `post` |
| §18 canonical + hreflang | **Gotowe i poprawne.** Self-canonical per język, wzajemne `hrefLang`, `x-default` |
| §19 sitemap | **Gotowe.** Generowany z Sanity, 168 URL (84 PL + 84 EN), `alternates` + `lastModified` |
| §8 „EN nie może być kopią PL" | **Gotowe.** Zapytanie GROQ po całym datasecie: 34 posty i 11 projektów mają wypełnione `body.en` **i** `body.pl` o porównywalnej długości. Archiwum jest realnie dwujęzyczne, nie maszynowe |
| §9 internal linking | **W dużej mierze gotowe.** `relatedServices` / `relatedProjects` / `relatedPosts` jako referencje + automatyczny fallback |
| §7 klastry blogowe | **W dużej mierze napisane.** Istnieją już: płatności store vs marketplace, provider-neutral integration hub (+ follow-up), cache invalidation, Postgres JIT, custom functionality w Medusa v2, marketplace MVP, rozbudowa sklepu o marketplace, legalne uruchomienie marketplace |
| §7 „nie pisz MedusaJS vs Shopify" | Spóźnione — istnieją już dwa takie teksty. Zostawić, nie rozwijać klastra |

**Skorygowana teza:** `/marketplace-guide` (26 rozdziałów: GDPR, DSA, GPSR, DAC7,
P2B, NIS2, consumer law, BDO/EPR, accessibility…) **nie jest osierocony**.
Strona marketplace ma dedykowany blok CTA, a każdy rozdział linkuje z powrotem
opisowym anchorem. Pętla jest domknięta. Wcześniejsza diagnoza była błędem pomiaru.

Konsekwencja dla oryginału: klaster „European commerce" z §7 **nie powinien
powstawać jako blog** — skanibalizowałby własny przewodnik.

---

## 2. Defekty znalezione poza oryginalnym planem

Uszeregowane wg stosunku wartości do ryzyka.

### 2.1. Zduplikowana strona główna — priorytet krytyczny

`/` i `/pl` serwują tę samą treść jako dwie osobne, indeksowalne strony:

```
/     canonical → https://appcrates.pl      hreflang pl → https://appcrates.pl
/pl   canonical → https://appcrates.pl/pl   hreflang pl → https://appcrates.pl/pl
```

Dwa self-canonicale i **dwa sprzeczne klastry hreflang** dla jednej treści.
Dodatkowo `/` ma inny `<title>` (bez sufiksu `| AppCrates`), więc Google widzi
je jako różne strony. W sitemapie jest tylko `/pl`.

To pojedynczo największy defekt SEO na stronie — większy niż cokolwiek
z oryginalnego planu.

**Fix:** usunąć `src/app/page.tsx`, `/` → 301 → `/pl` w `next.config.ts`.

### 2.2. `<html lang="pl">` na wszystkich stronach, także `/en/*`

`src/app/layout.tsx:102` hardkoduje `DEFAULT_LANGUAGE`, a `[lang]/layout.tsx`
nie może nadpisać `<html>`, bo nie jest layoutem roota.

Podważa sygnał językowy, który §18 oryginału uznaje za załatwiony, i psuje
dostępność (czytniki ekranu czytają angielski z polską fonetyką).

**Fix:** po usunięciu `src/app/page.tsx` przenieść `<html>`/`<body>` do
`app/[lang]/layout.tsx`, skasować `app/layout.tsx`, dodać `app/global-not-found.tsx`
(Next 16).

### 2.3. `x-default` wskazuje na PL

Przy strategii celującej w Europę przez EN, fallback dla użytkowników spoza
klastra `pl` powinien prowadzić do wersji angielskiej.

**Fix:** `x-default` → `/en/...` w `sitemap.ts` i w `alternates.languages`
wszystkich stron.

### 2.4. Segment ścieżki jest polski również po angielsku

Produkcja: `/en/uslugi/...`, `/en/project/...`. Oryginał zakłada
`/en/services/medusa-js-development` (§3.1, §4) i traktuje to jako pochodną
localized slugs — to osobny, droższy problem, bo struktura
`src/app/[lang]/uslugi/[slug]` jest sztywna w systemie plików.

**Nie jest blokerem.** Hub Medusa może powstać dziś pod `/en/uslugi/…`
i zostać przepięty później, przez model redirectów z 3.1.

### 2.5. Niespójność encji — email

`ProfessionalService` deklarował `appcratesdev@gmail.com`, cała §22 opiera się
na `kontakt@appcrates.pl`. **Naprawione** (patrz 3.4).

### 2.6. Artovnia nie komunikuje Medusy

Potwierdzone: title, H1 i intro nie zawierają słowa „Medusa"; Medusa.js jest
schowana w chipach za `+3 więcej`. Merytoryka jest natomiast mocna — Stripe
Connect Express, split payments, delayed payouts (14 dni), konfigurowalne
prowizje per sprzedawca, punkty lojalnościowe finansowane przez platformę,
system poleceń. **Brakuje wyłącznie etykiety, nie treści.**

To zadanie contentowe w Sanity, nie kodowe.

### 2.7. Soft 404 na trasach z `dynamicParams = true`

Nieistniejące slugi zwracają **200 zamiast 404**, mimo że strony wołają
`notFound()`. Potwierdzone na produkcji i lokalnie:

```
/pl/blog/nieistniejacy             200   (dynamicParams = true)
/pl/uslugi/nieistniejaca           200   (dynamicParams = true)
/foobar                            200   (dynamicParams = true)
/pl/marketplace-guide/nieistniejacy 404  (dynamicParams = false)
```

Korelacja jest jednoznaczna: trasy z `dynamicParams = false` zwracają twarde
404, trasy z `true` — soft 404. Google traktuje soft 404 jako treść cienką
albo zduplikowaną i potrafi wciągnąć takie adresy do indeksu.

**Decyzja do podjęcia, nie zmieniona samowolnie.** `dynamicParams = false`
naprawia status, ale nowy dokument w Sanity przestaje być dostępny do
najbliższego builda — dziś webhook wywołuje rewalidację, nie rebuild.
Alternatywa to zdjęcie `force-static` z tych tras, co kosztuje wydajność.

### 2.8. CTA przewodnika zabramkowany twardym stringiem

`uslugi/[slug]/page.tsx:455` — `landing.slug.current === 'marketplace-multi-vendor-medusa-js'`.
Nowy hub Medusa i strona ecommerce nie dostaną CTA bez edycji kodu.
Artovnia — jedyne case study marketplace — też go nie ma.

---

## 3. Roadmap (kolejność odwrócona względem oryginału)

Oryginał blokował wszystko Fazą 1 (przebudowa CMS + routingu, tygodnie pracy,
ryzyko regresji na 168 URL). Poniżej: najpierw rzeczy tanie i o natychmiastowym
efekcie, przebudowa schematów dopiero gdy zacznie być potrzebna.

### Faza A — higiena techniczna (dni, zero ryzyka dla istniejących URL)

- [x] `/` → 301 → `/pl`, usunięcie zduplikowanej strony głównej
- [x] `<html lang>` per język
- [x] `x-default` → EN
- [x] spójny `kontakt@appcrates.pl` w stopce, sekcji kontaktu i structured data
- [x] `founder` (Arkadiusz Wawrzyniak) + `sameAs` (GitHub, LinkedIn)
      w `ProfessionalService`, wraz z `Person.knowsAbout`
- [x] adres RODO w `privacy-policy.ts` przeniesiony na `kontakt@appcrates.pl`
      (4 wystąpienia, PL + EN)

### Faza B — model redirectów (przed jakąkolwiek zmianą URL)

- [x] typ `redirect` w Sanity (`source`, `destination`, `permanent`, `note`)
- [x] generowanie w buildzie do `next.config.ts` → `redirects()`
- [x] walidacja w Studio: duplikaty `source` oraz wykrywanie łańcuchów
      (`destination` nie może być czyimś `source`)
- [x] snapshot bazowy → `docs/url-baseline-2026-09-08.txt` (178 URL)
- [ ] dogranie eksportu „Strony" z Search Console do snapshotu
- [ ] decyzja w sprawie soft 404 (2.7)

**Zasada:** mapa redirectów nie jest lustrem sitemapy. Zawiera wyłącznie pary
`stary → nowy` dla URL-i faktycznie zmienionych. Dziś startuje pusta.
Sitemap nie wymaga osobnej obsługi — jest pochodną slugów w Sanity, więc
automatycznie zawiera tylko aktualne canonical URL (§19 oryginału spełnione
z definicji).

**Runtime:** `redirects()` w `next.config.ts` jest `async` i odpytuje Sanity
**raz w buildzie**. Zero lookupów per request. Świadomie nie w `proxy.ts` —
middleware działa na edge przy każdym żądaniu.

### Faza C — email (bez dotykania DNS)

MX domeny już wskazuje na Resend, więc forwarding budujemy kodem.

- [x] endpoint `/api/inbound` — webhook `email.received`
- [x] weryfikacja podpisu (schemat Svix, HMAC-SHA256, okno 5 min, bez nowej
      zależności) — 8 testów jednostkowych przechodzi
- [x] przekazanie na Gmail z `from` na zweryfikowanej domenie i `Reply-To`
      na oryginalnego nadawcę
- [ ] konfiguracja webhooka w panelu Resend + `RESEND_INBOUND_SECRET`
- [ ] test inbound/outbound na żywym mailu — **kształt payloadu `email.received`
      przyjęty defensywnie (`from` / `to` / `subject` / `html` / `text`
      z fallbackami); pierwszy realny webhook trzeba obejrzeć i w razie
      potrzeby skorygować mapowanie pól**
- [ ] opcjonalnie: załączniki

### Faza D — klaster komercyjny MedusaJS

- [x] CTA przewodnika jako pole `guideCta { enabled, chapters }` zamiast twardego
      stringa; landing marketplace zmigrowany, CTA nie zniknęło
- [x] `layoutVariant: service | hub` — selektor układu w Sanity
- [x] nowe pola: `capabilities[]`, `fitYes`, `fitNo`, `integrations[]`,
      `technologies[]`, `models[].linkLabel/linkHref`
- [x] komponent `HubLanding` + rozgałęzienie w `uslugi/[slug]/page.tsx`
- [x] nowe komponenty: `HubCapabilities`, `HubFit`, `HubIntegrations`, `HubEvidence`,
      `TechChips`
- [x] wydzielone z `page.tsx` do reużycia przez oba układy: `ServiceStatsNew`,
      `GuideCtaSection`, `ServiceCtaNew`
- [x] hub jako draft `medusa-js-development`, PL + EN, z pełną treścią
- [ ] **przeczytać copy i opublikować draft** — nic nie jest publiczne
- [x] stack renderowany przez `TechBadgeList` z ikonami marek, wspólny ze stronami
      projektów; dodane mapowania ikon dla Payload, Meilisearch i Klarna
- [x] `hubMedia[]` - opcjonalne grafiki w pięciu miejscach między sekcjami,
      pusty slot nie renderuje niczego
- [x] dropdown "Usługi" pogrupowany: Medusa.js (hub, sklepy, marketplace) oraz
      Pozostałe usługi. Hub dostaje link z każdej podstrony. Lista zagęszczona,
      panel ma 584 px zamiast 692, czyli mniej niż wersja sprzed zmiany
- [ ] podmienić grafikę podglądu huba w dropdownie (na razie współdzieli
      `marketplace.webp`)
- [ ] usunąć tymczasową trasę `/[lang]/hub-preview` po publikacji

**Reguła kadrowania, przyjęta po korekcie właściciela.** Artovnia jest dowodem
zdolności, nie specyfikacją tego, co dostaje klient. W treści huba nie ma
przypiętych wersji, pojedynczej bramki płatniczej ani liczb, których czytelnik
nie umie zinterpretować. Okno wstrzymania wypłaty, prowizje i progi występują
jako parametry konfigurowalne. Płatności: Stripe, PayU, Przelewy24, BLIK, Klarna
i inne — przy marketplace podział płatności zwykle przez Stripe Connect.
Wyszukiwanie: Algolia lub Meilisearch.

**Ograniczenie.** Oryginał zakładał `/pl/uslugi/medusa-js` i
`/en/uslugi/medusa-js-development` jako dwa adresy. Niewykonalne przed Fazą F —
slug jest jeden na dokument. Hub stoi pod wspólnym `medusa-js-development`.

### Faza E — proof

- [ ] Artovnia: Medusa.js w title / H1 / pierwszym akapicie, wyjęta z `+3 więcej`
- [ ] Artovnia → CTA przewodnika
- [ ] Artovnia → link do huba Medusa
- [ ] homepage: Medusa jako widoczna specjalizacja w title i H1
      (dziś: „Fullstack Web Developer tworzący strony, aplikacje AI…")
- [ ] anchor „Zobacz więcej" w `ServicesNew.tsx:127` → opisowy

### Faza F — dopiero teraz przebudowa CMS

Uruchamiana wyłącznie wtedy, gdy pojawi się konkretny powód do zmiany URL-i.

- [ ] lokalizowane slugi — **schemat i warstwa GROQ**; wszystkie zapytania
      filtrują dziś po `slug.current`, to nie jest sama zmiana schematu
- [ ] lokalizowane segmenty ścieżek (`services` / `projects`) — najdroższe,
      wymaga rewrite'ów albo `[lang]/[section]/[slug]`
- [ ] internal links w Portable Text jako referencje zamiast absolutnych URL
      (adnotacja `link` ma dziś jedno pole `href: type 'url'`, więc Sanity
      wymusza adresy absolutne — w polskim poście siedzi link do `/en/...`)

### Faza G — entity i off-page

Bez zmian względem §20/§24 oryginału.

---

## 4. Czego nie robić

Lista z §26 oryginału zostaje, z trzema dopiskami:

- nie budować klastra „European commerce" na blogu — jest `/marketplace-guide`
- nie blokować Faz A–E przebudową CMS (Faza F)
- nie wpinać lookupu redirectów w `proxy.ts`

---

## 5. Kryterium sukcesu

Bez zmian względem §28: osobno commercial queries, osobno topical, osobno
EN vs PL w Search Console. Metryka nadrzędna to jakościowe leady dotyczące
MedusaJS / marketplace / custom commerce, nie pozycja pojedynczej frazy.
