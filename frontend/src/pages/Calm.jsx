import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  Map,
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Info
} from 'lucide-react';
import './Calm.css';

const Calm = () => {
  const [activeMode, setActiveMode] = useState('box'); // box, grounding, pmr
  const [isActive, setIsActive] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [phase, setPhase] = useState('ready');

  const modes = [
    { id: 'box', name: 'Box Breathing', icon: <Wind size={20} />, color: 'var(--sky-blue)' },
    { id: 'grounding', name: 'Grounding 5-4-3-2-1', icon: <Map size={20} />, color: 'var(--mint-green)' },
    { id: 'pmr', name: 'Muscle Relax', icon: <Dumbbell size={20} />, color: 'var(--soft-pink)' },
  ];

  const resetAll = () => {
    setIsActive(false);
    setCycle(0);
    setPhase('ready');
  };

  return (
    <div className="calm-container">
      <motion.div
        className="calm-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Calm Zone 💆</h1>
        <p>Choose a path to tranquility. Breathe, sense, and release.</p>
      </motion.div>

      <div className="calm-mode-selector glass">
        {modes.map((m) => (
          <button
            key={m.id}
            className={`mode-btn ${activeMode === m.id ? 'active' : ''}`}
            onClick={() => { setActiveMode(m.id); resetAll(); }}
          >
            {m.icon} <span>{m.name}</span>
          </button>
        ))}
      </div>

      <div className="calm-workspace">
        <AnimatePresence mode="wait">
          {activeMode === 'box' && <BoxBreathing key="box" isActive={isActive} setIsActive={setIsActive} cycle={cycle} setCycle={setCycle} phase={phase} setPhase={setPhase} />}
          {activeMode === 'grounding' && <GroundingExercise key="grounding" isActive={isActive} setIsActive={setIsActive} />}
          {activeMode === 'pmr' && <PMRExercise key="pmr" isActive={isActive} setIsActive={setIsActive} />}
        </AnimatePresence>
      </div>

      <motion.div
        className="calm-info-card glass"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <Info size={24} className="info-icon" />
        <div>
          <h3>Scientific Benefit</h3>
          <p>
            {activeMode === 'box' && "Box breathing regulates the autonomic nervous system by equalizing carbon dioxide levels in the blood."}
            {activeMode === 'grounding' && "Grounding pulls your brain away from recursive thoughts and anchors you in physical reality."}
            {activeMode === 'pmr' && "Progressive muscle relaxation helps identify the physical sensation of tension vs. release."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- COMPONENTS ---

const BoxBreathing = ({ isActive, setIsActive, cycle, setCycle, phase, setPhase }) => {
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t > 1) return t - 1;

          // Switch Phases
          if (phase === 'ready' || phase === 'exhale') {
            setPhase('inhale');
            if (phase === 'exhale') setCycle(c => c + 1);
            return 4;
          }
          if (phase === 'inhale') {
            setPhase('hold1');
            return 4;
          }
          if (phase === 'hold1') {
            setPhase('exhale');
            return 4;
          }
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getPhaseMessage = () => {
    if (phase === 'inhale') return 'Breathe In Slowly';
    if (phase === 'hold1') return 'Hold Peacefully';
    if (phase === 'exhale') return 'Release Gently';
    return 'Prepare Your Mind';
  };

  return (
    <motion.div
      className="exercise-wrapper"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="breathing-circle-container">
        <motion.div
          className={`breathing-circle ${phase}`}
          animate={{ scale: phase === 'inhale' ? 1.4 : phase === 'exhale' ? 0.8 : 1.4 }}
          transition={{ duration: 4, ease: "linear" }}
        >
          <div className="circle-content">
            <span className="timer-val">{timer}</span>
            <span className="phase-msg">{getPhaseMessage()}</span>
          </div>
        </motion.div>
      </div>

      <div className="exercise-controls">
        <button className="btn btn-primary" onClick={() => setIsActive(!isActive)}>
          {isActive ? <Pause /> : <Play />} {isActive ? 'Pause' : 'Begin Box'}
        </button>
        {cycle > 0 && <span className="cycle-badge">Cycles: {cycle}</span>}
      </div>
    </motion.div>
  );
};

const GroundingExercise = ({ isActive, setIsActive }) => {
  const steps = [
    { title: "5 See", desc: "Acknowledge 5 things you see around you." },
    { title: "4 Feel", desc: "Acknowledge 4 things you can touch." },
    { title: "3 Hear", desc: "Acknowledge 3 things you hear." },
    { title: "2 Smell", desc: "Acknowledge 2 things you can smell." },
    { title: "1 Taste", desc: "Acknowledge 1 thing you can taste." }
  ];
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <motion.div className="exercise-wrapper grounding">
      <div className="grounding-display">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="grounding-step-card glass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2>{steps[currentStep].title}</h2>
            <p>{steps[currentStep].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grounding-controls">
        <button
          className="btn btn-secondary"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
        >Back</button>
        <div className="step-dots">
          {steps.map((_, i) => <div key={i} className={`dot ${i === currentStep ? 'active' : ''}`} />)}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => currentStep === 4 ? setCurrentStep(0) : setCurrentStep(prev => prev + 1)}
        >{currentStep === 4 ? "Restart" : "Next"}</button>
      </div>
    </motion.div>
  );
};

const PMRExercise = ({ isActive, setIsActive }) => {
  const steps = [
    "Clench your fists tightly... hold for 5 seconds.",
    "Release your fists. Notice the feeling of relaxation.",
    "Tense your shoulders by shrugging... hold for 5 seconds.",
    "Drop your shoulders. Release the weight.",
    "Curl your toes tightly... hold for 5 seconds.",
    "Release. Imagine the tension flowing into the ground."
  ];
  const [current, setCurrent] = useState(0);

  return (
    <motion.div className="exercise-wrapper pmr">
      <div className="pmr-card glass">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="pmr-text">{steps[current]}</p>
        </motion.div>
      </div>
      <div className="exercise-controls">
        <button
          className="btn btn-primary"
          onClick={() => setCurrent(prev => (prev + 1) % steps.length)}
        >Next Phase</button>
      </div>
    </motion.div>
  );
};

export default Calm;
