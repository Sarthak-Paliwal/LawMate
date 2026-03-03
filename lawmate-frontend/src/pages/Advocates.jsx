import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useGetAdvocatesQuery } from '../store/services/lawmateApi';
import BookAdvocateModal from '../components/BookAdvocateModal';

export default function Advocates() {
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [filters, setFilters] = useState({
    specialization: '',
    sortBy: 'score'
  });

  const handleBookClick = (adv) => {
    if (!user) {
      navigate('/login', { state: { from: '/advocates' } });
      return;
    }
    setSelectedAdvocate(adv);
  };

  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // RTK Query: cached — switching filters reuses cached results
  const queryParams = {};
  if (filters.specialization) queryParams.specialization = filters.specialization;
  if (filters.sortBy) queryParams.sortBy = filters.sortBy;
  const { data: advocates = [], isFetching: loading } = useGetAdvocatesQuery(queryParams);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };


  return (
    <div>

      {/* Header & Filters */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-default">
            {t('advocates')}
          </h1>
          <p className="text-muted mt-2 text-sm">
            {t('topAdvocatesDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            className="input py-2 px-3 text-sm"
            value={filters.specialization}
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
          >
            <option value="">{t('allCategories')}</option>
            <option value="Criminal Defense">Criminal Defense</option>
            <option value="Family Law">Family Law</option>
            <option value="Land & Property">Land & Property</option>
            <option value="Consumer Rights">Consumer Rights</option>
            <option value="Cyber Law">Cyber Law</option>
            <option value="Business Law">Business Law</option>
            <option value="Employment">Employment</option>
            <option value="Constitution">Constitution</option>
            <option value="Human Rights">Human Rights</option>
            <option value="Traffic Law">Traffic Law</option>
            <option value="Health & Medical">Health & Medical</option>
            <option value="Education Law">Education Law</option>
          </select>

          <select 
            className="input py-2 px-3 text-sm"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="">{t('all')}</option>
            <option value="score">{t('recommended')}</option>
            <option value="rating">{t('topRated')}</option>
            <option value="experience">{t('mostExperienced')}</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 h-48 animate-pulse" />
          ))}
        </div>
      ) : advocates.length === 0 ? (
        <div className="text-center py-16 text-muted">
          {t('noAdvocates')}
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advocates.map((adv) => (
            <li
              key={adv._id}
              className="card p-6 h-full flex flex-col justify-between hover:border-indigo-300 transition-all duration-200 relative overflow-hidden"
            >
              {/* Badge for high score */}
              {adv.score > 120 && (
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Recommended
                </div>
              )}

              {/* Top Section */}
              <div>

                {/* Avatar + Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    {adv.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-default flex items-center gap-1.5">
                      {adv.user?.name || 'Advocate'}
                      {adv.user?.isVerified && (
                        <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 p-0.5 rounded-full" title="Verified Advocate">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </h3>
                    <p className="text-muted text-[10px] truncate max-w-[120px] sm:max-w-[150px]">
                      {adv.user?.email}
                    </p>
                  </div>
                </div>


                {/* Bio */}
                {adv.bio && (
                  <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
                    {adv.bio}
                  </p>
                )}

                {/* Specializations */}
                {adv.specialization?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {adv.specialization.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100 dark:border-indigo-800/50"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                {/* Experience & Rate & Rating */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                     <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Experience</p>
                     <p className="text-sm font-medium text-default">{adv.experience} yrs</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Consultation</p>
                     <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">₹{adv.hourlyRate}/hr</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex items-center gap-1.5">
                       <span className="text-amber-500 text-sm">★</span>
                      <span className="text-sm font-bold text-default">{adv.rating || 0}</span>
                      <span className="text-[10px] text-muted">({adv.reviewCount || 0} reviews)</span>
                   </div>
                   {adv.isAvailable === false && (
                     <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tighter">{t('offline')}</span>
                     </div>
                   )}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleBookClick(adv)}
                disabled={adv.isAvailable === false}
                className={`mt-6 w-full py-2 rounded-md transition shadow-sm font-medium ${
                  adv.isAvailable === false 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 dark:bg-slate-800 dark:border-slate-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {adv.isAvailable === false ? t('notTakingBookings') : t('bookAdvocate')}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Booking Modal */}
      {selectedAdvocate && (
        <BookAdvocateModal
          advocate={selectedAdvocate}
          onClose={() => setSelectedAdvocate(null)}
          onSuccess={() => navigate('/bookings')}
        />
      )}
    </div>
  );
}
