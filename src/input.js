import { DAS_DELAY_MS, DAS_REPEAT_MS } from './constants.js';

const KEY_MAP = {
  ArrowLeft:  'MOVE_LEFT',
  ArrowRight: 'MOVE_RIGHT',
  ArrowDown:  'SOFT_DROP',
  ArrowUp:    'ROTATE_CW',
  KeyZ:       'ROTATE_CCW',
  Space:      'HARD_DROP',
  KeyP:       'PAUSE',
  KeyR:       'RESTART',
};

// Actions that support DAS (held key auto-repeat)
const DAS_ACTIONS = new Set(['MOVE_LEFT', 'MOVE_RIGHT', 'SOFT_DROP']);

export class InputHandler {
  constructor(dispatch) {
    this._dispatch = dispatch;
    this._held = new Map(); // action -> { dasTimer, repeatTimer }

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp   = this._onKeyUp.bind(this);
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup',   this._onKeyUp);

    // DAS loop runs on its own rAF to keep timing independent of game loop
    this._dasLoop = this._dasLoop.bind(this);
    this._lastDasTs = null;
    requestAnimationFrame(this._dasLoop);
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup',   this._onKeyUp);
  }

  _onKeyDown(e) {
    const action = KEY_MAP[e.code];
    if (!action) return;
    e.preventDefault();

    if (e.repeat) return; // handled by DAS loop

    this._dispatch(action);

    if (DAS_ACTIONS.has(action) && !this._held.has(action)) {
      this._held.set(action, { dasTimer: 0, repeating: false });
    }
  }

  _onKeyUp(e) {
    const action = KEY_MAP[e.code];
    if (action) this._held.delete(action);
  }

  _dasLoop(ts) {
    if (this._lastDasTs === null) this._lastDasTs = ts;
    const dt = Math.min(ts - this._lastDasTs, 100);
    this._lastDasTs = ts;

    for (const [action, state] of this._held.entries()) {
      state.dasTimer += dt;
      if (!state.repeating) {
        if (state.dasTimer >= DAS_DELAY_MS) {
          state.repeating = true;
          state.dasTimer = 0;
          this._dispatch(action);
        }
      } else {
        while (state.dasTimer >= DAS_REPEAT_MS) {
          state.dasTimer -= DAS_REPEAT_MS;
          this._dispatch(action);
        }
      }
    }

    requestAnimationFrame(this._dasLoop);
  }
}
