import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface GameState {
  isPlaying: boolean;
  isGameOver: boolean;
  score: number;
  birdY: number;
  birdVelocity: number;
  pipes: Array<{ x: number; topHeight: number; bottomHeight: number; passed: boolean }>;
  gameSpeed: number;
}

interface Player {
  name: string;
  email: string;
  score: number;
  date: string;
}

const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isGameOver: false,
    score: 0,
    birdY: 250,
    birdVelocity: 0,
    pipes: [],
    gameSpeed: 2.3
  });

  // Leaderboard and player state
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<{firstName: string, lastName: string, email: string}>({firstName: '', lastName: '', email: ''});
  const [formErrors, setFormErrors] = useState<{firstName?: string, lastName?: string, email?: string}>({});
  // const [, setLoading] = useState(false);
  const [cougarImage, setCougarImage] = useState<HTMLImageElement | null>(null);

  // Dynamic game dimensions for fullscreen mobile
  const [gameDimensions, setGameDimensions] = useState({ width: 400, height: 600 });
  
  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setGameDimensions({
          width: window.innerWidth,
          height: window.innerHeight - 20 // Small margin
        });
      } else {
        setGameDimensions({ width: 400, height: 600 });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const BIRD_SIZE = Math.min(30, gameDimensions.width * 0.08);
  const PIPE_WIDTH = Math.min(60, gameDimensions.width * 0.15);
  const PIPE_GAP = Math.min(200, gameDimensions.height * 0.32); // Slightly smaller gap
  const GRAVITY = 0.3; // Slightly heavier gravity
  const JUMP_FORCE = -5.5; // Slightly stronger jump

  // Fetch leaderboard from Supabase
  const fetchLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard_scores')
        .select('name, email, score, created_at')
        .order('score', { ascending: false })
        .limit(5);

      if (error) {
        throw error;
      }

      const players: Player[] =
        data?.map((row) => ({
          name: row.name || 'Anonymous',
          email: row.email || '',
          score: row.score || 0,
          date: row.created_at || new Date().toISOString(),
        })) ?? [];

      setLeaderboard(players);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  }, []);

  // Submit score via Supabase RPC (server-side upsert logic)
  const submitScore = useCallback(
    async (firstName: string, lastName: string, playerEmail: string, score: number) => {
      try {
        const fullName = `${firstName} ${lastName}`.trim();
        const { error } = await supabase.rpc('upsert_leaderboard_score', {
          p_email: playerEmail,
          p_name: fullName,
          p_score: score,
        });

        if (error) {
          throw error;
        }

        setTimeout(() => fetchLeaderboard(), 100);
      } catch (error) {
        console.error('Error submitting score:', error);
      }
    },
    [fetchLeaderboard]
  );

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation function
  const validateForm = (): boolean => {
    const errors: {firstName?: string, lastName?: string, email?: string} = {};
    
    if (!currentPlayer.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!currentPlayer.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!currentPlayer.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(currentPlayer.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Initialize game
  const startGame = useCallback(() => {
    if (!currentPlayer.firstName || !currentPlayer.lastName || !currentPlayer.email) {
      setShowPlayerForm(true);
      return;
    }
    
    setGameState({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      birdY: 250,
      birdVelocity: 0,
      pipes: [],
      gameSpeed: 2.3
    });
  }, [currentPlayer]);

  // Handle bird jump
  const jump = useCallback(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      setGameState(prev => ({
        ...prev,
        birdVelocity: JUMP_FORCE
      }));
    }
  }, [gameState.isPlaying, gameState.isGameOver]);

  // Game over logic
  const gameOver = useCallback(() => {
    console.log('Game Over triggered!');
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true
    }));
    
    // Submit score to leaderboard
    if (currentPlayer.firstName && currentPlayer.lastName && currentPlayer.email) {
      submitScore(currentPlayer.firstName, currentPlayer.lastName, currentPlayer.email, gameState.score);
    }
  }, [currentPlayer, gameState.score, submitScore]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    setGameState(prev => {
      let newState = { ...prev };

      // Update bird physics
      newState.birdVelocity += GRAVITY;
      newState.birdY += newState.birdVelocity;

      // Check bird boundaries
      if (newState.birdY < 0 || newState.birdY > gameDimensions.height - BIRD_SIZE) {
        gameOver();
        return prev;
      }

      // Update pipes
      newState.pipes = newState.pipes.map(pipe => ({
        ...pipe,
        x: pipe.x - newState.gameSpeed
      }));

      // Remove off-screen pipes
      newState.pipes = newState.pipes.filter(pipe => pipe.x > -PIPE_WIDTH);

      // Add new pipes
      if (newState.pipes.length === 0 || newState.pipes[newState.pipes.length - 1].x < gameDimensions.width - 180) {
        const topHeight = Math.random() * (gameDimensions.height - PIPE_GAP - 100) + 50;
        newState.pipes.push({
          x: gameDimensions.width,
          topHeight,
          bottomHeight: gameDimensions.height - topHeight - PIPE_GAP,
          passed: false
        });
      }

      // Check collisions
      const birdRect = {
        x: 50,
        y: newState.birdY,
        width: BIRD_SIZE,
        height: BIRD_SIZE
      };

      for (const pipe of newState.pipes) {
        // Top pipe collision
        if (birdRect.x < pipe.x + PIPE_WIDTH &&
            birdRect.x + birdRect.width > pipe.x &&
            birdRect.y < pipe.topHeight) {
          gameOver();
          return prev;
        }

        // Bottom pipe collision
        if (birdRect.x < pipe.x + PIPE_WIDTH &&
            birdRect.x + birdRect.width > pipe.x &&
            birdRect.y + birdRect.height > gameDimensions.height - pipe.bottomHeight) {
          gameOver();
          return prev;
        }

        // Score counting
        if (!pipe.passed && pipe.x + PIPE_WIDTH < birdRect.x) {
          pipe.passed = true;
          newState.score += 1;
        }
      }

      // Increase game speed gradually
      if (newState.score > 0 && newState.score % 4 === 0) {
        newState.gameSpeed = Math.min(2.3 + (newState.score / 4) * 0.25, 3.3);
      }

      return newState;
    });
  }, [gameState.isPlaying, gameState.isGameOver, gameOver]);

  // Handle touch/click with double-tap prevention
  // const handleInput = useCallback((e: React.MouseEvent | React.TouchEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   
  //   // Prevent double jumps by checking if we're already jumping
  //   if (gameState.birdVelocity > -3) { // Only allow jump if not already jumping hard
  //     jump();
  //   }
  // }, [jump, gameState.birdVelocity]);

  // Handle mouse clicks (desktop only)
  const handleMouseClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle mouse clicks if not on a touch device
    if (!('ontouchstart' in window)) {
      if (gameState.birdVelocity > -3) {
        jump();
      }
    }
  }, [jump, gameState.birdVelocity]);

  // Handle touch events (mobile only)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (gameState.birdVelocity > -3) {
      jump();
    }
  }, [jump, gameState.birdVelocity]);

  // Game loop effect
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isGameOver) {
      const loop = () => {
        gameLoop();
        if (gameState.isPlaying && !gameState.isGameOver) {
          gameLoopRef.current = requestAnimationFrame(loop);
        }
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isGameOver, gameLoop]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with PMA brand gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, gameDimensions.height);
    gradient.addColorStop(0, '#215096'); // PMA dark blue top
    gradient.addColorStop(1, '#4299E1'); // PMA light blue bottom
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameDimensions.width, gameDimensions.height);

    // Draw mountains background (cleaner look)
    ctx.fillStyle = '#1E3A8A'; // Darker blue mountains
    ctx.beginPath();
    ctx.moveTo(0, gameDimensions.height);
    ctx.lineTo(0, gameDimensions.height - 100);
    ctx.lineTo(100, gameDimensions.height - 150);
    ctx.lineTo(200, gameDimensions.height - 120);
    ctx.lineTo(300, gameDimensions.height - 180);
    ctx.lineTo(gameDimensions.width, gameDimensions.height - 140);
    ctx.lineTo(gameDimensions.width, gameDimensions.height);
    ctx.closePath();
    ctx.fill();

    // Draw pipes (PMA themed - white with blue accents)
    ctx.fillStyle = '#FFFFFF'; // White pipes
    gameState.pipes.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, gameDimensions.height - pipe.bottomHeight, PIPE_WIDTH, pipe.bottomHeight);
      
      // Pipe caps (PMA blue)
      ctx.fillStyle = '#215096';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
      ctx.fillRect(pipe.x - 5, gameDimensions.height - pipe.bottomHeight, PIPE_WIDTH + 10, 20);
      ctx.fillStyle = '#FFFFFF';
    });

    // Draw PMA Cougar head image
    const cougarX = 50;
    const cougarY = gameState.birdY;
    
    if (cougarImage) {
      // Save the current canvas state
      ctx.save();
      
      // Move to the center of the cougar position
      ctx.translate(cougarX + BIRD_SIZE/2, cougarY + BIRD_SIZE/2);
      
      // Flip the image horizontally to face right
      ctx.scale(-1, 1);
      
      // Draw the cougar image (larger size)
      const imageSize = BIRD_SIZE * 1.4; // Make it 40% larger
      ctx.drawImage(cougarImage, -imageSize/2, -imageSize/2, imageSize, imageSize);
      
      // Restore the canvas state
      ctx.restore();
    } else {
      // Fallback: draw a simple circle while image loads
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.ellipse(cougarX + BIRD_SIZE/2, cougarY + BIRD_SIZE/2, BIRD_SIZE/2, BIRD_SIZE/2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#215096';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw score (PMA themed)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Arial';
    ctx.strokeStyle = '#215096';
    ctx.lineWidth = 2;
    ctx.strokeText(`Score: ${gameState.score}`, 10, 35);
    ctx.fillText(`Score: ${gameState.score}`, 10, 35);

    // Draw PMA logo in corner
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.strokeStyle = '#215096';
    ctx.lineWidth = 1;
    ctx.strokeText('BYU PMA', gameDimensions.width - 70, 25);
    ctx.fillText('BYU PMA', gameDimensions.width - 70, 25);
  }, [gameState, gameDimensions]);

  // Load cougar image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setCougarImage(img);
    img.src = '/img/cougarhead.jpeg';
  }, []);

  // Fetch leaderboard on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);


  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="w-full">
        {/* Main Game Screen - Always visible when not playing */}
        {!gameState.isPlaying && (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#215096] to-[#4299E1] text-white p-4 py-8 pt-20">
            <div className="text-center mb-6 max-w-lg">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-white">
                BYU PMA <span className="text-gradient">Cougar Flight</span>
              </h1>
              
              {/* Game Instructions - Only show when not game over */}
              {!gameState.isGameOver && (
                <p className="text-lg sm:text-xl text-blue-100 mb-6">
                  Help the BYU Cougar fly through the obstacles! Tap to jump and avoid the pipes.
                </p>
              )}
              
              {/* Score Display - Only show when game over */}
              {gameState.isGameOver && (
                <div className="mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 sm:p-6 mb-4">
                    <p className="text-xl sm:text-2xl font-bold text-yellow-300 mb-2">Final Score</p>
                    <p className="text-2xl sm:text-3xl font-bold text-white">{gameState.score}</p>
                  </div>
                  
                  {/* Score Message */}
                  {gameState.score >= 20 ? (
                    <div className="animate-pulse">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-4 sm:p-6 mb-4">
                        <p className="text-2xl sm:text-3xl font-bold text-white mb-2">🏆 CONGRATS! 🏆</p>
                        <p className="text-lg sm:text-xl text-white">You get a prize!</p>
                      </div>
                      <p className="text-base sm:text-lg mb-4 text-blue-100">You've mastered the PMA Cougar Flight!</p>
                      <div className="flex justify-center space-x-2">
                        <span className="text-xl sm:text-2xl">🎉</span>
                        <span className="text-xl sm:text-2xl">🎊</span>
                        <span className="text-xl sm:text-2xl">🏆</span>
                        <span className="text-xl sm:text-2xl">🎉</span>
                        <span className="text-xl sm:text-2xl">🎊</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-orange-500/80 rounded-lg p-4 mb-4">
                        <p className="text-xl sm:text-2xl font-bold text-white mb-2">So Close!</p>
                        <p className="text-base sm:text-lg text-white">Try again to reach 20 points and win a prize!</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                {!gameState.isGameOver ? (
                  <button
                    onClick={startGame}
                    className="bg-white hover:bg-gray-100 text-[#215096] font-bold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-lg transition-colors shadow-lg transform hover:scale-105 w-full sm:w-auto"
                  >
                    Start Game
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setGameState({
                          isPlaying: true,
                          isGameOver: false,
                          score: 0,
                          birdY: 250,
                          birdVelocity: 0,
                          pipes: [],
                          gameSpeed: 2.3
                        });
                      }}
                      className="bg-white hover:bg-gray-100 text-[#215096] font-bold text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors shadow-lg transform hover:scale-105 w-full sm:w-auto"
                    >
                      🔄 Play Again
                    </button>
                    <Link
                      to="/"
                      className="bg-gradient-to-r from-[#215096] to-[#4299E1] !text-white font-bold text-lg sm:text-xl px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:from-[#1a3d7a] hover:to-[#3a8bd1] transition-all text-center shadow-lg transform hover:scale-105 w-full sm:w-auto drop-shadow-md"
                    >
                      Club Home Page
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Leaderboard - Always visible */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 max-w-md w-full mx-2 sm:mx-4 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 text-center">🏆 Top 5 Leaderboard</h3>
              <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                {leaderboard.length > 0 ? (
                  leaderboard.map((player, index) => (
                    <div key={index} className="flex justify-between items-center text-sm sm:text-lg bg-white/5 rounded-lg p-2 sm:p-3">
                      <span className="text-white font-medium truncate mr-2">
                        {index + 1}. {player.name}
                      </span>
                      <span className="text-yellow-300 font-bold text-lg sm:text-xl flex-shrink-0">
                        {player.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-blue-100 text-center text-sm sm:text-lg">No scores yet! Be the first to play!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Player Form Modal */}
        {showPlayerForm && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-[#215096] mb-6 text-center">
                Join the Leaderboard!
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={currentPlayer.firstName}
                    onChange={(e) => {
                      setCurrentPlayer(prev => ({...prev, firstName: e.target.value}));
                      if (formErrors.firstName) {
                        setFormErrors(prev => ({...prev, firstName: undefined}));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#215096] text-black ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your first name"
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={currentPlayer.lastName}
                    onChange={(e) => {
                      setCurrentPlayer(prev => ({...prev, lastName: e.target.value}));
                      if (formErrors.lastName) {
                        setFormErrors(prev => ({...prev, lastName: undefined}));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#215096] text-black ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your last name"
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={currentPlayer.email}
                    onChange={(e) => {
                      setCurrentPlayer(prev => ({...prev, email: e.target.value}));
                      if (formErrors.email) {
                        setFormErrors(prev => ({...prev, email: undefined}));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#215096] text-black ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowPlayerForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (validateForm()) {
                        setShowPlayerForm(false);
                        setGameState({
                          isPlaying: true,
                          isGameOver: false,
                          score: 0,
                          birdY: 250,
                          birdVelocity: 0,
                          pipes: [],
                          gameSpeed: 2.3
                        });
                      }
                    }}
                    disabled={!currentPlayer.firstName || !currentPlayer.lastName || !currentPlayer.email}
                    className="flex-1 px-4 py-2 bg-[#215096] text-white rounded-md hover:bg-[#1a3d7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Canvas - Only show when actively playing */}
        {gameState.isPlaying && !gameState.isGameOver && (
          <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-[#215096] to-[#4299E1]">
            <canvas
              ref={canvasRef}
              width={gameDimensions.width}
              height={gameDimensions.height}
              className="w-full h-full object-contain"
              onClick={handleMouseClick}
              onTouchStart={handleTouchStart}
              style={{ touchAction: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;

