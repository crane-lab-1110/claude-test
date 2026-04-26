import { BOARD_COLS, BOARD_ROWS } from './constants.js';

export class Board {
  constructor() {
    // Flat array: row-major order. grid[row * BOARD_COLS + col]
    // 0 = empty, 1-7 = locked color index
    this.grid = new Uint8Array(BOARD_ROWS * BOARD_COLS);
  }

  reset() {
    this.grid.fill(0);
  }

  getCell(col, row) {
    return this.grid[row * BOARD_COLS + col];
  }

  setCell(col, row, value) {
    this.grid[row * BOARD_COLS + col] = value;
  }

  isValidPosition(cells, col, row) {
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (!cells[r][c]) continue;
        const boardCol = col + c;
        const boardRow = row + r;
        if (boardCol < 0 || boardCol >= BOARD_COLS) return false;
        if (boardRow >= BOARD_ROWS) return false;
        // Cells above the board top are allowed (piece spawning)
        if (boardRow < 0) continue;
        if (this.getCell(boardCol, boardRow) !== 0) return false;
      }
    }
    return true;
  }

  lockPiece(piece) {
    const { cells, col, row, colorIndex } = piece;
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        if (!cells[r][c]) continue;
        const boardRow = row + r;
        const boardCol = col + c;
        if (boardRow >= 0 && boardRow < BOARD_ROWS && boardCol >= 0 && boardCol < BOARD_COLS) {
          this.setCell(boardCol, boardRow, colorIndex);
        }
      }
    }
  }

  clearLines() {
    let linesCleared = 0;
    let writeRow = BOARD_ROWS - 1;

    for (let readRow = BOARD_ROWS - 1; readRow >= 0; readRow--) {
      if (this._isRowFull(readRow)) {
        linesCleared++;
      } else {
        if (writeRow !== readRow) {
          this._copyRow(readRow, writeRow);
        }
        writeRow--;
      }
    }

    // Clear the rows at the top that were vacated
    for (let r = writeRow; r >= 0; r--) {
      this._clearRow(r);
    }

    return linesCleared;
  }

  _isRowFull(row) {
    for (let c = 0; c < BOARD_COLS; c++) {
      if (this.getCell(c, row) === 0) return false;
    }
    return true;
  }

  _copyRow(fromRow, toRow) {
    for (let c = 0; c < BOARD_COLS; c++) {
      this.setCell(c, toRow, this.getCell(c, fromRow));
    }
  }

  _clearRow(row) {
    for (let c = 0; c < BOARD_COLS; c++) {
      this.setCell(c, row, 0);
    }
  }
}
