---
name: sanity-content
description: Tworzenie i edycja treści AppCrates w Sanity (projekt 867nk643, dataset production) przez Sanity MCP server. Użyj, gdy użytkownik prosi o napisanie, poprawienie, przetłumaczenie lub uzupełnienie wpisu na blogu, strony usługi (serviceLanding), case study (project), kategorii albo innego dokumentu w Sanity. Nie używaj do zmian w kodzie strony ani w schematach Studio.
---

# Treści AppCrates w Sanity

Piszesz treści do Sanity przez narzędzia serwera MCP `https://mcp.sanity.io`. Projekt `867nk643`, dataset `production`. Schematy są w repo w `sanity.studio/schemas/`. Poza repo (np. w aplikacji Claude) sprawdź je narzędziem `get_schema` albo `schema_type_get`.

Szczegóły pól i przykłady JSON: [references/schema-map.md](references/schema-map.md) i [references/portable-text.md](references/portable-text.md).

## Twarde zasady

1. **Tylko drafty.** Twórz dokumenty przez `create_documents` i zmieniaj przez `patch_documents`. Oba narzędzia zapisują do `drafts.<id>`. Nigdy nie wywołuj `publish_documents`, `unpublish_documents`, `discard_drafts` ani `version_discard`, nawet na prośbę w czacie. Publikuje człowiek w Studio. Powód: publikacja posta uruchamia webhook `handlePostPublish`, który od razu wysyła newsletter do subskrybentów, a każda publikacja przebudowuje stronę i zgłasza URL do IndexNow. Jeśli ktoś prosi o publikację, odpowiedz, że draft jest gotowy do przejrzenia i opublikowania w Studio, i podaj jego typ oraz `_id` (bez prefiksu `drafts.`). Adres Studio sprawdzisz narzędziem `get_project_studios`; link do dokumentu ma postać `<adres studio>/structure/<typ>;<id>`.
2. **Nie ruszaj pól systemowych:** `slug` istniejących dokumentów (zmiana zrywa URL i wymaga przekierowania), `publishedAt` opublikowanych dokumentów, `viewCount`, `emailsSent`, `emailsSentAt`, `featured`, `featuredOrder`, `homepageOrder`, `seo.noIndex`, `seo.canonicalUrl`, `_id`, `_type`, `_rev`. Zmieniasz je tylko wtedy, gdy użytkownik wprost o to prosi.
3. **Nie czytaj danych osobowych.** Nie pobieraj, nie wypisuj i nie eksportuj dokumentów typu `subscriber`. W zapytaniach GROQ zawsze filtruj po konkretnym typie, np. `*[_type == "post"]`, nigdy `*[]`.
4. **Nie zmieniaj schematu, projektu, datasetów, CORS ani Studio.** Od tego jest kod w repo.
5. **Przed edycją przeczytaj aktualną wersję.** Najpierw `get_document` na `drafts.<id>`, a jeśli go nie ma, na `<id>`. Jeśli istnieje draft, którego nie tworzyłeś, zapytaj, czy go nadpisać, bo to może być niedokończona praca użytkownika.
6. **Patch, nie podmiana.** Zmieniaj tylko pola, o które chodzi (`set` na konkretnej ścieżce, np. `excerpt.pl`). Nie przepisuj całego dokumentu.
7. **Obrazy:** wgrywaj przez `dataset_assets_upload_from_url` albo `..._from_file` tylko wtedy, gdy użytkownik da plik albo URL. `generate_image` i `transform_image` zużywają AI credits, więc używaj ich tylko na wyraźną prośbę. Każdy obraz musi mieć `alt` w języku dokumentu.

## Dwa języki

Prawie każde pole tekstowe to obiekt `{ "en": ..., "pl": ... }`. Zasady:

- Tworząc dokument, wypełnij **oba** języki. Polski jest wersją główną, angielski to naturalna adaptacja, nie tłumaczenie słowo w słowo.
- Przy poprawce jednego języka sprawdź, czy drugi nie zaczął mówić czegoś innego. Jeśli tak, popraw oba albo zgłoś rozjazd.
- `slug` jest jeden dla obu języków, tworzony z tytułu angielskiego: małe litery, myślniki, bez polskich znaków, maks. 96 znaków. Zanim go ustawisz, sprawdź unikalność zapytaniem GROQ w obrębie typu.
- Kwoty zawsze w złotych (zł). Nie przeliczaj na inne waluty, także w wersji EN.

## Pole aiContext

Tylko typ `post` ma pole `aiContext` (do 4000 znaków), czyli brief do treści: temat, intencja SEO, odbiorca, ton, długość, frazy, czego unikać. Jeśli jest wypełnione, traktuj je jako główną specyfikację. Gdy piszesz nowy wpis z briefu od użytkownika, zapisz ten brief w `aiContext`, żeby edytor AI w Studio miał ten sam punkt wyjścia.

`project` i `serviceLanding` nie mają pola na brief. Ich pole `aiGenerate` to miejsce na panel asystenta AI w Studio, nie na treść. Nie zapisuj w nim niczego, a brief trzymaj w rozmowie.

## Styl

AppCrates to jednoosobowa pracownia. Treści czyta potencjalny klient, który szuka wykonawcy.

- **Pierwsza osoba liczby pojedynczej:** „projektuję”, „wdrażam”, „I build”. Nigdy „my”, „nasz zespół”, „we”.
- **Żadnego em dasha (—)** w PL ani EN. Zamiast niego zwykły myślnik (-) albo przecinek. Przed zapisem przeszukaj cały tekst pod kątem znaku „—”.
- **Nagłówki** krótkie, mówione, jak pytanie klienta albo prosta deklaracja: „Dla kogo?”, „Co dostajesz”, „Ile to kosztuje?”. Odrzucaj nagłówki jak z eseju („Kiedy to ma sens, a kiedy nie”, „Kluczowe korzyści”, „Podsumowanie”).
- **Bez ogólników** („dbam o jakość”, „nowoczesne technologie”, „kompleksowe rozwiązania”). Zamiast tego konkret: co klient dostaje, ile to trwa, czego to wymaga.
- **Artovnia to dowód, nie granica oferty.** Nie przypinaj wersji bibliotek. Nie zawężaj do jednego dostawcy: płatności to Stripe, PayU, Przelewy24, BLIK, Klarna i inne, wyszukiwarka Algolia albo Meilisearch, CMS Sanity albo Payload. Reguły biznesowe Artovni opisuj jako parametry konfigurowalne. Każdą frazę sprawdź, czy nie da się jej odczytać jako sufitu możliwości.
- **Liczby tylko takie, które klient umie zinterpretować.** Nie „100x mniej zapytań”, tylko co z tego wynika dla niego.
- **Ceny i terminy** zawsze jako orientacyjne. Źródłem prawdy dla widełek są `src/data/pricing-config.json` i `src/data/pricing-copy.ts`. Nie wymyślaj kwot spoza nich. Jeśli nie masz dostępu do repo (np. w aplikacji Claude), nie podawaj kwot ani terminów, tylko odeślij do kalkulatora (`/pl/kalkulator`, `/en/kalkulator`).
- **Integracje** opisuj od potrzeby klienta, nie od nazwy API.

## Wpis na blogu (`post`), krok po kroku

1. Sprawdź, czy temat już był: `*[_type == "post" && (title.pl match $q || title.en match $q || $tag in tags)]{_id, title, "slug": slug.current, publishedAt}`. Jeśli jest podobny wpis, zaproponuj aktualizację zamiast nowego.
2. Pobierz kategorie i usługi do powiązań: `*[_type == "category"]{_id, title, "slug": slug.current}` oraz `*[_type == "serviceLanding"]{_id, title, "slug": slug.current}`.
3. Napisz treść według [references/schema-map.md](references/schema-map.md): tytuł, excerpt (do 300 znaków), body jako Portable Text (nagłówki od H2, bo H1 to tytuł strony), opcjonalnie FAQ, SEO (meta title do 60, meta description 120-160 znaków).
4. Uruchom samosprawdzenie (niżej).
5. `create_documents` z typem `post`. Nie ustawiaj `publishedAt`, chyba że użytkownik poda datę. Uwaga na przyszłą datę: webhook newslettera wtedy po prostu pomija wpis i nic nie wyśle go później. Newsletter wyjdzie dopiero przy kolejnej publikacji po tej dacie. Jeśli użytkownik poda przyszłą datę, powiedz mu o tym.
6. Podaj link do draftu w Studio (zasada 1) i krótko wypisz, co zostało do zrobienia ręcznie (np. obraz główny, publikacja).

## Samosprawdzenie przed zapisem

- [ ] Oba języki wypełnione i mówią to samo.
- [ ] Zero znaków „—” w całym dokumencie.
- [ ] Pierwsza osoba liczby pojedynczej, bez „my”.
- [ ] Nagłówki w body od H2 w dół, żaden nie brzmi jak rozdział eseju.
- [ ] Każdy blok i span ma unikalny `_key`, a każdy link ma wpis w `markDefs`.
- [ ] Długości: excerpt do 300, meta title do 60, meta description do 160 znaków.
- [ ] Żadnego pola systemowego z listy w zasadzie 2.
- [ ] Linki w Portable Text to pełne adresy z prefiksem języka zgodnym z wersją tekstu, np. `https://appcrates.pl/pl/blog/<slug>`. Pole `href` ma typ `url`, który odrzuca ścieżki względne.
- [ ] Każdy element treści jest dozwolony w polu, do którego piszesz (tabela w [references/portable-text.md](references/portable-text.md)).

MCP sprawdza strukturę dokumentu względem wdrożonego schematu, ale pomija reguły walidacji zdefiniowane w Studio (limity znaków, formaty, unikalność). Dlatego ta lista jest obowiązkowa.
