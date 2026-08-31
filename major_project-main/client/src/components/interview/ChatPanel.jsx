import React, { useState, useEffect } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

export const ChatPanel = ({ roomId }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'init',
      text: 'Welcome to the interview room! Audio/Video and collaborative code sync are active.',
      sender: 'System',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    if (!socket) return;

    socket.on('new-chat-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('new-chat-message');
    };
  }, [socket]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) return;

    socket.emit('send-chat-message', {
      roomId,
      message: inputMessage,
      user,
    });
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Room Chat
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[220px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded-lg text-xs leading-relaxed ${
              m.sender === 'System'
                ? 'bg-slate-900 border border-slate-800 text-slate-400 text-[11px]'
                : m.sender === user?.name
                ? 'bg-indigo-950/60 border border-indigo-800/40 text-indigo-200 ml-4'
                : 'bg-slate-900 border border-slate-800 text-slate-200 mr-4'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-0.5">
              <span className="font-bold">{m.sender}</span>
              <span>{m.timestamp}</span>
            </div>
            <p>{m.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-2 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
