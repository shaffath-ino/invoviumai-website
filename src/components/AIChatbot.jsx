import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AuthContext } from '../context/AuthContext';

const knowledgeBaseTopics = [
  "About InvoviumAI",
  "Services",
  "Projects",
  "Careers"
];

const initialMessages = [
  { id: 1, sender: 'bot', text: "Hello! I'm the InvoviumAI Virtual Assistant. How can I help you architect your future today?" }
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const { firstName } = useContext(AuthContext);

  const sendMessageToBackend = async (userMessage) => {
    const userMsgObj = { id: Date.now(), sender: 'user', text: userMessage };
    setMessages(prev => [...prev, userMsgObj]);
    setIsTyping(true);
    
    // Maintain chat history format for backend
    const conversation = messages
      .filter(msg => msg.id !== 1) // Optional: Skip initial greeting to save tokens
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
    conversation.push({ role: 'user', content: userMessage });

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversation,
          userName: firstName || 'Guest User'
        })
      });

      if (!response.ok) {
         throw new Error('Backend Database API Error: ' + response.status);
      }

      const data = await response.json();
      
      const botMsgObj = { id: Date.now() + 1, sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMsgObj]);
    } catch (error) {
      console.error(error);
      const errorMsg = { id: Date.now() + 1, sender: 'bot', text: "Error connecting to internal systems securely. Please restart interface." };
      setMessages(prev => [...prev, errorMsg]);
    }

    setIsTyping(false);
  };

  const handleQuickReply = (topic) => {
    sendMessageToBackend(topic);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center shadow-[0_0_20px_rgba(230,57,70,0.5)] focus:outline-none focus:ring-4 focus:ring-primary/40 relative group"
            >
              <Sparkles size={16} className="absolute top-2 right-2 text-white/80 animate-pulse" />
              <MessageSquare size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute bottom-0 right-0 w-[calc(100vw-48px)] sm:w-[380px] h-[550px] max-h-[calc(100vh-100px)] bg-white dark:bg-cardDark border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl z-50 transform origin-bottom-right transition-colors duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-white/50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 relative">
                    <Bot size={18} className="text-primary" />
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-cardDark absolute -bottom-1 -right-1"></span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1 transition-colors">InvoviumAI AI</h3>
                    <p className="text-[10px] text-green-600 dark:text-green-400 font-semibold tracking-wider uppercase">Systems Online</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 -mr-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.sender === 'user' ? 'bg-secondary text-white' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                      {msg.sender === 'user' ? <UserIcon size={12} /> : <Bot size={12} />}
                    </div>
                    <div className={`text-[13px] px-4 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none shadow-md' 
                        : 'bg-white dark:bg-white/10 text-slate-700 dark:text-gray-200 rounded-tl-none border border-slate-100 dark:border-white/5 shadow-sm transition-colors'
                    }`}>
                      {msg.sender === 'bot' ? (
                        <div className="prose prose-sm dark:prose-invert prose-p:leading-snug prose-p:my-1 prose-ul:my-1 prose-ol:my-1 max-w-none prose-a:text-primary">
                          <ReactMarkdown>
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={12} />
                    </div>
                    <div className="bg-white dark:bg-white/10 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-white/5 flex gap-1 transition-colors">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-3 py-2 bg-slate-100/50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5 flex flex-wrap gap-2 transition-colors">
                {knowledgeBaseTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleQuickReply(topic)}
                    disabled={isTyping}
                    className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-primary/20 text-slate-600 dark:text-primary rounded-full border border-slate-200 dark:border-primary/30 transition-all disabled:opacity-50"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white dark:bg-cardDark border-t border-slate-200 dark:border-white/10">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if(inputMessage.trim()) {
                      sendMessageToBackend(inputMessage);
                      setInputMessage('');
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about InvoviumAI..."
                    disabled={isTyping}
                    className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 hover:bg-secondary transition-colors shrink-0"
                  >
                    <Send size={16} className="-ml-0.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
