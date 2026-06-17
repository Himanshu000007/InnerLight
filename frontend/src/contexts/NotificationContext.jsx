import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadChats, setUnreadChats] = useState([]);

  const checkUnread = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axiosInstance.get('/chats');
      const chats = response.data.data || [];

      // For each chat, compare updatedAt with localStorage lastRead timestamp
      const unread = chats.filter((chat) => {
        const lastRead = localStorage.getItem(`lastRead_${chat._id}`);
        if (!lastRead) return true; // never opened = unread
        return new Date(chat.updatedAt).getTime() > parseInt(lastRead, 10);
      });

      setUnreadCount(unread.length);
      setUnreadChats(unread);
    } catch {
      // silently fail
    }
  }, [user]);

  const markChatRead = useCallback((chatId) => {
    localStorage.setItem(`lastRead_${chatId}`, Date.now().toString());
    setUnreadChats((prev) => prev.filter((c) => c._id !== chatId));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const markAllRead = useCallback(() => {
    unreadChats.forEach((chat) => {
      localStorage.setItem(`lastRead_${chat._id}`, Date.now().toString());
    });
    setUnreadCount(0);
    setUnreadChats([]);
  }, [unreadChats]);

  // Poll every 15s when logged in
  useEffect(() => {
    if (!user) return;
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, [user, checkUnread]);

  return (
    <NotificationContext.Provider value={{ unreadCount, unreadChats, markChatRead, markAllRead, checkUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};
