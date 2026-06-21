"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatbot() {
  const { chatHistory, sendChatMessage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "How can I reduce my carbon footprint?",
    "Is cycling better than public transport?",
    "How much carbon does a flight emit?",
  ];

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chatHistory, isOpen, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const text = inputValue;
    setInputValue("");
    setIsTyping(true);
    
    try {
      await sendChatMessage(text);
    } catch (err) {
      console.warn("Chat message error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = async (prompt: string) => {
    setIsTyping(true);
    try {
      await sendChatMessage(prompt);
    } catch (err) {
      console.warn("Suggestion click error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="glass-panel w-[calc(100vw-2rem)] sm:w-[380px] h-[min(70vh,480px)] rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-700/50 mb-3"
            role="dialog"
            aria-label="CarbonCoach AI Chat Assistant"
          >
            {/* Header */}
            <div className="p-3.5 bg-slate-800/80 border-b border-slate-700/50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Bot size={16} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100 flex items-center gap-1.5 text-sm">
                    CarbonCoach AI <Sparkles size={12} className="text-emerald-400" />
                  </h3>
                  <p className="text-[10px] text-emerald-400/80">Eco Assistant • Active</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Chatbot"
                className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3" role="log" aria-live="polite" aria-label="Chat messages">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === "user"
                        ? "bg-teal-500/20 text-teal-300"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {msg.sender === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div
                    className={`rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-teal-600/90 text-white rounded-tr-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700/30 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 mr-auto max-w-[85%]">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <Bot size={12} />
                  </div>
                  <div className="bg-slate-800 text-slate-400 border border-slate-700/30 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {chatHistory.length <= 1 && !isTyping && (
              <div className="px-3.5 py-2 border-t border-slate-700/30 space-y-1.5 bg-slate-900/40 shrink-0">
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Suggested</p>
                <div className="flex flex-col gap-1">
                  {suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="text-left text-[11px] bg-slate-800/80 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 border border-slate-700/50 hover:border-emerald-500/30 rounded-xl px-3 py-2 transition-all duration-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-slate-700/50 bg-slate-800/90 flex gap-2 items-center shrink-0"
            >
              <input
                type="text"
                placeholder="Ask about reducing your footprint..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                aria-label="Type your sustainability question"
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 p-2 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center hover:scale-105 active:scale-95"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button — repositioned above mobile bottom nav */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle CarbonCoach AI Assistant"
        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 p-3.5 rounded-full shadow-2xl flex items-center justify-center cursor-pointer relative group border border-emerald-400/20"
      >
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
        </span>
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
        
        {/* Hover Tooltip */}
        <span className="absolute right-14 bg-slate-800 text-slate-200 border border-slate-700 text-[11px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg hidden sm:block">
          Chat with CarbonCoach AI
        </span>
      </motion.button>
    </div>
  );
}
