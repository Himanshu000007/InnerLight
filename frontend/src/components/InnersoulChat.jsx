import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Send,
    X,
    MessageCircle,
    Minus,
    Bot,
    User,
    Heart,
    Eraser
} from 'lucide-react';
import './InnersoulChat.css';

const InnersoulChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello, traveler of the mind. I am your Innersoul companion. How are you feeling today?",
            sender: 'bot',
            time: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputText.trim(),
            sender: 'user',
            time: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        // Mock bot response (Gemini integration placeholder)
        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                text: getMockResponse(userMessage.text),
                sender: 'bot',
                time: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const getMockResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('sad') || lowerText.includes('bad')) {
            return "I'm here with you. It's okay to feel this way. Remember, even the darkest night eventually gives way to the sun. What's weighing on your heart?";
        }
        if (lowerText.includes('happy') || lowerText.includes('gold')) {
            return "That's wonderful to hear! ✨ Tell me more about what's bringing you this joy. Let's celebrate this moment of light together.";
        }
        return "I hear you. Tell me more about that. I'm listening with an open heart.";
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                text: "The slate is clean. I am here whenever you wish to speak again.",
                sender: 'bot',
                time: new Date()
            }
        ]);
    };

    return (
        <div className="innersoul-wrapper">
            {/* Floating Trigger Button */}
            {!isOpen && (
                <motion.button
                    className="innersoul-trigger glass"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="trigger-glow"></div>
                    <Sparkles className="chat-trigger-icon" />
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="innersoul-window glass"
                        initial={{ opacity: 0, scale: 0.8, y: 100, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                    >
                        <div className="innersoul-header">
                            <div className="bot-status">
                                <div className="bot-avatar">
                                    <Bot size={20} />
                                    <div className="online-indicator"></div>
                                </div>
                                <div className="bot-info">
                                    <h3>Innersoul</h3>
                                    <span>Always listening...</span>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button onClick={clearChat} title="Clear Chat" className="icon-btn"><Eraser size={18} /></button>
                                <button onClick={() => setIsOpen(false)} className="icon-btn"><Minus size={18} /></button>
                            </div>
                        </div>

                        <div className="innersoul-messages">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`message-bubble-wrapper ${msg.sender}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="message-bubble">
                                        {msg.text}
                                    </div>
                                    <span className="message-time">
                                        {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <div className="message-bubble-wrapper bot">
                                    <div className="message-bubble typing">
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                        <span className="dot"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="innersoul-input-area" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Talk to your soul..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <button type="submit" className="send-btn" disabled={!inputText.trim()}>
                                <Send size={18} />
                            </button>
                        </form>

                        <div className="innersoul-footer">
                            <Heart size={12} fill="currentColor" /> <span>Safe & Private</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InnersoulChat;
