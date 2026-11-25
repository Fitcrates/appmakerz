# Portable Text w AppCrates

Treści wpisów, sekcji projektów i stron to tablice bloków Portable Text. Każdy element tablicy, każdy span i każdy wpis w `markDefs` ma `_key`: krótki, unikalny w obrębie tablicy ciąg, np. `"p1a"`, `"h2b"`. Brak `_key` psuje edycję w Studio.

## Co wolno w którym polu

Pola mają różne zestawy bloków. Element spoza listy da dokument niezgodny ze schematem.

| Pole | Style bloków | Link | Inne elementy |
|---|---|---|---|
| `post.body.*`, `project.body.*` | `normal`, `h2`, `h3`, `h4`, `blockquote` | tak | `image` (`alt`, `caption`), `gallery`, `blogTable`, `code` |
| Rich text w `project.sections` (np. `projectRichText`) | `normal`, `h2`, `h3`, `h4`, `blockquote` | tak | `image` (`alt`, `caption`), `gallery`, `blogTable`, `code` (dodatkowo `sql`) |
| `serviceLanding.content.*` | domyślne style Sanity, używaj `normal`, `h2`, `h3`, `blockquote` | tak (domyślna adnotacja `link`) | `image` (tylko `alt`), `blogTable` |
| `pages.content.*` | domyślne style Sanity, używaj `normal`, `h2`, `h3`, `blockquote` | tak (domyślna adnotacja `link`) | `image` (bez `alt` i `caption`) |

Przed pisaniem do innego pola niż w tabeli sprawdź jego definicję przez `schema_type_get` albo w `sanity.studio/schemas/`.

## Akapit, nagłówek, pogrubienie, link

```json
[
  {
    "_type": "block",
    "_key": "h2a",
    "style": "h2",
    "markDefs": [],
    "children": [{ "_type": "span", "_key": "h2a0", "text": "Ile to kosztuje?", "marks": [] }]
  },
  {
    "_type": "block",
    "_key": "p1a",
    "style": "normal",
    "markDefs": [{ "_type": "link", "_key": "lnk1", "href": "https://appcrates.pl/pl/kalkulator" }],
    "children": [
      { "_type": "span", "_key": "p1a0", "text": "Koszt zależy od ", "marks": [] },
      { "_type": "span", "_key": "p1a1", "text": "liczby integracji", "marks": ["strong"] },
      { "_type": "span", "_key": "p1a2", "text": ". Orientacyjną kwotę policzysz w ", "marks": [] },
      { "_type": "span", "_key": "p1a3", "text": "kalkulatorze", "marks": ["lnk1"] },
      { "_type": "span", "_key": "p1a4", "text": ".", "marks": [] }
    ]
  }
]
```

- Style bloków: `normal`, `h2`, `h3`, `h4`, `blockquote`. Nie używaj `h1`, tytuł wpisu jest już nagłówkiem H1 strony.
- Dekoratory w `marks`: `strong`, `em`, `code`.
- Link to wpis w `markDefs` z typem `link` i polem `href`, a span odwołuje się do jego `_key`.
- `href` ma typ `url`, który przyjmuje tylko pełne adresy `http(s)://`. Ścieżka względna (`/pl/...`) nie przejdzie walidacji i Studio nie pozwoli opublikować dokumentu. Linki do własnych stron pisz jako `https://appcrates.pl/<język>/...`, z językiem zgodnym z wersją tekstu.

## Lista

```json
{
  "_type": "block",
  "_key": "li1",
  "style": "normal",
  "listItem": "bullet",
  "level": 1,
  "markDefs": [],
  "children": [{ "_type": "span", "_key": "li1a", "text": "Płatności: Stripe, PayU, Przelewy24, BLIK i inne.", "marks": [] }]
}
```

Każdy punkt listy to osobny blok. Lista numerowana: `"listItem": "number"`.

## Tabela (`blogTable`)

```json
{
  "_type": "blogTable",
  "_key": "tbl1",
  "caption": "Porównanie modeli",
  "headerRow": true,
  "rows": [
    { "_type": "tableRow", "_key": "r0", "cells": ["Model", "Dla kogo", "Czas wdrożenia"] },
    { "_type": "tableRow", "_key": "r1", "cells": ["Marketplace", "Wielu sprzedawców", "Według wyceny"] }
  ]
}
```

Wszystkie wiersze mają tyle samo komórek.

## Blok kodu (`code`)

```json
{ "_type": "code", "_key": "c1", "language": "typescript", "code": "const x = 1;" }
```

Języki: `javascript`, `html`, `css`, `typescript`, `jsx`, `tsx`, `python`, `php`, `json`, `bash`.

## Obraz w treści

```json
{
  "_type": "image",
  "_key": "img1",
  "asset": { "_type": "reference", "_ref": "image-<hash>-<w>x<h>-<ext>" },
  "alt": "Opis tego, co widać na obrazie",
  "caption": "Opcjonalny podpis"
}
```

Pola `alt` i `caption` dodawaj tylko tam, gdzie pole je definiuje (tabela wyżej). `_ref` dostajesz z wyniku wgrania pliku (`dataset_assets_upload_from_url` albo `..._from_file`). Nie wymyślaj identyfikatorów zasobów.

## Edycja istniejącej treści

Do zmiany jednego akapitu użyj w `patch_documents` ścieżki z kluczem bloku, np. `body.pl[_key=="p1a"]`, zamiast podmieniać całą tablicę. Całą tablicę `body.pl` podmieniaj tylko przy przepisaniu całego wpisu.
