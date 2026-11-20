# KdG – Je plek nog niet gevonden? (late start / februaristart)

Een webapp voor studiekiezers die nog willen instappen of heroriënteren. Met een paar vragen komen ze
bij de juiste studieloopbaancoördinator (SLC'er), bij aansluitende KdG-opleidingen of bij de tips voor
studiekeuze. De data komt uit Airtable en wordt **elk uur** automatisch ververst.

## Hoe het werkt

```
Airtable  ──(elk uur, GitHub Action met token uit Secrets)──>  data.json  ──(fetch)──>  widget.js  ──(script)──>  kdg.be
```

- `widget.js` — de webapp: opmaak en logica. Laadt `data.json` en `inhoud.json` uit dezelfde map.
- `inhoud.json` — **het bewerkbare document**: alle teksten, de vaste links en de uitzonderingen per opleiding.
- `data.json` — de gepubliceerde data. **Wordt automatisch overschreven** door de Action; niet manueel bewerken.
- `build-data.js` — haalt Airtable op en schrijft `data.json`. Het token komt uit een GitHub Secret en staat **nooit** in de gepubliceerde code.
- `index.html` — testpagina: toont de webapp zoals ze op GitHub Pages staat.
- `.github/workflows/update-data.yml` — draait `build-data.js` elk uur en commit `data.json` als de inhoud gewijzigd is.

> **Belangrijk:** `data.json` is publiek leesbaar. Er staan namen en mailadressen van SLC'ers in; dat is
> de bedoeling, want de webapp toont ze. Interne notities (keuzes met een vraagteken in "Startmomenten"
> en "Late inschrijving mogelijk tot") worden niet meegenomen.

## Embedden op kdg.be

Plak dit één keer in de pagina (source/HTML-modus). Daarna hoeft de pagina niet meer aangepast te worden:
data wijzig je in Airtable, teksten, links en uitzonderingen in `inhoud.json`, opmaak in `widget.js`.

```html
<div id="kdg-plek-root"></div>
<script src="https://kdg-marcom.github.io/late-start-webapp/widget.js" defer></script>
```

De webapp wordt in de pagina zelf opgebouwd (geen iframe) en erft dus het lettertype en de kopstijlen van kdg.be.

## Eenmalige setup

1. Zet deze bestanden in de repository `late-start-webapp` (branch `main`), met behoud van de map `.github/workflows/`.
2. **Airtable Personal Access Token** aanmaken (airtable.com → Builder hub → Personal access tokens):
   - scope: `data.records:read`
   - toegang: alleen de base *Opleidingsportfolio KdG V2* (`appBu1JAcv2ArUIDW`)
3. **Token als GitHub Secret** zetten: repo → Settings → Secrets and variables → Actions →
   *New repository secret* → naam **`AIRTABLE_TOKEN`**.
4. **GitHub Pages** aanzetten: repo → Settings → Pages → *Deploy from a branch*, branch `main`, map `/ (root)`.
   De testpagina staat dan op `https://kdg-marcom.github.io/late-start-webapp/`.
5. **Eerste run**: Actions-tab → *Update data.json* → *Run workflow*. Daarna draait hij vanzelf elk uur.

## Wat komt er uit Airtable

Base *Opleidingsportfolio KdG V2*. Tabellen en velden worden op ID aangesproken, dus een veld hernoemen breekt niets.

| In de webapp | Tabel | Veld |
|---|---|---|
| Opleiding, link naar de opleidingspagina | Opleidingsaanbod website | `title`, `webaddress` |
| Bachelor of graduaat | Opleidingsaanbod website | `Opleidingstype` |
| Thema's | Opleidingsaanbod website | `Interessegebied studiekiezers` |
| "Kan je nu nog starten?" | Opleidingsaanbod website | `Startmomenten`, `Late inschrijving mogelijk tot` |
| SLC'er en mailadres | Opleidingsaanbod website, _Contactpersonen | `SLC'er`, `SLC - E-mails` |
| Vorige opleiding → KdG-opleidingen | Vooropleidingen | naam, `Soort opleiding`, koppeling naar KdG-opleidingen |

Regels in `build-data.js`:

- **Alleen het aanbod van dit academiejaar**: veld `Academiejaar` moet 2026-2027 bevatten. Het jaar staat bovenaan het script (`ACADEMIEJAAR`) en moet elk jaar aangepast worden.
- **Keuzelijsten** ("Welke opleiding wil je volgen?" en de thema's): alle professionele, educatieve en academische bachelors en
  graduaten met een pagina op de Nederlandstalige site (`Website-taal` = nl). Engelstalige opleidingen staan er dus in met hun
  Nederlandstalige pagina, net als verkorte trajecten, trajecten voor werkstudenten en afstudeerstudio's.
  Andere pagina's kan je toevoegen via `extraInLijst` in `inhoud.json`.
- **Dubbele pagina's** met dezelfde titel worden één opleiding; de pagina op de Nederlandstalige site wint.
- **Vooropleidingen**: alle rijen, ook die met het vinkje "Na te kijken". Zonder gekoppelde KdG-opleiding
  toont de webapp het scherm "geen aansluitende opleiding".
- **SLC'er**: is `SLC - E-mails` het persoonlijke adres van één van de gekoppelde SLC'ers, dan staat alleen
  die naam erbij; bij een gedeelde mailbox alle namen. Zonder mailadres verwijst de webapp naar de opleidingspagina.
- **Namen** staan in Airtable als "Achternaam Voornaam"; het script draait ze om op basis van het mailadres.

"Kan je nu nog starten?" hangt af van `Late inschrijving mogelijk tot` en wordt in `widget.js` berekend op de dag zelf.
Een maand telt tot en met haar laatste dag.

| In Airtable | Tekst (sleutel in `inhoud.json`) |
|---|---|
| Februari ZONDER | `startFebZonder` |
| Andere maand ZONDER, nog niet voorbij | `startZonder` |
| Maand MET, nog niet voorbij | `startMet` |
| "Niet meer mogelijk", of alle maanden voorbij | `startDicht` |
| Leeg, of alleen een keuze met vraagteken | `startOnbekend` |

Bij meerdere keuzes geldt eerst de keuze zonder studietijdverlies, anders de laatste maand met studietijdverlies.
Keuzes met een vraagteken zijn interne notities: ze tellen niet mee en komen niet in `data.json`.

## Teksten, links en uitzonderingen aanpassen: `inhoud.json`

Open `inhoud.json` op GitHub, klik op het potlood, pas aan en klik op **Commit changes**. Binnen enkele minuten staat het live.

Het bestand heeft vier delen:

- `teksten` — alle vragen, titels, zinnen en knopteksten. Woorden tussen accolades, zoals `{naam}` of `{opleiding}`, vult de webapp zelf in.
- `links` — de vaste links. `url` leeg = nog geen link; een url die met `/` begint, is een pagina op kdg.be; een url die met `#` begint, is een springlink op de pagina zelf en krijgt vanzelf de class `page-scroll`. Links openen altijd in hetzelfde venster. Met `perSoort` hangt de link af van het soort opleiding.
- `extraInLijst` — opleidingspagina's die normaal niet in de keuzelijsten staan (bv. een bachelor-na-bachelor) maar er toch in moeten.
- `uitzonderingen` — extra info voor bepaalde opleidingen. Elke uitzondering heeft een lijst `opleidingen` (titel exact zoals in Airtable) en een of meer van deze onderdelen:

| Onderdeel | Effect op het scherm van die opleiding |
|---|---|
| `"februaristart": true` | Extra link in het witte blok, naar het blok `#februaristart` op de opleidingspagina |
| `"knop": { "label": "…", "url": "…" }` | Extra knop naast "Stuur een mail" |
| `"starten": ["…", "…"]` | Vervangt de bullets onder "Kan je nu nog starten?" (eerste regel in het vet) |
| `"extraTekst": "…"` | Extra alinea onder "Kan je nu nog starten?" |
| `"links": [{ "label": "…", "url": "…" }]` | Extra links onder "Nog belangrijke informatie" |

Voorbeeld van een nieuwe uitzondering:

```json
{
  "opleidingen": ["Vroedkunde"],
  "starten": ["Instappen kan nog tot eind november.", "Je verliest geen studietijd."]
}
```

**Let op de vorm.** Tekst staat tussen dubbele aanhalingstekens, onderdelen zijn gescheiden door een komma en na het
laatste onderdeel staat geen komma. Zit er toch een fout in, dan:

- blijft de webapp werken met de ingebouwde standaardteksten (je wijziging is dan niet zichtbaar);
- krijgt de Action een rood kruisje, met in de log de plaats van de fout;
- meldt de log ook namen van opleidingen die niet overeenkomen met Airtable.

Regels die met `_` beginnen, zijn uitleg en doen niets.

## Lokaal testen

```bash
npx serve        # of: python3 -m http.server
```

Open daarna de lokale URL. Rechtstreeks via `file://` werkt niet, omdat de browser dan `data.json` niet mag laden.

## Data handmatig verversen

```bash
AIRTABLE_TOKEN=pat_xxx node build-data.js
```
