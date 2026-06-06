// FLAG_STYLE: visual similarity data for every country flag.
// Used by the quiz to pick wrong-answer flags that look similar to the correct one.
//
// c = dominant colors  (r=red  w=white  b=blue  g=green  y=yellow  k=black  o=orange  t=turquoise)
// p = pattern          (h=horizontal stripes  v=vertical stripes  x=cross  o=other/complex)
//
// Similarity score = shared color count + 3 bonus if same pattern.

const FLAG_STYLE = {
  // ── Africa ────────────────────────────────────────────────────────────────
  dz: { c:['g','w'],       p:'o' }, // Algeria      – green/white, crescent
  ao: { c:['r','k','y'],   p:'h' }, // Angola       – red/black + yellow emblem
  bj: { c:['g','y','r'],   p:'v' }, // Benin        – green|yellow|red vertical
  bw: { c:['b','w','k'],   p:'h' }, // Botswana     – blue/white/black stripes
  bf: { c:['r','g','y'],   p:'h' }, // Burkina Faso – red/green, yellow star
  bi: { c:['r','w','g'],   p:'o' }, // Burundi      – red/green, diagonal
  cv: { c:['b','w','r'],   p:'h' }, // Cabo Verde   – blue stripes, red stripe
  cm: { c:['g','r','y'],   p:'v' }, // Cameroon     – green|red|yellow + star
  cf: { c:['b','w','g'],   p:'v' }, // C.A.R.       – blue|white|green|yellow|red
  td: { c:['b','y','r'],   p:'v' }, // Chad         – blue|yellow|red vertical
  km: { c:['g','w','y'],   p:'o' }, // Comoros      – green, crescent
  cd: { c:['b','r','y'],   p:'o' }, // DR Congo     – blue/red, diagonal yellow
  cg: { c:['g','y','r'],   p:'o' }, // Rep. Congo   – green/yellow/red diagonal
  dj: { c:['b','g','w'],   p:'o' }, // Djibouti     – blue/green, white triangle
  eg: { c:['r','w','k'],   p:'h' }, // Egypt        – red/white/black + eagle
  gq: { c:['g','w','r'],   p:'h' }, // Eq. Guinea   – green/white/red + emblem
  er: { c:['g','r','b'],   p:'o' }, // Eritrea      – green/red/blue triangle
  sz: { c:['b','y','r'],   p:'o' }, // Eswatini     – blue/yellow/red, shield
  et: { c:['g','y','r'],   p:'h' }, // Ethiopia     – green/yellow/red + star
  ga: { c:['g','y','b'],   p:'h' }, // Gabon        – green/yellow/blue stripes
  gm: { c:['r','b','g'],   p:'h' }, // Gambia       – red/blue/green + white
  gh: { c:['r','y','g'],   p:'h' }, // Ghana        – red/gold/green + black star
  gn: { c:['r','y','g'],   p:'v' }, // Guinea       – red|yellow|green vertical
  gw: { c:['r','k','g'],   p:'o' }, // Guinea-Bissau– red/black/green + star
  ci: { c:['o','w','g'],   p:'v' }, // Ivory Coast  – orange|white|green vertical
  ke: { c:['k','r','g'],   p:'h' }, // Kenya        – black/red/green + shield
  ls: { c:['b','w','g'],   p:'h' }, // Lesotho      – blue/white/green + hat
  lr: { c:['r','w','b'],   p:'o' }, // Liberia      – red/white stripes, blue canton
  ly: { c:['k','r','g'],   p:'h' }, // Libya        – black/red/green + crescent
  mg: { c:['r','g','w'],   p:'v' }, // Madagascar   – white|red, green stripe
  mw: { c:['k','r','g'],   p:'h' }, // Malawi       – black/red/green + sun
  ml: { c:['g','y','r'],   p:'v' }, // Mali         – green|yellow|red vertical
  mr: { c:['g','y','r'],   p:'o' }, // Mauritania   – green + crescent/star/stripes
  mu: { c:['r','b','y'],   p:'h' }, // Mauritius    – red/blue/yellow/green stripes
  ma: { c:['r','g'],       p:'o' }, // Morocco      – red, green pentagram
  mz: { c:['g','k','y'],   p:'o' }, // Mozambique   – green/black/yellow + AK47
  na: { c:['b','r','g'],   p:'o' }, // Namibia      – blue/red/green + sun
  ne: { c:['o','w','g'],   p:'h' }, // Niger        – orange/white/green + circle
  ng: { c:['g','w'],       p:'v' }, // Nigeria      – green|white|green vertical
  rw: { c:['b','y','g'],   p:'h' }, // Rwanda       – blue/yellow/green + sun
  st: { c:['g','y','r'],   p:'h' }, // São Tomé     – green/yellow/red + stars
  sn: { c:['g','y','r'],   p:'v' }, // Senegal      – green|yellow|red + star
  sc: { c:['b','y','r'],   p:'o' }, // Seychelles   – radiating rays
  sl: { c:['g','w','b'],   p:'h' }, // Sierra Leone – green/white/blue
  so: { c:['b','w'],       p:'o' }, // Somalia      – blue + white star
  za: { c:['g','k','r'],   p:'o' }, // South Africa – multicolor Y-shape
  ss: { c:['k','r','g'],   p:'h' }, // South Sudan  – black/red/green + triangle
  sd: { c:['r','w','k'],   p:'h' }, // Sudan        – red/white/black + green
  tz: { c:['g','y','k'],   p:'o' }, // Tanzania     – green/yellow/black diagonal
  tg: { c:['g','y','r'],   p:'o' }, // Togo         – green/yellow/red + star
  tn: { c:['r','w'],       p:'o' }, // Tunisia      – red/white, crescent
  ug: { c:['k','y','r'],   p:'h' }, // Uganda       – black/yellow/red stripes
  zm: { c:['g','r','k'],   p:'o' }, // Zambia       – green + red/black/orange
  zw: { c:['g','y','r'],   p:'o' }, // Zimbabwe     – green/yellow/red + black

  // ── Asia ──────────────────────────────────────────────────────────────────
  af: { c:['k','r','g'],   p:'v' }, // Afghanistan  – black|red|green + emblem
  am: { c:['r','b','o'],   p:'h' }, // Armenia      – red/blue/orange stripes
  az: { c:['b','r','g'],   p:'h' }, // Azerbaijan   – blue/red/green + crescent
  bh: { c:['r','w'],       p:'o' }, // Bahrain      – red/white serrated
  bd: { c:['g','r'],       p:'o' }, // Bangladesh   – green + red disc
  bt: { c:['o','r','y'],   p:'o' }, // Bhutan       – orange/red, dragon
  bn: { c:['y','k','w'],   p:'o' }, // Brunei       – yellow + black/white stripes
  kh: { c:['b','r','w'],   p:'h' }, // Cambodia     – blue/red + white temple
  cn: { c:['r','y'],       p:'o' }, // China        – red + yellow stars
  cy: { c:['w','o','g'],   p:'o' }, // Cyprus       – white + map outline
  ge: { c:['w','r'],       p:'x' }, // Georgia      – white + red cross
  in: { c:['o','w','g'],   p:'h' }, // India        – orange/white/green + wheel
  id: { c:['r','w'],       p:'h' }, // Indonesia    – red/white horizontal
  ir: { c:['g','w','r'],   p:'h' }, // Iran         – green/white/red + emblem
  iq: { c:['r','w','k'],   p:'h' }, // Iraq         – red/white/black + eagle
  il: { c:['w','b'],       p:'o' }, // Israel       – white/blue + star of David
  jp: { c:['w','r'],       p:'o' }, // Japan        – white + red disc
  jo: { c:['k','w','g'],   p:'h' }, // Jordan       – black/white/green + star
  kz: { c:['b','y'],       p:'o' }, // Kazakhstan   – blue + yellow sun
  kw: { c:['g','w','r'],   p:'h' }, // Kuwait       – green/white/red/black
  kg: { c:['r','y'],       p:'o' }, // Kyrgyzstan   – red + yellow sun symbol
  la: { c:['r','b','w'],   p:'h' }, // Laos         – red/blue/white + circle
  lb: { c:['r','w','g'],   p:'h' }, // Lebanon      – red/white + cedar
  my: { c:['r','w','b'],   p:'o' }, // Malaysia     – red/white stripes + blue canton
  mv: { c:['r','g','w'],   p:'o' }, // Maldives     – red + green + crescent
  mn: { c:['r','b','y'],   p:'h' }, // Mongolia     – red/blue/red + soyombo
  mm: { c:['y','g','r'],   p:'h' }, // Myanmar      – yellow/green/red + star
  np: { c:['r','b','w'],   p:'o' }, // Nepal        – red/blue, pennant shape
  kp: { c:['r','w','b'],   p:'h' }, // N.Korea      – red/white/blue + star
  om: { c:['r','w','g'],   p:'o' }, // Oman         – red/white/green + emblem
  pk: { c:['g','w'],       p:'o' }, // Pakistan     – green/white + crescent
  ps: { c:['k','w','g'],   p:'h' }, // Palestine    – black/white/green + red
  ph: { c:['b','r','w'],   p:'o' }, // Philippines  – blue/red/white + sun
  qa: { c:['r','w'],       p:'o' }, // Qatar        – maroon/white serrated
  sa: { c:['g','w'],       p:'o' }, // Saudi Arabia – green + sword/script
  sg: { c:['r','w'],       p:'h' }, // Singapore    – red/white + crescent
  kr: { c:['w','r','b'],   p:'o' }, // S.Korea      – white + yin-yang + trigrams
  lk: { c:['r','y','g'],   p:'o' }, // Sri Lanka    – red/yellow/green + lion
  sy: { c:['r','w','k'],   p:'h' }, // Syria        – red/white/black + stars
  tw: { c:['r','b','w'],   p:'o' }, // Taiwan       – red/blue + white sun
  tj: { c:['r','w','g'],   p:'h' }, // Tajikistan   – red/white/green + emblem
  th: { c:['r','w','b'],   p:'h' }, // Thailand     – red/white/blue/white/red
  tl: { c:['r','k','y'],   p:'o' }, // Timor-Leste  – red + black/yellow triangle
  tr: { c:['r','w'],       p:'o' }, // Turkey       – red + crescent/star
  tm: { c:['g','r','w'],   p:'o' }, // Turkmenistan – green + red carpet strip
  ae: { c:['g','w','k'],   p:'h' }, // UAE          – green/white/black/red
  uz: { c:['b','w','g'],   p:'h' }, // Uzbekistan   – blue/white/green + crescent
  vn: { c:['r','y'],       p:'o' }, // Vietnam      – red + yellow star
  ye: { c:['r','w','k'],   p:'h' }, // Yemen        – red/white/black stripes

  // ── Europe ────────────────────────────────────────────────────────────────
  al: { c:['r','k'],       p:'o' }, // Albania      – red + black eagle
  ad: { c:['b','y','r'],   p:'v' }, // Andorra      – blue|yellow|red + emblem
  at: { c:['r','w'],       p:'h' }, // Austria      – red/white/red stripes
  by: { c:['r','g','w'],   p:'h' }, // Belarus      – red/green + white ornament
  be: { c:['k','y','r'],   p:'v' }, // Belgium      – black|yellow|red vertical
  ba: { c:['b','y','w'],   p:'o' }, // Bosnia       – blue + yellow triangle, stars
  bg: { c:['w','g','r'],   p:'h' }, // Bulgaria     – white/green/red stripes
  hr: { c:['r','w','b'],   p:'h' }, // Croatia      – red/white/blue + shield
  cz: { c:['w','r','b'],   p:'o' }, // Czech Rep.   – white/red + blue triangle
  dk: { c:['r','w'],       p:'x' }, // Denmark      – red + white cross
  ee: { c:['b','k','w'],   p:'h' }, // Estonia      – blue/black/white stripes
  fi: { c:['w','b'],       p:'x' }, // Finland      – white + blue cross
  fr: { c:['b','w','r'],   p:'v' }, // France       – blue|white|red vertical
  de: { c:['k','r','y'],   p:'h' }, // Germany      – black/red/yellow stripes
  gr: { c:['b','w'],       p:'o' }, // Greece       – blue/white stripes + cross
  hu: { c:['r','w','g'],   p:'h' }, // Hungary      – red/white/green stripes
  is: { c:['b','r','w'],   p:'x' }, // Iceland      – blue + red/white cross
  ie: { c:['g','w','o'],   p:'v' }, // Ireland      – green|white|orange vertical
  it: { c:['g','w','r'],   p:'v' }, // Italy        – green|white|red vertical
  xk: { c:['b','y','w'],   p:'o' }, // Kosovo       – blue + gold map
  lv: { c:['r','w'],       p:'h' }, // Latvia       – dark red/white/dark red
  li: { c:['b','r','y'],   p:'h' }, // Liechtenstein– blue/red + crown
  lt: { c:['y','g','r'],   p:'h' }, // Lithuania    – yellow/green/red stripes
  lu: { c:['r','w','b'],   p:'h' }, // Luxembourg   – red/white/light-blue
  mt: { c:['w','r'],       p:'h' }, // Malta        – white/red + cross
  md: { c:['b','y','r'],   p:'v' }, // Moldova      – blue|yellow|red + emblem
  mc: { c:['r','w'],       p:'h' }, // Monaco       – red/white halves
  me: { c:['r','y'],       p:'o' }, // Montenegro   – red/gold + eagle
  mk: { c:['r','y'],       p:'o' }, // N.Macedonia  – red + yellow sun
  nl: { c:['r','w','b'],   p:'h' }, // Netherlands  – red/white/blue stripes
  no: { c:['r','b','w'],   p:'x' }, // Norway       – red + blue/white cross
  pl: { c:['w','r'],       p:'h' }, // Poland       – white/red stripes
  pt: { c:['g','r','y'],   p:'o' }, // Portugal     – green/red + coat of arms
  ro: { c:['b','y','r'],   p:'v' }, // Romania      – blue|yellow|red vertical
  ru: { c:['w','b','r'],   p:'h' }, // Russia       – white/blue/red stripes
  sm: { c:['b','w'],       p:'h' }, // San Marino   – blue/white + towers
  rs: { c:['r','b','w'],   p:'h' }, // Serbia       – red/blue/white + eagle
  sk: { c:['w','b','r'],   p:'h' }, // Slovakia     – white/blue/red + cross
  si: { c:['w','b','r'],   p:'h' }, // Slovenia     – white/blue/red + mountains
  es: { c:['r','y'],       p:'h' }, // Spain        – red/yellow/red + emblem
  se: { c:['b','y'],       p:'x' }, // Sweden       – blue + yellow cross
  ch: { c:['r','w'],       p:'o' }, // Switzerland  – red + white cross (square)
  ua: { c:['b','y'],       p:'h' }, // Ukraine      – blue/yellow halves
  gb: { c:['r','w','b'],   p:'x' }, // UK           – red/white/blue union jack
  va: { c:['y','w'],       p:'o' }, // Vatican      – yellow/white + keys

  // ── North America ─────────────────────────────────────────────────────────
  ag: { c:['k','b','w'],   p:'o' }, // Antigua      – black/blue/white + sun
  bs: { c:['b','y','k'],   p:'o' }, // Bahamas      – aqua/yellow + black triangle
  bb: { c:['b','y'],       p:'h' }, // Barbados     – blue/yellow/blue + trident
  bz: { c:['b','r','w'],   p:'o' }, // Belize       – blue/red + coat of arms
  ca: { c:['r','w'],       p:'o' }, // Canada       – red/white + maple leaf
  cr: { c:['b','w','r'],   p:'h' }, // Costa Rica   – blue/white/red/white/blue
  cu: { c:['b','w','r'],   p:'o' }, // Cuba         – blue/white stripes + red triangle
  dm: { c:['g','r','y'],   p:'o' }, // Dominica     – green + cross + parrot
  do: { c:['b','r','w'],   p:'o' }, // Dom. Rep.    – blue/red + white cross
  sv: { c:['b','w'],       p:'h' }, // El Salvador  – blue/white/blue stripes
  gd: { c:['r','y','g'],   p:'o' }, // Grenada      – red/yellow/green + nutmeg
  gt: { c:['b','w'],       p:'v' }, // Guatemala    – blue|white|blue + quetzal
  ht: { c:['b','r','w'],   p:'h' }, // Haiti        – blue/red + coat of arms
  hn: { c:['b','w'],       p:'h' }, // Honduras     – blue/white/blue + stars
  jm: { c:['k','y','g'],   p:'o' }, // Jamaica      – black/yellow/green X
  mx: { c:['g','w','r'],   p:'v' }, // Mexico       – green|white|red + eagle
  ni: { c:['b','w'],       p:'h' }, // Nicaragua    – blue/white/blue + rainbow
  pa: { c:['r','w','b'],   p:'o' }, // Panama       – red/white/blue + stars
  kn: { c:['g','k','r'],   p:'o' }, // St Kitts     – green/black/red + stars
  lc: { c:['b','w','y'],   p:'o' }, // St Lucia     – blue + white/yellow triangles
  vc: { c:['b','y','g'],   p:'o' }, // St Vincent   – blue/yellow/green + diamonds
  tt: { c:['r','k','w'],   p:'o' }, // Trinidad     – red + black/white diagonal
  us: { c:['r','w','b'],   p:'o' }, // USA          – red/white stripes + blue canton

  // ── Oceania ───────────────────────────────────────────────────────────────
  au: { c:['b','r','w'],   p:'o' }, // Australia    – blue + union jack + stars
  fj: { c:['b','r','w'],   p:'o' }, // Fiji         – light blue + union jack
  ki: { c:['r','b','y'],   p:'o' }, // Kiribati     – red/blue + sun/bird
  mh: { c:['b','w','o'],   p:'o' }, // Marshall Is. – blue + diagonal stripes
  fm: { c:['b','w'],       p:'o' }, // Micronesia   – blue + 4 stars
  nr: { c:['b','y','w'],   p:'o' }, // Nauru        – blue + yellow stripe
  nz: { c:['b','r','w'],   p:'o' }, // New Zealand  – blue + union jack + stars
  pw: { c:['b','y'],       p:'o' }, // Palau        – blue + yellow circle
  pg: { c:['r','k','y'],   p:'o' }, // Papua N.G.   – red/black + bird + stars
  ws: { c:['r','b','w'],   p:'o' }, // Samoa        – red + blue canton + stars
  sb: { c:['b','g','y'],   p:'o' }, // Solomon Is.  – blue/green + yellow diagonal
  to: { c:['r','w'],       p:'o' }, // Tonga        – red + white cross canton
  tv: { c:['b','r','w'],   p:'o' }, // Tuvalu       – blue + union jack + stars
  vu: { c:['r','g','k'],   p:'o' }, // Vanuatu      – red/green + black triangle

  // ── South America ─────────────────────────────────────────────────────────
  ar: { c:['b','w','y'],   p:'h' }, // Argentina    – blue/white/blue + sun
  bo: { c:['r','y','g'],   p:'h' }, // Bolivia      – red/yellow/green stripes
  br: { c:['g','y','b'],   p:'o' }, // Brazil       – green/yellow + blue circle
  cl: { c:['r','w','b'],   p:'o' }, // Chile        – red/white/blue + star
  co: { c:['y','b','r'],   p:'h' }, // Colombia     – yellow/blue/red stripes
  ec: { c:['y','b','r'],   p:'h' }, // Ecuador      – yellow/blue/red + emblem
  gy: { c:['g','r','y'],   p:'o' }, // Guyana       – green/red/yellow/black
  py: { c:['r','w','b'],   p:'h' }, // Paraguay     – red/white/blue + emblems
  pe: { c:['r','w'],       p:'v' }, // Peru         – red|white|red vertical
  sr: { c:['g','w','r'],   p:'h' }, // Suriname     – green/white/red + star
  uy: { c:['b','w','y'],   p:'o' }, // Uruguay      – blue/white stripes + sun
  ve: { c:['y','b','r'],   p:'h' }, // Venezuela    – yellow/blue/red + arc of stars
};
