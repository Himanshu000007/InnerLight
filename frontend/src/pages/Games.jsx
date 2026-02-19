import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Play, Sparkles } from 'lucide-react';
import './Games.css';

/**
 * Games Page - Enhanced with Framer Motion
 */
const Games = () => {
  const [activeGame, setActiveGame] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="games-container">
      <AnimatePresence mode="wait">
        {!activeGame ? (
          <motion.div
            key="selection"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="games-header">
              <h1>Mindful Moments 🎮</h1>
              <p>Gentle, stress-free games designed to gently quiet a busy mind.</p>
            </div>

            <div className="games-selection">
              <motion.div
                className="game-card glass"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setActiveGame('bubble')}
              >
                <div className="game-status-badge">Relaxing</div>
                <div className="game-icon-circle" style={{ backgroundColor: 'var(--sky-blue)' }}>🫧</div>
                <h3>Bubble Pop</h3>
                <p>A meditative experience of popping colored bubbles. Focus on the gentle motion.</p>
                <button className="btn btn-primary">Enter Flow State</button>
              </motion.div>

              <motion.div
                className="game-card glass"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setActiveGame('color')}
              >
                <div className="game-status-badge">Focus</div>
                <div className="game-icon-circle" style={{ backgroundColor: 'var(--lavender)' }}>🎨</div>
                <h3>Zen Match</h3>
                <p>Find pairs in a sea of calming pastel colors. A gentle exercise for the mind.</p>
                <button className="btn btn-primary">Begin Session</button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game-active"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="active-game-wrapper"
          >
            <button
              onClick={() => setActiveGame(null)}
              className="games-back-btn"
            >
              <ArrowLeft size={18} /> Exit to Sanctuary
            </button>
            {activeGame === 'bubble' && <BubblePopGame />}
            {activeGame === 'color' && <ColorMatchGame />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- BUBBLE POP GAME ---
const BubblePopGame = () => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const colors = ['#FFB6C1', '#B0E0E6', '#E6E6FA', '#FFDAB9', '#B0F0B0', '#FFE4E1'];

  const createBubble = useCallback(() => {
    const id = Date.now();
    const newBubble = {
      id,
      x: 10 + Math.random() * 80, // percentage for better responsiveness
      size: 40 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 6 + Math.random() * 4,
    };
    setBubbles((prev) => [...prev, newBubble]);
  }, []);

  useEffect(() => {
    const interval = setInterval(createBubble, 1200);
    return () => clearInterval(interval);
  }, [createBubble]);

  const popBubble = (id) => {
    setScore(s => s + 1);
    setBubbles(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="bubble-game glass">
      <div className="game-controls-header">
        <div>
          <h2>Bubble Pop</h2>
          <p>Tap the floating colors to release tension.</p>
        </div>
        <div className="game-stat-item">
          <Sparkles className="stat-icon" size={18} />
          <span>Released: {score}</span>
        </div>
      </div>

      <div className="bubble-stage">
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              className="bubble-item"
              initial={{ y: "110%", opacity: 0, scale: 0 }}
              animate={{ y: "-10%", opacity: 0.8, scale: 1 }}
              exit={{ scale: 1.5, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: bubble.duration, ease: "linear" }}
              onAnimationComplete={() => setBubbles(prev => prev.filter(b => b.id !== bubble.id))}
              style={{
                left: `${bubble.x}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                backgroundColor: bubble.color,
                boxShadow: `0 0 15px ${bubble.color}44`,
              }}
              onClick={() => popBubble(bubble.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- ZEN MATCH GAME ---
const ColorMatchGame = () => {
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);

  const colors = [
    { name: 'Rose', hex: '#FFB6C1' },
    { name: 'Cloud', hex: '#B0E0E6' },
    { name: 'Lavender', hex: '#E6E6FA' },
    { name: 'Peach', hex: '#FFDAB9' },
    { name: 'Sage', hex: '#B0F0B0' },
    { name: 'Pearl', hex: '#FFF8DC' },
  ];

  const initGame = () => {
    const double = [...colors, ...colors]
      .sort(() => Math.random() - 0.5)
      .map((c, i) => ({ ...c, id: i }));
    setTiles(double);
    setMatched([]);
    setFlipped([]);
    setGameStarted(true);
  };

  const handleTileClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (tiles[newFlipped[0]].hex === tiles[newFlipped[1]].hex) {
        setMatched(m => [...m, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="zen-match-game glass">
      <div className="game-controls-header">
        <div>
          <h2>Zen Match</h2>
          <p>A quiet exercise in focus and memory.</p>
        </div>
        {gameStarted && (
          <div className="game-stat-item">
            <Trophy className="stat-icon" size={18} />
            <span>Found: {matched.length / 2}/6</span>
          </div>
        )}
      </div>

      {!gameStarted ? (
        <div className="start-screen">
          <button onClick={initGame} className="btn btn-primary game-start-btn">
            <Play size={18} fill="currentColor" /> Enter Zen
          </button>
        </div>
      ) : (
        <div className="zen-grid">
          {tiles.map((tile, i) => (
            <motion.div
              key={tile.id}
              className={`zen-tile ${flipped.includes(i) || matched.includes(i) ? 'active' : ''}`}
              whileHover={!matched.includes(i) ? { scale: 1.05 } : {}}
              onClick={() => handleTileClick(i)}
            >
              <div className="tile-inner">
                <div className="tile-front">?</div>
                <div className="tile-back" style={{ backgroundColor: tile.hex }}>
                  <span className="tile-color-name">{tile.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {matched.length === 12 && (
        <motion.div
          className="game-win-overlay"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>Peace Achieved</h3>
          <p>You have successfully aligned the colors of the session.</p>
          <button onClick={initGame} className="btn btn-primary">Another Session</button>
        </motion.div>
      )}
    </div>
  );
};

export default Games;
