import { Board } from './board.js';
import { Piece } from './piece.js';
import { Renderer } from './renderer.js';
import {
  LEVEL_SPEEDS, LINES_PER_LEVEL, LOCK_DELAY_MS, SCORE_TABLE,
} from './constants.js';

export class Game {
  constructor(gameCanvas, nextCanvas) {
    this._renderer = new Renderer(gameCanvas, nextCanvas);
    this._board = new Board();
    this._bag = [];
    this._state = this._makeState();
    this._lastTimestamp = null;
    this._rafId = null;
    this._actionQueue = [];
    this._onScoreChange = null;
    this._onStatusChange = null;
  }

  onScoreChange(fn) { this._onScoreChange = fn; }
  onStatusChange(fn) { this._onStatusChange = fn; }

  start() {
    this._resetState();
    this._setStatus('playing');
    if (!this._rafId) {
      this._rafId = requestAnimationFrame(ts => this._loop(ts));
    }
  }

  handleAction(action) {
    this._actionQueue.push(action);
  }

  _makeState() {
    return {
      status: 'idle',
      board: this._board,
      current: null,
      next: null,
      score: 0,
      lines: 0,
      level: 1,
      dropTimer: 0,
      lockTimer: 0,
      isGrounded: false,
    };
  }

  _resetState() {
    this._board.reset();
    this._bag = [];
    const s = this._state;
    s.score = 0;
    s.lines = 0;
    s.level = 1;
    s.dropTimer = 0;
    s.lockTimer = 0;
    s.isGrounded = false;
    s.current = Piece.random(this._bag);
    s.next = Piece.random(this._bag);
    this._notifyScore();
  }

  _setStatus(status) {
    this._state.status = status;
    if (this._onStatusChange) this._onStatusChange(status, this._state);
  }

  _loop(timestamp) {
    if (this._lastTimestamp === null) this._lastTimestamp = timestamp;
    const dt = Math.min(timestamp - this._lastTimestamp, 100);
    this._lastTimestamp = timestamp;

    this._drainActions();

    const s = this._state;
    if (s.status === 'playing' && s.current) {
      this._tick(dt);
    }

    this._renderer.draw(s);
    this._rafId = requestAnimationFrame(ts => this._loop(ts));
  }

  _drainActions() {
    while (this._actionQueue.length > 0) {
      this._handleAction(this._actionQueue.shift());
    }
  }

  _handleAction(action) {
    const s = this._state;

    if (action === 'PAUSE') {
      if (s.status === 'playing') {
        this._setStatus('paused');
      } else if (s.status === 'paused') {
        this._lastTimestamp = null;
        this._setStatus('playing');
      }
      return;
    }
    if (action === 'RESTART') {
      this._resetState();
      this._setStatus('playing');
      return;
    }
    if (s.status !== 'playing' || !s.current) return;

    switch (action) {
      case 'MOVE_LEFT':  this._tryMove(-1, 0); break;
      case 'MOVE_RIGHT': this._tryMove( 1, 0); break;
      case 'SOFT_DROP':  this._softDrop(); break;
      case 'HARD_DROP':  this._hardDrop(); break;
      case 'ROTATE_CW':  this._tryRotate(1); break;
      case 'ROTATE_CCW': this._tryRotate(-1); break;
    }
  }

  _tryMove(dc, dr) {
    const s = this._state;
    if (!s.current.move(dc, dr, this._board)) return false;
    if (s.isGrounded) {
      // If the piece can now fall again, un-ground it; otherwise reset lock timer
      if (this._canFall()) {
        s.isGrounded = false;
      } else {
        s.lockTimer = 0;
      }
    }
    return true;
  }

  _tryRotate(dir) {
    const s = this._state;
    if (!s.current.rotate(dir, this._board)) return;
    if (s.isGrounded) {
      if (this._canFall()) {
        s.isGrounded = false;
      } else {
        s.lockTimer = 0;
      }
    }
  }

  _softDrop() {
    const s = this._state;
    if (s.current.move(0, 1, this._board)) {
      s.dropTimer = 0;
      s.isGrounded = false;
      s.score += 1;
      this._notifyScore();
    }
  }

  _hardDrop() {
    const s = this._state;
    let dropped = 0;
    while (s.current.move(0, 1, this._board)) dropped++;
    s.score += dropped * 2;
    this._notifyScore();
    this._lockPiece();
  }

  _tick(dt) {
    const s = this._state;

    if (!s.isGrounded) {
      s.dropTimer += dt;
      const interval = this._dropInterval();
      while (s.dropTimer >= interval) {
        s.dropTimer -= interval;
        if (!s.current.move(0, 1, this._board)) {
          s.isGrounded = true;
          s.lockTimer = 0;
          s.dropTimer = 0;
          break;
        }
      }
    }

    if (s.isGrounded) {
      // Re-check: a previously grounded piece might be able to fall now (e.g. locked cell removed — not in standard Tetris, but defensive)
      if (this._canFall()) {
        s.isGrounded = false;
        return;
      }
      s.lockTimer += dt;
      if (s.lockTimer >= LOCK_DELAY_MS) {
        this._lockPiece();
      }
    }
  }

  _canFall() {
    const s = this._state;
    return this._board.isValidPosition(s.current.cells, s.current.col, s.current.row + 1);
  }

  _lockPiece() {
    const s = this._state;
    this._board.lockPiece(s.current);
    const cleared = this._board.clearLines();
    if (cleared > 0) {
      s.score += (SCORE_TABLE[cleared] ?? 0) * s.level;
      s.lines += cleared;
      s.level = Math.floor(s.lines / LINES_PER_LEVEL) + 1;
      this._notifyScore();
    }

    s.current = s.next;
    s.next = Piece.random(this._bag);
    s.dropTimer = 0;
    s.lockTimer = 0;
    s.isGrounded = false;

    if (!this._board.isValidPosition(s.current.cells, s.current.col, s.current.row)) {
      this._setStatus('gameover');
    }
  }

  _dropInterval() {
    const level = this._state.level;
    const idx = Math.min(level - 1, LEVEL_SPEEDS.length - 1);
    return LEVEL_SPEEDS[idx];
  }

  _notifyScore() {
    if (this._onScoreChange) {
      const s = this._state;
      this._onScoreChange(s.score, s.level, s.lines);
    }
  }
}
