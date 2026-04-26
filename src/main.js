import { Game } from './game.js';
import { InputHandler } from './input.js';

const gameCanvas = document.getElementById('game-canvas');
const nextCanvas = document.getElementById('next-canvas');
const scoreEl    = document.getElementById('score');
const levelEl    = document.getElementById('level');
const linesEl    = document.getElementById('lines');
const overlay    = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayScore = document.getElementById('overlay-score');
const overlayHint  = document.getElementById('overlay-hint');

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
    overlayHint.textContent  = 'Press R to restart';
    overlay.classList.remove('hidden');
  } else if (status === 'paused') {
    overlayTitle.textContent = 'PAUSED';
    overlayScore.textContent = '';
    overlayHint.textContent  = 'Press P to resume';
    overlay.classList.remove('hidden');
  } else if (status === 'playing') {
    overlay.classList.add('hidden');
  }
});

const input = new InputHandler(action => game.handleAction(action));

game.start();
