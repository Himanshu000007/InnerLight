import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Users, Brain, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';

const Landing = () => {
  const features = [
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Track your emotional patterns and understand your wellness journey',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Personal Journal',
      description: 'Express yourself through private journaling and self-reflection',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with others, share experiences, and support each other',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Brain,
      title: 'AI Wellness',
      description: 'Get personalized wellness advice from our AI assistant',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const benefits = [
    'Track your mood patterns',
    'Get personalized wellness advice',
    'Connect with supportive community',
    'Achieve mental clarity',
    'Build healthy habits',
    'Private and secure',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-card/50 border-b border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              IL
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InnerLight
            </h1>
          </div>

          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-6"
          >
            Your Personal{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Wellness
            </span>{' '}
            Companion
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto"
          >
            Track your mood, journal your thoughts, connect with your community, and get AI-powered wellness guidance all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-white w-full sm:w-auto">
                Start Free Trial <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text mb-4">Everything You Need</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Comprehensive mental wellness tools designed for your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background p-8 rounded-xl border border-border hover:border-primary transition"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{feature.title}</h3>
                  <p className="text-text-secondary text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-text mb-8">Why Choose InnerLight?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle size={20} className="text-success flex-shrink-0" />
                    <span className="text-text text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/30"
            >
              <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Heart size={64} className="text-white opacity-50" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-secondary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white text-opacity-90 mb-8">
            Join thousands of people improving their mental wellness with InnerLight.
          </p>
          <Link to="/signup">
            <Button className="bg-white text-primary hover:bg-opacity-90 w-full sm:w-auto">
              Get Started Now <ArrowRight size={20} />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center text-text-secondary text-sm">
          <p>© 2024 InnerLight. All rights reserved. Your wellness, our priority.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;