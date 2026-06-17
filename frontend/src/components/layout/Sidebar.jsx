import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  Users,
  Brain,
  User,
  Settings,
  BarChart3,
  ChevronDown,
  X,
  AlertTriangle,
  Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Heart, label: 'Mood Tracker', path: '/mood-tracker' },
    { icon: BookOpen, label: 'Journal', path: '/journal' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: Brain, label: 'AI Wellness', path: '/ai-wellness' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const adminItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: AlertTriangle, label: 'Reports', path: '/admin/reports' },
    { icon: Shield, label: 'Moderation', path: '/admin/moderation' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed md:static w-64 h-screen bg-card border-r border-border overflow-y-auto z-40 md:z-auto"
      >
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                IL
              </div>
              <h2 className="text-xl font-bold text-text">InnerLight</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1 hover:bg-border rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    active
                      ? 'bg-gradient-to-r from-primary to-secondary text-white'
                      : 'text-text-secondary hover:bg-border hover:text-text'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Section */}
            {user?.role === 'admin' && (
              <div className="pt-4 border-t border-border mt-4">
                <button
                  onClick={() => setAdminOpen(!adminOpen)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-border hover:text-text transition font-medium"
                >
                  <BarChart3 size={20} />
                  <span>Admin</span>
                  <ChevronDown
                    size={16}
                    className={`ml-auto transition ${adminOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {adminOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      {adminItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ml-4 ${
                              active
                                ? 'bg-gradient-to-r from-primary to-secondary text-white'
                                : 'text-text-secondary hover:bg-border hover:text-text'
                            }`}
                          >
                            <Icon size={16} />
                            <span className="text-sm font-medium">{item.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>

          {/* Footer Info */}
          <div className="pt-4 border-t border-border">
            <div className="p-3 bg-border bg-opacity-30 rounded-lg">
              <p className="text-xs text-text-secondary">Welcome back!</p>
              <p className="text-sm font-semibold text-text">{user?.firstName}</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;