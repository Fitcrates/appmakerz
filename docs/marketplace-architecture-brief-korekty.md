# Korekty do briefu przewodnika architektonicznego

Brief `marketplace-operations-guide-ai-brief.md` w obecnej formie wymusza publikację
odtwarzalnych szczegółów implementacyjnych Artovni. Poniżej sekcje do podmiany.

Zasada nadrzędna, do wklejenia na początek briefu:

> Repozytorium jest źródłem **osądu**, nie źródłem **artefaktów**. Czytasz kod po to,
> żeby wiedzieć, co jest prawdą i co się sprawdza. Nie publikujesz tego, co przeczytałeś.
>
> Test przed każdym akapitem: czy czytelnik po tym rozdziale wie, jaką decyzję podjąć
> i dlaczego, ale nadal musi sam zaprojektować swój system? Jeśli może pominąć pracę
> projektową, ujawniłeś za dużo.

---

## Zamiast §1.1 "Use the repository as primary implementation evidence"

### 1.1 Repozytorium jako źródło osądu

Przed napisaniem rozdziału zbadaj odpowiedni fragment kodu, żeby ustalić:

1. jaki problem biznesowy rozwiązuje to podejście,
2. na jakich założeniach stoi,
3. co jest wzorcem uniwersalnym, a co decyzją tego konkretnego biznesu,
4. co jest kompromisem, a nie dobrą praktyką,
5. przy jakiej skali albo jakim zdarzeniu wzorzec przestaje wystarczać.

Wynik badania trafia do rozdziału jako **wniosek**, nigdy jako materiał źródłowy.

**Nie publikuj:**

- nazw modułów, encji, modeli, pól i tabel z repozytorium,
- interfejsów TypeScript, schematów bazy, migracji,
- ścieżek API, nazw zdarzeń, tematów webhooków, kluczy idempotencji,
- list kroków workflow przepisanych jeden do jednego,
- wartości konfiguracyjnych, które są regułą biznesową (progi, okna wstrzymania,
  stawki, limity współbieżności, czasy dzierżawy).

**Możesz publikować:**

- decyzję i powód, dla którego została podjęta,
- kompromis, który za nią stoi, i jego cenę,
- diagram na poziomie ogólności, do którego doszedłby samodzielnie każdy kompetentny
  architekt,
- klasę problemu, który pojawia się przy wzroście, bez wskazywania, gdzie konkretnie
  siedzi w tym systemie.

---

## Zamiast §1.2 "Prefer real implementation examples"

### 1.2 Przykłady na poziomie wzorca, nie implementacji

Przykład ma tłumaczyć decyzję projektową, a nie dostarczać materiał do skopiowania.

Preferuj:

- opis relacji między pojęciami domenowymi ("zamówienie musi znać sprzedawcę linii,
  a nie tylko sprzedawcę zamówienia"),
- diagram stanów nazwany ogólnie, bez nazw z kodu,
- porównanie dwóch podejść i konsekwencji każdego,
- pseudokod ilustrujący regułę, jeśli reguły nie da się opisać zdaniem.

Nie wklejaj schematów, interfejsów, kształtów payloadów ani przykładów API
pochodzących z repozytorium.

---

## Zamiast sekcji "Reference implementation" w strukturze rozdziału

### Co sprawdza się w praktyce

Narracyjnie, bez kodu. Opisz, które podejście okazało się trafne przy prowadzeniu
systemu na produkcji i dlaczego, oraz czego brakowało w pierwszej wersji.

Atrybucja:

- Tak: "W systemie, który prowadzę na produkcji, sprawdziło się rozdzielenie..."
- Tak: "Jedna z praktycznych implementacji przyjmuje, że..."
- Nie: "W Artovni moduł X przechowuje pole Y..."

Nie nazywaj systemu z imienia w kontekście szczegółów technicznych. Nazwa może paść
tam, gdzie mowa o doświadczeniu, nie tam, gdzie mowa o budowie.

---

## Zamiast §5 krok 5 "Identify weak points. Do not hide them."

### Krok 5. Nazwij granicę wzorca, nie słabość systemu

Rozdział zyskuje na wiarygodności, gdy mówi, kiedy dane podejście przestaje
wystarczać. Nie zyskuje, gdy wskazuje słabe miejsca konkretnego wdrożenia.

- Tak: "Ten wzorzec przestaje wystarczać, gdy w koszyku pojawia się drugi sprzedawca."
- Nie: "Obecna implementacja nie radzi sobie z X i wymaga przepisania Y."

Publiczne wskazywanie słabości własnego systemu produkcyjnego jest jednocześnie
podpowiedzią dla konkurencji i obciążeniem sprzedażowym. Ta sama wiedza podana jako
granica wzorca jest dla czytelnika równie użyteczna.

---

## Do usunięcia z rozdziałów 5 i 18

Fragmenty typu "Document actual mapping, credentials, sync items, webhook handling,
retry strategy and source-of-truth assumptions".

Zastąpić: "Wyjaśnij, jakie decyzje trzeba podjąć przy mapowaniu identyfikatorów,
obsłudze powtórzonych dostarczeń i ustaleniu źródła prawdy, oraz jakie są konsekwencje
każdego wyboru."
