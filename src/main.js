import { Game } from './game.js';
import { InputHandler } from './input.js';

const gameCanvas = document.getElementById('game-canvas');
const nextCanvas = document.getElementById('next-canvas');
const scoreEl    = document.getElementById('score');
const levelEl    = document.getElementById('level');
const linesEl    = document.getElementById('lines');
const overlay      = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayScore = document.getElementById('overlay-score');
const overlayHint  = document.getElementById('overlay-hint');
const overlayBtn   = document.getElementById('overlay-btn');

const game = new Game(gameCanvas, nextCanvas);

game.onScoreChange((score, level, lines) => {
  scoreEl.textContent = score.toLocaleString();
  levelEl.textContent = level;
  linesEl.textContent = lines;
});

game.onStatusChange((status, state) => {
  if (status === 'gameover') {
    overlayTitle.textContent = 'GAME OVER';
    overlayScore.textContent = `Score: ${state.score.toLocaleString()}`;
    overlayHint.textContent  = '';
    overlayBtn.textContent   = 'RESTART';
    overlayBtn.style.display = '';
    overlay.classList.remove('hidden');
  } else if (status === 'paused') {
    overlayTitle.textContent = 'PAUSED';
    overlayScore.textContent = '';
    overlayHint.textContent  = '';
    overlayBtn.textContent   = 'RESUME';
    overlayBtn.style.display = '';
    overlay.classList.remove('hidden');
  } else if (status === 'playing') {
    overlay.classList.add('hidden');
  }
});

// Overlay button (RESTART / RESUME)
overlayBtn.addEventListener('click', () => {
  const title = overlayBtn.textContent;
  if (title === 'RESTART') game.handleAction('RESTART');
  else game.handleAction('PAUSE'); // RESUME
});

const input = new InputHandler(action => game.handleAction(action));

// Touch control buttons
const btnMap = [
  ['btn-left',  'MOVE_LEFT'],
  ['btn-right', 'MOVE_RIGHT'],
  ['btn-down',  'SOFT_DROP'],
  ['btn-hard',  'HARD_DROP'],
  ['btn-cw',    'ROTATE_CW'],
  ['btn-ccw',   'ROTATE_CCW'],
];
for (const [id, action] of btnMap) {
  input.addTouchButton(document.getElementById(id), action);
}

// Pause button
document.getElementById('pause-btn').addEventListener('click', () => {
  game.handleAction('PAUSE');
});

game.start();
