import React from 'react';
import { useTetris } from './hooks/useTetris';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { GameStats } from './components/GameStats';
import { GameControls } from './components/GameControls';
import { GameOverModal } from './components/GameOverModal';

function App() {
  const { gameState, rotatePiece, hardDrop, pauseGame, resetGame } = useTetris();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-slate-900/50 -z-10" />
      
      {/* Main game container */}
      <div className="container mx-auto px-4 py-4 h-screen flex flex-col">
        {gameState.isPaused && (
          <div className="text-center py-2">
            <div className="text-accent font-medium neon-text">
              Game Paused - Press P to resume
            </div>
          </div>
        )}

        {/* Game layout - Maximized for screen space */}
        <div className="flex gap-4 flex-1 max-w-[98vw] mx-auto">
          {/* Left sidebar - Stats (narrower) */}
          <div className="flex-shrink-0 w-[180px] pt-8">
            <GameStats gameState={gameState} />
          </div>

          {/* Center - Game board and title */}
          <div className="flex-1 flex flex-col">
            {/* Game board area */}
            <div className="flex-1 flex justify-center items-start pt-8">
              <div className="relative w-full max-w-none">
                <GameBoard gameState={gameState} />
                {gameState.isPaused && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <div className="text-2xl font-bold text-accent neon-text">PAUSED</div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Title below game board */}
            <div className="text-center py-6">
              <h1 className="text-5xl font-bold text-primary neon-text font-poppins">
                The LUMI tetris
              </h1>
            </div>
          </div>

          {/* Right sidebar - Next piece only (narrower) */}
          <div className="flex-shrink-0 w-[180px] pt-8">
            <NextPiece piece={gameState.nextPiece} />
            {/* Simple pause/reset controls without buttons */}
            <div className="mt-6 p-4 bg-card/50 rounded-lg border border-primary/20 neon-glow">
              <h3 className="text-sm font-medium text-primary mb-3 neon-text">Controls</h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>← Rotate piece</div>
                <div>→ Move right</div>
                <div>↑↓ Move vertically</div>
                <div>Space - Hard drop</div>
                <div>P - Pause/Resume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Over Modal */}
        <GameOverModal
          isOpen={gameState.isGameOver}
          score={gameState.score}
          level={gameState.level}
          lines={gameState.lines}
          onRestart={resetGame}
        />
      </div>
    </div>
  );
}

export default App;