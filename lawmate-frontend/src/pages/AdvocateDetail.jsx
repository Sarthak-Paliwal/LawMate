import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import BookAdvocateModal from '../components/BookAdvocateModal';

export default function AdvocateDetail() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Retrieve advocate details passed from the directory via React Router state
  const advocate = location.state?.advocate;

  if (!advocate) {
    // Fallback if the user navigates directly without state
    return <Navigate to="/advocates" replace />;
  }

  const casesFought = advocate.casesHandled || 0;
  const casesWon = advocate.casesWon || 0;
  const winPercent = casesFought > 0 ? Math.round((casesWon / casesFought) * 100) : 0;

  const handleBookPress = () => {
    if (!user) {
      navigate('/login', { state: { from: '/advocates' } });
      return;
    }
    setShowBookingModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
      <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <button 
            onClick={() => navigate('/advocates')}
            className="md:hidden self-start mb-2 px-4 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            ← Back
          </button>
          
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-4xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
             {advocate.profilePicture ? (
               <img src={advocate.profilePicture} alt="Profile" className="w-full h-full object-cover" />
             ) : (
               advocate.user?.name?.charAt(0).toUpperCase() || 'A'
             )}
          </div>
          
          <div className="flex-1 mt-2">
            <h1 className="text-3xl font-bold text-default flex flex-col md:flex-row items-center md:items-start gap-3 justify-center md:justify-start">
              {advocate.user?.name || 'Advocate'}
              {advocate.user?.isAdvocateVerified && (
                <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-full text-xs uppercase tracking-wider font-bold mt-1 md:mt-1.5 flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-800/50">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              )}
            </h1>
            <p className="text-muted text-base mt-2 mb-4">{advocate.user?.email}</p>
            
            <button 
               onClick={() => navigate('/advocates')}
               className="hidden md:inline-flex px-5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
             >
               ← Back to Directory
             </button>
          </div>
          
          <div className="hidden md:block">
            <button
               onClick={handleBookPress}
               disabled={advocate.isAvailable === false}
               className={`px-8 py-3 rounded-xl font-medium text-base shadow-md transition ${
                 advocate.isAvailable === false 
                   ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                   : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
               }`}
             >
               {advocate.isAvailable === false ? t('notTakingBookings') : t('bookAdvocate')}
             </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 md:p-8 space-y-10">
          
          {/* Stats Grid */}
          <div>
             <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                 <span className="text-lg">📊</span> Career Highlights
             </h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-5 rounded-xl text-center">
                  <div className="text-indigo-600 dark:text-indigo-400 font-bold text-3xl">{casesFought}</div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted mt-2">Cases Fought</div>
               </div>
               <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-xl text-center">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-3xl">{casesWon}</div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted mt-2">Cases Won</div>
               </div>
               <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-5 rounded-xl text-center">
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-3xl">{winPercent}%</div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted mt-2">Win Rate</div>
               </div>
               <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-5 rounded-xl text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-3xl">{advocate.rating || 0}</span>
                    <span className="text-amber-600 dark:text-amber-400 text-lg">★</span>
                  </div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted mt-2">({advocate.reviewCount || 0} Reviews)</div>
               </div>
             </div>
          </div>

          {/* Practice Information */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
             <div>
                <dt className="text-xs uppercase tracking-widest font-bold text-muted mb-1.5">Practice Location</dt>
                <dd className="text-base font-medium text-default flex items-center gap-2"><span className="text-indigo-500">📍</span> {advocate.location || 'Not Specified'}</dd>
             </div>
             <div>
                <dt className="text-xs uppercase tracking-widest font-bold text-muted mb-1.5">Consulting Fee</dt>
                <dd className="text-base font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><span className="text-emerald-500">₹</span> {advocate.consultationFee ? `${advocate.consultationFee}` : 'Consult to know'}</dd>
             </div>
             <div>
                <dt className="text-xs uppercase tracking-widest font-bold text-muted mb-1.5">Hearing Charges</dt>
                <dd className="text-base font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2"><span className="text-indigo-500">₹</span> {advocate.hourlyRate ? `${advocate.hourlyRate}/hr` : 'Consult to know'}</dd>
             </div>
             <div>
                <dt className="text-xs uppercase tracking-widest font-bold text-muted mb-1.5">Experience</dt>
                <dd className="text-base font-medium text-default flex items-center gap-2"><span className="text-amber-500">🏅</span> {advocate.experience} Years</dd>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-slate-100 dark:border-slate-800">
            {/* Specializations */}
            {advocate.specialization?.length > 0 && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                   <span className="text-lg">⚖️</span> Practice Areas
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {advocate.specialization.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-sm px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-800/50 font-medium"
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
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                   <span className="text-lg">🎓</span> Educational Qualifications
                </h3>
                <div className="text-base text-default leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  {advocate.qualifications}
                </div>
              </div>
            )}
          </div>

          {/* Story / Bio */}
          {advocate.bio && (
            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                 <span className="text-lg">📖</span> Advocate Story & Bio
              </h3>
              <div className="text-base text-default leading-relaxed whitespace-pre-wrap bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50">
                {advocate.bio}
              </div>
            </div>
          )}

        </div>

        {/* Mobile Booking Button (only visible on small screens) */}
        <div className="md:hidden p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleBookPress}
            disabled={advocate.isAvailable === false}
            className={`w-full py-3.5 rounded-xl font-medium text-base shadow-md transition ${
              advocate.isAvailable === false 
                ? 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {advocate.isAvailable === false ? t('notTakingBookings') : t('bookAdvocate')}
          </button>
        </div>
      </div>

      {showBookingModal && (
        <BookAdvocateModal
          advocate={advocate}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            navigate('/bookings');
          }}
        />
      )}
    </div>
  );
}
