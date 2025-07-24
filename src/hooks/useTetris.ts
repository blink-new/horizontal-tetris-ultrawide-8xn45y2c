import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, Piece, Position, CellState, PIECE_SHAPES, PIECE_COLORS, BOARD_WIDTH, BOARD_HEIGHT } from '../types/tetris';

const INITIAL_BOARD: CellState[][] = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));

const PIECES = Object.entries(PIECE_SHAPES);

const createRandomPiece = (): Piece => {
  const [, shape] = PIECES[Math.floor(Math.random() * PIECES.length)];
  const color = PIECE_COLORS[Math.floor(Math.random() * (PIECE_COLORS.length - 1)) + 1] as CellState;
  
  return {
    shape,
    color,
    position: { x: 0, y: Math.floor(BOARD_HEIGHT / 2) - Math.floor(shape.length / 2) }
  };
};

const rotatePiece = (piece: Piece): Piece => {
  const rotated = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  
  return {
    ...piece,
    shape: rotated
  };
};

const isValidPosition = (board: CellState[][], piece: Piece, newPos: Position): boolean => {
  // Check each cell of the piece shape
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = newPos.x + x;
        const boardY = newPos.y + y;
        
        // Check bounds more carefully
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY < 0 || boardY >= BOARD_HEIGHT) {
          return false;
        }
        
        // Check collision with existing pieces
        if (board[boardY] && board[boardY][boardX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

const placePiece = (board: CellState[][], piece: Piece): CellState[][] => {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardX = piece.position.x + x;
        const boardY = piece.position.y + y;
        if (boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }
  
  return newBoard;
};

const clearLines = (board: CellState[][]): { newBoard: CellState[][]; linesCleared: number } => {
  const newBoard = [...board];
  let linesCleared = 0;
  
  // Check vertical columns (since we're horizontal)
  for (let x = 0; x < BOARD_WIDTH; x++) {
    let isFullColumn = true;
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y][x] === 0) {
        isFullColumn = false;
        break;
      }
    }
    
    if (isFullColumn) {
      // Clear the column by shifting everything right
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let shiftX = x; shiftX > 0; shiftX--) {
          newBoard[y][shiftX] = newBoard[y][shiftX - 1];
        }
        newBoard[y][0] = 0;
      }
      linesCleared++;
      x--; // Check the same column again
    }
  }
  
  return { newBoard, linesCleared };
};

export const useTetris = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: INITIAL_BOARD,
    currentPiece: createRandomPiece(),
    nextPiece: createRandomPiece(),
    score: 0,
    level: 1,
    lines: 0,
    isGameOver: false,
    isPaused: false
  });

  const gameLoopRef = useRef<NodeJS.Timeout>();
  const dropTimeRef = useRef(1000);

  const movePiece = useCallback((direction: 'right' | 'down' | 'up') => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      let newPos: Position;
      switch (direction) {
        case 'right': // Move right (gravity direction)
          newPos = { x: prev.currentPiece.position.x + 1, y: prev.currentPiece.position.y };
          break;
        case 'down': // Move down
          newPos = { x: prev.currentPiece.position.x, y: prev.currentPiece.position.y + 1 };
          break;
        case 'up': // Move up
          newPos = { x: prev.currentPiece.position.x, y: prev.currentPiece.position.y - 1 };
          break;
      }

      // Ensure the new position is within bounds and valid
      if (isValidPosition(prev.board, prev.currentPiece, newPos)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: newPos
          }
        };
      }

      // If moving right (gravity) fails, place the piece
      if (direction === 'right') {
        const newBoard = placePiece(prev.board, prev.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        const newScore = prev.score + (linesCleared * 100 * prev.level) + 10;
        const newLines = prev.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        
        const nextPiece = createRandomPiece();
        const isGameOver = !isValidPosition(clearedBoard, prev.nextPiece!, prev.nextPiece!.position);
        
        return {
          ...prev,
          board: clearedBoard,
          currentPiece: isGameOver ? null : prev.nextPiece,
          nextPiece: nextPiece,
          score: newScore,
          level: newLevel,
          lines: newLines,
          isGameOver
        };
      }

      return prev;
    });
  }, []);

  const rotatePieceHandler = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const rotatedPiece = rotatePiece(prev.currentPiece);
      
      if (isValidPosition(prev.board, rotatedPiece, rotatedPiece.position)) {
        return {
          ...prev,
          currentPiece: rotatedPiece
        };
      }

      return prev;
    });
  }, []);

  const dropPiece = useCallback(() => {
    movePiece('right');
  }, [movePiece]);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;

      const newPiece = { ...prev.currentPiece };
      while (isValidPosition(prev.board, newPiece, { x: newPiece.position.x + 1, y: newPiece.position.y })) {
        newPiece.position.x++;
      }

      const newBoard = placePiece(prev.board, newPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newScore = prev.score + (linesCleared * 100 * prev.level) + 20;
      const newLines = prev.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      
      const nextPiece = createRandomPiece();
      const isGameOver = !isValidPosition(clearedBoard, prev.nextPiece!, prev.nextPiece!.position);
      
      return {
        ...prev,
        board: clearedBoard,
        currentPiece: isGameOver ? null : prev.nextPiece,
        nextPiece: nextPiece,
        score: newScore,
        level: newLevel,
        lines: newLines,
        isGameOver
      };
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: INITIAL_BOARD,
      currentPiece: createRandomPiece(),
      nextPiece: createRandomPiece(),
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
      return;
    }

    dropTimeRef.current = Math.max(100, 1000 - (gameState.level - 1) * 100);

    gameLoopRef.current = setInterval(() => {
      dropPiece();
    }, dropTimeRef.current);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.level, gameState.isGameOver, gameState.isPaused, dropPiece]);

  // Keyboard controls with debouncing for movement keys
  useEffect(() => {
    let lastMoveTime = 0;
    const MOVE_DEBOUNCE = 50; // 50ms debounce for movement keys

    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.isGameOver) return;

      const now = Date.now();
      const isMovementKey = ['ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key);

      // Apply debounce only to movement keys to prevent rapid firing
      if (isMovementKey && now - lastMoveTime < MOVE_DEBOUNCE) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          movePiece('right');
          lastMoveTime = now;
          break;
        case 'ArrowUp':
          event.preventDefault();
          movePiece('up');
          lastMoveTime = now;
          break;
        case 'ArrowDown':
          event.preventDefault();
          movePiece('down');
          lastMoveTime = now;
          break;
        case 'ArrowLeft': // Left arrow now rotates instead of moving backwards
          event.preventDefault();
          rotatePieceHandler();
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          rotatePieceHandler();
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isGameOver, movePiece, rotatePieceHandler, hardDrop, pauseGame]);

  return {
    gameState,
    movePiece,
    rotatePiece: rotatePieceHandler,
    hardDrop,
    pauseGame,
    resetGame
  };
};