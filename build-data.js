/**
 * build-data.js — genereert data.json uit de Airtable-base "Opleidingsportfolio KdG V2".
 * Wordt elk uur uitgevoerd door de GitHub Action (.github/workflows/update-data.yml).
 *
 * Vereist env-variabele AIRTABLE_TOKEN (Personal Access Token, scope data.records:read, alleen deze base).
 * Optioneel: AIRTABLE_BASE (default = de base hieronder).
 *
 * Node 18+ (globale fetch). Geen externe dependencies.
 * Tabellen en velden worden op ID aangesproken: een veld hernoemen in Airtable breekt dit script niet.
 */
const fs = require('fs');

const BASE = process.env.AIRTABLE_BASE || 'appBu1JAcv2ArUIDW';

// Tabel "Opleidingsaanbod website"
const OPL = {
  table: 'tblfUr00XRAeMSW13',
  title: 'fldLMIH0a6oknvB6X',        // title
  url: 'fldYdiM1pOx90tnKw',          // webaddress
  type: 'fldLgafWyLfTeh7JI',         // Opleidingstype (lookup)
  start: 'fldkGsHeipIbM3GMG',        // Startmomenten
  late: 'fldBkjm66w4gOn45c',         // Late inschrijving mogelijk tot
  themas: 'fldVwXFRraRUuxLkA',       // Interessegebied studiekiezers
  slc: 'fldH5ckPLlGxF3vzv',          // SLC'er (link naar _Contactpersonen)
  mail: 'fldkKnd1sLr2JbjJ7'          // SLC - E-mails
};
// Tabel "Vooropleidingen"
const VOOR = {
  table: 'tbl3nzwPZ19O2tJOT',
  naam: 'fldpS9POQq9D1VrPx',         // Vooropleiding (officiële naam)
  soort: 'fldkEmdKZvRTM0dsd',        // Soort opleiding
  kdg: 'fldg3QuUQGfdATBaN'           // KdG-opleidingen (koppeling)
};
// Tabel "_Contactpersonen"
const CONTACT = { table: 'tblYOrbjkD6gOFRW6', naam: 'fld186vrjXecnb78Q', mail: 'fldbIqe44sQ9xUNEP' };
// Tabel met de opleidingstypes
const TYPE = { table: 'tblIRCuc7DOz6l3LN', naam: 'fldSPnaKwvKVUG9UX' };

// Welke types komen in de keuzelijsten van de webapp, en met welk label
const TYPE_LABEL = {
  'Professionele bachelor': 'Bachelor', 'Educatieve bachelor': 'Bachelor', 'Academische bachelor': 'Bachelor', 'Graduaat': 'Graduaat'
};
// Pagina's die niet in de keuzelijsten horen: verkorte trajecten, werkstudenten, afstudeerstudio's ...
const NIET_IN_LIJST = / - |^Verkorte |Extra Vak|\(in English\)|^Studio /i;
const SOORT_LABEL = {
  'Academisch gerichte bachelor': 'Academische bachelor', 'Professioneel gerichte bachelor': 'Professionele bachelor',
  'Educatieve bachelor': 'Educatieve bachelor', 'Graduaatsopleiding': 'Graduaat'
};

const arr = v => Array.isArray(v) ? v : (v == null ? [] : [v]);
const naamVan = v => (v && typeof v === 'object') ? (v.name || '') : (v || '');
const idVan = v => (v && typeof v === 'object') ? v.id : v;
const plat = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
const isEngels = u => /\/en\//.test(u || '');

// Keuzes met een vraagteken zijn interne notities ("nog na te kijken"): die gaan niet naar de website.
const zeker = s => s && !s.includes('?');
/** "Februari MET studietijdverlies" -> { maand: "februari", verlies: true } */
function leesLate(s) {
  const m = /^(\S+)\s+(MET|ZONDER)\s+studietijdverlies/i.exec(s);
  return m ? { maand: m[1].toLowerCase(), verlies: m[2].toUpperCase() === 'MET' } : null;
}

/** "Van Peteghem Ingrid" -> "Ingrid Van Peteghem". Het mailadres (voornaam.achternaam@) bepaalt waar de voornaam begint. */
function toonNaam(naam, mail) {
  const w = String(naam || '').trim().split(/\s+/);
  if (w.length < 2) return w.join(' ');
  const voor = plat(String(mail || '').split('@')[0].split('.')[0]);
  let n = 1;
  for (let k = 1; k < w.length; k++) if (voor && plat(w.slice(-k).join('')) === voor) { n = k; break; }
  return w.slice(-n).join(' ') + ' ' + w.slice(0, -n).join(' ');
}

/** Zet de ruwe Airtable-records om naar de data voor de webapp. */
function bouw({ opl, voor, contacten, types }) {
  const typeNaam = {}; types.forEach(r => typeNaam[r.id] = r.fields[TYPE.naam] || '');
  const contact = {}; contacten.forEach(r => contact[r.id] = { naam: (r.fields[CONTACT.naam] || '').trim(), mail: (r.fields[CONTACT.mail] || '').trim().toLowerCase() });

  // 1) Elke opleidingspagina omzetten
  const paginas = opl.map(r => {
    const f = r.fields;
    const type = arr(f[OPL.type]).map(v => typeNaam[idVan(v)] || naamVan(v)).filter(Boolean)[0] || '';
    const mail = (f[OPL.mail] || '').trim().toLowerCase();
    let slc = arr(f[OPL.slc]).map(v => contact[idVan(v)]).filter(Boolean);
    // Persoonlijk adres van een van de SLC'ers? Toon dan alleen die persoon. Gedeelde mailbox: toon iedereen.
    const eigenaar = slc.filter(c => c.mail === mail);
    if (eigenaar.length) slc = eigenaar;
    return {
      id: r.id, naam: (f[OPL.title] || '').trim(), typeVol: type, type: TYPE_LABEL[type] || type,
      url: f[OPL.url] || '', themas: arr(f[OPL.themas]).map(naamVan),
      start: arr(f[OPL.start]).map(naamVan).filter(zeker).map(s => s.toLowerCase()),
      late: arr(f[OPL.late]).map(naamVan).filter(zeker).map(leesLate).filter(Boolean),
      slc: slc.map(c => toonNaam(c.naam, c.mail)), mail
    };
  }).filter(p => p.naam);

  // 2) Dubbele pagina's (bv. Nederlandse en Engelse pagina) samenvoegen tot een opleiding
  const groepen = {};
  paginas.forEach(p => { const k = p.naam + ' | ' + p.type; (groepen[k] = groepen[k] || []).push(p); });
  const kanoniek = {}, opleidingen = {};
  Object.keys(groepen).forEach(k => {
    const g = groepen[k].slice().sort((a, b) =>
      (isEngels(a.url) - isEngels(b.url)) || ((b.mail ? 1 : 0) - (a.mail ? 1 : 0)) || (a.url.length - b.url.length));
    const p = g[0];
    p.themas = [...new Set(g.flatMap(x => x.themas))];
    p.lijst = !!TYPE_LABEL[p.typeVol] && !NIET_IN_LIJST.test(p.naam) && !isEngels(p.url);
    g.forEach(x => kanoniek[x.id] = p.id);
    opleidingen[p.id] = p;
  });

  // 3) Vooropleidingen met hun KdG-opleidingen
  const gebruikt = new Set();
  const vooropleidingen = voor.map(r => {
    const f = r.fields;
    const kdg = [...new Set(arr(f[VOOR.kdg]).map(v => kanoniek[idVan(v)]).filter(Boolean))];
    kdg.forEach(id => gebruikt.add(id));
    const soort = naamVan(f[VOOR.soort]);
    return { naam: (f[VOOR.naam] || '').trim(), soort: SOORT_LABEL[soort] || soort, kdg };
  }).filter(v => v.naam).sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));

  // 4) Alleen opleidingen bewaren die in een lijst staan of waar een vooropleiding naar verwijst
  const lijst = Object.values(opleidingen).filter(p => p.lijst || gebruikt.has(p.id))
    .sort((a, b) => a.naam.localeCompare(b.naam, 'nl') || a.type.localeCompare(b.type, 'nl'))
    .map(({ typeVol, ...p }) => p);

  return { updated: new Date().toISOString(), opleidingen: lijst, vooropleidingen };
}

async function fetchAll(table, velden) {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  let records = [], offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE}/${table}`);
    url.searchParams.set('pageSize', '100');
    url.searchParams.set('returnFieldsByFieldId', 'true');
    velden.forEach(v => url.searchParams.append('fields[]', v));
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} — ${await res.text()}`);
    const json = await res.json();
    records = records.concat(json.records);
    offset = json.offset;
  } while (offset);
  return records;
}

async function main() {
  if (!process.env.AIRTABLE_TOKEN) { console.error('FOUT: AIRTABLE_TOKEN ontbreekt.'); process.exit(1); }
  const velden = o => Object.keys(o).filter(k => k !== 'table').map(k => o[k]);
  const [opl, voor, contacten, types] = await Promise.all([
    fetchAll(OPL.table, velden(OPL)), fetchAll(VOOR.table, velden(VOOR)),
    fetchAll(CONTACT.table, velden(CONTACT)), fetchAll(TYPE.table, velden(TYPE))
  ]);
  const out = bouw({ opl, voor, contacten, types });
  // Veiligheid: een lege of bijna lege uitkomst wijst op een fout; dan de vorige data.json laten staan.
  if (out.opleidingen.length < 20) throw new Error(`Slechts ${out.opleidingen.length} opleidingen gevonden; data.json niet overschreven.`);
  fs.writeFileSync('data.json', JSON.stringify(out, null, 1));
  const zonderMail = out.opleidingen.filter(o => o.lijst && !o.mail).map(o => o.naam);
  console.log(`data.json geschreven: ${out.opleidingen.length} opleidingen (${out.opleidingen.filter(o => o.lijst).length} in de keuzelijsten), ${out.vooropleidingen.length} vooropleidingen.`);
  if (zonderMail.length) console.log('Zonder SLC-mailadres: ' + zonderMail.join(', '));
}

module.exports = { bouw, toonNaam };
if (require.main === module) main().catch(e => { console.error(e); process.exit(1); });
