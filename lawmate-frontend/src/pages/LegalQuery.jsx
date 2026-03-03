import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../i18n/LanguageContext';
import { MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdBookmarkAdd } from 'react-icons/md';

/**
 * Parses a raw AI response string and returns well-formatted JSX.
 * Handles: **bold**, ## headings, numbered lists, bullet points, and cleans stray symbols.
 */
function FormattedResponse({ text }) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      // blank line → small spacer
      elements.push(<div key={i} className="h-2" />);
      return;
    }

    // --- Heading lines: ### or ## or # ---
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
    if (headingMatch) {
      const content = cleanInline(headingMatch[2]);
      elements.push(
        <div key={i} className="font-semibold text-[14px] mt-2.5 mb-1 text-slate-900 dark:text-white">
          {content}
        </div>
      );
      return;
    }

    // --- Numbered list: 1. or 1) ---
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.*)/);
    if (numberedMatch) {
      const content = cleanInline(numberedMatch[2]);
      elements.push(
        <div key={i} className="flex gap-2 mt-1">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-[1.2em] text-right">{numberedMatch[1]}.</span>
          <span>{content}</span>
        </div>
      );
      return;
    }

    // --- Bullet list: - or * at start ---
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      const content = cleanInline(bulletMatch[1]);
      elements.push(
        <div key={i} className="flex gap-2 mt-1 pl-1">
          <span className="text-indigo-500 dark:text-indigo-400">•</span>
          <span>{content}</span>
        </div>
      );
      return;
    }

    // --- Normal paragraph line ---
    elements.push(
      <p key={i} className="mt-1 leading-relaxed">
        {cleanInline(trimmed)}
      </p>
    );
  });

  return <div className="text-[13.5px] space-y-0.5 text-slate-700 dark:text-slate-300">{elements}</div>;
}

/**
 * Converts inline markdown (**bold**, *italic*) into React elements,
 * and strips leftover # or * symbols.
 */
function cleanInline(text) {
  // Split by **bold** segments
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    // Bold
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{boldMatch[1]}</strong>;
    }
    // Clean leftover stray * or # that aren't part of syntax
    const cleaned = part.replace(/(?<!\w)\*(?!\*)/g, '').replace(/#+/g, '').trim();
    return cleaned ? <span key={i}>{cleaned}</span> : null;
  });
}

export default function LegalQuery() {
  const [question, setQuestion] = useState('');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { t } = useLanguage();
  const bottomRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasAutoSubmitted = useRef(false);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/queries');
      setQueries(data.data || data);
    } catch {
      setQueries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [queries]);

  // Auto-submit query from home page search bar
  useEffect(() => {
    const queryFromHome = searchParams.get('q');
    if (queryFromHome && !hasAutoSubmitted.current && !loading) {
      hasAutoSubmitted.current = true;
      // Clear the URL parameter so it doesn't re-submit on refresh
      setSearchParams({}, { replace: true });
      // Auto-submit the question
      const autoSubmit = async () => {
        setSubmitLoading(true);
        try {
          const { data } = await api.post('/queries', { question: queryFromHome });
          setQueries((prev) => [...prev, data.data || data]);
        } catch {
          // handled by interceptor
        } finally {
          setSubmitLoading(false);
        }
      };
      autoSubmit();
    }
  }, [loading, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setQuestion('');
    setSubmitLoading(true);

    try {
      const { data } = await api.post('/queries', { question: userQuestion });
      setQueries((prev) => [...prev, data.data || data]);
    } catch {
      // handled by interceptor
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm("Are you sure you want to clear your entire chat history? This action cannot be undone.")) return;

    try {
      await api.delete('/queries/clear-all');
      // Re-fetch to keep saved queries
      fetchQueries();
    } catch (err) {
       console.error("Clear chat error:", err);
    }
  };

  return (
    <div className="flex flex-col h-[75vh]">

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-default">
            {t('legalQuery')}
          </h1>
          <p className="text-muted text-sm mt-2">
            Ask your legal question and receive AI-powered guidance.
          </p>
        </div>
        
        {queries.length > 0 && (
          <button 
            onClick={handleClearChat}
            className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 px-3 py-1.5 border border-red-100 dark:border-red-900/30 rounded-lg bg-red-50/50 dark:bg-red-900/10 transition-colors"
          >
            <MdDelete className="inline" size={14} /> {t('clearHistory') || 'Clear History'}
          </button>
        )}
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto card p-6 space-y-6">

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-pulse flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30"></div>
              <div className="text-muted text-sm font-medium">Loading chat history...</div>
            </div>
          </div>
        ) : queries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-default mb-2">{t('noQueries') || 'No messages yet'}</h3>
            <p className="text-muted text-sm max-w-sm">
              Ask any legal question to get started. LawMate AI will analyze your query and provide structured guidance.
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            {queries.map((q) => (
              <div key={q._id} className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* --- User Message Bubble --- */}
                <div className="flex justify-end pr-2">
                  <div className="flex flex-col items-end max-w-[85%] sm:max-w-[70%]">
                    <div className="bg-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm relative">
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{q.question || q.description}</p>
                    </div>
                    <span className="text-[10px] text-muted mt-1.5 px-1 font-medium">
                      You • {new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* --- AI Response Bubble --- */}
                <div className="flex justify-start pl-2">
                  <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[80%]">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mt-1 border border-indigo-200 dark:border-indigo-800">
                      <span className="text-sm">⚖️</span>
                    </div>
                    <div className="flex flex-col items-start w-full">
                      <div className="bg-white dark:bg-slate-800 text-default px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-700 w-full overflow-hidden">
                        <div className="max-w-none">
                          <FormattedResponse text={q.response} />
                        </div>
                        
                        {/* --- Footer Actions for AI Response --- */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            {q.isSaved ? (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-900/10 rounded-md">
                                <MdCheckCircle size={14} /> Saved to Dashboard
                              </span>
                            ) : (
                              <button 
                                onClick={async () => {
                                  try {
                                    const { data } = await api.patch(`/queries/${q._id}/save`);
                                    setQueries(prev => prev.map(item => item._id === q._id ? data.data : item));
                                  } catch (err) {
                                    console.error("Save error:", err);
                                  }
                                }}
                                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium px-2 py-1 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                                title="Pin to dashboard for quick access"
                              >
                                <MdBookmarkAdd size={14} /> Save Query
                              </button>
                            )}
                          </div>
                          
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            LawMate AI • {new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {submitLoading && (
          <div className="flex justify-start pl-2 animate-in fade-in duration-300">
             <div className="flex items-end gap-3 max-w-[90%] sm:max-w-[70%]">
               <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mb-1 border border-indigo-200 dark:border-indigo-800">
                  <span className="text-sm animate-pulse">🤖</span>
                </div>
               <div className="bg-white dark:bg-slate-800 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <span className="text-xs text-muted font-medium ml-1 tracking-wide">LawMate is thinking...</span>
               </div>
             </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-xl">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (question.trim() && !submitLoading) {
                  handleSubmit(e);
                }
              }
            }}
            placeholder={t('questionPlaceholder') || "Type your legal question here..."}
            className="flex-1 bg-transparent border-none resize-none focus:ring-0 px-3 py-2.5 text-sm max-h-32 min-h-[44px]"
            rows={1}
            required
          />

          <button
            type="submit"
            disabled={submitLoading || !question.trim()}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 mr-0.5"
            title="Send Message"
          >
            {submitLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <div className="text-center mt-3 mb-1">
          <p className="text-[10px] text-slate-400 font-medium">LawMate AI can make mistakes. Consider verifying important information with a human advocate.</p>
        </div>
      </div>
    </div>
  );
}
