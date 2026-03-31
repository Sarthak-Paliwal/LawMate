import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useGetChatMessagesQuery } from '../store/services/lawmateApi';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ChatWindow({ bookingId, onClose, userRole, onComplete }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initializedRef = useRef(false);

  // REST: load message history once
  const { data: existingMessages = [], isSuccess } = useGetChatMessagesQuery(bookingId);

  // Seed messages from REST — only once
  useEffect(() => {
    if (isSuccess && !initializedRef.current) {
      initializedRef.current = true;
      setMessages(existingMessages);
    }
  }, [isSuccess, existingMessages]);

  // Socket.io connection
  useEffect(() => {
    const token = localStorage.getItem('lawmate-token');
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      forceNew: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-room', bookingId);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('new-message', (msg) => {
      setMessages((prev) => {
        const msgId = msg._id?.toString();
        if (msgId && prev.some((m) => m._id?.toString() === msgId)) return prev;
        return [...prev, msg];
      });
    });

    socket.on('connect_error', (err) => {
      console.error('[ChatWindow] connect_error:', err.message);
      setConnected(false);
    });

    socket.on('message-error', (err) => {
      console.error('[ChatWindow] message-error:', err);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-message');
      socket.off('connect_error');
      socket.off('message-error');
      socket.emit('leave-room', bookingId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bookingId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current?.connected) return;
    socketRef.current.emit('send-message', { bookingId, text: trimmed });
    setText('');
    inputRef.current?.focus();
  }, [text, bookingId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isMyMessage = (msg) => {
    const senderId =
      typeof msg.sender === 'object' ? msg.sender?._id?.toString() : msg.sender?.toString();
    return senderId === user?._id?.toString();
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center gap-2">
          <span className="text-white text-lg">💬</span>
          <span className="text-white font-bold text-sm">Live Chat</span>
          <span
            className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
            title={connected ? 'Connected' : 'Disconnected'}
          ></span>
        </div>
        <div className="flex items-center gap-2">
          {userRole === 'advocate' && onComplete && (
            <button
              onClick={onComplete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition border border-white/20"
              title="Mark booking as completed and close chat"
            >
              ✅ Complete & Close
            </button>
          )}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-xs transition"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-72 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/50">
        {messages.length === 0 && (
          <div className="text-center text-muted text-sm py-8">
            No messages yet. Start the conversation! 👋
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = isMyMessage(msg);
          const senderName = typeof msg.sender === 'object' ? msg.sender?.name : null;
          return (
            <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isMe
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-white dark:bg-slate-800 text-default border border-slate-200 dark:border-slate-700 rounded-bl-md'
              }`}>
                {!isMe && senderName && (
                  <p className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 mb-0.5">
                    {senderName}
                  </p>
                )}
                <p>{msg.text}</p>
                <p className={`text-[9px] mt-1 ${isMe ? 'text-white/60' : 'text-muted'}`}>
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connected ? 'Type a message...' : 'Connecting...'}
          disabled={!connected}
          className="flex-1 text-sm px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-default focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || !connected}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${
            text.trim() && connected
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
