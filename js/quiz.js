// ── Constants ────────────────────────────────────────────────────────────────
const QUESTION_TIME = 20; // seconds per question
const QUIZ_LENGTH   = 10;
const FEEDBACK_MS   = 1400; // ms to show correct/wrong before next question
const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const TOPIC_LIST = [
  { id: 'all',        label: '🌟 All Topics' },
  { id: 'capitals',   label: '🏙️ Capital Cities' },
  { id: 'animals',    label: '🐾 National Animals' },
  { id: 'facts',      label: '⭐ Fun Facts' },
  { id: 'flags',      label: '🚩 Flags' },
  { id: 'continents', label: '🌍 Continents' },
];

// Question types per topic
const TOPIC_TYPES = {
  all:        ['capital', 'capital-reverse', 'animal', 'fact', 'flag-identify', 'flag-select', 'continent'],
  capitals:   ['capital', 'capital-reverse'],
  animals:    ['animal'],
  facts:      ['fact'],
  flags:      ['flag-identify', 'flag-select'],
  continents: ['continent'],
};

// ── State ────────────────────────────────────────────────────────────────────
let S = {
  screen:          'setup',  // setup | ready | question | feedback | results
  continent:       'all',
  topic:           'all',
  pool:            [],
  questions:       [],
  currentQ:        0,
  results:         [],
  timerSecs:       QUESTION_TIME,
  timerInterval:   null,
  totalElapsed:    0,
  totalInterval:   null,
  qStartTime:      0,
  answered:        false,
};

// ── Utilities ─────────────────────────────────────────────────────────────────
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function pickRandom(arr, n) { return shuffle(arr).slice(0, n); }

function getWrongValues(values, correct, n) {
  // Deduplicate values and remove the correct answer
  const unique = [...new Set(values)].filter(v => v !== correct);
  return pickRandom(unique, Math.min(n, unique.length));
}

function getWrongCountries(pool, correct, n) {
  const others = pool.filter(c => c.name !== correct.name);
  return pickRandom(others, Math.min(n, others.length));
}

function el(id) { return document.getElementById(id); }
function render(html) { el('quiz-app').innerHTML = html; }

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ── Question generators ───────────────────────────────────────────────────────
function makeQuestion(type, country, pool) {
  switch (type) {

    case 'capital': {
      const wrongs = getWrongValues(pool.map(c => c.capital), country.capital, 3);
      const opts   = shuffle([country.capital, ...wrongs]);
      return { type, text: `What is the capital city of <strong>${country.name}</strong> ${country.emoji}?`,
               options: opts, answer: country.capital, countryName: country.name };
    }

    case 'capital-reverse': {
      const wrongs = getWrongValues(pool.map(c => c.name), country.name, 3);
      const opts   = shuffle([country.name, ...wrongs]);
      return { type, text: `Which country has <strong>${country.capital}</strong> as its capital city?`,
               options: opts, answer: country.name, countryName: country.name };
    }

    case 'animal': {
      const wrongs = getWrongValues(pool.map(c => c.animal), country.animal, 3);
      const opts   = shuffle([country.animal, ...wrongs]);
      return { type, text: `What is the national animal of <strong>${country.name}</strong> ${country.emoji}?`,
               options: opts, answer: country.animal, countryName: country.name };
    }

    case 'fact': {
      const wrongs = getWrongValues(pool.map(c => c.name), country.name, 3);
      const opts   = shuffle([country.name, ...wrongs]);
      return { type, text: `Which country is this fun fact about?`,
               factText: country.fact,
               options: opts, answer: country.name, countryName: country.name };
    }

    case 'flag-identify': {
      const wrongs = getWrongValues(pool.map(c => c.name), country.name, 3);
      const opts   = shuffle([country.name, ...wrongs]);
      return { type, text: `Which country does this flag belong to?`,
               flagUrl: `https://flagcdn.com/w320/${country.iso2}.png`,
               options: opts, answer: country.name, countryName: country.name };
    }

    case 'flag-select': {
      const wrongCountries = getWrongCountries(pool, country, 3);
      const allOpts = shuffle([country, ...wrongCountries]);
      return { type, text: `Which flag belongs to <strong>${country.name}</strong> ${country.emoji}?`,
               flagOptions: allOpts.map(c => ({ name: c.name, url: `https://flagcdn.com/w320/${c.iso2}.png` })),
               options: allOpts.map(c => c.name),
               answer: country.name, countryName: country.name };
    }

    case 'continent': {
      const continents = Object.keys(CONTINENT_CONFIG);
      const wrongs     = pickRandom(continents.filter(c => c !== country.continent), 3);
      const opts       = shuffle([country.continent, ...wrongs]);
      return { type, text: `Which continent is <strong>${country.name}</strong> ${country.emoji} in?`,
               options: opts, answer: country.continent, countryName: country.name };
    }
  }
}

function generateQuestions(pool, topic, continent) {
  let types = [...(TOPIC_TYPES[topic] || TOPIC_TYPES.all)];
  // Continent questions are trivial when quizzing one continent
  if (continent !== 'all') types = types.filter(t => t !== 'continent');
  if (types.length === 0) types = ['capital', 'animal', 'fact'];

  // Need pool ≥ 4 for 3 wrong options; supplement from all countries if needed
  const supplementedPool = pool.length >= 4 ? pool : COUNTRIES;

  const subjects = pickRandom(pool, Math.min(QUIZ_LENGTH, pool.length));
  const questions = [];

  for (let i = 0; i < QUIZ_LENGTH; i++) {
    const country = subjects[i % subjects.length];
    const type    = types[Math.floor(Math.random() * types.length)];
    const q       = makeQuestion(type, country, supplementedPool);
    if (q) questions.push(q);
  }
  return questions;
}

// ── Timer management ─────────────────────────────────────────────────────────
function startTimers() {
  S.timerSecs = QUESTION_TIME;
  S.qStartTime = Date.now();
  S.answered = false;

  // Numeric countdown
  S.timerInterval = setInterval(() => {
    S.timerSecs = Math.max(0, QUESTION_TIME - Math.floor((Date.now() - S.qStartTime) / 1000));
    const numEl = el('quiz-timer-num');
    if (numEl) numEl.textContent = S.timerSecs + 's';
    const barFill = el('quiz-timer-fill');
    if (barFill) barFill.style.width = (S.timerSecs / QUESTION_TIME * 100) + '%';
    if (S.timerSecs <= 0 && !S.answered) handleAnswer(null);
  }, 250);

  // Total elapsed
  if (!S.totalInterval) {
    S.totalInterval = setInterval(() => {
      S.totalElapsed++;
      const totEl = el('quiz-total-time');
      if (totEl) totEl.textContent = '⏱ ' + formatTime(S.totalElapsed);
    }, 1000);
  }
}

function stopTimers() {
  clearInterval(S.timerInterval);
  S.timerInterval = null;
}

function stopAllTimers() {
  clearInterval(S.timerInterval);
  clearInterval(S.totalInterval);
  S.timerInterval = null;
  S.totalInterval = null;
}

// ── Answer handling ───────────────────────────────────────────────────────────
function handleAnswer(selectedOption) {
  if (S.answered) return;
  S.answered = true;
  stopTimers();

  const q         = S.questions[S.currentQ];
  const timeTaken = Math.min(QUESTION_TIME, (Date.now() - S.qStartTime) / 1000);
  const correct   = selectedOption !== null && selectedOption === q.answer;
  const points    = correct ? Math.max(1, Math.round(QUESTION_TIME - timeTaken)) : 0;

  S.results.push({ question: q, selected: selectedOption, correct, timeTaken, points });

  // Highlight options
  const isFlagSelect = q.type === 'flag-select';
  if (isFlagSelect) {
    q.options.forEach((opt, i) => {
      const btn = el(`qopt-${i}`);
      if (!btn) return;
      if (opt === q.answer)      btn.classList.add('quiz-opt-correct');
      else if (opt === selectedOption) btn.classList.add('quiz-opt-wrong');
    });
  } else {
    q.options.forEach((opt, i) => {
      const btn = el(`qopt-${i}`);
      if (!btn) return;
      if (opt === q.answer)      btn.classList.add('quiz-opt-correct');
      else if (opt === selectedOption) btn.classList.add('quiz-opt-wrong');
      btn.disabled = true;
    });
  }

  // Show feedback badge
  const badge = el('quiz-feedback-badge');
  if (badge) {
    badge.textContent = correct ? '✅ Correct! +' + points + ' pts' : selectedOption ? '❌ Wrong!' : '⏰ Time\'s up!';
    badge.className   = 'quiz-feedback-badge ' + (correct ? 'badge-correct' : 'badge-wrong');
    badge.style.display = 'block';
  }

  setTimeout(() => {
    S.currentQ++;
    if (S.currentQ >= QUIZ_LENGTH) {
      stopAllTimers();
      showResults();
    } else {
      showQuestion();
    }
  }, FEEDBACK_MS);
}

// ── Screen renderers ──────────────────────────────────────────────────────────
function showSetup() {
  S.screen = 'setup';
  const preContinent = new URLSearchParams(window.location.search).get('c') || 'all';
  S.continent = preContinent;

  const continentOpts = [
    { id: 'all', label: '🌍 All Countries' },
    ...Object.entries(CONTINENT_CONFIG).map(([name, cfg]) => ({ id: name, label: cfg.emoji + ' ' + name }))
  ];

  const continentBtns = continentOpts.map(opt => `
    <button class="quiz-choice-btn ${S.continent === opt.id ? 'selected' : ''}"
            style="${S.continent === opt.id ? 'border-color:' + (CONTINENT_CONFIG[opt.id]?.color || '#6366f1') + ';background:' + (CONTINENT_CONFIG[opt.id]?.color || '#6366f1') + '22;color:' + (CONTINENT_CONFIG[opt.id]?.color || '#6366f1') : ''}"
            onclick="selectContinent('${opt.id}')">${opt.label}</button>
  `).join('');

  const topicBtns = TOPIC_LIST.map(opt => `
    <button class="quiz-choice-btn ${S.topic === opt.id ? 'selected' : ''}"
            onclick="selectTopic('${opt.id}')">${opt.label}</button>
  `).join('');

  render(`
    <div class="quiz-wrap">
      <div class="quiz-setup-card">
        <div class="quiz-setup-icon">🧠</div>
        <h2 class="quiz-setup-title">Country Quiz</h2>
        <p class="quiz-setup-sub">10 questions · 20 seconds each · Speed + accuracy scoring</p>

        <div class="quiz-section-label">Choose a region</div>
        <div class="quiz-choice-group" id="continent-group">${continentBtns}</div>

        <div class="quiz-section-label">Choose a topic</div>
        <div class="quiz-choice-group" id="topic-group">${topicBtns}</div>

        <button class="quiz-start-btn" onclick="startQuiz()">🚀 Start Quiz</button>
      </div>
    </div>
  `);
}

function selectContinent(id) {
  S.continent = id;
  document.querySelectorAll('#continent-group .quiz-choice-btn').forEach(btn => {
    btn.classList.remove('selected');
    btn.style.borderColor = '';
    btn.style.background = '';
    btn.style.color = '';
  });
  const selected = document.querySelector(`#continent-group .quiz-choice-btn[onclick="selectContinent('${id}')"]`);
  if (selected) {
    selected.classList.add('selected');
    const color = CONTINENT_CONFIG[id]?.color || '#6366f1';
    selected.style.borderColor = color;
    selected.style.background  = color + '22';
    selected.style.color       = color;
  }
}

function selectTopic(id) {
  S.topic = id;
  document.querySelectorAll('#topic-group .quiz-choice-btn').forEach(btn => btn.classList.remove('selected'));
  const selected = document.querySelector(`#topic-group .quiz-choice-btn[onclick="selectTopic('${id}')"]`);
  if (selected) selected.classList.add('selected');
}

function startQuiz() {
  // Build filtered pool
  S.pool = S.continent === 'all'
    ? COUNTRIES
    : COUNTRIES.filter(c => c.continent === S.continent);

  S.questions     = generateQuestions(S.pool, S.topic, S.continent);
  S.currentQ      = 0;
  S.results       = [];
  S.totalElapsed  = 0;
  S.totalInterval = null;
  showReady();
}

function showReady() {
  S.screen = 'ready';
  const continentLabel = S.continent === 'all' ? 'All Countries' : S.continent;
  const topicLabel     = TOPIC_LIST.find(t => t.id === S.topic)?.label || 'All Topics';
  const color          = CONTINENT_CONFIG[S.continent]?.color || '#6366f1';

  render(`
    <div class="quiz-wrap">
      <div class="quiz-setup-card">
        <div class="quiz-setup-icon">🏆</div>
        <h2 class="quiz-setup-title">Ready?</h2>
        <p class="quiz-setup-sub">You'll get 10 questions. Answer as fast as you can —<br>faster correct answers earn more points!</p>

        <div class="quiz-chips">
          <span class="quiz-chip" style="background:${color}22;color:${color};border-color:${color}">🌍 ${continentLabel}</span>
          <span class="quiz-chip">${topicLabel}</span>
          <span class="quiz-chip">⏱ 20s per question</span>
          <span class="quiz-chip">🏆 Max ${QUIZ_LENGTH * QUESTION_TIME} points</span>
        </div>

        <button class="quiz-start-btn" onclick="showQuestion()" style="margin-top:1.5rem">🚀 Let's Go!</button>
        <button class="quiz-back-btn" onclick="showSetup()">← Change Settings</button>
      </div>
    </div>
  `);
}

function showQuestion() {
  S.screen = 'question';
  const q     = S.questions[S.currentQ];
  const qNum  = S.currentQ + 1;
  const color = CONTINENT_CONFIG[S.continent]?.color || '#6366f1';
  const pct   = ((S.currentQ) / QUIZ_LENGTH * 100).toFixed(0);

  // Build option buttons
  let optionsHtml = '';
  if (q.type === 'flag-select') {
    // 2×2 grid of flag images
    optionsHtml = `<div class="quiz-flag-opts">` +
      q.flagOptions.map((opt, i) => `
        <button class="quiz-flag-opt" id="qopt-${i}" onclick="handleAnswer('${opt.name.replace(/'/g, "\\'")}')">
          <img src="${opt.url}" alt="${opt.name}" onerror="this.style.opacity='0.3'">
          <span>${OPTION_LABELS[i]}</span>
        </button>
      `).join('') +
      `</div>`;
  } else {
    optionsHtml = `<div class="quiz-text-opts">` +
      q.options.map((opt, i) => `
        <button class="quiz-text-opt" id="qopt-${i}" onclick="handleAnswer('${opt.replace(/'/g, "\\'")}')">
          <span class="opt-label">${OPTION_LABELS[i]}</span>
          <span class="opt-text">${opt}</span>
        </button>
      `).join('') +
      `</div>`;
  }

  // Image display (flag-identify shows the flag)
  let imageHtml = '';
  if (q.flagUrl) {
    imageHtml = `<img class="quiz-flag-display" src="${q.flagUrl}" alt="Flag">`;
  }

  // Fact callout
  let factHtml = '';
  if (q.factText) {
    factHtml = `<div class="quiz-fact-callout">"${q.factText}"</div>`;
  }

  render(`
    <div class="quiz-wrap">
      <!-- Header row -->
      <div class="quiz-top-bar">
        <button class="quiz-back-btn" onclick="confirmQuit()">✕ Quit</button>
        <span class="quiz-qcount">Question ${qNum} of ${QUIZ_LENGTH}</span>
        <span class="quiz-elapsed" id="quiz-total-time">⏱ 0:00</span>
      </div>

      <!-- Progress bar -->
      <div class="quiz-progress-track">
        <div class="quiz-progress-fill" style="width:${pct}%;background:${color}"></div>
      </div>

      <!-- Timer bar -->
      <div class="quiz-timer-track">
        <div class="quiz-timer-fill" id="quiz-timer-fill" style="width:100%;background:${color}"></div>
      </div>
      <div class="quiz-timer-row">
        <span class="quiz-timer-label">Time left:</span>
        <span class="quiz-timer-num" id="quiz-timer-num">${QUESTION_TIME}s</span>
      </div>

      <!-- Question card -->
      <div class="quiz-card">
        <div class="quiz-q-text">${q.text}</div>
        ${factHtml}
        ${imageHtml}
        ${optionsHtml}
        <div class="quiz-feedback-badge" id="quiz-feedback-badge" style="display:none"></div>
      </div>
    </div>
  `);

  startTimers();
}

function confirmQuit() {
  if (confirm('Quit the quiz? Your progress will be lost.')) {
    stopAllTimers();
    showSetup();
  }
}

function showResults() {
  S.screen = 'results';
  const totalScore = S.results.reduce((sum, r) => sum + r.points, 0);
  const maxScore   = QUIZ_LENGTH * QUESTION_TIME;
  const correct    = S.results.filter(r => r.correct).length;
  const accuracy   = Math.round((correct / QUIZ_LENGTH) * 100);

  // Trophy based on score percentage
  const pct = totalScore / maxScore;
  const trophy = pct >= 0.85 ? '🥇' : pct >= 0.65 ? '🥈' : pct >= 0.45 ? '🥉' : '🎯';

  const rows = S.results.map((r, i) => {
    const typeLabel = {
      'capital':          '🏙️ Capital',
      'capital-reverse':  '🏙️ Which country?',
      'animal':           '🐾 Animal',
      'fact':             '⭐ Fun Fact',
      'flag-identify':    '🚩 Name that flag',
      'flag-select':      '🚩 Find that flag',
      'continent':        '🌍 Continent',
    }[r.question.type] || r.question.type;

    return `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
        <td>${i + 1}</td>
        <td>${r.question.countryName}</td>
        <td>${typeLabel}</td>
        <td>
          <span class="result-badge ${r.correct ? 'badge-correct' : 'badge-wrong'}">
            ${r.correct ? '✅ Correct' : r.selected ? '❌ Wrong' : '⏰ Timeout'}
          </span>
        </td>
        <td>${r.timeTaken.toFixed(1)}s</td>
        <td class="${r.points > 0 ? 'pts-positive' : 'pts-zero'}">${r.points}</td>
      </tr>
    `;
  }).join('');

  render(`
    <div class="quiz-wrap">
      <div class="quiz-results-header">
        <div class="quiz-results-trophy">${trophy}</div>
        <h2 class="quiz-setup-title">Quiz Complete!</h2>
      </div>

      <div class="quiz-stat-cards">
        <div class="quiz-stat-card" style="color:#6366f1">
          <div class="stat-value">${totalScore}<span class="stat-max">/${maxScore}</span></div>
          <div class="stat-label">Score</div>
        </div>
        <div class="quiz-stat-card" style="color:#10b981">
          <div class="stat-value">${correct}<span class="stat-max">/${QUIZ_LENGTH}</span></div>
          <div class="stat-label">Correct</div>
        </div>
        <div class="quiz-stat-card" style="color:#f59e0b">
          <div class="stat-value">${formatTime(S.totalElapsed)}</div>
          <div class="stat-label">Time</div>
        </div>
        <div class="quiz-stat-card" style="color:#3b82f6">
          <div class="stat-value">${accuracy}%</div>
          <div class="stat-label">Accuracy</div>
        </div>
      </div>

      <div class="quiz-results-table-wrap">
        <table class="quiz-results-table">
          <thead>
            <tr>
              <th>#</th><th>Country</th><th>Topic</th><th>Result</th><th>Time</th><th>Points</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="quiz-results-btns">
        <button class="quiz-start-btn" onclick="startQuiz()">🔄 Play Again</button>
        <button class="quiz-back-btn" onclick="showSetup()">⚙️ Change Settings</button>
      </div>
    </div>
  `);
}

// ── Init ─────────────────────────────────────────────────────────────────────
function initQuiz() {
  showSetup();
}
