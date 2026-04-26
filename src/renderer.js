import { BOARD_COLS, BOARD_ROWS, CELL_SIZE, NEXT_CELL, COLORS } from './constants.js';

const NEXT_GRID = 4;

export class Renderer {
  constructor(gameCanvas, nextCanvas) {
    this._ctx = gameCanvas.getContext('2d');
    this._nextCtx = nextCanvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    this._dpr = dpr;

    const w = BOARD_COLS * CELL_SIZE;
    const h = BOARD_ROWS * CELL_SIZE;
    gameCanvas.width = w * dpr;
    gameCanvas.height = h * dpr;
    gameCanvas.style.width = `${w}px`;
    gameCanvas.style.height = `${h}px`;
    this._ctx.scale(dpr, dpr);

    const nw = NEXT_GRID * NEXT_CELL;
    const nh = NEXT_GRID * NEXT_CELL;
    nextCanvas.width = nw * dpr;
    nextCanvas.height = nh * dpr;
    nextCanvas.style.width = `${nw}px`;
    nextCanvas.style.height = `${nh}px`;
    this._nextCtx.scale(dpr, dpr);
  }

  draw(state) {
    this._drawBoard(state.board);
    if (state.current) {
      this._drawGhost(state.current, state.board);
      this._drawPiece(this._ctx, state.current, CELL_SIZE);
    }
    this._drawNext(state.next);
  }

  _drawBoard(board) {
    const ctx = this._ctx;
    const w = BOARD_COLS * CELL_SIZE;
    const h = BOARD_ROWS * CELL_SIZE;

    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = '#1e1e3a';
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= BOARD_COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_SIZE, 0);
      ctx.lineTo(c * CELL_SIZE, h);
      ctx.stroke();
    }
    for (let r = 0; r <= BOARD_ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL_SIZE);
      ctx.lineTo(w, r * CELL_SIZE);
      ctx.stroke();
    }

    // Locked cells
    for (let r = 0; r < BOARD_ROWS; r++) {
      for (let c = 0; c < BOARD_COLS; c++) {
        const colorIdx = board.getCell(c, r);
        if (colorIdx) {
          this._drawCell(ctx, c, r, COLORS[colorIdx], CELL_SIZE);
        }
      }
    }
  }

  _drawGhost(piece, board) {
    const ghostRow = piece.ghostRow(board);
    if (ghostRow === piece.row) return;
    const ctx = this._ctx;
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (let r = 0; r < piece.cells.length; r++) {
      for (let c = 0; c < piece.cells[r].length; c++) {
        if (!piece.cells[r][c]) continue;
        this._drawCell(ctx, piece.col + c, ghostRow + r, COLORS[piece.colorIndex], CELL_SIZE);
      }
    }
    ctx.restore();
  }

  _drawPiece(ctx, piece, cellSize) {
    for (let r = 0; r < piece.cells.length; r++) {
      for (let c = 0; c < piece.cells[r].length; c++) {
        if (!piece.cells[r][c]) continue;
        const boardRow = piece.row + r;
        if (boardRow < 0) continue; // above visible board
        this._drawCell(ctx, piece.col + c, boardRow, COLORS[piece.colorIndex], cellSize);
      }
    }
  }

  _drawNext(piece) {
    const ctx = this._nextCtx;
    const size = NEXT_GRID * NEXT_CELL;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, size, size);
    if (!piece) return;

    // Center the piece in the 4x4 preview grid
    const offsetCol = Math.floor((NEXT_GRID - piece.cells[0].length) / 2);
    const offsetRow = Math.floor((NEXT_GRID - piece.cells.length) / 2);

    for (let r = 0; r < piece.cells.length; r++) {
      for (let c = 0; c < piece.cells[r].length; c++) {
        if (!piece.cells[r][c]) continue;
        this._drawCell(ctx, offsetCol + c, offsetRow + r, COLORS[piece.colorIndex], NEXT_CELL);
      }
    }
  }

  _drawCell(ctx, col, row, color, cellSize) {
    const x = col * cellSize;
    const y = row * cellSize;
    const pad = 1;

    // Main fill
    ctx.fillStyle = color;
    ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, cellSize - pad * 2);

    // Highlight (top-left)
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(x + pad, y + pad, cellSize - pad * 2, 3);
    ctx.fillRect(x + pad, y + pad, 3, cellSize - pad * 2);

    // Shadow (bottom-right)
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fillRect(x + pad, y + cellSize - pad - 3, cellSize - pad * 2, 3);
    ctx.fillRect(x + cellSize - pad - 3, y + pad, 3, cellSize - pad * 2);
  }
}
