import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X } from 'lucide-react';

// 4-7-8 breathing technique
const PHASES = [
  { label: 'Breathe In', duration: 4, color: 'from-blue-500 to-cyan-400', scale: 1.25 },
  { label: 'Hold', duration: 7, color: 'from-purple-500 to-indigo-400', scale: 1.25 },
  { label: 'Breathe Out', duration: 8, color: 'from-emerald-500 to-teal-400', scale: 0.85 },
];

const BreathingExercise = ({ onClose }) => {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(PHASES[0].duration);
  const [cycles, setCycles] = useState(0);
  const timerRef = useRef(null);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    if (!running) return;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Move to next phase
          setPhaseIndex((pi) => {
            const next = (pi + 1) % PHASES.length;
            if (next === 0) setCycles((c) => c + 1);
            setCountdown(PHASES[next].duration);
            return next;
          });
          return PHASES[phaseIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [running, phaseIndex]);

  const handleToggle = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      setPhaseIndex(0);
      setCountdown(PHASES[0].duration);
    } else {
      setRunning(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl text-center">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-border text-text-secondary transition"
        >
          <X size={18} />
        </button>

        <h2 className="text-2xl font-bold text-text mb-1">Breathing Exercise</h2>
        <p className="text-text-secondary text-sm mb-6">4-7-8 Technique · {cycles} cycle{cycles !== 1 ? 's' : ''} completed</p>

        {/* Animated Circle */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative flex items-center justify-center">
            {/* Outer ripple */}
            {running && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: phase.duration, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute w-52 h-52 rounded-full bg-gradient-to-br ${phase.color} opacity-20`}
              />
            )}

            {/* Main breathing circle */}
            <motion.div
              animate={running ? { scale: phase.scale } : { scale: 1 }}
              transition={{ duration: phase.duration, ease: 'easeInOut' }}
              className={`w-40 h-40 rounded-full bg-gradient-to-br ${running ? phase.color : 'from-gray-600 to-gray-500'} flex flex-col items-center justify-center shadow-xl`}
            >
              <span className="text-white text-5xl font-bold">{countdown}</span>
              <span className="text-white text-xs mt-1 font-medium opacity-90">
                {running ? phase.label : 'Ready'}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {PHASES.map((p, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                running && phaseIndex === i
                  ? 'w-8 bg-primary'
                  : 'w-4 bg-border'
              }`}
            />
          ))}
        </div>

        <p className="text-text-secondary text-xs mb-6 leading-relaxed">
          {running
            ? `${phase.label} · ${countdown}s remaining`
            : 'Start when you\'re ready. Breathe in for 4s, hold for 7s, out for 8s.'}
        </p>

        <button
          onClick={handleToggle}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 ${
            running
              ? 'bg-gray-600 hover:bg-gray-500'
              : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg'
          }`}
        >
          {running ? 'Stop Exercise' : 'Start Breathing'}
        </button>
      </div>
    </motion.div>
  );
};

// Floating trigger button
const BreathingWidget = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {open && <BreathingExercise onClose={() => setOpen(false)} />}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Breathing Exercise"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-2xl flex items-center justify-center"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Wind size={24} />
        </motion.div>
      </motion.button>
    </>
  );
};

export default BreathingWidget;
