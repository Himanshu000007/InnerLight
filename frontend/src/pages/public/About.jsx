import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold text-text mb-6">About InnerLight</h1>
          <p className="text-xl text-text-secondary mb-8">
            InnerLight is a mental wellness platform designed to help you track, understand, and improve your emotional health.
          </p>

          <div className="prose prose-invert max-w-none space-y-6">
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-bold text-text mb-4">Our Mission</h2>
              <p className="text-text-secondary">
                To provide accessible, technology-enabled mental wellness support that empowers individuals to understand themselves better and live healthier, happier lives.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-bold text-text mb-4">What We Offer</h2>
              <ul className="space-y-3 text-text-secondary">
                <li>📊 Mood tracking with detailed analytics</li>
                <li>📝 Private journaling space for self-reflection</li>
                <li>👥 Supportive community platform</li>
                <li>🤖 AI-powered wellness guidance</li>
                <li>🧘 Breathing exercises and mindfulness tools</li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-bold text-text mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-bold text-text mb-2">Privacy</h3>
                  <p className="text-text-secondary text-sm">Your data is yours. We protect it with the highest standards.</p>
                </div>
                <div>
                  <h3 className="font-bold text-text mb-2">Support</h3>
                  <p className="text-text-secondary text-sm">Building a compassionate community where everyone belongs.</p>
                </div>
                <div>
                  <h3 className="font-bold text-text mb-2">Accessibility</h3>
                  <p className="text-text-secondary text-sm">Mental wellness should be available to everyone.</p>
                </div>
                <div>
                  <h3 className="font-bold text-text mb-2">Growth</h3>
                  <p className="text-text-secondary text-sm">We're constantly improving to serve you better.</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex gap-4 justify-center"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-white">
                Get Started
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;