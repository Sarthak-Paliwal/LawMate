import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { IoClose, IoRocketSharp } from 'react-icons/io5';

const FAQ = [
  { q: "How do I hire an advocate?", a: "Go to the 'Advocates' page, browse by specialization, and click 'Book Advocate' to schedule a consultation." },
  { q: "Which document do I need for rent?", a: "You usually need a Rent Agreement. We have a template for this in our 'Document Generator'." },
  { q: "What is an FIR?", a: "An FIR (First Information Report) is a document prepared by police when they receive information about the commission of a cognizable offence." },
  { q: "Is LawMate free?", a: "Basic legal act search and AI guidance are free. Some advanced tools may require a registered account." }
];

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am LawMate AI. How can I assist you today?' }
  ]);
  const [showOptions, setShowOptions] = useState(true);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, { role: 'user', text: option.q }]);
    setShowOptions(false);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: option.a }]);
      setShowOptions(true);
    }, 600);
  };

  const startQuery = () => {
    setMessages(prev => [...prev, { role: 'user', text: "I want to start a legal query" }]);
    setIsOpen(false);
    navigate('/legal-query');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-indigo-600 text-white'}`}
      >
        {isOpen ? <IoClose size={24} /> : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] sm:w-[350px] max-h-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-fadeInUp">
          
          {/* Header */}
          <div className="bg-indigo-600 p-4 text-white">
            <h3 className="font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              LawMate Assistant
            </h3>
            <p className="text-[10px] text-indigo-100 opacity-80 uppercase tracking-widest mt-1">Instant Legal FAQ</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 min-h-[300px]">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-default border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'}`}>
                   {m.text}
                 </div>
               </div>
             ))}
             <div ref={messagesEndRef} />
          </div>

          {/* Options/Inputs */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
             {showOptions && (
               <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted uppercase mb-2">Common Questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {FAQ.map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => handleOptionClick(item)}
                        className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-default px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition"
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>
                  <button 
                     onClick={startQuery}
                     className="w-full mt-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40 hover:bg-indigo-100 transition"
                  >
                    <IoRocketSharp className="inline mr-1" size={14} /> Start Personal Query
                  </button>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
