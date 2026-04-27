// ============================================================
//  きょうりゅうカタカナトレーニング — script.js
// ============================================================

// ===== STAGE DATA =====

const ALL_STAGES = [
  { id: 'a',  name: 'アぎょう', chars: ['ア','イ','ウ','エ','オ'],         cardIndex: 0 },
  { id: 'ka', name: 'カぎょう', chars: ['カ','キ','ク','ケ','コ'],         cardIndex: 1 },
  { id: 'sa', name: 'サぎょう', chars: ['サ','シ','ス','セ','ソ'],         cardIndex: 2 },
  { id: 'ta', name: 'タぎょう', chars: ['タ','チ','ツ','テ','ト'],         cardIndex: 3 },
  { id: 'na', name: 'ナぎょう', chars: ['ナ','ニ','ヌ','ネ','ノ'],         cardIndex: 4 },
  { id: 'ha', name: 'ハぎょう', chars: ['ハ','ヒ','フ','ヘ','ホ'],         cardIndex: 5 },
  { id: 'ma', name: 'マぎょう', chars: ['マ','ミ','ム','メ','モ'],         cardIndex: -1 },
  { id: 'ya', name: 'ヤぎょう', chars: ['ヤ','ユ','ヨ'],                   cardIndex: -1 },
  { id: 'ra', name: 'ラぎょう', chars: ['ラ','リ','ル','レ','ロ'],         cardIndex: -1 },
  { id: 'wa', name: 'ワぎょう', chars: ['ワ','ヲ','ン'],                   cardIndex: -1 },
];

const DEFAULT_UNLOCKED = ['a', 'ka', 'sa'];

// ===== HIRAGANA MAP =====

const HIRA = {
  'ア':'あ','イ':'い','ウ':'う','エ':'え','オ':'お',
  'カ':'か','キ':'き','ク':'く','ケ':'け','コ':'こ',
  'サ':'さ','シ':'し','ス':'す','セ':'せ','ソ':'そ',
  'タ':'た','チ':'ち','ツ':'つ','テ':'て','ト':'と',
  'ナ':'な','ニ':'に','ヌ':'ぬ','ネ':'ね','ノ':'の',
  'ハ':'は','ヒ':'ひ','フ':'ふ','ヘ':'へ','ホ':'ほ',
  'マ':'ま','ミ':'み','ム':'む','メ':'め','モ':'も',
  'ヤ':'や','ユ':'ゆ','ヨ':'よ',
  'ラ':'ら','リ':'り','ル':'る','レ':'れ','ロ':'ろ',
  'ワ':'わ','ヲ':'を','ン':'ん',
};

// ===== DINO CARD DATA =====

const DINO_CARDS = [
  {
    id: 'tyranno', name: 'ティラノサウルス', emoji: '🦖',
    desc: 'きょうりゅうの おうさま！ おおきな きばで なんでも たべるよ。あしがはやくて とっても つよいんだ。',
  },
  {
    id: 'trike', name: 'トリケラトプス', emoji: '🦕',
    desc: 'あたまに みっぽんの つのが はえているよ。かおに おおきな えりかざりが あるかっこいい きょうりゅう。',
  },
  {
    id: 'ptero', name: 'プテラノドン', emoji: '🦅',
    desc: 'そらを とぶ きょうりゅう！ おおきな つばさで うみの うえを とびながら さかなを つかまえるよ。',
  },
  {
    id: 'stego', name: 'ステゴサウルス', emoji: '🦎',
    desc: 'せなかに おおきな こっぱんが ならんでいるよ。くさだけ たべる やさしい きょうりゅうだよ。',
  },
  {
    id: 'brachi', name: 'ブラキオサウルス', emoji: '🦕',
    desc: 'くびが ながーい きょうりゅう！ たかい きの はっぱを たべるよ。からだが とっても おおきいんだ。',
  },
  {
    id: 'velo', name: 'ヴェロキラプトル', emoji: '🦖',
    desc: 'はやくて かしこい きょうりゅう！ なかまと いっしょに かりを するよ。かぎづめが するどいよ。',
  },
];

// ===== STRONG MODE QUESTIONS =====

const STRONG_QUESTIONS = [
  { q: '「ティラノサウルス」の\nさいしょの もじは どれ？', ans: 'ティ', choices: ['ティ','テ','チ'] },
  { q: '「トリケラトプス」の\nさいしょの もじは どれ？',   ans: 'ト',   choices: ['ト','タ','テ'] },
  { q: '「プテラノドン」の\nさいしょの もじは どれ？',     ans: 'プ',   choices: ['プ','フ','ブ'] },
  { q: '「ステゴサウルス」の\nさいしょの もじは どれ？',   ans: 'ス',   choices: ['ス','セ','サ'] },
  { q: '「ブラキオサウルス」の\nさいしょの もじは どれ？', ans: 'ブ',   choices: ['ブ','フ','プ'] },
  { q: '「アイスクリーム」の\nさいしょの もじは どれ？',   ans: 'ア',   choices: ['ア','イ','ウ'] },
  { q: '「コアラ」の\nさいしょの もじは どれ？',           ans: 'コ',   choices: ['コ','カ','ク'] },
  { q: '「カレー」の\nさいしょの もじは どれ？',           ans: 'カ',   choices: ['カ','ケ','キ'] },
  { q: '「サッカー」の\nさいしょの もじは どれ？',         ans: 'サ',   choices: ['サ','ス','セ'] },
  { q: '「タワー」の\nさいしょの もじは どれ？',           ans: 'タ',   choices: ['タ','テ','ト'] },
  { q: '「ナイフ」の\nさいしょの もじは どれ？',           ans: 'ナ',   choices: ['ナ','ニ','ノ'] },
  { q: '「ハンバーガー」の\nさいしょの もじは どれ？',     ans: 'ハ',   choices: ['ハ','ヒ','ホ'] },
  { q: '「マグマ」の\nさいしょの もじは どれ？',           ans: 'マ',   choices: ['マ','ミ','モ'] },
  { q: '「ヤシのき」の\nさいしょの もじは どれ？',         ans: 'ヤ',   choices: ['ヤ','ユ','ヨ'] },
  { q: '「ラーメン」の\nさいしょの もじは どれ？',         ans: 'ラ',   choices: ['ラ','リ','ル'] },
  { q: '「ワニ」の\nさいしょの もじは どれ？',             ans: 'ワ',   choices: ['ワ','ヲ','ン'] },
];

// ===== GAME DATA (persisted) =====

const SAVE_KEY = 'dinoKatakana_v1';

let gd = {
  unlockedStages: [...DEFAULT_UNLOCKED],
  clearedStages:  [],
  ownedCards:     [],
  wrongChars:     [],
  soundOn:        true,
};

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      gd = Object.assign(gd, parsed);
    }
  } catch (e) { /* ignore */ }
}

function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(gd)); } catch (e) { /* ignore */ }
}

// ===== QUIZ STATE =====

let qs = {
  stageId:      null,
  mode:         null,
  questions:    [],
  idx:          0,
  score:        0,
  answered:     false,
  wrongSession: [],
};

// ===== SCREEN NAVIGATION =====

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

function showTitle() { showScreen('title'); }

function showStageSelect() {
  renderStageSelect();
  showScreen('stage-select');
}

function showZukan() {
  renderZukan();
  showScreen('zukan');
}

// ===== STAGE SELECT =====

function renderStageSelect() {
  const grid = document.getElementById('stage-grid');
  grid.innerHTML = '';

  ALL_STAGES.forEach((stage) => {
    const unlocked = gd.unlockedStages.includes(stage.id);
    const cleared  = gd.clearedStages.includes(stage.id);

    const btn = document.createElement('button');
    btn.className = 'stage-btn' + (unlocked ? '' : ' locked') + (cleared ? ' cleared' : '');

    if (unlocked) {
      btn.onclick = () => showDifficulty(stage.id);
      btn.innerHTML =
        `<div class="stage-name">${stage.name}</div>` +
        `<div class="stage-chars">${stage.chars.join('・')}</div>` +
        (cleared ? '<div class="stage-clear-badge">✓ クリア</div>' : '');
    } else {
      btn.innerHTML =
        `<div class="stage-lock">🔒</div>` +
        `<div class="stage-name">${stage.name}</div>`;
    }

    grid.appendChild(btn);
  });

  const reviewBtn = document.getElementById('review-btn');
  if (reviewBtn) {
    reviewBtn.style.display = gd.wrongChars.length > 0 ? 'block' : 'none';
  }
}

// ===== DIFFICULTY SELECT =====

let _selectedStageId = null;

function showDifficulty(stageId) {
  _selectedStageId = stageId;
  const stage = ALL_STAGES.find(s => s.id === stageId);
  document.getElementById('difficulty-stage-name').textContent = stage.name;
  showScreen('difficulty');
}

function startQuiz(mode) {
  if (!_selectedStageId) return;
  initQuiz(_selectedStageId, mode);
}

// ===== QUIZ INIT =====

function initQuiz(stageId, mode) {
  const stage = ALL_STAGES.find(s => s.id === stageId);

  qs = {
    stageId,
    mode,
    questions:    buildQuestions(stage, mode),
    idx:          0,
    score:        0,
    answered:     false,
    wrongSession: [],
  };

  showScreen('quiz');
  renderQuestion();
}

// ===== QUESTION BUILDER =====

function buildQuestions(stage, mode) {
  if (mode === 'tsuyoi') {
    return shuffle([...STRONG_QUESTIONS]).slice(0, 5).map(sq => ({
      questionText: sq.q,
      display:      null,
      target:       sq.ans,
      choices:      shuffle([...sq.choices]),
    }));
  }

  const allChars = ALL_STAGES.flatMap(s => s.chars);
  const pool     = buildPool(stage.chars);
  const selected = shuffle(pool).slice(0, 5);

  return selected.map(char => {
    const distractors = pickDistractors(char, allChars, 2);
    const choices     = shuffle([char, ...distractors]);

    if (mode === 'tamago') {
      return {
        questionText: `「${char}」を えらぼう！`,
        display:      char,
        target:       char,
        choices,
      };
    } else { // kodomo
      return {
        questionText: `「${HIRA[char]}」と よむ\nカタカナは どれ？`,
        display:      HIRA[char],
        target:       char,
        choices,
      };
    }
  });
}

function buildPool(chars) {
  let pool = [...chars];
  while (pool.length < 5) pool = [...pool, ...chars];
  return pool;
}

function pickDistractors(correct, pool, n) {
  const filtered = pool.filter(c => c !== correct);
  return shuffle(filtered).slice(0, n);
}

// ===== RENDER QUESTION =====

function renderQuestion() {
  const q     = qs.questions[qs.idx];
  const total = qs.questions.length;

  document.getElementById('q-current').textContent = qs.idx + 1;
  document.getElementById('q-total').textContent   = total;
  document.getElementById('q-score').textContent   = qs.score;

  const pct = (qs.idx / total) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';

  const qEl       = document.getElementById('quiz-question');
  const charEl    = document.getElementById('quiz-char-display');
  const choicesEl = document.getElementById('quiz-choices');
  const fbEl      = document.getElementById('quiz-feedback');

  fbEl.textContent = '';
  fbEl.className   = 'quiz-feedback';

  qEl.innerHTML = q.questionText.replace(/\n/g, '<br>');

  if (q.display) {
    charEl.textContent = q.display;
    charEl.style.display = 'block';
  } else {
    charEl.style.display = 'none';
  }

  choicesEl.innerHTML = '';
  q.choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className   = 'choice-btn';
    btn.textContent = ch;
    btn.onclick     = () => handleAnswer(ch, btn, q);
    choicesEl.appendChild(btn);
  });

  qs.answered = false;
}

// ===== HANDLE ANSWER =====

function handleAnswer(choice, btnEl, q) {
  if (qs.answered) return;
  qs.answered = true;

  const correct = (choice === q.target);

  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === q.target) b.classList.add('show-correct');
  });

  const fbEl = document.getElementById('quiz-feedback');

  if (correct) {
    qs.score++;
    btnEl.classList.add('correct', 'anim-bounce');
    fbEl.textContent = 'せいかい！ 🦖✨';
    fbEl.className   = 'quiz-feedback correct-feedback';
    playCorrect();
    spawnStar();
  } else {
    btnEl.classList.add('wrong', 'anim-shake');
    fbEl.textContent = 'おしい！ もういちど えらんでみよう！ 🦕💪';
    fbEl.className   = 'quiz-feedback wrong-feedback';
    playWrong();

    if (q.target && q.target.length === 1 && !qs.wrongSession.includes(q.target)) {
      qs.wrongSession.push(q.target);
    }
  }

  setTimeout(() => {
    qs.idx++;
    if (qs.idx >= qs.questions.length) {
      finishQuiz();
    } else {
      renderQuestion();
    }
  }, correct ? 1400 : 2000);
}

function spawnStar() {
  const container = document.getElementById('quiz-content');
  const el = document.createElement('div');
  el.className = 'celebration-star';
  el.textContent = ['⭐','🌟','✨'][Math.floor(Math.random() * 3)];
  container.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// ===== CONFIRM QUIT =====

function confirmQuit() {
  if (confirm('クイズをやめてステージにもどりますか？')) {
    showStageSelect();
  }
}

// ===== FINISH QUIZ / RESULT =====

function finishQuiz() {
  // Save wrong chars
  qs.wrongSession.forEach(ch => {
    if (!gd.wrongChars.includes(ch)) gd.wrongChars.push(ch);
  });

  const cleared = (qs.score >= 4);
  let   newCard = null;

  if (cleared && qs.stageId !== '__review__') {
    if (!gd.clearedStages.includes(qs.stageId)) gd.clearedStages.push(qs.stageId);

    // unlock next stage
    const idx = ALL_STAGES.findIndex(s => s.id === qs.stageId);
    if (idx >= 0 && idx + 1 < ALL_STAGES.length) {
      const nextId = ALL_STAGES[idx + 1].id;
      if (!gd.unlockedStages.includes(nextId)) gd.unlockedStages.push(nextId);
    }

    // award card
    const stage = ALL_STAGES.find(s => s.id === qs.stageId);
    if (stage && stage.cardIndex >= 0) {
      const card = DINO_CARDS[stage.cardIndex];
      if (card && !gd.ownedCards.includes(card.id)) {
        gd.ownedCards.push(card.id);
        newCard = card;
      }
    }
  }

  persist();
  renderResult(cleared, newCard);
  showScreen('result');
}

function renderResult(cleared, newCard) {
  const dinoEl  = document.getElementById('result-dino');
  const titleEl = document.getElementById('result-title');
  const scoreEl = document.getElementById('result-score');
  const cardEl  = document.getElementById('result-card');
  const total   = qs.questions.length;

  if (cleared && qs.stageId !== '__review__') {
    dinoEl.textContent  = '🦖';
    dinoEl.className    = 'result-dino cleared';
    titleEl.textContent = 'ステージクリア！🎉';
    titleEl.style.color = '#ffd700';
  } else if (cleared) {
    dinoEl.textContent  = '🦕';
    dinoEl.className    = 'result-dino cleared';
    titleEl.textContent = 'ふくしゅうかんりょう！';
    titleEl.style.color = '#ffd700';
  } else {
    dinoEl.textContent  = '🦕';
    dinoEl.className    = 'result-dino';
    titleEl.textContent = 'よくがんばったね！';
    titleEl.style.color = '#ff8c00';
  }

  const filled = '⭐'.repeat(qs.score);
  const empty  = '☆'.repeat(total - qs.score);
  scoreEl.innerHTML =
    `<div class="score-big">${qs.score} / ${total}</div>` +
    `<div class="score-stars">${filled}${empty}</div>`;

  if (newCard) {
    cardEl.style.display = 'block';
    cardEl.innerHTML =
      `<div class="new-card-announce">🎊 きょうりゅうカードをゲット！</div>` +
      `<div class="dino-card obtained">` +
        `<div class="dino-card-emoji">${newCard.emoji}</div>` +
        `<div class="dino-card-name">${newCard.name}</div>` +
      `</div>`;
  } else {
    cardEl.style.display = 'none';
    cardEl.innerHTML = '';
  }
}

function retryQuiz() {
  initQuiz(qs.stageId, qs.mode);
}

// ===== REVIEW MODE =====

function showReview() {
  if (gd.wrongChars.length === 0) return;

  const allChars = ALL_STAGES.flatMap(s => s.chars);
  const pool     = buildPool(gd.wrongChars);
  const selected = shuffle(pool).slice(0, 5);

  const questions = selected.map(char => {
    const distractors = pickDistractors(char, allChars, 2);
    const choices     = shuffle([char, ...distractors]);
    return {
      questionText: `「${char}」を えらぼう！`,
      display:      char,
      target:       char,
      choices,
    };
  });

  qs = {
    stageId:      '__review__',
    mode:         'review',
    questions,
    idx:          0,
    score:        0,
    answered:     false,
    wrongSession: [],
  };

  showScreen('quiz');
  renderQuestion();
}

// ===== ZUKAN =====

function renderZukan() {
  const grid  = document.getElementById('zukan-grid');
  const count = document.getElementById('zukan-count');
  grid.innerHTML = '';

  const owned = gd.ownedCards.length;
  const total = DINO_CARDS.length;
  count.textContent = `${owned} / ${total} まい ゲット！`;

  DINO_CARDS.forEach(card => {
    const isOwned = gd.ownedCards.includes(card.id);
    const div     = document.createElement('div');
    div.className = 'dino-card ' + (isOwned ? 'obtained' : 'mystery');

    if (isOwned) {
      div.innerHTML =
        `<div class="dino-card-emoji">${card.emoji}</div>` +
        `<div class="dino-card-name">${card.name}</div>`;
      div.onclick = () => showZukanDetail(card);
    } else {
      div.innerHTML =
        `<div class="dino-card-emoji mystery-emoji">？</div>` +
        `<div class="dino-card-name">？？？</div>`;
    }

    grid.appendChild(div);
  });
}

function showZukanDetail(card) {
  const overlay = document.getElementById('zukan-detail');
  const content = document.getElementById('zukan-detail-content');
  content.innerHTML =
    `<div class="detail-emoji">${card.emoji}</div>` +
    `<div class="detail-name">${card.name}</div>` +
    `<div class="detail-desc">${card.desc}</div>`;
  overlay.style.display = 'flex';
}

function closeZukanDetail() {
  document.getElementById('zukan-detail').style.display = 'none';
}

// ===== SOUND =====

let _audioCtx = null;

function getCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
  }
  return _audioCtx;
}

function playCorrect() {
  if (!gd.soundOn) return;
  try {
    const ctx  = getCtx();
    if (!ctx) return;
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((f, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.13 + 0.28);
      osc.start(ctx.currentTime + i * 0.13);
      osc.stop(ctx.currentTime  + i * 0.13 + 0.3);
    });
  } catch (e) { /* ignore */ }
}

function playWrong() {
  if (!gd.soundOn) return;
  try {
    const ctx  = getCtx();
    if (!ctx) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.32);
  } catch (e) { /* ignore */ }
}

// ===== UTILS =====

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== BOOT =====

document.addEventListener('DOMContentLoaded', () => {
  loadSave();
  showScreen('title');
});
