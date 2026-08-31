export const STORAGE_KEY = 'swa-wealth-academy-budget-v1';

export const MONTHS = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember',
];

/** Every editable list on a month, with the labels a fresh month starts from. */
export const DEFAULT_LABELS = {
  income: [
    'Lønn etter skatt',
    'Barnetrygd',
    'Leieinntekter',
    'Andre inntekter',
  ],
  costs: [
    'Boliglån (renter og avdrag)',
    'Studielån (månedlige renter og avdrag)',
    'Billån (renter og avdrag)',
    'Husleie/fellesutgifter',
    'Andre faste boligutgifter utenom forsikring (boligalarm, vask etc.)',
    'Kommunale avgifter',
    'Strøm',
    'Mat og andre dagligvarer (alt du kjøper på matbutikken)',
    'Forsikringer (innbo, reise, livforsikring...)',
    'Transport (drivstoff, bompassering, kollektivtransport etc.)',
    'Helse (lege, tannlege, apotekvarer)',
    'Personlig pleie (frisør, sminke, spa, massasje, o.l.)',
    'Barnehage og SFO',
    'Klær, sko og fritidsutstyr',
    'Faste fritidsaktiviteter',
    'Interiør (møbler og andre ting til hjemmet)',
    'Abonnement (mobil, trening, aviser, musikk, internett, TV, etc.)',
    'Andre levekostnader (kafébesøk, kos, etc.)',
    'Faste beløp til konkrete ideelle formål',
    'Evt. Forbrukslån (månedlige renter og avdrag)',
    'Evt. Kredittkort (månedlige renter og avdrag)',
  ],
  buffer: [
    'Fest og feiring',
    'Gaver (til bursdager, jul, babyshowers, etc.)',
    'Vedlikehold (bolig, bil etc.)',
    'Sparing til ferie',
    'Sparing til andre kortsiktige mål',
  ],
  assets: [
    'Brukskonto',
    'Sparekonto',
    'Fond og aksjer',
    'Pensjon',
    'BSU',
    'Bolig (markedsverdi)',
    'Bil / kjøretøy',
    'Kontanter som du har liggende',
    'Annet av verdi',
  ],
  debts: [
    'Boliglån',
    'Studielån',
    'Billån',
    'Kredittkort',
    'Forbrukslån',
    'Annen gjeld',
  ],
};

export const LIST_KEYS = Object.keys(DEFAULT_LABELS);

export const VIEWS = [
  { id: 'dashboard', label: 'Oversikt' },
  { id: 'budget', label: 'Budsjett' },
  { id: 'rule', label: '50/30/20' },
  { id: 'networth', label: 'Formue' },
  { id: 'history', label: 'Historikk' },
];
