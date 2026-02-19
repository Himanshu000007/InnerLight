import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  BookOpen,
  Wind,
  Gamepad2,
  Heart,
  CheckCircle2,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const features = [
    {
      icon: <MessageCircle size={32} />,
      title: "Anonymous Share",
      desc: "Connect and share your heart without fear. A safe, judgment-free space.",
      link: "/share",
      btnText: "Explore Community",
      color: "var(--soft-pink)"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Private Journal",
      desc: "Document your growth. Your personal sanctuary for deep reflection.",
      link: "/journal",
      btnText: "Start Writing",
      authRequired: true,
      color: "var(--lavender)"
    },
    {
      icon: <Wind size={32} />,
      title: "Calm Zone",
      desc: "Master your breath. Reduce stress with scientifically-proven techniques.",
      link: "/calm",
      btnText: "Find Your Center",
      authRequired: true,
      color: "var(--sky-blue)"
    },
    {
      icon: <TrendingUp size={32} />,
      title: "Mood Compass",
      desc: "Track your emotional landscape. Discover patterns and find your inner balance.",
      link: "/mood",
      btnText: "Chart Your Mood",
      authRequired: true,
      color: "var(--primary-light)"
    },
    {
      icon: <Gamepad2 size={32} />,
      title: "Relaxing Games",
      desc: "Light, mindful games designed to gently quiet a busy mind.",
      link: "/games",
      btnText: "Play Now",
      color: "var(--mint-green)"
    }
  ];

  return (
    <div className="home-container">
      <motion.section
        className="home-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="hero-badge"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Heart size={14} fill="currentColor" /> <span>Your Journey Starts Here</span>
        </motion.div>
        <h1 className="home-title">
          InnerLight <span className="title-accent">🌿</span>
        </h1>
        <p className="home-subtitle">
          Pause. Breathe. Connect. A premium sanctuary for your mental well-being and inner peace.
        </p>
        {!isAuthenticated && (
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-large">
              Begin Your Journey <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </motion.section>

      <motion.div
        className="home-features"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          (!feature.authRequired || isAuthenticated) && (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
            >
              <div className="feature-icon-wrapper" style={{ backgroundColor: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
              <Link to={feature.link} className="feature-btn">
                {feature.btnText} <ArrowRight size={16} />
              </Link>
            </motion.div>
          )
        ))}
      </motion.div>

      <motion.section
        className="wellness-tips"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="tips-content">
          <h2 className="section-title">Why InnerLight?</h2>
          <div className="tips-grid">
            <div className="tip-item">
              <CheckCircle2 className="tip-icon" />
              <div>
                <h4>Total Anonymity</h4>
                <p>Your privacy is our priority. Share without reveal.</p>
              </div>
            </div>
            <div className="tip-item">
              <CheckCircle2 className="tip-icon" />
              <div>
                <h4>Science-Based</h4>
                <p>Breathing patterns designed to calm your nervous system.</p>
              </div>
            </div>
            <div className="tip-item">
              <CheckCircle2 className="tip-icon" />
              <div>
                <h4>Mindful Interaction</h4>
                <p>Gentle games and interactions to soothe your soul.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        className="home-message glass"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2>"It's okay to take a moment for yourself."</h2>
        <p>You are not alone in this journey. Every small step counts towards a brighter tomorrow.</p>
      </motion.div>

      <footer className="home-footer">
        <p>© 2024 InnerLight. Made with ❤️ for your peace of mind.</p>
      </footer>
    </div>
  );
};

export default Home;
