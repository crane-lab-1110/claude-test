export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

// Layout constants (must match CSS)
const _HEADER_H   = 60;
const _CONTROLS_H = 128;
const _GAPS       = 16; // 8px above + 8px below canvas
const _H_PAD      = 8;  // total horizontal padding

const _availH = window.innerHeight - _HEADER_H - _CONTROLS_H - _GAPS;
const _availW = window.innerWidth  - _H_PAD;
export const CELL_SIZE = Math.max(20, Math.min(
  Math.floor(_availH / BOARD_ROWS),
  Math.floor(_availW / BOARD_COLS),
));

export const NEXT_CELL = 12; // size of each cell in the next-piece preview

// Tetromino definitions: cells are 4x4 matrices (rotation state 0)
// Color indices map to COLORS array (1-based, 0 = empty)
export const TETROMINOES = {
  I: {
    cells: [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0],
    ],
    colorIndex: 1,
  },
  O: {
    cells: [
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0],
    ],
    colorIndex: 2,
  },
  T: {
    cells: [
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0],
    ],
    colorIndex: 3,
  },
  S: {
    cells: [
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0],
      [0,0,0,0],
    ],
    colorIndex: 4,
  },
  Z: {
    cells: [
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0],
    ],
    colorIndex: 5,
  },
  J: {
    cells: [
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0],
    ],
    colorIndex: 6,
  },
  L: {
    cells: [
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0],
    ],
    colorIndex: 7,
  },
};

// Color palette: index 0 = empty, 1-7 = tetromino colors
export const COLORS = [
  null,
  '#00f0f0', // I - cyan
  '#f0f000', // O - yellow
  '#a000f0', // T - purple
  '#00f000', // S - green
  '#f00000', // Z - red
  '#0000f0', // J - blue
  '#f0a000', // L - orange
];

// Scoring: lines cleared simultaneously -> base points
export const SCORE_TABLE = { 1: 100, 2: 300, 3: 500, 4: 800 };

// Drop interval in ms per level (levels 1-10, then stays at last value)
export const LEVEL_SPEEDS = [
  800, 717, 633, 550, 467, 383, 300, 217, 133, 100,
];

// Lines needed to advance to next level
export const LINES_PER_LEVEL = 10;

// Lock delay: how long a grounded piece waits before locking (ms)
export const LOCK_DELAY_MS = 500;

// DAS: Delayed Auto Shift timings (ms)
export const DAS_DELAY_MS = 170;
export const DAS_REPEAT_MS = 50;

// SRS wall kick tables for J, L, S, T, Z pieces
// Each entry: [rotation_from, rotation_to] -> array of [col_offset, row_offset] to try
export const SRS_KICKS = {
  '0->1': [[ 0,0],[-1,0],[-1,-1],[0, 2],[-1, 2]],
  '1->0': [[ 0,0],[ 1,0],[ 1, 1],[0,-2],[ 1,-2]],
  '1->2': [[ 0,0],[ 1,0],[ 1, 1],[0,-2],[ 1,-2]],
  '2->1': [[ 0,0],[-1,0],[-1,-1],[0, 2],[-1, 2]],
  '2->3': [[ 0,0],[ 1,0],[ 1,-1],[0, 2],[ 1, 2]],
  '3->2': [[ 0,0],[-1,0],[-1, 1],[0,-2],[-1,-2]],
  '3->0': [[ 0,0],[-1,0],[-1, 1],[0,-2],[-1,-2]],
  '0->3': [[ 0,0],[ 1,0],[ 1,-1],[0, 2],[ 1, 2]],
};

// SRS wall kick tables for I piece (different offsets)
export const SRS_KICKS_I = {
  '0->1': [[ 0,0],[-2,0],[ 1,0],[-2, 1],[ 1,-2]],
  '1->0': [[ 0,0],[ 2,0],[-1,0],[ 2,-1],[-1, 2]],
  '1->2': [[ 0,0],[-1,0],[ 2,0],[-1,-2],[ 2, 1]],
  '2->1': [[ 0,0],[ 1,0],[-2,0],[ 1, 2],[-2,-1]],
  '2->3': [[ 0,0],[ 2,0],[-1,0],[ 2,-1],[-1, 2]],
  '3->2': [[ 0,0],[-2,0],[ 1,0],[-2, 1],[ 1,-2]],
  '3->0': [[ 0,0],[ 1,0],[-2,0],[ 1, 2],[-2,-1]],
  '0->3': [[ 0,0],[-1,0],[ 2,0],[-1,-2],[ 2, 1]],
};
