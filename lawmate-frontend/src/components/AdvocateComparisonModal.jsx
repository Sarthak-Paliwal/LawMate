import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCompareAdvocatesMutation } from '../store/services/lawmateApi';

function StatBadge({ value, better }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1.5 ${
      better === 'A' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' :
      better === 'B' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
    }`}>
      {better === 'A' ? '▲ Better' : better === 'B' ? '▲ Better' : '≈ Equal'}
    </span>
  );
}

function CompareRow({ label, valA, valB, higherIsBetter = true, lowerIsBetter = false, icon }) {
  const a = parseFloat(valA) || 0;
  const b = parseFloat(valB) || 0;
  let better = 'equal';
  if (a !== b) {
    if (lowerIsBetter) {
      better = a < b ? 'A' : 'B';
    } else if (higherIsBetter) {
      better = a > b ? 'A' : 'B';
    }
  }

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2">
        <span>{icon}</span> {label}
      </td>
      <td className={`py-3.5 px-4 text-center font-semibold text-base ${better === 'A' ? 'text-indigo-600 dark:text-indigo-400' : 'text-default'}`}>
        {valA}
        {better === 'A' && <StatBadge better="A" />}
      </td>
      <td className={`py-3.5 px-4 text-center font-semibold text-base ${better === 'B' ? 'text-emerald-600 dark:text-emerald-400' : 'text-default'}`}>
        {valB}
        {better === 'B' && <StatBadge better="B" />}
      </td>
    </tr>
  );
}

export default function AdvocateComparisonModal({ advocateA, advocateB, onClose }) {
  const [useCase, setUseCase] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [compareAdvocates, { isLoading }] = useCompareAdvocatesMutation();

  const nameA = advocateA?.user?.name || 'Advocate A';
  const nameB = advocateB?.user?.name || 'Advocate B';

  const winRateA = advocateA?.casesHandled > 0
    ? Math.round((advocateA.casesWon / advocateA.casesHandled) * 100)
    : 0;
  const winRateB = advocateB?.casesHandled > 0
    ? Math.round((advocateB.casesWon / advocateB.casesHandled) * 100)
    : 0;

  const handleAnalyze = async () => {
    if (!useCase.trim()) return;
    try {
      const result = await compareAdvocates({
        advocateA: {
          name: nameA,
          experience: advocateA.experience || 0,
          consultationFee: advocateA.consultationFee || 0,
          hourlyRate: advocateA.hourlyRate || 0,
          casesHandled: advocateA.casesHandled || 0,
          casesWon: advocateA.casesWon || 0,
          specialization: advocateA.specialization || [],
        },
        advocateB: {
          name: nameB,
          experience: advocateB.experience || 0,
          consultationFee: advocateB.consultationFee || 0,
          hourlyRate: advocateB.hourlyRate || 0,
          casesHandled: advocateB.casesHandled || 0,
          casesWon: advocateB.casesWon || 0,
          specialization: advocateB.specialization || [],
        },
        useCase,
      }).unwrap();
      setAiResult(result);
    } catch (e) {
      setAiResult({ error: true, summary: 'AI comparison failed. Please try again.', keyDifferences: [], recommendation: 'N/A', reasoning: '' });
    }
  };

  const winnerName = aiResult?.recommendation;
  const isAdvAWinner = winnerName === nameA;
  const isAdvBWinner = winnerName === nameB;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50">
              <span className="text-white text-base">⚡</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-default">AI Advocate Comparison</h2>
              <p className="text-xs text-muted">Side-by-side analysis powered by LLaMA AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Versus header with avatars */}
          <div className="flex items-center justify-between gap-4">
            {[{ name: nameA, adv: advocateA, color: 'indigo' }, { name: nameB, adv: advocateB, color: 'emerald' }].map(({ name, adv, color }, i) => (
              <div key={i} className={`flex-1 flex flex-col items-center p-4 rounded-2xl ${color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50' : 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50'}`}>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl mb-2 overflow-hidden ${color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {adv?.profilePicture
                    ? <img src={adv.profilePicture} alt={name} className="w-full h-full object-cover" />
                    : name.charAt(0).toUpperCase()}
                </div>
                <p className={`font-bold text-sm text-center ${color === 'indigo' ? 'text-indigo-700 dark:text-indigo-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{name}</p>
                <p className="text-[10px] text-muted mt-0.5">{adv?.user?.email}</p>
                {adv?.user?.isAdvocateVerified && (
                  <span className="mt-1 text-[9px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full font-bold uppercase tracking-wider">✓ Verified</span>
                )}
              </div>
            ))}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 text-sm">VS</div>
          </div>

          {/* Comparison Grid */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-muted">Metric</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{nameA}</th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{nameB}</th>
                </tr>
              </thead>
              <tbody>
                <CompareRow icon="🏅" label="Experience" valA={`${advocateA.experience || 0} yrs`} valB={`${advocateB.experience || 0} yrs`} />
                <CompareRow icon="⚖️" label="Win Rate" valA={`${winRateA}%`} valB={`${winRateB}%`} />
                <CompareRow icon="📁" label="Cases Fought" valA={advocateA.casesHandled || 0} valB={advocateB.casesHandled || 0} />
                <CompareRow icon="🏆" label="Cases Won" valA={advocateA.casesWon || 0} valB={advocateB.casesWon || 0} />
                <CompareRow icon="💬" label="Consulting Fee (₹)" valA={advocateA.consultationFee || 'TBD'} valB={advocateB.consultationFee || 'TBD'} lowerIsBetter />
                <CompareRow icon="⚡" label="Hearing Charges (₹/hr)" valA={advocateA.hourlyRate || 'TBD'} valB={advocateB.hourlyRate || 'TBD'} lowerIsBetter />
                <CompareRow icon="⭐" label="Rating" valA={advocateA.rating || 0} valB={advocateB.rating || 0} />
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-2"><span>⚖️</span> Specializations</td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {(advocateA.specialization || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md font-medium">{s}</span>
                      ))}
                      {!advocateA.specialization?.length && <span className="text-muted text-xs">General</span>}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {(advocateB.specialization || []).slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md font-medium">{s}</span>
                      ))}
                      {!advocateB.specialization?.length && <span className="text-muted text-xs">General</span>}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Use-case Input */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-default mb-1">
                🤖 Describe Your Legal Situation
              </label>
              <p className="text-xs text-muted mb-2">Tell the AI what kind of case you have so it can recommend the best fit advocate for your specific need.</p>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                rows={3}
                placeholder="e.g. I need a lawyer to help me with a property dispute against my neighbor..."
                className="w-full text-sm px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-default focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !useCase.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                isLoading || !useCase.trim()
                  ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200 dark:shadow-indigo-900/50 hover:shadow-md'
              }`}
            >
              {isLoading
                ? <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full"></span> Analyzing with AI...</>
                : <><span>⚡</span> Get AI Recommendation</>
              }
            </button>
          </div>

          {/* AI Result */}
          {aiResult && !isLoading && (
            <div className={`rounded-2xl border-2 overflow-hidden ${
              aiResult.error
                ? 'border-red-200 dark:border-red-800/50'
                : isAdvAWinner
                ? 'border-indigo-200 dark:border-indigo-800/60'
                : 'border-emerald-200 dark:border-emerald-800/60'
            }`}>
              {/* Winner name bar */}
              {!aiResult.error && (winnerName === nameA || winnerName === nameB) && (
                <div className={`flex items-center gap-3 px-5 py-3 ${
                  isAdvAWinner
                    ? 'bg-indigo-600'
                    : 'bg-emerald-600'
                }`}>
                  <span className="text-white text-xl">🏆</span>
                  <div>
                    <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">AI Recommends</p>
                    <p className="text-white font-black text-lg leading-tight">{winnerName}</p>
                  </div>
                </div>
              )}

              {/* The single hire statement */}
              <div className={`p-5 ${
                isAdvAWinner
                  ? 'bg-indigo-50 dark:bg-indigo-950/30'
                  : isAdvBWinner
                  ? 'bg-emerald-50 dark:bg-emerald-950/30'
                  : 'bg-slate-50 dark:bg-slate-800/50'
              }`}>
                <p className="text-base text-default leading-relaxed font-medium">
                  {aiResult.reasoning || aiResult.summary || 'No recommendation could be generated.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-default transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
