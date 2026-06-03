// Continent configuration
const CONTINENT_CONFIG = {
  "Africa":        { color: "#E8512A", emoji: "🌍" },
  "Asia":          { color: "#2E86AB", emoji: "🌏" },
  "Europe":        { color: "#5B4FBE", emoji: "🌍" },
  "North America": { color: "#27AE60", emoji: "🌎" },
  "Oceania":       { color: "#E67E22", emoji: "🌏" },
  "South America": { color: "#C0392B", emoji: "🌎" },
};

// Countries that may not render in GeoChart
const GEO_UNSUPPORTED = new Set(["xk", "tw", "ps", "va"]);

function getCountriesByContinent(continent) {
  return COUNTRIES
    .filter(c => c.continent === continent)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getContinentColor(continent) {
  return (CONTINENT_CONFIG[continent] || {}).color || "#718096";
}

function getContinentEmoji(continent) {
  return (CONTINENT_CONFIG[continent] || {}).emoji || "🌍";
}

// Build the shared header, inject into #site-header
function buildHeader(activeContinent) {
  const el = document.getElementById("site-header");
  if (!el) return;

  const pills = Object.entries(CONTINENT_CONFIG).map(([name, cfg]) => {
    const active = name === activeContinent ? " active" : "";
    // Determine relative path depth for links
    const prefix = window.location.pathname.includes("/countries-of-the-world/") ? "" : "";
    return `<a href="continent.html?c=${encodeURIComponent(name)}"
               class="continent-pill${active}"
               style="background:${cfg.color}">${cfg.emoji} ${name}</a>`;
  }).join("");

  el.innerHTML = `
    <h1>🌍 Countries of the World</h1>
    <p class="subtitle">Fact Sheets for Years 5–6</p>
    <nav class="continent-pills">${pills}</nav>
  `;
}

// Build a country card HTML string
function buildCardHTML(country) {
  const color = getContinentColor(country.continent);
  const lightBg = hexToRgba(color, 0.1);
  const chartId = "geo-chart-" + country.iso2;
  const unsupported = GEO_UNSUPPORTED.has(country.iso2);

  const geoBlock = unsupported
    ? `<div class="geo-unavailable">Map not available for this territory</div>`
    : `<div class="geo-chart-container" id="${chartId}"></div>`;

  return `
    <div class="country-card">
      <div class="card-header" style="background:${color}">
        <h2>${country.emoji} ${country.name}</h2>
        <span class="card-continent-badge">${country.continent}</span>
      </div>
      <div class="card-visuals">
        <div class="visual-block">
          <span class="visual-label">🚩 National Flag</span>
          <img class="flag-img"
               src="https://flagcdn.com/w320/${country.iso2}.png"
               alt="Flag of ${country.name}"
               onerror="this.style.opacity='0.3'">
        </div>
        <div class="visual-block">
          <span class="visual-label">🗺️ Where in the World?</span>
          ${geoBlock}
        </div>
      </div>
      <div class="card-facts">
        <div class="fact-cell">
          <div class="fact-label">Continent</div>
          <div class="fact-value" style="color:${color}">${getContinentEmoji(country.continent)} ${country.continent}</div>
        </div>
        <div class="fact-cell">
          <div class="fact-label">Capital City</div>
          <div class="fact-value">🏙️ ${country.capital}</div>
        </div>
        <div class="fact-cell">
          <div class="fact-label">Population</div>
          <div class="fact-value">👥 ${country.population}</div>
        </div>
        <div class="fact-cell">
          <div class="fact-label">National Animal</div>
          <div class="fact-value">🐾 ${country.animal}</div>
        </div>
      </div>
      <div class="fun-fact-banner" style="background:${lightBg}">
        ⭐ <strong>Fun Fact:</strong> ${country.fact}
      </div>
    </div>
  `;
}

// Draw geochart for a country (called after Google Charts loads)
function drawGeoChart(divId, countryIso2Upper, subregionCode, hexColor) {
  var data = google.visualization.arrayToDataTable([
    ['Country', 'Value'],
    [countryIso2Upper, 1]
  ]);
  var options = {
    region: subregionCode,
    displayMode: 'regions',
    colorAxis: { colors: [hexColor, hexColor] },
    backgroundColor: '#c8dff0',
    datalessRegionColor: '#e8e8e8',
    legend: 'none',
    enableRegionInteractivity: false,
    tooltip: { trigger: 'none' },
    width: 200,
    height: 160,
  };
  var chart = new google.visualization.GeoChart(document.getElementById(divId));
  chart.draw(data, options);
}

// Render a country card into a container, then draw its geochart
function renderCard(country, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = buildCardHTML(country);

  if (!GEO_UNSUPPORTED.has(country.iso2)) {
    const chartId = "geo-chart-" + country.iso2;
    const color = getContinentColor(country.continent);
    if (typeof google !== "undefined" && google.visualization) {
      drawGeoChart(chartId, country.iso2.toUpperCase(), country.subregion, color);
    } else {
      // Queue for when charts load
      window._pendingCharts = window._pendingCharts || [];
      window._pendingCharts.push({ chartId, country, color });
    }
  }
}

// Called by Google Charts loader callback
function onGoogleChartsReady() {
  if (window._pendingCharts) {
    window._pendingCharts.forEach(({ chartId, country, color }) => {
      const el = document.getElementById(chartId);
      if (el) drawGeoChart(chartId, country.iso2.toUpperCase(), country.subregion, color);
    });
    window._pendingCharts = [];
  }
  if (window._onChartsReady) window._onChartsReady();
}

// Utility
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
