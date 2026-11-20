/**
 * KdG – Je plek nog niet gevonden? (late start / februaristart)
 * Embed op kdg.be:
 *   <div id="kdg-plek-root"></div>
 *   <script src="https://kdg-marcom.github.io/late-start-webapp/widget.js" defer></script>
 * De data komt uit data.json (zelfde map), elk uur ververst vanuit Airtable.
 * Teksten, vaste links en uitzonderingen per opleiding: inhoud.json (zelfde map).
 */
(function () {
  "use strict";
  var script = document.currentScript;
  var root = document.getElementById("kdg-plek-root");
  if (!root || root.dataset.kdgPlek) return;
  root.dataset.kdgPlek = "1";
  root.classList.add("kdg-app");

  // Waar staat data.json? Standaard naast dit script; anders via data-src op de div.
  var DATA_URL = root.dataset.src || (script && script.src ? new URL("data.json", script.src).href : "data.json");
  var INHOUD_URL = root.dataset.inhoud || (script && script.src ? new URL("inhoud.json", script.src).href : "inhoud.json");

  // ---------- Teksten, vaste links en uitzonderingen ----------
  // Dit zijn de ingebouwde standaardwaarden. De echte inhoud staat in inhoud.json (zelfde map) en overschrijft ze.
  const KDG = "https://www.kdg.be";
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const STD = {"teksten": {"q1": "Weet je al wat je wilt studeren?", "q2": "Heb je hiervoor al aan een andere hogeschool of universiteit gestudeerd?", "q3": "Wil je iets in dezelfde richting studeren?", "ja": "Ja", "nee": "Nee", "vraag": "Vraag {nummer}", "start": "Wanneer wil je starten?", "startNu": "Zo snel mogelijk of in februari", "startSept": "Volgend academiejaar (september 2027)", "pick": "Welke opleiding wil je volgen?", "pickZoek": "Zoek je opleiding…", "voor": "Wat heb je daar gestudeerd?", "voorZoek": "Zoek je vorige opleiding…", "thema": "Welk thema spreekt je aan?", "themaAantal": "{aantal} opleidingen", "themaWeetNiet": "Ik weet het nog niet", "themaLijst": "Welke opleiding spreekt je aan?", "themaSub": "Deze opleidingen horen bij {thema}.", "themaTwijfel": "Ik twijfel nog: help me kiezen", "slcTitel": "Contacteer je studieloopbaancoördinator", "slcEen": "Je studiecoach is {naam}.", "slcMeer": "Je studiecoaches zijn {naam}.", "slcTekst": "Samen bekijk je jouw persoonlijk traject, wanneer je kan starten én welke vrijstellingen je kan krijgen.", "slcKnop": "Stuur een mail", "slcGeen": "Neem contact op met de opleiding via de opleidingspagina.", "mailOnderwerp": "Late start voor de opleiding {opleiding}: vraag via website", "startTitel": "Kan je nu nog starten?", "startFebZonder": ["Je kan nog starten in februari.", "Je volgt dan een aangepast traject.", "Je verliest geen studietijd."], "startZonder": ["Je kan nog instappen tot eind {maand}.", "Je sluit aan bij de lessen van dit academiejaar.", "Je verliest geen studietijd."], "startMet": ["Je kan nog inschrijven tot eind {maand}.", "Je neemt dit academiejaar al een aantal vakken op.", "Vanaf september volg je het normale curriculum.", "Je doet wel langer over je opleiding."], "startDicht": ["Inschrijven voor dit academiejaar kan niet meer.", "Je kan starten in september 2027."], "startOnbekend": ["Of je nu nog kan instappen, bekijk je met je studiecoach."], "februaristartLink": "Bekijk welke vakken je vanaf februari volgt", "meerWeten": "Nog belangrijke informatie", "opleidingspagina": "Opleidingspagina", "infoTitel": "Kom naar een infomoment", "infoTekst": "Je hebt nog tijd. Maak kennis met de opleiding, de docenten en de campus.", "twijfel": "Twijfel je nog?", "meerWeten2728": "Meer weten", "altTitel": "Deze KdG-opleidingen sluiten aan bij wat je al studeerde", "altSlcTitel": "Contacteer de studieloopbaancoördinator", "altSlc1": "Kies hieronder de opleiding die je aanspreekt en neem contact op.", "altSlc2": "De studieloopbaancoördinator bekijkt met jou wanneer je kunt instappen en welke vrijstellingen je kunt krijgen.", "kaartMet": "Inschrijven kan nog tot eind {maand}, met studietijdverlies. Je doet langer over de opleiding.", "kaartFebZonder": "Starten in februari kan, zonder studietijdverlies.", "kaartZonder": "Instappen kan nog tot eind {maand}, zonder studietijdverlies.", "kaartDicht": "Inschrijven voor dit academiejaar kan niet meer. Je kan starten in september 2027.", "kaartOnbekend": "Of je nu nog kan instappen, bekijk je met de studieloopbaancoördinator.", "kaartMail": "Je mailt met", "aanpak": "Hoe pak je het aan?", "tijdTitel": "Je hebt nog tijd om te vergelijken en te kiezen", "tijdInfo": "Leer de opleidingen kennen op een infomoment", "geenAltTitel": "We hebben geen opleiding die hierbij aansluit", "geenAltTekst": "Voor je vorige opleiding hebben we bij KdG geen opleiding die er rechtstreeks op aansluit. Wil je in dezelfde richting verder studeren? Dan wensen we je veel succes aan een andere hogeschool of universiteit.", "geenAltTipsTitel": "Weet je het nog niet zeker?", "geenAltTipsTekst": "Misschien past een andere richting beter bij je. Met onze tips ontdek je stap voor stap welke opleiding aansluit bij je interesses, talenten en verwachtingen.", "geenAltHandig": "Ook handig", "keuzeTitel": "Dan beginnen we bij je studiekeuze.", "tipsTitel": "Ontdek welke opleiding bij je past.", "tipsTekst": "Twijfel je over je studiekeuze of weet je nog niet welke richting je uit wil? Met onze tips ontdek je stap voor stap welke opleiding aansluit bij je interesses, talenten en verwachtingen.", "keuzeHandig": "Ook handig", "vorige": "← Vorige vraag", "opnieuw": "Opnieuw beginnen", "aantalEen": "{aantal} opleiding", "aantalMeer": "{aantal} opleidingen", "laden": "Bezig met laden…", "fout": "De gegevens konden niet geladen worden. Probeer later opnieuw."}, "links": {"inschrijven": {"label": "Inschrijven", "perSoort": {"Professionele bachelor": "/inschrijven/nederlandstalige-professionele-bachelor#inschrijven-voor-huidig-academiejaar-2026-27", "Graduaat": "/inschrijven/graduaat#inschrijven-voor-huidig-academiejaar-2026-27", "Educatieve bachelor": "/inschrijven/educatieve-bachelor#inschrijven-voor-huidig-academiejaar-2026-27", "Academische bachelor": "/inschrijven/academische-bachelor-beeldende-kunsten-nederlandstalig-programma", "standaard": "/inschrijven/nederlandstalige-professionele-bachelor#inschrijven-voor-huidig-academiejaar-2026-27"}}, "inschrijven2728": {"label": "Inschrijven voor 2027-2028", "perSoort": {"Graduaat": "/inschrijven/graduaat#inschrijven-voor-volgend-academiejaar-2027-28", "standaard": "/inschrijven/nederlandstalige-professionele-bachelor#inschrijven-voor-volgend-academiejaar-2027-28"}}, "vrijstellingen": {"label": "Vrijstellingen", "url": "/inschrijven/inschrijven-met-vrijstellingen-persoonlijk-deeltraject-pdt"}, "februari": {"label": "Starten in februari", "url": "#februaristart", "klasse": "page-scroll"}, "tips": {"label": "Tips voor je studiekeuze", "url": "/studiekeuze-maken"}, "infomomenten": {"label": "Bekijk de infomomenten", "url": "/infomomenten"}, "volgLes": {"label": "Volg een les", "url": "/opleidingen/infomomenten/volg-een-les"}, "aanbod": {"label": "Opleidingsaanbod", "url": "/opleidingen/alle-bachelors"}, "stappen": {"label": "5 stappen om te heroriënteren", "url": "#5-stappen", "klasse": "page-scroll"}}, "uitzonderingen": [{"opleidingen": ["KMO-Management", "Marketing", "Supply Chain Management", "Rechtspraktijk", "Business & Languages", "Accountancy-Fiscaliteit", "Financiën en Verzekeringen", "Event & Project Management", "Cross Media Management", "Toegepaste Informatica", "Internationaal Ondernemen"], "februaristart": true}, {"opleidingen": ["Verkorte Educatieve Bachelor Secundair Onderwijs", "Educatief Graduaat Secundair Onderwijs"], "knop": {"label": "Infomoment start februari", "url": "/opleidingen/infomoment-verkorte-educatieve-bachelor-en-graduaat-secundair-onderwijs-start-februari"}}]};
  let TEKST = Object.assign({}, STD.teksten), LINKS = Object.assign({}, STD.links), REGELS = STD.uitzonderingen || [];
  function neemInhoud(inh) {
    if (!inh || typeof inh !== "object") return;
    if (inh.teksten) Object.keys(inh.teksten).forEach(k => { if (k.charAt(0) !== "_") TEKST[k] = inh.teksten[k]; });
    if (inh.links) Object.keys(inh.links).forEach(k => { if (k.charAt(0) !== "_") LINKS[k] = Object.assign({}, LINKS[k], inh.links[k]); });
    if (Array.isArray(inh.uitzonderingen)) REGELS = inh.uitzonderingen;
  }
  const T = (k, v) => { let s = String(TEKST[k] == null ? "" : TEKST[k]); if (v) Object.keys(v).forEach(n => { s = s.split("{" + n + "}").join(v[n]); }); return s; };
  const TL = k => Array.isArray(TEKST[k]) ? TEKST[k] : (TEKST[k] ? [TEKST[k]] : []);

  const CSS = `
  #kdg-plek-root{
    --zwart:#000; --wit:#fff; --grijs-licht:#e6e6e6; --grijs-bg:#f3f3f1; --grijs-hover:#e8e8e4; --grijs-donker:#555;
    --paneel:#8cc8d2; --link:#5A4B8C;
    font-family:inherit; font-size:18px; line-height:1.45; color:#1d1d1b;
    background:#fff; width:100%; max-width:none; margin:0; padding:4px 0 16px;
  }
  #kdg-plek-root *{box-sizing:border-box}
  #kdg-plek-root h2, #kdg-plek-root h3{color:#1d1d1b}
  #kdg-plek-root p{margin:0}

  #kdg-plek-root .paneel{background:var(--paneel); padding:44px 44px 48px; margin:0 0 18px}
  #kdg-plek-root .stap{font-size:.82em; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin:0 0 10px}
  #kdg-plek-root .kop{margin:0 0 28px}
  #kdg-plek-root .zoekbox input{width:100%; font:inherit; padding:15px 16px; border:2px solid #000; background:#fff; outline:none; color:#1d1d1b}
  #kdg-plek-root .zoekbox input:focus{box-shadow:0 0 0 3px #000}
  #kdg-plek-root .telling{margin:18px 2px 14px; color:#1d1d1b}
  #kdg-plek-root .paneel .sub{margin:-14px 0 24px}
  #kdg-plek-root .paneel > :last-child{margin-bottom:0}

  #kdg-plek-root .lijst{list-style:none; margin:0; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:14px}
  #kdg-plek-root .lijst li{margin:0; display:flex}
  #kdg-plek-root .lijst li[hidden]{display:none}
  #kdg-plek-root .opl-knop{width:100%; text-align:left; font:inherit; color:#1d1d1b; background:var(--grijs-bg); border:0;
    padding:18px 20px; cursor:pointer; display:flex; flex-direction:column; justify-content:center; gap:10px}
  #kdg-plek-root .opl-knop:hover,#kdg-plek-root .opl-knop:focus{background:var(--grijs-hover); outline:none}
  #kdg-plek-root .opl-nm{font-weight:800; font-size:1.18em}
  #kdg-plek-root .opl-tags{display:flex; flex-wrap:wrap; gap:8px}
  #kdg-plek-root .tag{font-size:.82em; padding:4px 10px; white-space:nowrap; color:#1d1d1b}
  #kdg-plek-root .kdg-label{display:inline-block; color:#1d1d1b; font-family:inherit; font-size:12px; line-height:1.3; font-weight:700; letter-spacing:.03em; text-transform:uppercase; padding:3px 8px; border-radius:3px; white-space:nowrap; vertical-align:middle; position:relative; top:-.12em}
  #kdg-plek-root .lijst.compact .kdg-label{top:0}
  #kdg-plek-root .sectie .extra{margin:18px 0 0}
  #kdg-plek-root .lijst.compact{grid-template-columns:1fr; gap:4px; max-height:380px; overflow-y:auto; padding-right:6px; scrollbar-gutter:stable}
  #kdg-plek-root .lijst.compact .opl-knop{flex-direction:row; align-items:center; justify-content:space-between; gap:12px; padding:9px 14px}
  #kdg-plek-root .lijst.compact .opl-nm{font-weight:700; font-size:1em}
  #kdg-plek-root .lijst.compact .opl-tags{flex-wrap:nowrap; flex:none}
  #kdg-plek-root .lijst.compact .tag{font-size:.75em; padding:2px 8px}

  #kdg-plek-root .terug{font:inherit; color:#1d1d1b; background:none; border:0; cursor:pointer; padding:6px 0; margin:0 22px 18px 0; text-decoration:underline}
  #kdg-plek-root .opl-head{background:var(--paneel); padding:44px 44px 48px; margin:0 0 26px}
  #kdg-plek-root .opl-head h2{margin:0 0 12px}
  #kdg-plek-root .badges{display:flex; flex-wrap:wrap; gap:8px}
  #kdg-plek-root .blok h2{margin:0 0 6px}
  #kdg-plek-root .blok h2{display:flex; flex-wrap:wrap; align-items:center; gap:6px 12px}
  #kdg-plek-root .blok h2 .type{display:inline-flex}
  #kdg-plek-root .sectie{margin-top:36px; padding-top:32px; border-top:1px solid rgba(0,0,0,.25)}
  #kdg-plek-root .sectie.wit{background:#fff; border:0; padding:30px 32px; margin-top:30px}
  #kdg-plek-root .sectie.wit + .sectie{border-top:0; padding-top:4px}
  #kdg-plek-root .sectie h3{margin:0 0 10px}
  #kdg-plek-root .blok > h3{margin:0 0 8px}
  #kdg-plek-root .kaarten.inblok{margin-top:30px; gap:22px}
  #kdg-plek-root .sectie.wit h3{margin-bottom:16px}
  #kdg-plek-root .sectie.wit h3:has(+ p),#kdg-plek-root .sectie.wit h3:has(+ ul){margin-bottom:10px}
  #kdg-plek-root .blok .badges{margin-top:14px}
  #kdg-plek-root .of{margin:14px 0 0 !important}
  #kdg-plek-root .of a{color:inherit; text-decoration:underline}
  #kdg-plek-root .opl-head .intro{margin:14px 0 0}
  #kdg-plek-root .sectie p{margin:0 0 18px}
  #kdg-plek-root .sectie p:last-child,#kdg-plek-root .sectie ul:last-child{margin-bottom:0}
  #kdg-plek-root .links{margin:0; padding-left:1.2em}
  #kdg-plek-root .links li{margin:8px 0}
  #kdg-plek-root .links a{color:inherit; text-decoration:underline}
  #kdg-plek-root .links a,#kdg-plek-root .extra a,#kdg-plek-root .leeglink,#kdg-plek-root .maillink,#kdg-plek-root .terug{color:var(--link); text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:3px; cursor:pointer}
  #kdg-plek-root .links a:hover,#kdg-plek-root .extra a:hover,#kdg-plek-root .leeglink:hover,#kdg-plek-root .maillink:hover,#kdg-plek-root .terug:hover{text-decoration-thickness:3px}

  #kdg-plek-root .kaarten{display:grid; grid-template-columns:1fr 1fr; gap:22px}
  #kdg-plek-root .kaart{background:var(--grijs-bg); padding:28px; display:grid; grid-template-columns:36px 1fr; gap:18px; align-items:start}
  #kdg-plek-root .kaart.hoofd{grid-column:1/-1; border:3px solid #000}
  #kdg-plek-root .kaart .ico svg{width:32px; height:32px; display:block}
  #kdg-plek-root .kaart h3{margin:0 0 8px}
  #kdg-plek-root .kaart .desc{color:var(--grijs-donker); margin:0 0 14px}
  #kdg-plek-root .kaart .detail{margin:0 0 20px}
  #kdg-plek-root .kaart .punten{margin:4px 0 20px; padding-left:1.2em}
  #kdg-plek-root .kaart .punten li{margin:4px 0}
  #kdg-plek-root .knoppen{display:flex; flex-wrap:wrap; gap:12px}
  #kdg-plek-root .cta{display:inline-flex; align-items:center; gap:9px; font:inherit; font-weight:700;
    background:#000; color:#fff; border:2px solid #000; padding:12px 20px; cursor:pointer; text-decoration:none}
  #kdg-plek-root .cta:hover{opacity:.8}
  #kdg-plek-root .cta:not(.sec):hover{opacity:.65}
  #kdg-plek-root .cta:active{background:var(--grijs-bg); color:#000}
  #kdg-plek-root .cta.sec{background:#fff; color:#000}
  #kdg-plek-root .cta svg{width:16px; height:16px}
  #kdg-plek-root .cta.breed{display:flex; width:100%; justify-content:space-between; margin-top:26px; padding:18px 22px; font-size:1.1em}


  #kdg-plek-root .status{margin:0; padding:18px 0}

  @media(max-width:640px){
    #kdg-plek-root .paneel{padding:30px 22px 32px}
    #kdg-plek-root .opl-head{padding:30px 22px 32px}
    #kdg-plek-root .sectie.wit{padding:24px 22px}
    #kdg-plek-root .lijst{grid-template-columns:1fr}
    #kdg-plek-root .kaarten{grid-template-columns:1fr}
    #kdg-plek-root .kaart{grid-template-columns:1fr; padding:22px}
    #kdg-plek-root .kaart .ico{display:none}
  }
`;
  if (!document.getElementById("kdg-plek-css")) {
    const st = document.createElement("style"); st.id = "kdg-plek-css"; st.textContent = CSS; document.head.appendChild(st);
  }
  const app = document.createElement("div"); app.setAttribute("aria-live", "polite"); root.appendChild(app);
  app.innerHTML = `<p class="status">${esc(T("laden"))}</p>`;

  // ---------- Data ----------
  let OPL = {}, LIJST = [], VOOR = [], THEMAS = {}, THEMA_NAMEN = [];
  function laad(data) {
    (data.opleidingen || []).forEach(o => OPL[o.id] = o);
    LIJST = (data.opleidingen || []).filter(o => o.lijst);
    VOOR = data.vooropleidingen || [];
    LIJST.forEach(o => (o.themas || []).forEach(t => (THEMAS[t] = THEMAS[t] || []).push(o)));
    THEMA_NAMEN = Object.keys(THEMAS).sort((a, b) => a.localeCompare(b, "nl"));
  }

  // ---------- Startmoment: welke late inschrijving geldt vandaag nog? ----------
  const MAANDEN = ["september", "oktober", "november", "december", "januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus"];
  const nuIdx = () => (new Date().getMonth() + 4) % 12;           // september = 0
  // Geeft { soort: "febZonder" | "zonder" | "met" | "dicht" | "onbekend", maand, i }
  function startKeuze(o) {
    const alle = o.late || [];
    if (alle.some(l => l.dicht)) return { soort: "dicht" };
    const opties = alle.filter(l => l.maand).map(l => ({ maand: l.maand, verlies: l.verlies, i: MAANDEN.indexOf(l.maand) })).filter(l => l.i >= 0);
    if (!opties.length) return { soort: "onbekend" };
    const geldig = opties.filter(l => l.i >= nuIdx());          // t.e.m. het einde van die maand
    const zonder = geldig.filter(l => !l.verlies).sort((a, b) => a.i - b.i)[0];
    if (zonder) return { soort: zonder.maand === "februari" ? "febZonder" : "zonder", maand: zonder.maand, i: zonder.i };
    const met = geldig.filter(l => l.verlies).sort((a, b) => b.i - a.i)[0];   // met verlies: de laatste datum telt
    return met ? { soort: "met", maand: met.maand, i: met.i } : { soort: "dicht" };
  }
  const START_TEKST = { febZonder: "startFebZonder", zonder: "startZonder", met: "startMet", dicht: "startDicht", onbekend: "startOnbekend" };
  const KAART_TEKST = { febZonder: "kaartFebZonder", zonder: "kaartZonder", met: "kaartMet", dicht: "kaartDicht", onbekend: "kaartOnbekend" };
  function startBullets(o) {
    const k = startKeuze(o);
    const b = TL(START_TEKST[k.soort]).map((s, i) => { s = esc(String(s).split("{maand}").join(k.maand || "")); return i ? s : `<strong>${s}</strong>`; });
    if (k.soort === "dicht") b.push(vast("inschrijven2728", o));
    return b;
  }
  const startRang = o => { const k = startKeuze(o); return k.soort === "onbekend" ? 99 : k.soort === "dicht" ? 90 : (k.soort === "met" ? 50 : 0) + k.i; };

  // ---------- Bouwstenen ----------
  const state = { screen: "q1", history: [], stap: 1, opleiding: null, voor: null, thema: null };
  const plat = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const TYPE_KLEUR = { "Bachelor": "#6991c8", "Graduaat": "#ff873c" };
  const SVG_KOP = '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
  const ICONS = {
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4.5 8l7.5 5 7.5-5"/>',
    fysiek: '<path d="M12 21c4.2-4.4 6.3-7.6 6.3-10.6a6.3 6.3 0 10-12.6 0C5.7 13.4 7.8 16.6 12 21z"/><circle cx="12" cy="10.4" r="2.3"/>'
  };
  const arrow = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const tag = (label, kleur) => `<span class="tag" style="background:${kleur || "#cdd2d2"}">${esc(label)}</span>`;
  const label = (tekst, kleur) => `<span class="kdg-label" style="background:${kleur || "#cdd2d2"}">${esc(tekst)}</span>`;
  const typeTag = o => label(o.type, TYPE_KLEUR[o.type]);

  // Knop: act = stap in de webapp, href = echte link, geen van beide = nog geen link
  const knop = (label, o = {}) => o.act
    ? `<button class="cta ${o.sec ? "sec" : ""} ${o.breed ? "breed" : ""}" data-act="${o.act}">${esc(label)} ${arrow}</button>`
    : o.href
      ? `<a class="cta ${o.sec ? "sec" : ""}" href="${esc(o.href)}"${/^(mailto:|#)/.test(o.href) ? "" : ' target="_blank" rel="noopener"'}>${esc(label)} ${arrow}</a>`
      : `<span class="cta ${o.sec ? "sec" : ""} leeg">${esc(label)} ${arrow}</span>`;
  const link = (label, href, klasse) => !href ? `<span class="leeglink">${esc(label)}</span>`
    : href.charAt(0) === "#" ? `<a href="${esc(href)}"${klasse ? ` class="${klasse}"` : ""}>${esc(label)}</a>`
    : `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  // Juiste url van een vaste link, eventueel volgens het soort opleiding (o)
  const vastUrl = (k, o) => { const L = LINKS[k] || {}; const s = L.perSoort;
    return volUrl(s ? (s[(o || {}).soort] || ((o || {}).type === "Graduaat" && s.Graduaat) || s.standaard || "") : (L.url || "")); };
  const vast = (k, o) => link((LINKS[k] || {}).label || k, vastUrl(k, o), (LINKS[k] || {}).klasse);
  const vastKnop = (k, o = {}) => knop((LINKS[k] || {}).label || k, { href: vastUrl(k, o.opl), sec: o.sec });
  const paginaLink = o => link(T("opleidingspagina"), o.url);
  const paginaKnop = (o, primair) => knop(T("opleidingspagina"), { href: o.url, sec: !primair });

  const vraag = (kop, knoppen) => `<div class="paneel"><p class="stap">${esc(T("vraag", { nummer: state.stap }))}</p><h2 class="kop">${esc(kop)}</h2><div class="knoppen">${knoppen}</div></div>`;
  const jaNee = (kop, ja, nee) => vraag(kop, knop(T("ja"), { act: ja }) + knop(T("nee"), { act: nee, sec: true }));
  const lijst = (items, act, compact) => `<ul class="lijst${compact ? " compact" : ""}" id="kdg-plek-list">${items.map((it, i) =>
    `<li data-text="${esc(plat(it.naam))}"><button class="opl-knop" data-act="${act}" data-i="${i}"><span class="opl-nm">${esc(it.naam)}</span><span class="opl-tags">${it.tags}</span></button></li>`).join("")}</ul>`;
  const zoekLijst = (kop, placeholder, items, act) => `<div class="paneel"><p class="stap">${esc(T("vraag", { nummer: state.stap }))}</p><h2 class="kop">${esc(kop)}</h2>
    <div class="zoekbox"><input id="kdg-plek-search" type="text" placeholder="${esc(placeholder)}" autocomplete="off" aria-label="${esc(placeholder)}"></div>
    <p class="telling" id="kdg-plek-telling">${esc(T("aantalMeer", { aantal: items.length }))}</p>${lijst(items, act, true)}</div>`;
  const sectie = (titel, desc, detail, knoppen, links, wit, extra) => `<section class="sectie${wit ? " wit" : ""}"><h3>${esc(titel)}</h3>${desc ? `<p class="desc">${desc}</p>` : ""}${detail ? `<p class="detail">${detail}</p>` : ""}
    ${knoppen ? `<div class="knoppen">${knoppen}</div>` : ""}${links ? `<ul class="links">${links.map(l => `<li>${l}</li>`).join("")}</ul>` : ""}${extra || ""}</section>`;
  const kaart = (ico, titel, desc, detail, knoppen, punten) => `<div class="kaart"><div class="ico">${SVG_KOP}${ICONS[ico]}</svg></div><div>
    <h3>${titel}</h3>${desc ? `<p class="desc">${desc}</p>` : ""}${detail ? `<p class="detail">${detail}</p>` : ""}${punten ? `<ul class="punten">${punten.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
    ${knoppen ? `<div class="knoppen">${knoppen}</div>` : ""}</div></div>`;
  const blok = (o, secties) => `<div class="opl-head blok"><h2>${esc(o.naam)} <span class="type">${label(o.type, "#fff")}</span></h2>${secties.join("")}</div>`;

  // SLC'er: namen + één mailadres (gedeelde mailbox of persoonlijk adres)
  const mailto = o => "mailto:" + o.mail + "?subject=" + encodeURIComponent(T("mailOnderwerp", { opleiding: o.naam }));
  const slcWie = o => !(o.slc && o.slc.length) ? "" : T(o.slc.length > 1 ? "slcMeer" : "slcEen", { naam: o.slc.join(" en ") }) + " ";
  const slcTekst = o => !o.mail ? esc(T("slcGeen")) : esc(slcWie(o) + T("slcTekst"));
  const slcDetail = o => !o.mail ? esc(T("slcGeen"))
    : esc(T("kaartMail")) + " " + (o.slc && o.slc.length ? `<b>${esc(o.slc.join(" en "))}</b>: ` : "") + `<a class="maillink" href="${esc(mailto(o))}">${esc(o.mail)}</a>`;
  const slcKnop = o => o.mail ? knop(T("slcKnop"), { href: mailto(o) }) : "";
  // Uitzonderingen uit inhoud.json die voor deze opleiding gelden, samengevoegd
  function regelsVoor(o) {
    const r = { links: [] }, naam = plat(o.naam);
    REGELS.forEach(x => {
      if (!x || !Array.isArray(x.opleidingen) || !x.opleidingen.some(n => plat(n) === naam)) return;
      if (x.februaristart) r.februaristart = true;
      if (x.knop && x.knop.label) r.knop = x.knop;
      if (Array.isArray(x.starten) && x.starten.length) r.starten = x.starten;
      if (x.extraTekst) r.extraTekst = x.extraTekst;
      if (Array.isArray(x.links)) r.links = r.links.concat(x.links.filter(l => l && l.label));
    });
    return r;
  }
  const volUrl = u => u && u.charAt(0) === "/" ? KDG + u : u;
  const startSectieA = o => { const r = regelsVoor(o);
    let b = r.starten ? r.starten.map((s, i) => i ? esc(s) : `<strong>${esc(s)}</strong>`) : startBullets(o);
    return `<section class="sectie"><h3>${esc(T("startTitel"))}</h3><ul class="links">${b.map(x => `<li>${x}</li>`).join("")}</ul>${r.extraTekst ? `<p class="extra">${esc(r.extraTekst)}</p>` : ""}</section>`; };
  const startKort = o => { const k = startKeuze(o); return esc(T(KAART_TEKST[k.soort], { maand: k.maand || "" })); };
  const handig = titel => sectie(titel, "", "", "", [vast("aanbod"), vast("februari"), vast("vrijstellingen")]);
  const tipsBlok = (titel, handigTitel) => `<div class="opl-head blok"><h2>${esc(titel)}</h2>
    ${sectie(T("tipsTitel"), esc(T("tipsTekst")), "", vastKnop("tips"), null, true)}
    ${handig(handigTitel)}</div>`;
  const geenAltBlok = v => `<div class="opl-head blok"><h2>${esc(T("geenAltTitel"))}</h2><div class="badges">${tag(v.naam, "#fff")}</div>
    <p class="intro">${esc(T("geenAltTekst"))}</p>
    ${sectie(T("geenAltTipsTitel"), esc(T("geenAltTipsTekst")), "", vastKnop("tips"), null, true)}
    ${handig(T("geenAltHandig"))}</div>`;
  const startQ = r => vraag(T("start"), knop(T("startNu"), { act: "startNu" + r }) + knop(T("startSept"), { act: "startSept" + r, sec: true }));
  const alternatieven = v => v.kdg.map(id => OPL[id]).filter(Boolean);

  // ---------- Schermen ----------
  const screens = {
    q1: () => jaNee(T("q1"), "toPick", "toQ2"),
    pick: () => zoekLijst(T("pick"), T("pickZoek"), LIJST.map(o => ({ naam: o.naam, tags: typeTag(o) })), "chooseOpl"),
    startA: () => startQ("A"),
    startB: () => startQ("B"),

    resultA: () => { const o = state.opleiding, r = regelsVoor(o); return blok(o, [
      sectie(T("slcTitel"), slcTekst(o), "", (o.mail ? slcKnop(o) : paginaKnop(o, true)) + (r.knop ? knop(r.knop.label, { href: volUrl(r.knop.url), sec: true }) : ""), null, true,
        r.februaristart && o.url && startKeuze(o).soort !== "dicht" ? `<p class="extra">${link(T("februaristartLink"), o.url.split("#")[0] + "#februaristart")}</p>` : ""),
      startSectieA(o),
      sectie(T("meerWeten"), "", "", "", [paginaLink(o)].concat(startKeuze(o).soort === "dicht" ? [] : [vast("inschrijven", o)], [vast("vrijstellingen")]).concat(r.links.map(l => link(l.label, volUrl(l.url)))))]); },

    resultA2: () => { const o = state.opleiding; return blok(o, [
      sectie(T("infoTitel"), esc(T("infoTekst")), "", vastKnop("infomomenten") + paginaKnop(o) + vastKnop("volgLes", { sec: true }), null, true),
      sectie(T("twijfel"), "", "", "", [vast("tips")]),
      sectie(T("meerWeten2728"), "", "", "", [vast("inschrijven2728", o)])]); },

    q2: () => jaNee(T("q2"), "toQ3", "toThema"),
    q3: () => jaNee(T("q3"), "toVoor", "toThema"),

    thema: () => `<div class="paneel"><p class="stap">${esc(T("vraag", { nummer: state.stap }))}</p><h2 class="kop">${esc(T("thema"))}</h2>` +
      lijst(THEMA_NAMEN.map(t => ({ naam: t, tags: tag(T("themaAantal", { aantal: THEMAS[t].length })) })), "chooseThema") +
      knop(T("themaWeetNiet"), { act: "toC", breed: true }) + `</div>`,

    themaList: () => { const t = state.thema; return `<div class="paneel"><p class="stap">${esc(T("vraag", { nummer: state.stap }))}</p><h2 class="kop">${esc(T("themaLijst"))}</h2><p class="sub">${esc(T("themaSub", { thema: t }))}</p>` +
      lijst(THEMAS[t].map(o => ({ naam: o.naam, tags: typeTag(o) })), "chooseFromThema", true) +
      knop(T("themaTwijfel"), { act: "toC", breed: true }) + `</div>`; },

    voor: () => zoekLijst(T("voor"), T("voorZoek"), VOOR.map(v => ({ naam: v.naam, tags: tag(v.soort) })), "chooseVoor"),

    resultB: () => { const v = state.voor; const alts = alternatieven(v);
      if (!alts.length) return geenAltBlok(v);
      const sorted = alts.slice().sort((a, b) => startRang(a) - startRang(b) || a.naam.localeCompare(b.naam, "nl"));
      return `<div class="opl-head blok"><h2>${esc(T("altTitel"))}</h2><div class="badges">${tag(v.naam, "#fff")}</div>
        ${sectie(T("altSlcTitel"), "", "", "", [esc(T("altSlc1")), esc(T("altSlc2"))], true)}
        <div class="kaarten inblok">${sorted.map(o => kaart("mail", esc(o.naam) + " " + typeTag(o), startKort(o), slcDetail(o), slcKnop(o) + paginaKnop(o))).join("")}</div>
        ${sectie(T("aanpak"), "", "", "", [vast("stappen"), vast("vrijstellingen"), vast("februari")])}</div>`; },

    resultB2: () => { const v = state.voor; const alts = alternatieven(v);
      if (!alts.length) return geenAltBlok(v);
      return `<div class="opl-head blok"><h2>${esc(T("tijdTitel"))}</h2>
      ${sectie(T("tijdInfo"), "", "", vastKnop("infomomenten"), null, true)}
      <section class="sectie"><h3>${esc(T("altTitel"))}</h3><div class="badges">${tag(v.naam, "#fff")}</div>
      <div class="kaarten inblok">${alts.map(o => kaart("fysiek", esc(o.naam) + " " + typeTag(o), "", "", paginaKnop(o))).join("")}</div></section>
      ${sectie(T("aanpak"), "", "", "", [vast("tips"), vast("volgLes"), vast("vrijstellingen")])}</div>`; },

    resultC: () => tipsBlok(T("keuzeTitel"), T("keuzeHandig"))
  };

  // ---------- Navigatie ----------
  function go(screen, set) {
    state.history.push({ screen: state.screen, stap: state.stap, opleiding: state.opleiding, voor: state.voor, thema: state.thema });
    state.stap++;
    if (set) Object.assign(state, set);
    state.screen = screen;
    render(true);
  }
  function back() { const p = state.history.pop(); if (!p) return; Object.assign(state, p); render(true); }
  function restart() { Object.assign(state, { screen: "q1", history: [], stap: 1, opleiding: null, voor: null, thema: null }); render(true); }

  const acts = {
    toPick: () => go("pick"),
    toQ2: () => go("q2"),
    toQ3: () => go("q3"),
    toThema: () => go("thema"),
    toC: () => go("resultC"),
    toVoor: () => go("voor"),
    chooseThema: i => go("themaList", { thema: THEMA_NAMEN[i] }),
    chooseFromThema: i => go("startA", { opleiding: THEMAS[state.thema][i] }),
    chooseOpl: i => go("startA", { opleiding: LIJST[i] }),
    chooseVoor: i => { const v = VOOR[i]; alternatieven(v).length ? go("startB", { voor: v }) : go("resultB", { voor: v }); },
    startNuA: () => go("resultA"),
    startSeptA: () => go("resultA2"),
    startNuB: () => go("resultB"),
    startSeptB: () => go("resultB2")
  };

  function render(scroll) {
    const nav = (state.history.length ? `<button class="terug" data-act="back">${esc(T("vorige"))}</button>` : "") +
      (state.screen !== "q1" ? `<button class="terug" data-act="restart">${esc(T("opnieuw"))}</button>` : "");
    app.innerHTML = (nav ? `<div>${nav}</div>` : "") + screens[state.screen]();
    const search = document.getElementById("kdg-plek-search");
    if (search) {
      search.addEventListener("input", () => {
        const q = plat(search.value.trim()); let n = 0;
        app.querySelectorAll("#kdg-plek-list li").forEach(li => { li.hidden = !!q && !li.dataset.text.includes(q); if (!li.hidden) n++; });
        const t = document.getElementById("kdg-plek-telling"); if (t) t.textContent = T(n === 1 ? "aantalEen" : "aantalMeer", { aantal: n });
      });
    }
    // Na een klik het begin van de webapp in beeld houden als dat boven het scherm verdwenen is
    if (scroll && root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: "start" });
  }

  app.addEventListener("click", e => {
    const b = e.target.closest("[data-act]");
    if (!b || !app.contains(b)) return;
    const a = b.dataset.act;
    if (a === "back") return back();
    if (a === "restart") return restart();
    acts[a](b.dataset.i !== undefined ? Number(b.dataset.i) : undefined);
  });

  const haal = url => fetch(url, { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); });
  // inhoud.json is optioneel: ontbreekt het of zit er een fout in, dan gelden de ingebouwde standaardteksten.
  Promise.all([haal(DATA_URL), haal(INHOUD_URL).catch(e => { if (window.console) console.warn("KdG late start: inhoud.json niet gelezen, standaardteksten gebruikt.", e); return null; })])
    .then(res => { neemInhoud(res[1]); laad(res[0]); render(false); })
    .catch(() => { app.innerHTML = `<p class="status">${esc(T("fout"))}</p>`; });
})();
