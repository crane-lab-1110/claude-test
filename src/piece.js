import { TETROMINOES, SRS_KICKS, SRS_KICKS_I, BOARD_COLS } from './constants.js';

const TYPES = Object.keys(TETROMINOES);

export class Piece {
  constructor(type) {
    const def = TETROMINOES[type];
    this.type = type;
    this.colorIndex = def.colorIndex;
    this.rotationState = 0;
    // Deep-copy all 4 rotation states
    this._rotations = Piece._buildRotations(def.cells);
    this.cells = this._rotations[0];
    // Spawn position: top-center
    this.col = Math.floor((BOARD_COLS - this.cells[0].length) / 2);
    this.row = -1; // start just above the visible board
  }

  // Returns a new Piece of a random type, consuming from the bag.
  // bag is mutated in place; pass an empty array to auto-fill.
  static random(bag) {
    if (bag.length === 0) {
      const shuffled = [...TYPES];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      bag.push(...shuffled);
    }
    return new Piece(bag.shift());
  }

  clone() {
    const p = new Piece(this.type);
    p.col = this.col;
    p.row = this.row;
    p.rotationState = this.rotationState;
    p.cells = this._rotations[this.rotationState];
    return p;
  }

  move(dcol, drow, board) {
    const newCol = this.col + dcol;
    const newRow = this.row + drow;
    if (!board.isValidPosition(this.cells, newCol, newRow)) return false;
    this.col = newCol;
    this.row = newRow;
    return true;
  }

  rotate(direction, board) {
    const numStates = 4;
    const from = this.rotationState;
    const to = ((from + direction + numStates) % numStates);
    const newCells = this._rotations[to];
    const key = `${from}->${to}`;
    const kicks = this.type === 'I' ? SRS_KICKS_I : SRS_KICKS;
    const offsets = kicks[key] ?? [[0, 0]];

    for (const [dc, dr] of offsets) {
      const newCol = this.col + dc;
      const newRow = this.row + dr;
      if (board.isValidPosition(newCells, newCol, newRow)) {
        this.col = newCol;
        this.row = newRow;
        this.cells = newCells;
        this.rotationState = to;
        return true;
      }
    }
    return false;
  }

  // Compute the lowest valid row (ghost piece drop position)
  ghostRow(board) {
    let r = this.row;
    while (board.isValidPosition(this.cells, this.col, r + 1)) {
      r++;
    }
    return r;
  }

  // Build all 4 rotation matrices from the base (rotation state 0) matrix
  static _buildRotations(base) {
    const rotations = [base.map(row => [...row])];
    for (let i = 0; i < 3; i++) {
      rotations.push(Piece._rotateCW(rotations[rotations.length - 1]));
    }
    return rotations;
  }

  static _rotateCW(matrix) {
    const n = matrix.length;
    const result = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        result[c][n - 1 - r] = matrix[r][c];
      }
    }
    return result;
  }
}
