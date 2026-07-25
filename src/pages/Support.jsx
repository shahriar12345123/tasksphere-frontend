import React, { useState } from 'react';
import { ArrowLeft, Send, Headphones, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export const Support = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello shahriar123! Welcome to TaskSphere Support. How can we assist you today?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputMsg };
    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');

    // Automated agent response simulator
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Thank you for reaching out! Our support team is processing your inquiry and will respond shortly.'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="w-full space-y-3 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#12072b]/80 border border-purple-600/30 rounded-2xl p-3.5 backdrop-blur-xl">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-purple-900/40 text-purple-200 hover:text-white border border-purple-700/40"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">Live Chat Support</h2>
          <p className="text-[11px] text-purple-300/70">24/7 Agent Help & Ticket Resolver</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Chat Container */}
      <div className="bg-[#12072b]/80 border border-purple-600/30 rounded-3xl p-4 h-[420px] flex flex-col justify-between backdrop-blur-xl shadow-2xl">
        {/* Message Log */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  <Headphones className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-tr-none'
                    : 'bg-purple-950/80 border border-purple-800/50 text-purple-100 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSend} className="flex items-center space-x-2 pt-3 border-t border-purple-800/40">
          <input
            type="text"
            placeholder="Type your message here..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 bg-purple-950/80 border border-purple-700/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-pink-500"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md hover:brightness-110"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Support;
