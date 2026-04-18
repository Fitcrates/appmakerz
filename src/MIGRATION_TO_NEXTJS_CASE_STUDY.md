# AppCrates: pełna migracja z Vite SPA do Next.js App Router na Netlify

**Status:** migracja wykonana, projekt przełączony z architektury SPA na aplikację Next.js z App Routerem  
**Docelowy hosting:** ten sam projekt Netlify, bez zmiany DNS  
**Cel dokumentu:** materiał roboczy do wpisu blogowego opisującego migrację, decyzje techniczne, problemy i końcową architekturę

## 1. Punkt wyjścia

Projekt AppCrates działał jako aplikacja oparta o `Vite + React`. Było to wygodne środowisko developerskie, ale w praktyce miało kilka ograniczeń:

- renderowanie głównie po stronie klienta,
- słabszy pierwszy HTML dla SEO i crawlerów,
- część metadanych i zachowań SEO oparta o obejścia,
- mieszanie logiki routingu, widoków i klientowych efektów,
- konfiguracja Netlify odziedziczona po SPA,
- dodatkowe warstwy pomocnicze, które w modelu Next.js przestawały mieć sens.

Migracja miała nie tylko "uruchomić to samo w Next", ale doprowadzić projekt do finalnej, produkcyjnej formy:

- zachować design i funkcje strony,
- przejść na `Next.js App Router`,
- zachować hosting na Netlify,
- nie ruszać DNS,
- uporządkować strukturę repozytorium,
- zachować zgodność z Sanity, formularzami, analytics i SEO.

## 2. Główne założenia migracji

Podczas migracji przyjęto kilka zasad, które trzymały cały proces w ryzach:

### Zachowanie warstwy wizualnej

Priorytetem było zachowanie istniejącego wyglądu i zachowania strony. Zamiast przepisywać cały frontend od zera, warstwa wizualna została możliwie szeroko zre-użyta z istniejących komponentów:

- `src/components/new/*` pozostało bazą dla sekcji wizualnych,
- komponenty stricte nextowe trafiły do `src/components/next/*`,
- nowe strony w App Routerze składają się z warstwy serwerowej i komponentów klienckich tam, gdzie były potrzebne interakcje.

To podejście pozwoliło uniknąć niepotrzebnego redesignu podczas migracji technologicznej.

### App Router jako nowe źródło prawdy

Nowy routing został oparty o App Router. Dzięki temu:

- każda strona ma własny plik `page.tsx`,
- SEO i metadata są zarządzane po nextowemu,
- możliwe jest mieszanie renderowania serwerowego z komponentami klientowymi,
- route handlery zastąpiły część starych funkcji wykonywanych poza Next.

### Serwer dla treści, klient dla interakcji

Logika została podzielona zgodnie z naturalnym modelem Next.js:

- dane, metadata, SEO i rendering tras są po stronie serwera,
- animacje, formularze, consent, event tracking i interakcje zostały po stronie klienta,
- minimalizowano ilość komponentów z `"use client"` tylko do tych, które faktycznie tego wymagały.

## 3. Co zostało zmigrowane

### Routing i widoki

W projekcie działa komplet tras oparty o App Router:

- `/`
- `/about-me`
- `/blog`
- `/blog/[slug]`
- `/project/[slug]`
- `/uslugi/[slug]`
- `/faq`
- `/privacy-policy`
- `/unsubscribe`
- `robots.txt`
- `sitemap.xml`
- `not-found`

Nowe pliki tras znajdują się w `src/app`.

### Serwerowa warstwa danych

Warstwa danych została wyniesiona do helperów serwerowych:

- `src/lib/sanity.server.ts`
- `src/lib/sanity.write.server.ts`
- `src/lib/request-language.ts`
- `src/lib/localize.ts`
- `src/lib/language.ts`
- `src/lib/site.ts`
- `src/lib/sanity.image.ts`

To pozwoliło odseparować:

- pobieranie danych z Sanity,
- lokalizację,
- generowanie adresów i URL-i,
- serwerowe mutacje typu newsletter i view count.

### API w Next zamiast tylko w Netlify Functions

Część przepływów została przeniesiona do route handlerów App Routera:

- `src/app/api/newsletter/subscribe/route.ts`
- `src/app/api/newsletter/unsubscribe/route.ts`
- `src/app/api/blog/views/route.ts`

To uprościło architekturę aplikacji, bo frontend i część backendu zaczęły żyć w jednym frameworku.

## 4. Struktura komponentów po migracji

Jednym z ważniejszych tematów w trakcie migracji było pytanie: dlaczego nie wszystkie komponenty są w `src/components/next`?

Ostateczne założenie było takie:

- `src/components/new/*` przechowuje bazowe komponenty wizualne istniejącego serwisu,
- `src/components/next/*` przechowuje komponenty specyficzne dla Next.js i adaptery łączące warstwę App Router z istniejącym UI,
- `src/app/*` odpowiada za routing, metadata, rendering stron i serwerowe wejście do aplikacji.

Przykładowo:

- `HomePageClient.tsx` składa stronę główną w środowisku Next,
- `NextHeader.tsx` i `NextFooter.tsx` spinają layout zgodny z App Routerem,
- `PortableTextComponentsServer.tsx` obsługuje render treści z Sanity po stronie serwera,
- `FaqPageClient.tsx` i `UnsubscribePageClient.tsx` pilnują interaktywności tam, gdzie to potrzebne.

To oznacza, że katalog `src/components/next` nie miał być duplikatem całego frontendu, tylko warstwą integracyjną.

## 5. Najważniejsze decyzje architektoniczne

### 5.1. Dynamiczne renderowanie przez cookies i język

Projekt korzysta z wyboru języka opartego o cookies. To ma ważną konsekwencję: jeśli strona czyta `cookies()`, to Next traktuje ją jako dynamiczną.

W praktyce oznacza to:

- HTML strony nie jest w pełni statycznie spłaszczany jak klasyczne SSG,
- ale użytkownik dostaje poprawny język już na renderze,
- unika się migania interfejsu i późniejszego przepinania tłumaczeń po hydracji.

To był świadomy trade-off: mniej agresywnego cache na poziomie całych tras, ale poprawna personalizacja języka i bardziej przewidywalny UX.

### 5.2. Cache na poziomie danych, nie całych stron

Zamiast rozrzucać `revalidate` po każdej trasie, cache został spięty centralnie w warstwie danych Sanity.

Podejście:

- route może być dynamiczna,
- ale same zapytania do Sanity są cache'owane,
- dzięki temu nie tracimy wydajności mimo dynamicznego renderu HTML.

Taki model bardzo dobrze pasuje do nowoczesnego App Routera:

- dynamiczne HTML tam, gdzie trzeba,
- cache danych tam, gdzie to bezpieczne i opłacalne.

### 5.3. Renderowanie serwerowe dla SEO, klientowe dla UX

Zasada była prosta:

- treść, metadata, JSON-LD i dane z CMS po stronie serwera,
- animacje, scroll effects, formularze, consent i eventy po stronie klienta.

To pozwala zachować jednocześnie:

- poprawny HTML dla wyszukiwarki,
- działającą, nowoczesną warstwę interaktywną,
- minimalizację ryzyka hydration mismatch.

## 6. SEO i metadata po migracji

Migracja była okazją do porządków w SEO.

### Co zostało poprawione

- metadata przestały być oparte o stare rozwiązania z `index.html`,
- strony korzystają z mechanizmów Next do generowania metadata,
- wdrożono `robots.ts` i `sitemap.ts`,
- zadbano o canonicale, opis stron i poprawne metadane dla dynamicznych tras,
- uporządkowano structured data / JSON-LD na poziomie aplikacji,
- przygotowano politykę prywatności zgodną z realnym stackiem narzędzi.

### Dlaczego to było ważne

W starym modelu SPA crawler często widział głównie shell aplikacji i dopiero po uruchomieniu JavaScriptu docierał do finalnej treści. W modelu Next celem było podanie możliwie pełnego, sensownego HTML już na wejściu.

## 7. Analytics, Google Tag i śledzenie konwersji

Migracja objęła też warstwę analityczną.

### Google Tag

Dodano bootstrap warstwy `dataLayer` i integrację z Google Tag w layoucie aplikacji:

- ładowanie jest uzależnione od obecności `NEXT_PUBLIC_GOOGLE_TAG_ID`,
- rozwiązanie jest zgodne z nową architekturą Next,
- można bezpiecznie podpinać eventy z komponentów klientowych.

### Consent i polityka cookies

Komponent cookie consent został dostosowany tak, aby:

- aktualizował stan zgody dla analytics,
- emitował event decyzji użytkownika,
- współpracował z GTM / Google Tag bez ręcznych obejść.

### Formularz kontaktowy i eventy leadowe

Śledzenie zostało rozszerzone o realne eventy konwersyjne:

- wejście użytkownika w obszar formularza,
- rozpoczęcie interakcji z formularzem,
- kliknięcia e-mail i telefon,
- wysłanie formularza,
- wygenerowanie leada po udanym submit.

To daje bardziej praktyczny obraz jakości ruchu niż samo liczenie odsłon.

## 8. Netlify: największe źródło problemów podczas migracji

Sama migracja kodu do Next.js była tylko połową zadania. Druga połowa to poprawne wystawienie aplikacji na Netlify.

### Oryginalny problem

Projekt był historycznie skonfigurowany pod Vite SPA. To powodowało konflikty:

- stary publish directory wskazywał na `dist`,
- w obiegu były stare redirecty typu SPA fallback,
- część ustawień żyła jeszcze w panelu Netlify, nie tylko w repo,
- lokalnie można było uruchomić Next, ale produkcja potrafiła dalej serwować stary shell albo kończyć się 404.

### Co zostało uporządkowane

- build przełączono na `next build`,
- publish został odpięty od starego `dist`,
- usunięto lub wygaszono stare artefakty po Vite,
- zostawiono hosting na tym samym projekcie Netlify,
- zachowano custom domain i tym samym brak potrzeby zmian w DNS,
- edge function dla AI została zachowana tylko tam, gdzie nadal miała sens.

### Headers i redirects

Podczas porządków usunięto duplikaty i rozstrzygnięto źródła prawdy:

- `robots.txt` generowane przez Next,
- `sitemap.xml` generowane przez Next,
- `llms.txt` trzymane jako plik publiczny,
- headers przeniesione do jednego miejsca, zamiast polegać na plikach ignorowanych przez publish directory,
- usunięto zbędne duplikaty `robots.txt` i podobnych plików.

### Wniosek

W migracji z Vite do Next.js samo przepięcie kodu nie wystarcza. Trzeba też usunąć założenia starego SPA z hostingu, bo inaczej produkcja może zachowywać się tak, jakby migracja nigdy nie nastąpiła.

## 9. Problemy, które pojawiły się po drodze

To ważna część materiału blogowego, bo pokazuje realną stronę migracji.

### 9.1. Bałagan przejściowy w repo

W pierwszym etapie w repo równolegle istniały:

- nowe trasy Next,
- stare pliki Vite,
- legacy entrypointy,
- tymczasowe adaptery,
- nie do końca oczywisty podział na komponenty `new` i `next`.

Był to stan przejściowy, który pozwolił utrzymać ciągłość pracy, ale wymagał drugiej tury cleanupu.

### 9.2. Stare ustawienia Netlify wygrywały z repo

Nawet po zmianach w kodzie Netlify potrafiło nadal używać ustawień z UI, na przykład starego `publish = dist`. To jest bardzo typowy problem przy migracjach frameworków na istniejącym projekcie hostingowym.

### 9.3. Błędy lokalnego środowiska na Windows

Po restarcie maszyny pojawiły się problemy:

- zajęty port `3000`,
- wiszące procesy `node`,
- zablokowany plik `.next/trace`,
- błędy `EADDRINUSE`,
- błędy `EPERM`.

To nie były błędy aplikacji, tylko środowiska developerskiego po niedomkniętych procesach.

### 9.4. Pierwszy render bez tekstu

Lokalnie strona potrafiła załadować CSS, ale bez widocznego tekstu do momentu odświeżenia. Przyczyną były stany startowe animacji, które chowały content przed hydratacją.

Naprawa polegała na:

- zmianie początkowych stanów animacji,
- usunięciu ukrywania treści above-the-fold na pierwszym renderze,
- dopilnowaniu, żeby tekst był widoczny już w HTML z serwera.

### 9.5. Mieszanie nowej architektury z historycznymi plikami

W praktyce największym ryzykiem nie był sam Next, tylko stan przejściowy:

- trochę starego routingu,
- trochę nowych tras,
- częściowo żywe stare funkcje,
- pliki, których nie było już sensu trzymać,
- niejednoznaczność co jest kanoniczne, a co tylko tymczasowe.

Dlatego częścią migracji musiał być także pełny cleanup i dokumentacja struktury.

## 10. Cleanup po migracji

Pełna migracja nie kończy się na "działa". Kończy się dopiero wtedy, gdy projekt jest czytelny.

W ramach porządków:

- odłączono artefakty i konfiguracje charakterystyczne dla Vite,
- usunięto duplikaty plików SEO i publicznych zasobów,
- wydzielono kanoniczne miejsca dla routingu, danych i komponentów,
- uproszczono zależności między Netlify Functions a route handlerami Next,
- dopisano dokumentację migracji i audyt struktury.

Ważny wniosek: migracja frameworka zawsze zostawia po sobie "martwe drewno". Jeśli się go nie usunie, projekt będzie działał, ale zespół będzie pracował w stale rosnącym chaosie.

## 11. Obecna docelowa architektura

Po migracji projekt można opisać tak:

### `src/app`

Nowy routing, metadata, `robots`, `sitemap`, `not-found`, route handlery i główne wejście aplikacji.

### `src/components/new`

Warstwa istniejącego designu i produkcyjnych sekcji UI. To tutaj znajduje się większość zachowanego wyglądu strony.

### `src/components/next`

Komponenty integracyjne i nextowe adaptery spinające App Router z istniejącym UI.

### `src/lib`

Serwerowa logika danych, lokalizacji, adresów, Sanity i helperów wspólnych.

### `src/content`

Treści statyczne, na przykład FAQ i polityka prywatności.

### `netlify`

Funkcje i edge functions, które nadal mają sens jako niezależne jednostki poza App Routerem.

## 12. Co było celem biznesowym, a nie tylko technicznym

Tego typu migracja nie służy wyłącznie programistom. Jej biznesowe cele były bardzo konkretne:

- lepsza widoczność treści w wyszukiwarkach,
- mocniejszy pierwszy render i lepszy perceived performance,
- czystsza architektura pod dalszy rozwój strony,
- łatwiejsze utrzymanie SEO, treści i analityki,
- możliwość dalszego rozwoju projektu jako nowoczesnej platformy usługowej.

Innymi słowy: chodziło nie o zmianę modnego narzędzia, tylko o przejście z konfiguracji "działa" do konfiguracji "skaluje się i daje kontrolę".

## 13. Lessons learned

Kilka najważniejszych wniosków z tej migracji:

### Nie warto przepisywać wszystkiego od zera

Jeśli design działa, lepiej zbudować nową architekturę wokół istniejących komponentów niż robić niepotrzebny redesign pod pretekstem migracji.

### Netlify trzeba migrować razem z aplikacją

Repo może być już nextowe, a produkcja nadal może działać jak stary projekt SPA. Hosting trzeba potraktować jako część migracji, nie jako osobny temat.

### Dynamiczny render nie oznacza braku optymalizacji

Jeśli aplikacja korzysta z cookies lub per-user kontekstu, dynamiczne renderowanie może być właściwym wyborem. Wydajność nadal da się odzyskać przez sensowny cache danych.

### Cleanup jest częścią wdrożenia, nie dodatkiem

Najwięcej długów technicznych powstaje nie podczas pierwszego przepisywania, tylko wtedy, gdy zespół zostawia repo w połowie stare, w połowie nowe.

### Dokumentacja oszczędza czas po kilku tygodniach

Po migracji najbardziej potrzebny jest nie kolejny refactor, tylko jasna odpowiedź na pytania:

- co jest źródłem prawdy,
- co zostało zachowane,
- co jest legacy,
- co można usunąć,
- gdzie szukać problemów przy deployu.

## 14. Tematy na wpis blogowy

Z tego dokumentu można wyciągnąć kilka różnych formatów publikacji:

### Wersja techniczna

Jak przenieść aplikację z Vite SPA do Next.js App Router bez przepisywania całego UI.

### Wersja SEO / marketingowa

Dlaczego migracja z klasycznego SPA do Next.js poprawia kontrolę nad SEO, metadata i pierwszym renderem.

### Wersja devopsowa

Jak nie zepsuć Netlify przy migracji frameworka i dlaczego stare ustawienia hostingu potrafią sabotować poprawny deploy.

### Wersja "lessons learned"

Największe błędy i pułapki przy migracji dużego frontendu do nowego frameworka.

## 15. Krótkie podsumowanie do wykorzystania w blogu

Migracja AppCrates z Vite do Next.js nie była prostym "przepisaniem routera". Była to pełna zmiana modelu działania aplikacji: od SPA opartego głównie o klienta do architektury, w której routing, SEO, metadata i warstwa danych są prowadzone serwerowo, a interaktywność pozostaje dokładnie tam, gdzie naprawdę jest potrzebna.

Najważniejsze było zachowanie 100% istniejącego designu i funkcji, bez naruszania działającej warstwy wizualnej. Dzięki temu migracja nie zmieniła charakteru strony, ale radykalnie poprawiła jej fundamenty.

Największym wyzwaniem okazał się nie sam Next.js, tylko uporządkowanie starego środowiska Vite i hostingu Netlify. To właśnie tam zwykle chowają się problemy, które sprawiają wrażenie, że "framework nie działa", chociaż w rzeczywistości konflikt dotyczy starych publish directory, redirectów, headers albo dziedziczonych ustawień w panelu hostingu.

Końcowy efekt to czystsza, nowocześniejsza i bardziej skalowalna aplikacja, gotowa pod dalszy rozwój contentu, SEO, formularzy, analityki i nowych funkcji biznesowych.
