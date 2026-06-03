# 🌍 Countries of the World

A multi-page static website for Year 5–6 students to explore countries around the world.

## Features

- **195 countries** across 6 continents with facts, flags, and maps
- **Random country** on the landing page — refreshes on every click
- **Browse by continent** — alphabetical grid of country buttons
- **Country fact sheets** — flag, GeoChart map, capital, population, national animal, and a fun fact
- **Prev/Next navigation** to cycle through countries on a continent
- Pure **HTML + CSS + JavaScript** — no frameworks, no build step

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `index.html` | Random country card with shuffle button |
| Continent | `continent.html?c=Africa` | Grid of countries for a continent |
| Country | `country.html?c=Africa&i=0` | Full fact sheet for one country |

## Running locally

Just open `index.html` in a browser, or serve the folder with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

> **Note:** Flag images (flagcdn.com) and Google GeoCharts require an internet connection.

## Deploy to Netlify via GitHub

### 1. Create a GitHub repository

```bash
cd countries-of-the-world
git init
git add .
git commit -m "Initial commit: Countries of the World website"
```

Go to [github.com/new](https://github.com/new), create a new repo, then push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/countries-of-the-world.git
git branch -M main
git push -u origin main
```

### 2. Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in.
2. Click **"Add new site" → "Import an existing project"**.
3. Choose **GitHub** and select your repository.
4. Leave all build settings blank (the `netlify.toml` handles it).
5. Click **"Deploy site"**.

Netlify will auto-deploy on every push to `main`.
