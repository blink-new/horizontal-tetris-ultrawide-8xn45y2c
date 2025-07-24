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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2 neon-text">
            The LUMI tetris
          </h1>
          <p className="text-muted-foreground">
            Optimized for ultra-wide displays • Pieces fall left to right
          </p>
          {gameState.isPaused && (
            <div className="mt-4 text-accent font-medium neon-text">
              Game Paused - Press P to resume
            </div>
          )}
        </div>

        {/* Game layout - Game board takes 2/3 width, sidebars share remaining 1/3 */}
        <div className="flex gap-6 items-start max-w-[95vw] mx-auto">
          {/* Left sidebar - Stats (1/6 of total width) */}
          <div className="flex-shrink-0 w-[16.67%] min-w-[250px]">
            <GameStats gameState={gameState} />
          </div>

          {/* Center - Game board (2/3 of total width) */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-none">
              <GameBoard gameState={gameState} />
              {gameState.isPaused && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
                  <div className="text-2xl font-bold text-accent neon-text">PAUSED</div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar - Controls and Next piece (1/6 of total width) */}
          <div className="flex-shrink-0 w-[16.67%] min-w-[250px] space-y-6">
            <NextPiece piece={gameState.nextPiece} />
            <GameControls
              isPaused={gameState.isPaused}
              isGameOver={gameState.isGameOver}
              onPause={pauseGame}
              onReset={resetGame}
              onRotate={rotatePiece}
              onHardDrop={hardDrop}
            />
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