# On-demand revalidation — Sanity webhook

Endpoint: `POST /api/revalidate`

## Co robi

Po opublikowaniu / aktualizacji / usunięciu dokumentu w Sanity Studio, webhook wysyła żądanie POST na ten endpoint. Next.js unieważnia cache (`revalidateTag` + `revalidatePath`) dla stron powiązanych ze zmienionym dokumentem.

## Zabezpieczenie

Żądanie musi zawierać poprawny nagłówek `sanity-webhook-signature`. Podpis jest weryfikowany przez HMAC-SHA256 z użyciem `SANITY_WEBHOOK_SECRET`. Nieprawidłowy podpis → `401 Unauthorized`.

## Wymagane tagi cache

| Funkcja | Tagi | Ścieżki |
|---|---|---|
| `getPosts` | `posts`, `blog` | `/blog` |
| `getPost(slug)` | `post`, `<slug>` | `/blog/<slug>` |
| `getPopularPosts` | `posts` | — |
| `getProjects` | `projects` | `/project` |
| `getProject(slug)` | `project`, `<slug>` | `/project/<slug>` |
| `getServiceLanding(slug)` | `service-landing`, `<slug>` | `/uslugi/<slug>` |
| `getServiceLandings` | `service-landings` | — |
| `getAboutMe` | `about-me` | `/about-me` |
| `getSitemapEntries` | `posts`, `projects`, `service-landings`, `sitemap` | `/sitemap.xml` |

## Konfiguracja w Sanity Studio

1. Przejdź do **Settings → API → Webhooks**.
2. Kliknij **Add webhook**.
3. Uzupełnij pola:
   - **URL:** `https://<twoja-domena>/api/revalidate`
   - **Dataset:** `* (all datasets)` lub konkretny
   - **Trigger on:** ☑️ Create, ☑️ Update, ☑️ Delete
   - **Filter (GROQ):**
     ```groq
     _type in ["post", "project", "serviceLanding", "aboutMe"]
     ```
   - **Projection (opcjonalnie, dla mniejszego payloadu):**
     ```groq
     {
       _type,
       slug {
         current
       }
     }
     ```
   - **HTTP Method:** `POST`
   - **Secret:** wygeneruj silny secret i skopiuj go do `.env` jako `SANITY_WEBHOOK_SECRET`
4. Zapisz.

## Zmienne środowiskowe

```env
SANITY_WEBHOOK_SECRET=twoj-sekret-z-sanity-studio
```

Po wdrożeniu na produkcję, opublikowanie posta w Sanity spowoduje natychmiastową rewalidację `/blog` — nowy post pojawi się na liście bez czekania na wygaśnięcie cache (1h).
