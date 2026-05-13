# Podsumowanie konsolidacji AI – obecny stan

## Co zrobiono

### 1. Rejestr schem AI
- **Nowy plik**: `sanity.studio/components/ai-registry.ts`
- Zawiera `AI_SCHEMA_REGISTRY` z definicją pola `post`.
- Każde pole ma: `path`, `title`, `kind` (`string` | `text` | `portableText` | `stringArray` | `faq`), `group`, `maxLength`.
- Dostępne presety: `document`, `body`, `seo`, `summary`, `faq`, `taxonomy`.
- Funkcje pomocnicze: `resolveAiTargetFieldPath`, `resolveAiTargetFields`, `getAiPresetEntries`.

### 2. Preferencje dokumentowe (model per typ dokumentu)
- **Nowy plik**: `sanity.studio/components/AiDocumentPreferences.tsx`
- Model AI jest zapisywany w `localStorage` pod kluczem `appcrates.ai.preferences.{docType}`.
- Synchronizacja między zakładkami przez `CustomEvent` i `storage`.
- Pole `aiContext` jest częścią dokumentu (nie localStorage).

### 3. Picker modelu AI
- **Nowy plik**: `sanity.studio/components/AiModelPicker.tsx`
- Pobiera listę modeli z endpointu `GET /api/ai-generate`.
- Wybiera domyślny model jeśli brak zapisanej preferencji.

### 4. Kontekst AI na poziomie dokumentu
- **Nowe pole schemy**: `sanity.studio/schemas/aiContextField.ts`
- Typ: `text`, 6 wierszy, max 4000 znaków.
- Zawiera własny input (`AiContextInput`) osadzający picker modelu bezpośrednio pod polem.
- W `post.ts` pole `aiContext` jest na górze schemy i renderuje się jako `AIWholePostGenerator` (panel Asystenta AI).

### 5. Uproszczony input field-level
- **Zmieniony plik**: `sanity.studio/components/AIGeneratorInput.tsx`
- Usunięto lokalne pickery provider/model.
- Przycisk „Generuj pole” używa:
  - `useAiDocumentPreferences` (model z localStorage),
  - `resolveAiTargetFieldPath` (registry),
  - `callStructuredAi` (unified endpoint).
- Wysyła tylko jedno pole w `targetFields`.

### 6. Panel Asystenta AI (document-level)
- **Nowy plik**: `sanity.studio/components/AiDocumentAssistantPanel.tsx`
- Zastąpił legacy `AIWholePostGenerator` (stary czat z auto-referencjami został usunięty).
- Funkcje:
  - Wybór presetu (document, body, seo, summary, faq, taxonomy, custom).
  - Checkboxy do wyboru pól w trybie custom.
  - Dodatkowa instrukcja użytkownika.
  - Generowanie propozycji → przegląd → „Zastosuj zmiany” (commit patch przez Sanity client).
  - Nie pobiera automatycznie starych dokumentów jako kontekst.

### 7. Normalizacja outputu AI
- **Nowy plik**: `sanity.studio/components/structured-output.ts`
- `normalizeFieldValue` obsługuje wszystkie `kind` z registry.
- `normalizePortableText` zachowuje strukturę bloków Sanity.
- `normalizeFaqItems` dodaje `_key` i czyści puste wpisy.
- `buildSetPatchFromFieldValues` używa **flat keys** (np. `title.en`) – bezpieczne dla Sanity `.set()`.

### 8. Backend – jeden endpoint
- **Zmieniony plik**: `netlify/edge-functions/ai-generate.js`
- `GET` – zwraca `availableModels` i `defaultModel` z katalogu `MODEL_CATALOG`.
- `POST mode: "document-chat"` – nowy tryb:
  - Buduje prompt z `aiContext`, `currentDocument`, allowlist pól i dodatkowej instrukcji.
  - Wymusza `response_format: { type: "json_object" }` (OpenAI) / odpowiednik.
  - Normalizuje `fieldValues`, filtruje tylko dozwolone ścieżki.
  - Zwraca `assistantMessage`, `resolvedTargetFields`, `fieldValues`.
- **Fallback**: stary tryb `prompt`/`systemPrompt` jest nadal obsługiwany dla kompatybilności.

### 9. FAQ w blog poście
- **Schema**: `post.ts` ma nowe pole `faq` (`object` z `en` i `pl`, każde to array `{ question, answer }`).
- **Sanity query**: `sanity.server.ts` pobiera `faq { en, pl }` w `getPost`.
- **Render Next.js**: `src/app/blog/[slug]/page.tsx`:
  - Import `FaqAccordionList`.
  - Pobiera FAQ przez `getLocalizedArray`.
  - Renderuje sekcję FAQ pod treścią artykułu.
  - Dodaje `FAQPage` structured data (`schema.org`).

## Pliki, które powstały lub zostały znacząco zmienione

| Plik | Status |
|------|--------|
| `sanity.studio/components/ai-registry.ts` | Nowy |
| `sanity.studio/components/AiDocumentPreferences.tsx` | Nowy |
| `sanity.studio/components/ai-request.ts` | Nowy |
| `sanity.studio/components/AiModelPicker.tsx` | Nowy |
| `sanity.studio/components/AiContextInput.tsx` | Nowy |
| `sanity.studio/components/AiDocumentAssistantPanel.tsx` | Nowy |
| `sanity.studio/components/structured-output.ts` | Nowy |
| `sanity.studio/schemas/aiContextField.ts` | Nowy |
| `sanity.studio/schemas/documents/post.ts` | Zmieniony (aiContext, FAQ, AI inputy) |
| `sanity.studio/components/AIGeneratorInput.tsx` | Przepisany (uproszczony) |
| `sanity.studio/components/AIWholePostGenerator.tsx` | Przepisany (wrapper na nowy panel) |
| `netlify/edge-functions/ai-generate.js` | Przepisany (registry + document-chat + GET) |
| `src/lib/sanity.server.ts` | Zmieniony (faq w query) |
| `src/app/blog/[slug]/page.tsx` | Zmieniony (render FAQ + schema) |

## Walidacja

- `npx tsc --noEmit` – **czysto** (exit code 0).
- `npm run build -- --no-lint` (Next.js) – **przeszedł** (14/14 stron, brak błędów kompilacji).

## Co pozostaje (rekomendacje)

1. **Dodać `post.faq` do typów** w `src/types/sanity.types.ts` (dla kompletności TypeScript na frontendzie).
2. **Przetestować end-to-end** w Sanity Studio:
   - Upewnić się, że `AiModelPicker` ładuje modele z local edge function.
   - Sprawdzić, czy przycisk „Zastosuj zmiany” w panelu Asystenta poprawnie zapisuje pola per-language bez nadpisywania drugiego języka.
3. **Rozszerzyć registry** na `project` i `serviceLanding` jeśli mają korzystać z tej samej architektury.
4. **Usunąć lub zarchiwizować** stary kod `AIWholePostGenerator` (legacy czat z referencjami) jeśli nowy panel działa stabilnie – obecnie został całkowicie zastąpony.
