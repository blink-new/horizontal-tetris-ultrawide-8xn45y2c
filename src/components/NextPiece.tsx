import React from 'react';
import { Piece, CellState } from '../types/tetris';

interface NextPieceProps {
  piece: Piece | null;
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

export const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
  if (!piece) return null;

  const maxSize = 4; // Maximum piece size
  const displayGrid = Array(maxSize).fill(null).map(() => Array(maxSize).fill(0));

  // Center the piece in the display grid
  const offsetY = Math.floor((maxSize - piece.shape.length) / 2);
  const offsetX = Math.floor((maxSize - piece.shape[0].length) / 2);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const gridY = offsetY + y;
        const gridX = offsetX + x;
        if (gridY >= 0 && gridY < maxSize && gridX >= 0 && gridX < maxSize) {
          displayGrid[gridY][gridX] = piece.color;
        }
      }
    }
  }

  return (
    <div className="neon-card rounded-lg p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Next Piece</h3>
      <div 
        className="piece-preview"
        style={{
          gridTemplateColumns: `repeat(${maxSize}, 1fr)`,
          gridTemplateRows: `repeat(${maxSize}, 1fr)`,
          width: '80px',
          height: '80px',
        }}
      >
        {displayGrid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`tetris-cell ${cell !== 0 ? 'filled' : ''} ${CELL_COLORS[cell]} transition-colors duration-150`}
              style={{
                minWidth: '16px',
                minHeight: '16px',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};