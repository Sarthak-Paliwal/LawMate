import { createPortal } from 'react-dom';
import { useLanguage } from '../i18n/LanguageContext';

export default function AdvocateDetailsModal({ advocate, onClose, onBook }) {
  const { t } = useLanguage();

  if (!advocate) return null;

  const casesFought = advocate.casesHandled || 0;
  const casesWon = advocate.casesWon || 0;
  const winPercent = casesFought > 0 ? Math.round((casesWon / casesFought) * 100) : 0;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 overflow-y-auto" onClick={onClose}>
      <div 
        className="w-full max-w-5xl mx-auto min-h-screen relative flex flex-col bg-white dark:bg-slate-900 shadow-2xl border-x border-slate-200 dark:border-slate-800" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition"
        >
          ✕
        </button>

        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
             {advocate.profilePicture ? (
               <img src={advocate.profilePicture} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               advocate.user?.name?.charAt(0).toUpperCase() || 'A'
             )}
          </div>
          <div className="flex-1 mt-2">
            <h2 className="text-2xl font-bold text-default flex flex-col sm:flex-row items-center sm:items-start gap-2 justify-center sm:justify-start">
              {advocate.user?.name || 'Advocate'}
              {advocate.user?.isAdvocateVerified && (
                <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold mt-1 sm:mt-1.5 flex items-center gap-1 border border-emerald-100 dark:border-emerald-800/50">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </h2>
            <p className="text-muted text-sm mt-1 mb-3">{advocate.user?.email}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8 flex-1">
          
          {/* Stats Grid */}
          <div>
             <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                 <span className="text-lg">📊</span> Career Highlights
             </h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-xl text-center">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold text-2xl">{casesFought}</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted mt-1">Cases Fought</div>
               </div>
               <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl text-center">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-2xl">{casesWon}</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted mt-1">Cases Won</div>
               </div>
               <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-xl text-center">
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-2xl">{winPercent}%</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted mt-1">Win Rate</div>
               </div>
               <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-4 rounded-xl text-center">
                  <div className="flex items-baseline justify-center gap-0.5">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-2xl">{advocate.rating || 0}</span>
                    <span className="text-amber-600 dark:text-amber-400 text-sm">★</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted mt-1">({advocate.reviewCount || 0} Reviews)</div>
               </div>
             </div>
          </div>

          {/* Practice Information */}
          <div className="grid sm:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800">
             <div>
                <dt className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Practice Location</dt>
                <dd className="text-sm font-medium text-default flex items-center gap-1.5"><span className="text-indigo-500">📍</span> {advocate.location || 'Not Specified'}</dd>
             </div>
             <div>
                <dt className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Hearing Charges</dt>
                <dd className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5"><span className="text-emerald-500">₹</span> {advocate.hourlyRate ? `${advocate.hourlyRate}/hr` : 'Consult to know'}</dd>
             </div>
             <div>
                <dt className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Experience</dt>
                <dd className="text-sm font-medium text-default flex items-center gap-1.5"><span className="text-amber-500">🏅</span> {advocate.experience} Years</dd>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {/* Specializations */}
            {advocate.specialization?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                   <span className="text-lg">⚖️</span> Practice Areas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {advocate.specialization.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-800/50 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Qualifications */}
            {advocate.qualifications && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                   <span className="text-lg">🎓</span> Educational Qualifications
                </h3>
                <div className="text-sm text-default leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  {advocate.qualifications}
                </div>
              </div>
            )}
          </div>

          {/* Story / Bio */}
          {advocate.bio && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                 <span className="text-lg">📖</span> Advocate Story & Bio
              </h3>
              <div className="text-sm text-default leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                {advocate.bio}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-end gap-3 mt-auto">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 rounded-xl font-medium text-sm text-default bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
           >
             Close
           </button>
           <button
             onClick={() => onBook(advocate)}
             disabled={advocate.isAvailable === false}
             className={`px-8 py-2.5 rounded-xl font-medium text-sm transition shadow-sm ${
               advocate.isAvailable === false 
                 ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
             }`}
           >
             {advocate.isAvailable === false ? t('notTakingBookings') : t('bookAdvocate')}
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
