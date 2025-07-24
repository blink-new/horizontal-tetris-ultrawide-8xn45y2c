export type CellState = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // 0 = empty, 1-7 = different piece types

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  shape: number[][];
  color: CellState;
  position: Position;
}

export interface GameState {
  board: CellState[][];
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
  clearingColumns: number[]; // Columns currently being cleared with animation
  isClearing: boolean; // Whether line clearing animation is in progress
}

export const PIECE_SHAPES = {
  I: [
    [1, 1, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ]
};

export const PIECE_COLORS: CellState[] = [0, 1, 2, 3, 4, 5, 6, 7];

export const BOARD_WIDTH = 30; // Wider for horizontal play
export const BOARD_HEIGHT = 10; // Shorter for horizontal play