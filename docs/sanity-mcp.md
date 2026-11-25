# Treści w Sanity z czatu (Sanity MCP)

Treści w Sanity możesz pisać i poprawiać z czatu w Claude Code, T3 Code, Codexie albo w aplikacji Claude. Wszystkie korzystają z serwera MCP Sanity (`https://mcp.sanity.io`) i ze skilla `sanity-content`, który zna nasze typy dokumentów i zasady pisania.

Model zapisuje **wyłącznie drafty**. Publikujesz Ty, w Studio, po przejrzeniu tekstu.

## Dlaczego publikacja jest zablokowana

Publikacja dokumentu `post` uruchamia webhook `netlify/functions/handlePostPublish.ts`, który od razu wysyła newsletter do subskrybentów. Każda publikacja przebudowuje też stronę (`/api/revalidate`) i zgłasza adresy do IndexNow. Pomyłki modelu nie da się wtedy cofnąć.

Zablokowane narzędzia (te same w `.claude/settings.json` i `.codex/config.toml`):

| Grupa | Narzędzia |
|---|---|
| Publikacja i kasowanie | `publish_documents`, `unpublish_documents`, `discard_drafts`, `version_discard` |
| Schemat i Studio | `deploy_schema`, `undeploy_schema`, `deploy_studio`, `schema_fields_patch`, `schema_types_delete` |
| Projekt, datasety, CORS | `create_project`, `create_dataset`, `update_dataset`, `add_cors_origin`, `cors_origins_delete` |
| CLI | `run_sanity_cli` |
| Media Library (zapis od razu na żywo) | `media_library_create_documents`, `media_library_patch_documents`, `media_library_publish_documents`, `media_library_discard_drafts` |

Po każdej zmianie list uruchom `npm run check:sanity-mcp`, który sprawdza, czy obie listy są zgodne.

## Konfiguracja

### Claude Code i T3 Code

Nic nie trzeba dodawać. Serwer jest w `.mcp.json` i zatwierdzony w `.claude/settings.json`, a skill leży w `.claude/skills/sanity-content/`.

1. Otwórz sesję w tym repo i wpisz `/mcp`.
2. Wybierz `sanity` i zaloguj się przez przeglądarkę (OAuth, sesja ważna ok. 7 dni).

Nie dodawaj drugiego serwera Sanity w zasięgu użytkownika (`claude mcp add ... --scope user` albo `npx sanity mcp configure`). Pod inną nazwą niż `sanity` albo `Sanity` blokady z `.claude/settings.json` by go nie objęły.

### Codex

Serwer jest w `.codex/config.toml`, a skill w `.agents/skills/sanity-content/`.

1. Oznacz projekt jako zaufany, bo inaczej Codex pominie `.codex/config.toml`.
2. Uruchom `codex mcp login sanity` i zaloguj się w przeglądarce.

Tu też nie dodawaj globalnego serwera przez `npx sanity mcp configure`, bo nie miałby listy `disabled_tools`.

### Aplikacja Claude (claude.ai, Desktop)

Konfiguracja z repo tu nie działa, trzeba ją zrobić ręcznie.

1. Settings > Connectors > Add custom connector, adres `https://mcp.sanity.io`, zaloguj się.
2. W ustawieniach konektora wyłącz narzędzia z tabeli wyżej.
3. Spakuj skill i wgraj go w Settings > Capabilities > Skills:
   ```powershell
   Compress-Archive -Path .agents/skills/sanity-content -DestinationPath sanity-content.zip -Force
   ```
   Po każdej zmianie skilla wgraj nową paczkę.

W aplikacji model nie widzi repo, więc schemat czyta przez `get_schema` i nie podaje kwot (nie ma dostępu do `src/data/pricing-config.json`).

## Jak pracować

- „Napisz wpis o migracji z WooCommerce na Medusę, kategoria e-commerce, powiąż z usługą Medusa”.
- „Popraw excerpt i meta description we wpisie `<slug>`, oba języki”.
- „Przetłumacz na angielski FAQ na stronie usługi `<slug>`”.

Model:

1. sprawdza, czy podobna treść już istnieje,
2. zapisuje draft (`drafts.<id>`),
3. podaje typ i id dokumentu.

Ty otwierasz draft w Studio, przeglądasz, uzupełniasz obraz i publikujesz.

## Schemat

Serwer MCP sprawdza dokumenty względem **wdrożonego** schematu. `npm run sanity-deploy` wdraża Studio razem ze schematem. Jeśli zmienisz schemat bez wdrażania Studio, uruchom `npm run sanity:schema-deploy`. Bez tego model będzie pisał według starych pól.

## Ograniczenia

- Logowanie OAuth daje modelowi Twoje uprawnienia w projekcie. Narzędzia do odczytu mogą sięgnąć po każdy typ, także `subscriber` (adresy e-mail). Skill tego zabrania, ale technicznie to nie jest blokada. Twardą granicę daje dopiero token z rolą ograniczoną do potrzebnych typów (własne role wymagają odpowiedniego planu Sanity), podany w nagłówku `Authorization` zamiast OAuth.
- MCP sprawdza strukturę dokumentu względem wdrożonego schematu, ale pomija reguły walidacji ze Studio (limity znaków, formaty, unikalność). Skill ma listę kontrolną, ale przejrzyj draft przed publikacją. Studio pokaże błędy walidacji dopiero przy otwarciu draftu.
- Pole `href` w linkach ma typ `url`, więc skill każe pisać linki do własnych stron jako pełne adresy (`https://appcrates.pl/pl/...`). Renderer bloga otwiera każdy adres zaczynający się od `http` w nowej karcie, także linki do appcrates.pl.
- Ustawienie przyszłej daty `publishedAt` nie planuje newslettera. Webhook przy publikacji pomija taki wpis i nic go nie wyśle później.
- Sanity Context (endpointy MCP i Knowledge Bases w zakładce Context) służy tylko do odczytu. Do zapisu się nie nadaje i ta konfiguracja go nie używa.
