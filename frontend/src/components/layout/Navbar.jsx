import { useState } from 'react';
import { Menu, Bell, LogOut, Settings, User, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount, unreadChats, markChatRead, markAllRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNotifClick = (chat) => {
    markChatRead(chat._id);
    setShowNotifications(false);
    navigate('/chats');
  };

  return (
    <nav className="sticky top-0 z-40 bg-card border-b border-border backdrop-blur-sm">
      <div className="px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-border rounded-lg transition"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            InnerLight
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDropdown(false);
              }}
              className="p-2 hover:bg-border rounded-lg transition relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-text text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto">
                    {unreadChats.length === 0 ? (
                      <div className="py-8 text-center text-text-secondary text-sm">
                        <Bell size={28} className="mx-auto mb-2 opacity-30" />
                        <p>No new notifications</p>
                      </div>
                    ) : (
                      unreadChats.map((chat) => (
                        <motion.button
                          key={chat._id}
                          whileHover={{ backgroundColor: 'rgba(99,102,241,0.08)' }}
                          onClick={() => handleNotifClick(chat)}
                          className="w-full text-left px-4 py-3 border-b border-border last:border-0 transition flex items-start gap-3"
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MessageSquare size={16} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">
                              New message in anonymous chat
                            </p>
                            <p className="text-xs text-text-secondary truncate mt-0.5">
                              {chat.postId?.content
                                ? `"${chat.postId.content.slice(0, 50)}..."`
                                : 'Community connection'}
                            </p>
                            <p className="text-[10px] text-primary mt-1">
                              {new Date(chat.updatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        </motion.button>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-border">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/chats');
                      }}
                      className="text-xs text-primary hover:underline w-full text-center"
                    >
                      View all chats →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-3 py-2 hover:bg-border rounded-lg transition"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {user?.firstName}
              </span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-text">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-text-secondary">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-border transition flex items-center gap-2"
                  >
                    <User size={16} /> Profile
                  </button>
                  <button
                    onClick={() => { navigate('/settings'); setShowDropdown(false); }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-border transition flex items-center gap-2"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-border transition flex items-center gap-2 text-danger"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;