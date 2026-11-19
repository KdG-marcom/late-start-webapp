# KdG – Je plek nog niet gevonden? (late start / februaristart)

Een webapp voor studiekiezers die nog willen instappen of heroriënteren. Met een paar vragen komen ze
bij de juiste studieloopbaancoördinator (SLC'er), bij aansluitende KdG-opleidingen of bij de tips voor
studiekeuze. De data komt uit Airtable en wordt **elk uur** automatisch ververst.

## Hoe het werkt

```
Airtable  ──(elk uur, GitHub Action met token uit Secrets)──>  data.json  ──(fetch)──>  widget.js  ──(script)──>  kdg.be
```

- `widget.js` — de webapp: opmaak, teksten, vaste links en logica. Laadt `data.json` uit dezelfde map.
- `data.json` — de gepubliceerde data. **Wordt automatisch overschreven** door de Action; niet manueel bewerken.
- `build-data.js` — haalt Airtable op en schrijft `data.json`. Het token komt uit een GitHub Secret en staat **nooit** in de gepubliceerde code.
- `index.html` — testpagina: toont de webapp zoals ze op GitHub Pages staat.
- `.github/workflows/update-data.yml` — draait `build-data.js` elk uur en commit `data.json` als de inhoud gewijzigd is.

> **Belangrijk:** `data.json` is publiek leesbaar. Er staan namen en mailadressen van SLC'ers in; dat is
> de bedoeling, want de webapp toont ze. Interne notities (keuzes met een vraagteken in "Startmomenten"
> en "Late inschrijving mogelijk tot") worden niet meegenomen.

## Embedden op kdg.be

Plak dit één keer in de pagina (source/HTML-modus). Daarna hoeft de pagina niet meer aangepast te worden:
data wijzig je in Airtable, opmaak en teksten in `widget.js`.

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

- **Keuzelijsten** ("Welke opleiding wil je volgen?" en de thema's): professionele, educatieve en academische
  bachelors en graduaten. Niet: pagina's met " - " in de titel (verkort, werkstudenten, brugprogramma …),
  "Verkorte …", "Extra Vak", "(in English)", afstudeerstudio's ("Studio …") en pagina's die alleen een `/en/`-adres hebben.
- **Dubbele pagina's** met dezelfde titel (bv. Nederlandse en Engelse pagina) worden één opleiding; de Nederlandse pagina wint.
- **Vooropleidingen**: alle rijen, ook die met het vinkje "Na te kijken". Zonder gekoppelde KdG-opleiding
  verwijst de webapp naar de tips voor studiekeuze.
- **SLC'er**: is `SLC - E-mails` het persoonlijke adres van één van de gekoppelde SLC'ers, dan staat alleen
  die naam erbij; bij een gedeelde mailbox alle namen. Zonder mailadres verwijst de webapp naar de opleidingspagina.
- **Namen** staan in Airtable als "Achternaam Voornaam"; het script draait ze om op basis van het mailadres.

"Kan je nu nog starten?" wordt in `widget.js` berekend op de dag zelf: een late inschrijving waarvan de maand
voorbij is, telt niet meer mee. Is er nog een optie zonder studietijdverlies, dan wordt die getoond; anders de
laatste datum met studietijdverlies. Is er niets (meer) ingevuld, dan verwijst de tekst naar de SLC'er.

## Teksten en vaste links aanpassen

Bovenaan `widget.js` staan twee blokken:

- `LINKS` — de vaste links (Inschrijven, Vrijstellingen, Infomomenten …). Vul de `url` in; zolang die leeg is,
  staat de tekst er zonder werkende link.
- `TEKST` — alle vragen, titels en zinnen.

Na een commit op `main` staat de wijziging binnen enkele minuten live (browsers kunnen `widget.js` tot
ongeveer 10 minuten in de cache houden).

## Lokaal testen

```bash
npx serve        # of: python3 -m http.server
```

Open daarna de lokale URL. Rechtstreeks via `file://` werkt niet, omdat de browser dan `data.json` niet mag laden.

## Data handmatig verversen

```bash
AIRTABLE_TOKEN=pat_xxx node build-data.js
```
