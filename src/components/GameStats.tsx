import React from 'react';
import { GameState } from '../types/tetris';

interface GameStatsProps {
  gameState: GameState;
}

export const GameStats: React.FC<GameStatsProps> = ({ gameState }) => {
  const { score, level, lines } = gameState;

  return (
    <div className="space-y-4">
      <div className="neon-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Score</h3>
        <div className="text-2xl font-bold text-primary neon-text">
          {score.toLocaleString()}
        </div>
      </div>

      <div className="neon-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Level</h3>
        <div className="text-2xl font-bold text-accent neon-text">
          {level}
        </div>
      </div>

      <div className="neon-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Lines</h3>
        <div className="text-2xl font-bold text-foreground neon-text">
          {lines}
        </div>
      </div>
    </div>
  );
};