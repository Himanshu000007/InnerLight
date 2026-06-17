import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Loader2, ArrowLeft, Info } from 'lucide-react';
import axiosInstance from '../../api/axios';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';

const Chats = () => {
  const { user } = useAuth();
  const { markChatRead } = useNotifications();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const prevMessageCountRef = useRef(0);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval;
    if (activeChat) {
      fetchMessages(activeChat._id, true);
      markChatRead(activeChat._id);
      interval = setInterval(() => fetchMessages(activeChat._id, false), 3000);
    } else {
      setMessages([]);
      prevMessageCountRef.current = 0;
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  // Only auto-scroll when new messages arrive AND user is near bottom
  useEffect(() => {
    const newCount = messages.length;
    const prevCount = prevMessageCountRef.current;
    if (newCount > prevCount) {
      if (isNearBottomRef.current) {
        scrollToBottom();
      }
    }
    prevMessageCountRef.current = newCount;
  }, [messages]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = distFromBottom < 80;
  };

  const fetchChats = async () => {
    try {
      const response = await axiosInstance.get('/chats');
      setChats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (chatId, showLoading = true) => {
    try {
      if (showLoading) setLoadingMessages(true);
      const response = await axiosInstance.get(`/chats/${chatId}/messages`);
      setMessages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      if (showLoading) setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      setSending(true);
      const content = newMessage;
      setNewMessage('');
      
      const response = await axiosInstance.post(`/chats/${activeChat._id}/messages`, {
        content,
      });
      
      setMessages(prev => [...prev, response.data.data]);
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getChatName = (chat) => {
    if (!chat.postId) return 'Anonymous Connection';

    // Safely get the author ID — postId.userId might be null for anonymous posts
    const authorId = chat.postId.userId?._id?.toString() || chat.postId.userId?.toString() || null;
    const currentUserId = (user?.id || user?._id)?.toString();

    if (!authorId) return `Anonymous Connection (${chat.postId.category || 'Support'})`;

    if (authorId === currentUserId) {
      return `Anonymous Reader (${chat.postId.category || 'Support'})`;
    } else {
      return `Anonymous Poster (${chat.postId.category || 'Support'})`;
    }
  };

  const getMessageSenderName = (senderId, chat) => {
    const currentUserId = (user?.id || user?._id)?.toString();
    if (senderId?.toString() === currentUserId) {
      return 'You';
    }

    const authorId = chat.postId?.userId?._id?.toString() || chat.postId?.userId?.toString() || null;
    if (authorId && senderId?.toString() === authorId) {
      return 'Anonymous Poster';
    }
    return 'Anonymous Reader';
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6">
      {/* Chats Sidebar Pane */}
      <div className={`w-full md:w-80 flex flex-col bg-card border border-border rounded-2xl overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border bg-background bg-opacity-30">
          <h2 className="text-xl font-bold text-text flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" />
            Connections
          </h2>
          <p className="text-xs text-text-secondary mt-1">Start chatting anonymously from posts</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loadingChats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-12 text-text-secondary text-sm">
              <p>No active chats yet.</p>
              <p className="text-xs mt-2 opacity-75">Click "Connect" on any post in the Community feed.</p>
            </div>
          ) : (
            chats.map(chat => {
              const isActive = activeChat?._id === chat._id;
              return (
                <button
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'hover:bg-border text-text-secondary hover:text-text bg-background bg-opacity-40'
                  }`}
                >
                  <div className="font-semibold text-sm truncate">
                    {getChatName(chat)}
                  </div>
                  <div className="text-xs mt-1 truncate opacity-80">
                    {chat.postId?.content || 'Click to view chat'}
                  </div>
                  <div className="text-[10px] text-right mt-2 opacity-60">
                    {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Messaging Chat Pane */}
      <div className={`flex-1 flex flex-col bg-card border border-border rounded-2xl overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-background bg-opacity-30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-1.5 hover:bg-border text-text-secondary rounded-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h3 className="font-bold text-text">{getChatName(activeChat)}</h3>
                  <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-0.5">
                    <Info size={12} className="text-primary" />
                    Anonymous Chat Connection
                  </p>
                </div>
              </div>
            </div>

            {/* Post context banner */}
            <div className="px-4 py-2.5 bg-border bg-opacity-30 border-b border-border text-xs text-text-secondary italic truncate">
              Context: "{activeChat.postId?.content || ''}"
            </div>

            {/* Messages Feed */}
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={32} className="animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-secondary text-sm text-center p-6 space-y-2">
                  <p className="font-semibold">Your anonymous connection is active!</p>
                  <p className="text-xs opacity-75">Send a message below to start the conversation safely.</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.senderId.toString() === (user.id || user._id).toString();
                  const senderName = getMessageSenderName(msg.senderId, activeChat);
                  
                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-text-secondary mb-1 px-1">{senderName}</span>
                      <div
                        className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm text-sm break-words ${
                          isMe
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-border text-text rounded-tl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[9px] text-text-secondary mt-1 px-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-background bg-opacity-30 flex gap-2">
              <input
                type="text"
                placeholder="Type your anonymous message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                disabled={sending}
                className="flex-1 px-4 py-3 bg-background border border-border rounded-xl text-text placeholder-text-secondary focus:border-primary focus:outline-none transition text-sm"
              />
              <Button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-5 gradient-primary text-white flex items-center justify-center rounded-xl"
              >
                {sending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <MessageSquare size={48} className="text-text-secondary opacity-30 animate-bounce" />
            <h3 className="text-lg font-bold text-text">No Connection Selected</h3>
            <p className="text-sm text-text-secondary max-w-sm">
              Select a conversation from the sidebar, or navigate to the Community feed and click "Connect" on any post to chat privately and anonymously.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
