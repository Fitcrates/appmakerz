# AppCrates performance audit - 2026-06-05

## Kontekst

Audyt dotyczy wolnego initial load oraz odczuwalnie wolnych przejsc na strone glowna. Dane z PageSpeed wskazywaly przede wszystkim:

- duzy czas pracy main thread: ok. 4,3 s,
- script evaluation: ok. 2,1 s,
- Google Tag jako istotny nieuzywany JS na starcie,
- dodatkowy koszt wejscia przez `https://appcrates.pl`, ktore bylo przekierowywane do `/pl`,
- obrazy zbyt duze wzgledem wymiarow renderowania.

## Najbardziej prawdopodobne przyczyny

1. Root URL renderowal redirect zamiast homepage.

   `src/app/page.tsx` wykonywal `permanentRedirect('/pl')`, a `src/middleware.ts` dodatkowo kierowal `/` na `/pl`. To oznaczalo dodatkowy round-trip przed pobraniem finalnego HTML. Dla PageSpeed i realnych uzytkownikow start z `https://appcrates.pl` byl przez to wolniejszy niz bezposrednie wejscie na `/pl`.

2. Homepage jest ciezkim client-side widokiem.

   `HomePageClient` sklada cala strone jako komponent kliencki i laduje wiele interaktywnych sekcji: Framer Motion, GSAP/ScrollTrigger, chat, header, footer, globalne prefetchowanie tras i animacje przejsc. To pasuje do diagnozy PSI: wysoki `Script Evaluation` i `Total Blocking Time`.

3. Globalny prefetch startowal zbyt wczesnie.

   `GlobalRoutePrefetch` natychmiast prefetchowal statyczne trasy, a potem w idle pobieral manifest tras dynamicznych. To jest dobre dla pozniejszych przejsc, ale konkuruje z initial load i hydration.

4. Custom route transition byl kosztowny.

   `RouteTransitionProvider` przed nawigacja klonowal caly DOM (`cloneNode(true)` i `outerHTML`) oraz odpalal canvasowa animacje. Na rozrosnietej stronie glowny watek dostawal koszt dokladnie w momencie klikniecia linku.

5. Google Tag ladowal sie za wczesnie.

   `gtag/js` byl ladowany `afterInteractive`, czyli zaraz po hydration. PSI pokazywal ok. 173 KiB transferu i duza czesc nieuzywanego JS.

6. Male logo pobieralo zbyt duzy plik.

   Logo renderowane jako 32-44 px uzywalo `/media/AppcratesLogoSmaller.webp`, ktory wazyl ok. 65 KiB.

## Wprowadzone zmiany

### 1. Usuniecie redirectu dla root URL

Pliki:

- `src/app/page.tsx`
- `src/middleware.ts`

Zmiany:

- `/` nie jest juz przekierowywane do `/pl`,
- root page renderuje polska homepage bezposrednio,
- dodano metadata, canonical `https://appcrates.pl/`, alternates i dane homepage,
- w middleware `/` nie trafia juz do redirectu jezykowego.

Oczekiwany efekt:

- jeden request mniej przy pierwszym wejsciu,
- szybszy initial HTML,
- lepszy wynik PSI dla testu wykonywanego na `https://appcrates.pl`.

### 2. Google Tag opozniony do `lazyOnload`

Plik:

- `src/app/layout.tsx`

Zmiany:

- `gtag/js` i konfiguracja tagu zostaly przestawione z `afterInteractive` na `lazyOnload`.

Oczekiwany efekt:

- mniej pracy JS w pierwszej fazie hydration,
- mniejszy nacisk na main thread przed LCP.

### 3. Globalne prefetchowanie przesuniete na idle

Plik:

- `src/components/next/GlobalRoutePrefetch.tsx`

Zmiany:

- statyczne prefetch routes nie startuja natychmiast,
- caly prefetch jest opozniony do `requestIdleCallback`,
- fallback timeout zwiekszony z 250 ms do 3000 ms.

Oczekiwany efekt:

- mniej konkurencji sieciowej i JS podczas initial load,
- prefetch nadal dziala, ale pozniej.

### 4. Chat widget opozniony na homepage

Plik:

- `src/components/next/HomePageClient.tsx`

Zmiany:

- chat jest importowany dynamicznie z `ssr: false`,
- widget renderuje sie dopiero po idle albo po fallback timeout,
- usunieto nieuzywany import `HeroNew`.

Oczekiwany efekt:

- mniejszy poczatkowy JS homepage,
- mniej pracy hydration na pierwszym ekranie.

### 5. Route transition odchudzony

Pliki:

- `src/components/next/RouteTransitionProvider.tsx`
- `src/components/next/NoiseTransitionCanvas.tsx`

Zmiany:

- usunieto snapshot aktualnej strony przez klonowanie calego DOM,
- animacja cover/reveal skrocona z 1400 ms do 700 ms,
- rozdzielczosc canvasa zmniejszona z `0.35` do `0.25`.

Oczekiwany efekt:

- mniej blokowania main thread przy kliknieciu linku,
- szybsze odczucie przejscia na homepage,
- mniejszy koszt canvas animation.

### 6. Mniejszy obraz logo

Pliki:

- `src/components/new/HeaderNew.tsx`
- `src/components/new/FooterNew.tsx`
- `src/components/next/ChatWidget.tsx`

Zmiany:

- male logo w header/footer/chat uzywa teraz `/media/favicon-32x32.png` zamiast `/media/AppcratesLogoSmaller.webp`.

Oczekiwany efekt:

- ok. 60 KiB mniej transferu dla malego logo wskazanego w PSI.

### 7. Obrazy usług przez Next Image

Pliki:

- `src/components/new/HeaderNew.tsx`
- `src/components/new/SolutionsNew.tsx`

Zmiany:

- obrazy w mega menu headera nie uzywaja juz raw `<img src="/media/solutions/...">`,
- mega menu renderuje obrazy dopiero po otwarciu menu usług,
- obrazy w headerze ida przez `next/image` z `quality={55}` i dopasowanym `sizes`,
- obrazy w `SolutionsNew` juz byly na `next/image`; dodano `quality={60}` dla lzejszych wariantow generowanych przez Next.

Wazne:

- alert PSI z raw `/media/solutions/*.webp` najpewniej pochodzil z `HeaderNew`, nie z `SolutionsNew`.
- `SolutionsNew` renderuje obrazy przez optimizer Nexta jako `/_next/image?...`, wiec tam problemem byla raczej jakosc/rozmiar wariantu, nie brak Next Image.

Oczekiwany efekt:

- brak pobierania pieciu obrazow mega menu na initial load,
- mniejsze warianty obrazow w sekcji solutions,
- mniej transferu bez recznej rekompresji plikow z `public/media`.

### 8. Anchor navigation na root homepage

Plik:

- `src/components/new/HeaderNew.tsx`

Zmiany:

- klikniecia w linki typu `/pl/#about` na root homepage przewijaja lokalnie zamiast wykonywac niepotrzebna nawigacje do `/pl`.

Oczekiwany efekt:

- mniej sztucznych przejsc i mniej pracy route transition na stronie glownej.

## Rzeczy nadal do zrobienia

1. Uruchomic `npm run build:next`.

   Build byl dwa razy przerywany w trakcie, wiec zmiany nie sa jeszcze potwierdzone kompilacja.

2. Po deployu ponownie sprawdzic PageSpeed dla:

   - `https://appcrates.pl`,
   - `https://appcrates.pl/pl`.

3. Rozwazyc dalsze rozbicie homepage.

   Najwiekszy kolejny zysk da przeniesienie czesci sekcji z client components do server components albo ladowanie ponizej-foldowych sekcji dopiero po wejsciu w viewport.

4. Ponownie sprawdzic obrazy `public/media/solutions/*` w PSI.

   Czesc problemu zostala usunieta kodowo przez `next/image`, lazy rendering mega menu i nizsze `quality`. Jesli PSI nadal wskaze te obrazy, kolejnym krokiem bedzie doprecyzowanie `sizes` albo warunkowe ladowanie sekcji ponizej foldu.

5. Rozwazyc lazy chat globalnie.

   Homepage ma juz opozniony chat, ale inne strony nadal importuja `ChatWidget` bezposrednio. Dla spójności mozna wprowadzic jeden `LazyChatWidget` i podmienic go wszedzie.

## Status walidacji

- Code review i zmiany zostaly wykonane lokalnie.
- Build nie zostal potwierdzony, bo proces `npm run build:next` zostal przerwany.
- Po buildzie i deployu nalezy porownac PSI oraz realny waterfall dla root URL bez redirectu.
