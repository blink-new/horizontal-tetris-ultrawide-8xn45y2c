import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { RotateCcw, Trophy } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  level: number;
  lines: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  level,
  lines,
  onRestart
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6 text-primary" />
            Game Over!
          </DialogTitle>
          <DialogDescription>
            Great job! Here's how you performed in this horizontal Tetris session.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="neon-card rounded-lg p-3">
              <div className="text-2xl font-bold text-primary neon-text">{score.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="neon-card rounded-lg p-3">
              <div className="text-2xl font-bold text-accent neon-text">{level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
            <div className="neon-card rounded-lg p-3">
              <div className="text-2xl font-bold text-foreground neon-text">{lines}</div>
              <div className="text-xs text-muted-foreground">Lines</div>
            </div>
          </div>
          
          <Button 
            onClick={onRestart}
            className="w-full neon-button"
            size="lg"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};