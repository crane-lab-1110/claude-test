import { Piece } from '../piece.js';
import { Board } from '../board.js';
import { TETROMINOES, BOARD_ROWS } from '../constants.js';

export const pieceTests = [];

function test(name, fn) {
  pieceTests.push({ name, fn });
}

const TYPES = Object.keys(TETROMINOES);

test('all 7 types can be instantiated', () => {
  for (const t of TYPES) {
    const p = new Piece(t);
    if (p.type !== t) throw new Error(`Type mismatch: ${t}`);
    if (!p.cells || p.cells.length === 0) throw new Error(`No cells for type ${t}`);
  }
});

test('each piece has a non-zero colorIndex', () => {
  for (const t of TYPES) {
    const p = new Piece(t);
    if (!p.colorIndex || p.colorIndex < 1 || p.colorIndex > 7) {
      throw new Error(`Invalid colorIndex for ${t}: ${p.colorIndex}`);
    }
  }
});

test('rotate CW 4 times returns to original shape', () => {
  for (const t of TYPES) {
    const p = new Piece(t);
    const original = JSON.stringify(p.cells);
    const b = new Board();
    // Place piece in center to avoid wall interference
    p.col = 4; p.row = 10;
    for (let i = 0; i < 4; i++) p.rotate(1, b);
    if (JSON.stringify(p.cells) !== original) {
      throw new Error(`${t}: 4 CW rotations did not return to original`);
    }
  }
});

test('rotate CCW 4 times returns to original shape', () => {
  for (const t of TYPES) {
    const p = new Piece(t);
    const original = JSON.stringify(p.cells);
    const b = new Board();
    p.col = 4; p.row = 10;
    for (let i = 0; i < 4; i++) p.rotate(-1, b);
    if (JSON.stringify(p.cells) !== original) {
      throw new Error(`${t}: 4 CCW rotations did not return to original`);
    }
  }
});

test('rotate CW then CCW returns to original shape', () => {
  for (const t of TYPES) {
    const p = new Piece(t);
    const original = JSON.stringify(p.cells);
    const b = new Board();
    p.col = 4; p.row = 10;
    p.rotate(1, b);
    p.rotate(-1, b);
    if (JSON.stringify(p.cells) !== original) {
      throw new Error(`${t}: CW+CCW did not return to original`);
    }
  }
});

test('move returns false at left boundary', () => {
  const p = new Piece('T');
  const b = new Board();
  p.col = 0; p.row = 10;
  const result = p.move(-1, 0, b);
  if (result) throw new Error('Should not move past left boundary');
});

test('move returns false at right boundary', () => {
  const p = new Piece('T');
  const b = new Board();
  p.col = 0; p.row = 5;
  // Move right until we hit the wall
  let moved = true;
  while (moved) moved = p.move(1, 0, b);
  const result = p.move(1, 0, b);
  if (result) throw new Error('Should not move past right boundary');
});

test('move returns false at board floor', () => {
  const p = new Piece('T');
  const b = new Board();
  p.col = 4; p.row = 0;
  // Move down until floor
  let moved = true;
  while (moved) moved = p.move(0, 1, b);
  const result = p.move(0, 1, b);
  if (result) throw new Error('Should not move past floor');
});

test('move returns false when blocked by locked cell', () => {
  const p = new Piece('O');
  const b = new Board();
  p.col = 4; p.row = 5;
  // Place a cell directly below the piece
  b.setCell(4, 7, 1);
  b.setCell(5, 7, 1);
  // Move down should fail when piece reaches row 5 and locked cells are at row 7
  let moved = true;
  while (moved) moved = p.move(0, 1, b);
  if (p.move(0, 1, b)) throw new Error('Should be blocked by locked cells');
});

test('ghostRow is at or below current piece row', () => {
  const p = new Piece('I');
  const b = new Board();
  p.col = 3; p.row = 0;
  const ghost = p.ghostRow(b);
  if (ghost < p.row) throw new Error(`Ghost row ${ghost} is above piece row ${p.row}`);
});

test('ghostRow equals piece row when piece is grounded', () => {
  const p = new Piece('T');
  const b = new Board();
  p.col = 4; p.row = 0;
  // Move to floor
  while (p.move(0, 1, b)) {}
  const ghost = p.ghostRow(b);
  if (ghost !== p.row) throw new Error(`Ghost ${ghost} != piece row ${p.row} when grounded`);
});

test('7-bag: all 7 types appear in first 7 draws', () => {
  const bag = [];
  const drawn = new Set();
  for (let i = 0; i < 7; i++) {
    drawn.add(Piece.random(bag).type);
  }
  for (const t of TYPES) {
    if (!drawn.has(t)) throw new Error(`Type ${t} missing from first 7 draws`);
  }
});

test('7-bag: same type does not appear twice in one bag cycle', () => {
  const bag = [];
  const firstBatch = [];
  for (let i = 0; i < 7; i++) firstBatch.push(Piece.random(bag).type);
  const seen = new Set(firstBatch);
  if (seen.size !== 7) throw new Error('Duplicate type in 7-bag cycle');
});

test('7-bag: 14 draws contain each type exactly twice', () => {
  const bag = [];
  const counts = {};
  for (let i = 0; i < 14; i++) {
    const t = Piece.random(bag).type;
    counts[t] = (counts[t] ?? 0) + 1;
  }
  for (const t of TYPES) {
    if (counts[t] !== 2) throw new Error(`Type ${t} appeared ${counts[t]} times in 14 draws`);
  }
});

test('SRS: T-piece can rotate when touching left wall', () => {
  const p = new Piece('T');
  const b = new Board();
  p.col = 0; p.row = 10;
  // Should succeed via wall kick
  const success = p.rotate(1, b);
  if (!success) throw new Error('T-piece rotation at left wall should succeed via SRS kick');
});

test('clone preserves position and rotation state', () => {
  const p = new Piece('L');
  const b = new Board();
  p.col = 4; p.row = 8;
  p.rotate(1, b);
  const c = p.clone();
  if (c.col !== p.col || c.row !== p.row) throw new Error('Clone position mismatch');
  if (c.rotationState !== p.rotationState) throw new Error('Clone rotation state mismatch');
  if (JSON.stringify(c.cells) !== JSON.stringify(p.cells)) throw new Error('Clone cells mismatch');
});
