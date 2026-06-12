# Countries of the World — Project Handoff

## What this project is
A static educational website for Year 5–6 students covering 197 countries.
Each country has a flag, GeoChart distribution map, capital, population, national animal, continent, and a fun fact.
A full quiz mode is included with 7 question types, a 20-second timer, and speed+accuracy scoring.

## Live URL
https://countriesoftheworldfacts.netlify.app

## GitHub repo
https://github.com/leonsteyn/countries-of-the-world

## Deployment
- Hosted on **Netlify**, auto-deploys from the `main` branch on GitHub.
- `netlify.toml` sets `publish = "."` (no build step — pure static files).
- To deploy a change: commit and `git push origin main`. Netlify picks it up automatically.

## Tech stack
- **Vanilla HTML / CSS / JavaScript only** — no frameworks, no npm, no build step.
- **Google GeoCharts** (`https://www.gstatic.com/charts/loader.js`) for country maps.
- **flagcdn.com** (`https://flagcdn.com/w320/{iso2}.png`) for flag images.
- **Fonts**: Fredoka One + Nunito from Google Fonts.

---

## File structure

```
countries-of-the-world/
├── index.html          Landing page — shows a random country card
├── continent.html      Lists all countries in a continent
├── country.html        Individual country card page
├── quiz.html           Quiz page
├── css/
│   ├── styles.css      Shared styles (header, cards, nav, responsive)
│   └── quiz.css        Quiz-specific styles
├── js/
│   ├── app.js          Shared logic (header builder, card renderer, GeoChart)
│   └── quiz.js         Full quiz engine
└── data/
    ├── countries.js    Global COUNTRIES array (197 countries)
    └── flag-groups.js  Visual flag similarity data (FLAG_STYLE object)
```

---

## Data format — `data/countries.js`

Exports a global `const COUNTRIES = [...]` array. Each entry:

```js
{
  name:       "France",
  iso2:       "fr",           // ISO 3166-1 alpha-2 (lowercase) — used for flag CDN
  continent:  "Europe",       // must match a key in CONTINENT_CONFIG
  subregion:  "155",          // UN M.49 region code — used to zoom the GeoChart
  capital:    "Paris",
  population: "68 million",
  animal:     "Gallic Rooster",
  fact:       "France is the most visited country...",
  emoji:      "🇫🇷",
}
```

**GeoChart unsupported territories** (no map rendered):
`xk` (Kosovo), `tw` (Taiwan), `ps` (Palestine), `va` (Vatican) — stored in `GEO_UNSUPPORTED` set in `app.js`.

---

## Data format — `data/flag-groups.js`

Exports a global `FLAG_STYLE` object used by the quiz to find visually similar flags:

```js
const FLAG_STYLE = {
  fr: { c: ['b','w','r'], p: 'v' },
  // c = colours: r=red w=white b=blue g=green y=yellow k=black o=orange
  // p = pattern: h=horizontal v=vertical x=cross o=other
};
```

Every one of the 197 countries has an entry. Used in `getSimilarFlagCountries()` in `quiz.js`.

---

## Shared logic — `js/app.js`

Key functions:

| Function | Purpose |
|---|---|
| `buildHeader(activeContinent)` | Injects site header with continent pills into `#site-header` |
| `buildCardHTML(country)` | Returns full country card HTML string |
| `renderCard(country, containerId)` | Renders card + triggers GeoChart |
| `drawGeoChart(divId, iso2Upper, subregionCode, color)` | Draws a Google GeoChart |
| `onGoogleChartsReady()` | Called by Google Charts loader callback — flushes queued charts |
| `hexToRgba(hex, alpha)` | Colour utility |
| `getQueryParam(name)` | Reads a URL query parameter |
| `getContinentColor(continent)` | Returns hex colour for a continent |

**`CONTINENT_CONFIG`** — colours and emojis for all 6 continents (no Antarctica):
```js
const CONTINENT_CONFIG = {
  "Africa":        { color: "#E8512A", emoji: "🌍" },
  "Asia":          { color: "#2E86AB", emoji: "🌏" },
  "Europe":        { color: "#5B4FBE", emoji: "🌍" },
  "North America": { color: "#27AE60", emoji: "🌎" },
  "Oceania":       { color: "#E67E22", emoji: "🌏" },
  "South America": { color: "#C0392B", emoji: "🌎" },
};
```

**`HOME_URL`** — set to `https://mrssteynsgames.netlify.app`. Used in the "← All Games" banner.

---

## Quiz engine — `js/quiz.js`

### Question types
| Type | Question |
|---|---|
| `capital` | What is the capital of X? |
| `capital-reverse` | Which country has Y as its capital? |
| `animal` | What is the national animal of X? |
| `fact` | Which country is this fun fact about? (name redacted from fact) |
| `flag-identify` | Which country does this flag belong to? (shows flag image) |
| `flag-select` | Which flag belongs to X? (2×2 grid of flag images) |
| `continent` | Which continent is X in? |

### Key constants
```js
const QUESTION_TIME = 20;  // seconds per question
const QUIZ_LENGTH   = 10;  // questions per game
const FEEDBACK_MS   = 1400; // ms to show correct/wrong before advancing
```

### Scoring
`points = max(1, round(20 − timeTaken))` per correct answer. Max 200 per game.

### Fun fact redaction
`redactCountryName(factText, country)` replaces the country name (and known aliases like DRC, UAE, UK) with "this country". Handles possessives, "The X" prefixes, and partial names from compound names like "Antigua and Barbuda".

### Flag similarity
`getSimilarFlagCountries(target, n)` scores all countries by colour overlap + pattern match using `FLAG_STYLE`, picks `n` from the top 10 most similar. Ensures wrong flag options look plausible.

### Quiz state machine
Screens: `setup → ready → question → feedback → results`

---

## Page navigation flow

```
index.html
  ↓ continent pill
continent.html?c=Europe
  ↓ country button
country.html?c=Europe&i=3    (i = index within sorted continent list)
  ↓ ← / → nav arrows
country.html?c=Europe&i=4

quiz.html                    (standalone)
quiz.html?c=Europe           (pre-filtered to continent)
```

---

## All Games banner (identical on every page)

```html
<a href="https://mrssteynsgames.netlify.app" style="
  display:flex;align-items:center;gap:0.5rem;
  background:#1e293b;color:#f8fafc;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  font-size:0.82rem;font-weight:600;
  padding:0.55rem 1.2rem;
  text-decoration:none;letter-spacing:0.01em;
">← All Games</a>
```

---

## Common tasks

### Add a new country
Add an entry to the `COUNTRIES` array in `data/countries.js`. Follow the existing format exactly.
Add a matching entry to `data/flag-groups.js` for the flag quiz to work properly.

### Change a continent colour
Edit the `color` value in `CONTINENT_CONFIG` in `js/app.js`.

### Add a new quiz question type
1. Add the type string to `TOPIC_TYPES` in `quiz.js`
2. Add a `case` to the `makeQuestion()` switch statement
3. Add a label entry to `TYPE_LABELS` in `showResults()`

### Update the live site
```bash
git add .
git commit -m "describe your change"
git push origin main
```
Netlify auto-deploys within ~1 minute.
