import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../common/Spinner';
import { useLanguage } from '../../i18n/LanguageContext';
import { MdCheckCircle, MdSaveAlt, MdHourglassBottom, MdPsychology, MdStar } from 'react-icons/md';

export default function StepResult({ result }) {
  const [advocates, setAdvocates] = useState([]);
  const [loadingAdvocates, setLoadingAdvocates] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (result && result.category) {
      setLoadingAdvocates(true);
      // Fetch top 3 advocates for this category
      api.get('/advocates', { 
        params: { 
          specialization: result.category,
          limit: 3 
        } 
      })
      .then(({ data }) => setAdvocates(data.data || []))
      .catch(err => console.error("Error fetching advocates:", err))
      .finally(() => setLoadingAdvocates(false));
    }
  }, [result]);

  if (!result) return null;

  const { 
    legalNature, 
    relevantActs = [], 
    recommendedAction = [], 
    severity,
    worthItAnalysis,
    estimatedTime,
    estimatedCost
  } = result;

  const severityColor = {
    Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Very High': 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200',
  }[severity] || 'bg-slate-100 text-slate-800';

  const worthStatusColor = {
    Yes: 'text-green-600 dark:text-green-400',
    Maybe: 'text-amber-600 dark:text-amber-400',
    No: 'text-red-600 dark:text-red-400',
  }[worthItAnalysis?.status] || 'text-slate-600';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-default">
            Legal Analysis & Guidance
          </h2>
          <p className="text-sm text-muted mt-1">{legalNature}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          {result.isSaved ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 px-3 py-1.5 rounded-lg">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <MdCheckCircle className="text-sm text-emerald-600" /> Analysis Saved to Dashboard
              </span>
            </div>
          ) : (
            <button 
              onClick={async () => {
                try {
                  const { data } = await api.patch(`/queries/${result.queryId || result._id}/save`);
                  // Result is passed as prop, might need to update local state or trigger a refresh if needed
                  // But since it's a "Step", maybe just alert/temporary state is enough if the prop doesn't change
                  alert("Analysis saved to your dashboard!");
                  // Ideally, we'd want to update the result object's isSaved property
                  window.location.reload(); // Quickest way to refresh state if prop is from parent
                } catch (err) {
                  console.error("Save error:", err);
                }
              }}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition shadow-sm"
            >
              <MdSaveAlt className="inline mr-1" size={14} /> Save Analysis to Dashboard
            </button>
          )}
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold self-start md:self-center ${severityColor}`}>
          {severity} Severity
        </span>
      </div>

      {/* Worth It Analysis */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <MdPsychology size={28} />
            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200">
              Is it worth taking legal action?
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium uppercase tracking-wider text-muted">Conclusion:</span>
            <span className={`font-bold text-lg ${worthStatusColor}`}>
              {worthItAnalysis?.status || 'Maybe'}
            </span>
          </div>

          <p className="text-default leading-relaxed text-sm italic border-l-4 border-indigo-400 pl-4 py-1">
            "{worthItAnalysis?.rationale}"
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-indigo-100 dark:border-indigo-800/50 pt-4">
            <div>
              <span className="block text-[10px] uppercase font-bold text-muted mb-1 tracking-widest">Complexity</span>
              <span className="font-semibold text-sm">{worthItAnalysis?.complexity}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-muted mb-1 tracking-widest">Est. Cost</span>
              <span className="font-semibold text-sm">{estimatedCost || 'Variable'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center text-center">
           <MdHourglassBottom size={32} className="mb-2" />
           <span className="text-xs uppercase font-bold text-muted tracking-widest mb-1">Estimated Time</span>
           <span className="text-xl font-bold text-default">{estimatedTime || 'Unknown'}</span>
           <p className="text-[10px] text-muted mt-2">Subject to court backlog and case complexity.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recommended Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-default flex items-center gap-2">
            <span className="bg-indigo-600 text-white rounded-md w-6 h-6 flex items-center justify-center text-xs">A</span>
            Recommended Actions
          </h3>
          <ul className="space-y-3">
            {recommendedAction.length > 0 ? (
              recommendedAction.map((action, i) => (
                <li key={i} className="text-sm text-default flex items-start gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-border shadow-xs">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{action}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted">Consult a professional for specific advice.</li>
            )}
          </ul>
        </div>

        {/* Legal Context */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-default flex items-center gap-2">
            <span className="bg-slate-700 text-white rounded-md w-6 h-6 flex items-center justify-center text-xs">L</span>
            Relevant Acts & Sections
          </h3>
          <div className="flex flex-wrap gap-2">
            {relevantActs.length > 0 ? (
              relevantActs.map((act, i) => (
                <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-md text-xs border border-slate-200 dark:border-slate-700">
                  {act}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted italic">General laws applicable.</span>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Advocates */}
      <div className="border-t border-border pt-8 mt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-default">
            Recommended Advocates
          </h3>
          <Link to="/advocates" className="text-indigo-600 hover:underline text-sm font-medium">
            View All &rarr;
          </Link>
        </div>

        {loadingAdvocates ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : advocates.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {advocates.map((adv) => (
              <div key={adv._id} className="card-hover-effect p-4 border border-border rounded-xl bg-white dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                     {adv.user?.name?.charAt(0) || 'A'}
                   </div>
                   <div className="min-w-0">
                     <p className="font-bold text-sm truncate">{adv.user?.name}</p>
                     <p className="text-[10px] text-muted uppercase tracking-wider">{adv.experience} Years Exp.</p>
                   </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-amber-500 gap-1">
                      <span className="text-xs font-bold">{adv.rating || 0}</span>
                      <span className="text-[10px]">★</span>
                    </div>
                    {adv.isAvailable === false && (
                      <span className="text-[9px] font-bold text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded bg-red-500/5 uppercase">{t('offline')}</span>
                    )}
                  </div>
                  <Link 
                    to={`/advocates/${adv._id}`} 
                    className={`text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-tighter ${
                      adv.isAvailable === false 
                        ? 'bg-slate-200 text-slate-500 pointer-events-none' 
                        : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm'
                    }`}
                  >
                    {adv.isAvailable === false ? t('unavailable') : t('viewProfile')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg text-center text-muted text-sm">
            No specific advocates found for this category. Visit the marketplace to search.
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-muted italic text-center border-t border-border pt-4">
        DISCLAIMER: This guidance is generated by a rule-based engine for informational purposes only. 
        Case outcomes in Indian courts depend on multiple variables. Always consult a licensed advocate before taking legal steps.
      </p>
    </div>
  );
}

