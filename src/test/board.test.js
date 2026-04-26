import { Board } from '../board.js';
import { BOARD_COLS, BOARD_ROWS } from '../constants.js';

export const boardTests = [];

function test(name, fn) {
  boardTests.push({ name, fn });
}

// Helper: fill a row with a given color index
function fillRow(board, row, colorIdx = 1) {
  for (let c = 0; c < BOARD_COLS; c++) board.setCell(c, row, colorIdx);
}

// Helper: count non-empty cells in a row
function rowCount(board, row) {
  let n = 0;
  for (let c = 0; c < BOARD_COLS; c++) if (board.getCell(c, row) !== 0) n++;
  return n;
}

const singleCell = [[1]];
const twoWide   = [[1, 1]];

test('isValidPosition: single cell in center is valid', () => {
  const b = new Board();
  if (!b.isValidPosition(singleCell, 5, 10)) throw new Error('Expected valid');
});

test('isValidPosition: cell at left edge (col=0) is valid', () => {
  const b = new Board();
  if (!b.isValidPosition(singleCell, 0, 10)) throw new Error('Expected valid');
});

test('isValidPosition: cell at right edge is valid', () => {
  const b = new Board();
  if (!b.isValidPosition(singleCell, BOARD_COLS - 1, 10)) throw new Error('Expected valid');
});

test('isValidPosition: cell out-of-bounds left is invalid', () => {
  const b = new Board();
  if (b.isValidPosition(singleCell, -1, 10)) throw new Error('Expected invalid');
});

test('isValidPosition: cell out-of-bounds right is invalid', () => {
  const b = new Board();
  if (b.isValidPosition(singleCell, BOARD_COLS, 10)) throw new Error('Expected invalid');
});

test('isValidPosition: cell below board bottom is invalid', () => {
  const b = new Board();
  if (b.isValidPosition(singleCell, 5, BOARD_ROWS)) throw new Error('Expected invalid');
});

test('isValidPosition: cell above board top (row=-1) is valid (spawn area)', () => {
  const b = new Board();
  if (!b.isValidPosition(singleCell, 5, -1)) throw new Error('Expected valid above board');
});

test('isValidPosition: overlap with locked cell is invalid', () => {
  const b = new Board();
  b.setCell(5, 10, 1);
  if (b.isValidPosition(singleCell, 5, 10)) throw new Error('Expected invalid on occupied cell');
});

test('isValidPosition: adjacent to locked cell is valid', () => {
  const b = new Board();
  b.setCell(5, 10, 1);
  if (!b.isValidPosition(singleCell, 6, 10)) throw new Error('Expected valid adjacent');
});

test('clearLines: no full row returns 0', () => {
  const b = new Board();
  b.setCell(0, BOARD_ROWS - 1, 1); // partial row
  const cleared = b.clearLines();
  if (cleared !== 0) throw new Error(`Expected 0 cleared, got ${cleared}`);
});

test('clearLines: one full row returns 1', () => {
  const b = new Board();
  fillRow(b, BOARD_ROWS - 1);
  const cleared = b.clearLines();
  if (cleared !== 1) throw new Error(`Expected 1 cleared, got ${cleared}`);
});

test('clearLines: full row is removed (bottom row becomes empty)', () => {
  const b = new Board();
  fillRow(b, BOARD_ROWS - 1);
  b.clearLines();
  if (rowCount(b, BOARD_ROWS - 1) !== 0) throw new Error('Bottom row should be empty after clear');
});

test('clearLines: content above full row shifts down', () => {
  const b = new Board();
  fillRow(b, BOARD_ROWS - 1);   // full row to clear
  b.setCell(0, BOARD_ROWS - 2, 3); // cell above
  b.clearLines();
  // The above-cell should now be at BOARD_ROWS - 1
  if (b.getCell(0, BOARD_ROWS - 1) !== 3) throw new Error('Cell should shift down after line clear');
});

test('clearLines: four full rows (Tetris) returns 4', () => {
  const b = new Board();
  for (let r = BOARD_ROWS - 4; r < BOARD_ROWS; r++) fillRow(b, r);
  const cleared = b.clearLines();
  if (cleared !== 4) throw new Error(`Expected 4 cleared, got ${cleared}`);
});

test('clearLines: four rows cleared, rows above shift down', () => {
  const b = new Board();
  for (let r = BOARD_ROWS - 4; r < BOARD_ROWS; r++) fillRow(b, r);
  b.setCell(0, BOARD_ROWS - 5, 7); // marker above cleared rows
  b.clearLines();
  if (b.getCell(0, BOARD_ROWS - 1) !== 7) throw new Error('Marker should shift to bottom row');
});

test('clearLines: partial row in middle is not cleared', () => {
  const b = new Board();
  fillRow(b, BOARD_ROWS - 1);
  b.setCell(0, BOARD_ROWS - 2, 1); // partial row
  b.clearLines();
  // Partial row should still exist (now at bottom)
  if (b.getCell(0, BOARD_ROWS - 1) !== 1) throw new Error('Partial row should not be cleared');
});

test('reset: all cells become empty', () => {
  const b = new Board();
  for (let r = 0; r < BOARD_ROWS; r++) fillRow(b, r, 3);
  b.reset();
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let c = 0; c < BOARD_COLS; c++) {
      if (b.getCell(c, r) !== 0) throw new Error(`Cell (${c}, ${r}) not cleared after reset`);
    }
  }
});

test('lockPiece: cells are stamped into grid', () => {
  const b = new Board();
  const piece = { cells: [[1, 1]], col: 3, row: 5, colorIndex: 2 };
  b.lockPiece(piece);
  if (b.getCell(3, 5) !== 2) throw new Error('Cell (3,5) should be locked');
  if (b.getCell(4, 5) !== 2) throw new Error('Cell (4,5) should be locked');
  if (b.getCell(2, 5) !== 0) throw new Error('Cell (2,5) should remain empty');
});
