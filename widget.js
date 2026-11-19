/**
 * KdG – Je plek nog niet gevonden? (late start / februaristart)
 * Embed op kdg.be:
 *   <div id="kdg-plek-root"></div>
 *   <script src="https://kdg-marcom.github.io/late-start-webapp/widget.js" defer></script>
 * De data komt uit data.json (zelfde map), elk uur ververst vanuit Airtable.
 * Teksten en vaste links: zie TEKST en LINKS hieronder.
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

  // ---------- Vaste links: vul de url in zodra die vastligt. Leeg = nog geen link. ----------
  const LINKS = {
    inschrijven:     { label: "Inschrijven", url: "" },
    inschrijven2728: { label: "Inschrijven voor 2027-2028", url: "" },
    vrijstellingen:  { label: "Vrijstellingen", url: "" },
    infomomenten:    { label: "Bekijk de infomomenten", url: "" },
    tips:            { label: "Tips voor je studiekeuze", url: "" },
    openLessen:      { label: "Open lessen", url: "" },
    aanbod:          { label: "Opleidingsaanbod", url: "" },
    februari:        { label: "Starten in februari", url: "" },
    stappen:         { label: "5 stappen om te heroriënteren", url: "" }
  };

  // ---------- Teksten ----------
  const TEKST = {
    q1: "Weet je al wat je wilt studeren?",
    q2: "Heb je hiervoor al aan een andere hogeschool of universiteit gestudeerd?",
    q3: "Wil je iets in dezelfde richting studeren?",
    start: "Wanneer wil je starten?",
    startNu: "Zo snel mogelijk of in februari",
    startSept: "Volgend academiejaar (september 2027)",
    pick: "Welke opleiding wil je volgen?", pickZoek: "Zoek je opleiding…",
    voor: "Wat heb je daar gestudeerd?", voorZoek: "Zoek je vorige opleiding…",
    thema: "Welk thema spreekt je aan?", themaWeetNiet: "Ik weet het nog niet",
    themaLijst: "Welke opleiding spreekt je aan?", themaSub: "Deze opleidingen horen bij {thema}.", themaTwijfel: "Ik twijfel nog: help me kiezen",
    slcTitel: "Contacteer je studieloopbaancoördinator",
    slcTekst: "Die bekijkt met jou of en wanneer je kunt instappen, en welke vrijstellingen je kunt krijgen.",
    slcKnop: "Stuur een mail",
    slcGeen: "Neem contact op met de opleiding via de opleidingspagina.",
    mailOnderwerp: "Late start voor de opleiding {opleiding}: vraag via website",
    startTitel: "Kan je nu nog starten?",
    startOnbekend: "Of je nu nog kunt instappen, bekijkt de studieloopbaancoördinator met jou.",
    startFebZonder: "Starten in februari kan, zonder studietijdverlies.",
    startZonder: "Instappen kan nog tot {maand}, zonder studietijdverlies.",
    startMet: "Instappen kan nog tot {maand}, met studietijdverlies.",
    startZonderUitleg: "Je studeert af binnen de normale studieduur.",
    startMetUitleg: "Je doet langer over de opleiding dan de normale studieduur.",
    meerWeten: "Meer weten", opleidingspagina: "Opleidingspagina",
    infoTitel: "Kom naar een infomoment", infoTekst: "Je hebt nog tijd. Maak kennis met de opleiding, de docenten en de campus.",
    twijfel: "Twijfel je nog?",
    altTitel: "Deze KdG-opleidingen sluiten aan bij wat je al studeerde",
    altSlcTitel: "Contacteer de studieloopbaancoördinator",
    altSlc1: "Kies hieronder de opleiding die je aanspreekt en neem contact op.",
    altSlc2: "De studieloopbaancoördinator bekijkt met jou wanneer je kunt instappen en welke vrijstellingen je kunt krijgen.",
    aanpak: "Hoe pak je het aan?",
    tijdTitel: "Je hebt nog tijd om te vergelijken en te kiezen", tijdInfo: "Leer de opleidingen kennen op een infomoment",
    geenAlt: "Voor deze opleiding hebben we geen opleiding die er rechtstreeks op aansluit", geenAltHandig: "Wel een andere richting uit?",
    keuzeTitel: "Dan beginnen we bij je studiekeuze", keuzeHandig: "Ook handig",
    tipsTitel: "Begin bij onze tips voor je studiekeuze", tipsTekst: "Ontdek stap voor stap welke richting bij je past.",
    vorige: "← Vorige vraag", opnieuw: "Opnieuw beginnen",
    laden: "Bezig met laden…", fout: "De gegevens konden niet geladen worden. Probeer later opnieuw."
  };

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

  #kdg-plek-root .paneel{background:var(--paneel); padding:30px 32px; margin:0 0 18px}
  #kdg-plek-root .stap{font-size:.82em; font-weight:700; text-transform:uppercase; letter-spacing:.05em; margin:0 0 6px}
  #kdg-plek-root .kop{margin:0 0 18px}
  #kdg-plek-root .zoekbox input{width:100%; font:inherit; padding:15px 16px; border:2px solid #000; background:#fff; outline:none; color:#1d1d1b}
  #kdg-plek-root .zoekbox input:focus{box-shadow:0 0 0 3px #000}
  #kdg-plek-root .telling{margin:14px 2px 12px; color:#1d1d1b}
  #kdg-plek-root .paneel .sub{margin:-8px 0 16px}
  #kdg-plek-root .paneel > :last-child{margin-bottom:0}

  #kdg-plek-root .lijst{list-style:none; margin:0; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:14px}
  #kdg-plek-root .lijst li{margin:0; display:flex}
  #kdg-plek-root .lijst li[hidden]{display:none}
  #kdg-plek-root .opl-knop{width:100%; text-align:left; font:inherit; color:#1d1d1b; background:var(--grijs-bg); border:0;
    padding:18px 20px; cursor:pointer; display:flex; flex-direction:column; justify-content:center; gap:10px}
  #kdg-plek-root .opl-knop:hover,#kdg-plek-root .opl-knop:focus{background:var(--grijs-hover); outline:none}
  #kdg-plek-root .opl-nm{font-weight:800; font-size:1.18em}
  #kdg-plek-root .opl-tags{display:flex; flex-wrap:wrap; gap:8px}
  #kdg-plek-root .tag{font-size:.82em; padding:4px 10px; white-space:nowrap}
  #kdg-plek-root .lijst.compact{grid-template-columns:1fr; gap:4px; max-height:380px; overflow-y:auto; padding-right:6px; scrollbar-gutter:stable}
  #kdg-plek-root .lijst.compact .opl-knop{flex-direction:row; align-items:center; justify-content:space-between; gap:12px; padding:9px 14px}
  #kdg-plek-root .lijst.compact .opl-nm{font-weight:700; font-size:1em}
  #kdg-plek-root .lijst.compact .opl-tags{flex-wrap:nowrap; flex:none}
  #kdg-plek-root .lijst.compact .tag{font-size:.75em; padding:2px 8px}

  #kdg-plek-root .terug{font:inherit; color:#1d1d1b; background:none; border:0; cursor:pointer; padding:6px 0; margin:0 22px 18px 0; text-decoration:underline}
  #kdg-plek-root .opl-head{background:var(--paneel); padding:26px 30px; margin:0 0 26px}
  #kdg-plek-root .opl-head h2{margin:0 0 12px}
  #kdg-plek-root .badges{display:flex; flex-wrap:wrap; gap:8px}
  #kdg-plek-root .blok h2{margin:0 0 4px}
  #kdg-plek-root .blok h2{display:flex; flex-wrap:wrap; align-items:center; gap:6px 14px}
  #kdg-plek-root .blok h2 .type{font-weight:400; font-size:.62em; display:inline-flex}
  #kdg-plek-root .sectie{margin-top:22px; padding-top:20px; border-top:1px solid rgba(0,0,0,.25)}
  #kdg-plek-root .sectie.wit{background:#fff; border:0; padding:22px 24px; margin-top:18px}
  #kdg-plek-root .sectie.wit + .sectie{border-top:0; padding-top:0}
  #kdg-plek-root .sectie h3{margin:0 0 6px}
  #kdg-plek-root .blok > h3{margin:0 0 8px}
  #kdg-plek-root .kaarten.inblok{margin-top:18px; gap:18px}
  #kdg-plek-root .sectie.wit h3{margin-bottom:12px}
  #kdg-plek-root .sectie.wit h3:has(+ p),#kdg-plek-root .sectie.wit h3:has(+ ul){margin-bottom:6px}
  #kdg-plek-root .blok .badges{margin-top:10px}
  #kdg-plek-root .of{margin:14px 0 0 !important}
  #kdg-plek-root .of a{color:inherit; text-decoration:underline}
  #kdg-plek-root .opl-head .intro{margin:14px 0 0}
  #kdg-plek-root .sectie p{margin:0 0 12px}
  #kdg-plek-root .sectie p:last-child,#kdg-plek-root .sectie ul:last-child{margin-bottom:0}
  #kdg-plek-root .links{margin:0; padding-left:1.2em}
  #kdg-plek-root .links li{margin:4px 0}
  #kdg-plek-root .links a{color:inherit; text-decoration:underline}
  #kdg-plek-root .links a,#kdg-plek-root .leeglink,#kdg-plek-root .maillink,#kdg-plek-root .terug{color:var(--link); text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:3px; cursor:pointer}
  #kdg-plek-root .links a:hover,#kdg-plek-root .leeglink:hover,#kdg-plek-root .maillink:hover,#kdg-plek-root .terug:hover{text-decoration-thickness:3px}

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
  #kdg-plek-root .cta.breed{display:flex; width:100%; justify-content:space-between; margin-top:18px; padding:18px 22px; font-size:1.1em}


  /* Werkmateriaal voor het overleg, hoort niet bij de widget */
  #kdg-plek-root .status{margin:0; padding:18px 0}

  @media(max-width:640px){
    #kdg-plek-root .paneel{padding:22px 20px}
    #kdg-plek-root .opl-head{padding:22px 20px}
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
  app.innerHTML = `<p class="status">${TEKST.laden}</p>`;

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
  function startKeuze(o) {
    const geldig = (o.late || []).map(l => ({ maand: l.maand, verlies: l.verlies, i: MAANDEN.indexOf(l.maand) })).filter(l => l.i >= nuIdx());
    const zonder = geldig.filter(l => !l.verlies).sort((a, b) => a.i - b.i)[0];
    if (zonder) return zonder;
    return geldig.filter(l => l.verlies).sort((a, b) => b.i - a.i)[0] || null;   // met verlies: de laatste datum telt
  }
  function startBullets(o) {
    const k = startKeuze(o); if (!k) return null;
    const kop = !k.verlies
      ? (k.maand === "februari" && (o.start || []).includes("februari") ? TEKST.startFebZonder : TEKST.startZonder.replace("{maand}", k.maand))
      : TEKST.startMet.replace("{maand}", k.maand);
    return [`<strong>${esc(kop)}</strong>`, esc(k.verlies ? TEKST.startMetUitleg : TEKST.startZonderUitleg)];
  }
  const startRang = o => { const k = startKeuze(o); return !k ? 99 : (k.verlies ? 50 : 0) + k.i; };

  // ---------- Bouwstenen ----------
  const state = { screen: "q1", history: [], stap: 1, opleiding: null, voor: null, thema: null };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const plat = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const TYPE_KLEUR = { "Bachelor": "#6991c8", "Graduaat": "#ff873c" };
  const SVG_KOP = '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
  const ICONS = {
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4.5 8l7.5 5 7.5-5"/>',
    fysiek: '<path d="M12 21c4.2-4.4 6.3-7.6 6.3-10.6a6.3 6.3 0 10-12.6 0C5.7 13.4 7.8 16.6 12 21z"/><circle cx="12" cy="10.4" r="2.3"/>'
  };
  const arrow = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const tag = (label, kleur) => `<span class="tag" style="background:${kleur || "#cdd2d2"}">${esc(label)}</span>`;
  const typeTag = o => tag(o.type, TYPE_KLEUR[o.type]);

  // Knop: act = stap in de webapp, href = echte link, geen van beide = nog geen link
  const knop = (label, o = {}) => o.act
    ? `<button class="cta ${o.sec ? "sec" : ""} ${o.breed ? "breed" : ""}" data-act="${o.act}">${esc(label)} ${arrow}</button>`
    : o.href
      ? `<a class="cta ${o.sec ? "sec" : ""}" href="${esc(o.href)}"${/^mailto:/.test(o.href) ? "" : ' target="_blank" rel="noopener"'}>${esc(label)} ${arrow}</a>`
      : `<span class="cta ${o.sec ? "sec" : ""} leeg">${esc(label)} ${arrow}</span>`;
  const link = (label, href) => href ? `<a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>` : `<span class="leeglink">${esc(label)}</span>`;
  const vast = k => link(LINKS[k].label, LINKS[k].url);
  const vastKnop = (k, o = {}) => knop(LINKS[k].label, { href: LINKS[k].url, sec: o.sec });
  const paginaLink = o => link(TEKST.opleidingspagina, o.url);
  const paginaKnop = (o, primair) => knop(TEKST.opleidingspagina, { href: o.url, sec: !primair });

  const vraag = (kop, knoppen) => `<div class="paneel"><p class="stap">Vraag ${state.stap}</p><h2 class="kop">${esc(kop)}</h2><div class="knoppen">${knoppen}</div></div>`;
  const jaNee = (kop, ja, nee) => vraag(kop, knop("Ja", { act: ja }) + knop("Nee", { act: nee, sec: true }));
  const lijst = (items, act, compact) => `<ul class="lijst${compact ? " compact" : ""}" id="kdg-plek-list">${items.map((it, i) =>
    `<li data-text="${esc(plat(it.naam))}"><button class="opl-knop" data-act="${act}" data-i="${i}"><span class="opl-nm">${esc(it.naam)}</span><span class="opl-tags">${it.tags}</span></button></li>`).join("")}</ul>`;
  const zoekLijst = (kop, placeholder, items, act) => `<div class="paneel"><p class="stap">Vraag ${state.stap}</p><h2 class="kop">${esc(kop)}</h2>
    <div class="zoekbox"><input id="kdg-plek-search" type="text" placeholder="${esc(placeholder)}" autocomplete="off" aria-label="${esc(placeholder)}"></div>
    <p class="telling" id="kdg-plek-telling">${items.length} opleidingen</p>${lijst(items, act, true)}</div>`;
  const sectie = (titel, desc, detail, knoppen, links, wit) => `<section class="sectie${wit ? " wit" : ""}"><h3>${esc(titel)}</h3>${desc ? `<p class="desc">${desc}</p>` : ""}${detail ? `<p class="detail">${detail}</p>` : ""}
    ${knoppen ? `<div class="knoppen">${knoppen}</div>` : ""}${links ? `<ul class="links">${links.map(l => `<li>${l}</li>`).join("")}</ul>` : ""}</section>`;
  const kaart = (ico, titel, desc, detail, knoppen, punten) => `<div class="kaart"><div class="ico">${SVG_KOP}${ICONS[ico]}</svg></div><div>
    <h3>${titel}</h3>${desc ? `<p class="desc">${desc}</p>` : ""}${detail ? `<p class="detail">${detail}</p>` : ""}${punten ? `<ul class="punten">${punten.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
    ${knoppen ? `<div class="knoppen">${knoppen}</div>` : ""}</div></div>`;
  const blok = (o, secties) => `<div class="opl-head blok"><h2>${esc(o.naam)} <span class="type">${tag(o.type, "#fff")}</span></h2>${secties.join("")}</div>`;

  // SLC'er: namen + één mailadres (gedeelde mailbox of persoonlijk adres)
  const mailto = o => "mailto:" + o.mail + "?subject=" + encodeURIComponent(TEKST.mailOnderwerp.replace("{opleiding}", o.naam));
  const slcDetail = o => !o.mail ? esc(TEKST.slcGeen)
    : "Je mailt met " + (o.slc && o.slc.length ? `<b>${esc(o.slc.join(" en "))}</b>: ` : "") + `<a class="maillink" href="${esc(mailto(o))}">${esc(o.mail)}</a>`;
  const slcKnop = o => o.mail ? knop(TEKST.slcKnop, { href: mailto(o) }) : "";
  const startSectie = o => { const b = startBullets(o); return sectie(TEKST.startTitel, "", b ? "" : esc(TEKST.startOnbekend), "", b); };
  const startKort = o => { const b = startBullets(o); return b ? b.join(" ") : esc(TEKST.startOnbekend); };
  const tipsBlok = (titel, badges, handigTitel) => `<div class="opl-head blok"><h2>${esc(titel)}</h2>${badges ? `<div class="badges">${badges}</div>` : ""}
    ${sectie(TEKST.tipsTitel, esc(TEKST.tipsTekst), "", vastKnop("tips"), null, true)}
    ${sectie(handigTitel, "", "", "", [vast("aanbod"), vast("februari"), vast("vrijstellingen")])}</div>`;
  const startQ = r => vraag(TEKST.start, knop(TEKST.startNu, { act: "startNu" + r }) + knop(TEKST.startSept, { act: "startSept" + r, sec: true }));
  const alternatieven = v => v.kdg.map(id => OPL[id]).filter(Boolean);

  // ---------- Schermen ----------
  const screens = {
    q1: () => jaNee(TEKST.q1, "toPick", "toQ2"),
    pick: () => zoekLijst(TEKST.pick, TEKST.pickZoek, LIJST.map(o => ({ naam: o.naam, tags: typeTag(o) })), "chooseOpl"),
    startA: () => startQ("A"),
    startB: () => startQ("B"),

    resultA: () => { const o = state.opleiding; return blok(o, [
      sectie(TEKST.slcTitel, o.mail ? esc(TEKST.slcTekst) : "", slcDetail(o), o.mail ? slcKnop(o) : paginaKnop(o, true), null, true),
      startSectie(o),
      sectie(TEKST.meerWeten, "", "", "", [paginaLink(o), vast("inschrijven"), vast("vrijstellingen")])]); },

    resultA2: () => { const o = state.opleiding; return blok(o, [
      sectie(TEKST.infoTitel, esc(TEKST.infoTekst), "", vastKnop("infomomenten") + paginaKnop(o), null, true),
      sectie(TEKST.twijfel, "", "", "", [vast("tips"), vast("openLessen")]),
      sectie(TEKST.meerWeten, "", "", "", [vast("inschrijven2728")])]); },

    q2: () => jaNee(TEKST.q2, "toQ3", "toThema"),
    q3: () => jaNee(TEKST.q3, "toVoor", "toThema"),

    thema: () => `<div class="paneel"><p class="stap">Vraag ${state.stap}</p><h2 class="kop">${esc(TEKST.thema)}</h2>` +
      lijst(THEMA_NAMEN.map(t => ({ naam: t, tags: tag(THEMAS[t].length + " opleidingen") })), "chooseThema") +
      knop(TEKST.themaWeetNiet, { act: "toC", breed: true }) + `</div>`,

    themaList: () => { const t = state.thema; return `<div class="paneel"><p class="stap">Vraag ${state.stap}</p><h2 class="kop">${esc(TEKST.themaLijst)}</h2><p class="sub">${esc(TEKST.themaSub.replace("{thema}", t))}</p>` +
      lijst(THEMAS[t].map(o => ({ naam: o.naam, tags: typeTag(o) })), "chooseFromThema", true) +
      knop(TEKST.themaTwijfel, { act: "toC", breed: true }) + `</div>`; },

    voor: () => zoekLijst(TEKST.voor, TEKST.voorZoek, VOOR.map(v => ({ naam: v.naam, tags: tag(v.soort) })), "chooseVoor"),

    resultB: () => { const v = state.voor; const alts = alternatieven(v);
      if (!alts.length) return tipsBlok(TEKST.geenAlt, tag(v.naam, "#fff"), TEKST.geenAltHandig);
      const sorted = alts.slice().sort((a, b) => startRang(a) - startRang(b) || a.naam.localeCompare(b.naam, "nl"));
      return `<div class="opl-head blok"><h2>${esc(TEKST.altTitel)}</h2><div class="badges">${tag(v.naam, "#fff")}</div>
        ${sectie(TEKST.altSlcTitel, "", "", "", [esc(TEKST.altSlc1), esc(TEKST.altSlc2)], true)}
        <div class="kaarten inblok">${sorted.map(o => kaart("mail", esc(o.naam) + " " + typeTag(o), startKort(o), slcDetail(o), slcKnop(o) + paginaKnop(o))).join("")}</div>
        ${sectie(TEKST.aanpak, "", "", "", [vast("stappen"), vast("vrijstellingen"), vast("februari")])}</div>`; },

    resultB2: () => { const v = state.voor; const alts = alternatieven(v);
      if (!alts.length) return tipsBlok(TEKST.geenAlt, tag(v.naam, "#fff"), TEKST.geenAltHandig);
      return `<div class="opl-head blok"><h2>${esc(TEKST.tijdTitel)}</h2>
      ${sectie(TEKST.tijdInfo, "", "", vastKnop("infomomenten"), null, true)}
      <section class="sectie"><h3>${esc(TEKST.altTitel)}</h3><div class="badges">${tag(v.naam, "#fff")}</div>
      <div class="kaarten inblok">${alts.map(o => kaart("fysiek", esc(o.naam) + " " + typeTag(o), "", "", paginaKnop(o))).join("")}</div></section>
      ${sectie(TEKST.aanpak, "", "", "", [vast("tips"), vast("openLessen"), vast("vrijstellingen")])}</div>`; },

    resultC: () => tipsBlok(TEKST.keuzeTitel, "", TEKST.keuzeHandig)
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
    const nav = (state.history.length ? `<button class="terug" data-act="back">${esc(TEKST.vorige)}</button>` : "") +
      (state.screen !== "q1" ? `<button class="terug" data-act="restart">${esc(TEKST.opnieuw)}</button>` : "");
    app.innerHTML = (nav ? `<div>${nav}</div>` : "") + screens[state.screen]();
    const search = document.getElementById("kdg-plek-search");
    if (search) {
      search.addEventListener("input", () => {
        const q = plat(search.value.trim()); let n = 0;
        app.querySelectorAll("#kdg-plek-list li").forEach(li => { li.hidden = !!q && !li.dataset.text.includes(q); if (!li.hidden) n++; });
        const t = document.getElementById("kdg-plek-telling"); if (t) t.textContent = n + " opleiding" + (n === 1 ? "" : "en");
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

  fetch(DATA_URL, { cache: "no-cache" })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => { laad(data); render(false); })
    .catch(() => { app.innerHTML = `<p class="status">${esc(TEKST.fout)}</p>`; });
})();
