import React from 'react';
import { GameState, CellState } from '../types/tetris';

interface GameBoardProps {
  gameState: GameState;
}

const CELL_COLORS: Record<CellState, string> = {
  0: 'bg-slate-900/20', // Empty
  1: 'bg-piece-i', // I piece - Bright orange
  2: 'bg-piece-o', // O piece - Light orange (accent)
  3: 'bg-piece-t', // T piece - Dark orange
  4: 'bg-piece-s', // S piece - Medium orange
  5: 'bg-piece-z', // Z piece - Deep orange
  6: 'bg-piece-j', // J piece - Golden orange
  7: 'bg-piece-l', // L piece - Burnt orange
};

export const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const { board, currentPiece } = gameState;

  // Create a display board with the current piece overlaid
  const displayBoard = board.map(row => [...row]);
  
  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardX = currentPiece.position.x + x;
          const boardY = currentPiece.position.y + y;
          if (
            boardX >= 0 && 
            boardX < displayBoard[0].length && 
            boardY >= 0 && 
            boardY < displayBoard.length
          ) {
            displayBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
  }

  return (
    <div 
      className="game-grid"
      style={{
        gridTemplateColumns: `repeat(${displayBoard[0].length}, 1fr)`,
        gridTemplateRows: `repeat(${displayBoard.length}, 1fr)`,
        width: '100%',
        height: 'auto',
        aspectRatio: `${displayBoard[0].length} / ${displayBoard.length}`,
      }}
    >
      {displayBoard.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${x}-${y}`}
            className={`tetris-cell ${cell !== 0 ? 'filled' : ''} ${CELL_COLORS[cell]} transition-colors duration-100`}
            style={{
              minWidth: '20px',
              minHeight: '20px',
            }}
          />
        ))
      )}
    </div>
  );
};