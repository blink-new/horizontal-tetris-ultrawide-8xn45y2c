import React from 'react';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, ArrowDown } from 'lucide-react';

interface GameControlsProps {
  isPaused: boolean;
  isGameOver: boolean;
  onPause: () => void;
  onReset: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  isPaused,
  isGameOver,
  onPause,
  onReset,
  onRotate,
  onHardDrop
}) => {
  return (
    <div className="space-y-4">
      <div className="neon-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Game Controls</h3>
        <div className="space-y-2">
          <Button
            onClick={onPause}
            disabled={isGameOver}
            variant="outline"
            size="sm"
            className="w-full neon-button"
          >
            {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="w-full neon-button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Game
          </Button>
        </div>
      </div>

      <div className="neon-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button
            onClick={onRotate}
            disabled={isGameOver || isPaused}
            variant="outline"
            size="sm"
            className="w-full neon-button"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Rotate (R)
          </Button>
          
          <Button
            onClick={onHardDrop}
            disabled={isGameOver || isPaused}
            variant="outline"
            size="sm"
            className="w-full neon-button"
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            Hard Drop (Space)
          </Button>
        </div>
      </div>

      <div className="neon-card rounded-lg p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Controls</h3>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>→ Move right (gravity)</div>
          <div>↑ ↓ Move vertically</div>
          <div>← R - Rotate piece</div>
          <div>Space - Hard drop</div>
          <div>P - Pause/Resume</div>
        </div>
      </div>
    </div>
  );
};