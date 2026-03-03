import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useRateBookingMutation,
} from '../store/services/lawmateApi';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export default function Bookings() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: bookings = [], isLoading: loading } = useGetBookingsQuery();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [rateBooking] = useRateBookingMutation();

  const updateStatus = (bookingId, status) => updateBookingStatus({ bookingId, status });
  const handleRate = (bookingId, rating) => rateBooking({ bookingId, rating });

  const renderStars = (booking) => {
    if (user?.role !== 'user' || booking.status !== 'completed') return null;

    const currentRating = booking.rating || 0;
    
    return (
      <div className="flex flex-col items-center md:items-end mt-3 gap-1">
        <span className="text-xs text-muted font-medium">
          {currentRating ? t('yourRating') : t('rateYourExperience')}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRate(booking._id, star)}
              disabled={!!booking.rating} // Disable if already rated
              className={`text-xl transition-all duration-200 focus:outline-none ${
                booking.rating
                  ? (star <= currentRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 cursor-default')
                  : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 hover:scale-110 active:scale-95'
              } ${!booking.rating && 'group-hover:text-amber-400'}`}
              onMouseEnter={(e) => {
                if (!booking.rating) {
                  const stars = e.currentTarget.parentNode.children;
                  for (let i = 0; i < star; i++) stars[i].classList.add('text-amber-400');
                }
              }}
              onMouseLeave={(e) => {
                if (!booking.rating) {
                  const stars = e.currentTarget.parentNode.children;
                  for (let i = 0; i < 5; i++) stars[i].classList.remove('text-amber-400');
                }
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-default">
          {t('myBookings')}
        </h1>
        <p className="text-muted text-sm mt-2">
          {user?.role === 'advocate'
            ? 'Manage client appointment requests.'
            : 'Track your advocate consultations.'}
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-6 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 text-muted">
          {t('noBookings')}
        </div>
      ) : (
        <ul className="space-y-6">
          {bookings.map((b) => (
            <li
              key={b._id}
              className="card p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                {/* Left Section */}
                <div>
                  <p className="font-semibold text-default">
                    {user?.role === 'user'
                      ? b.advocate?.name || 'Advocate'
                      : b.user?.name || 'User'}
                  </p>

                  <p className="text-muted text-sm mt-1">
                    {user?.role === 'user'
                      ? b.advocate?.email
                      : b.user?.email}
                  </p>

                  {b.message && (
                     <p className="text-muted text-sm mt-3 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-md border border-slate-100 dark:border-slate-700">
                      {b.message}
                    </p>
                  )}

                  <p className="text-slate-400 text-xs mt-3 flex items-center gap-1.5">
                    <span className="text-lg">🕒</span> {new Date(b.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-start md:items-end min-w-[120px]">

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      statusStyles[b.status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {t(b.status)}
                  </span>
                  
                  {/* Rating Stars Layer */}
                  {renderStars(b)}

                  {/* Action Buttons for Advocates */}
                  {user?.role === 'advocate' && b.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => updateStatus(b._id, 'accepted')}
                          className="px-4 py-2 rounded-lg bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white transition text-sm font-semibold border border-green-600/20"
                        >
                          {t('accept')}
                        </button>

                        <button
                          onClick={() => updateStatus(b._id, 'rejected')}
                          className="px-4 py-2 rounded-lg bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition text-sm font-semibold border border-red-600/20"
                        >
                          {t('reject')}
                        </button>
                      </div>
                  )}

                  {/* Mark as Completed for Advocates */}
                  {user?.role === 'advocate' && b.status === 'accepted' && (
                    <button
                      onClick={() => updateStatus(b._id, 'completed')}
                      className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-semibold shadow-sm"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
