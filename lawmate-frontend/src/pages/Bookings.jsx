import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useRateBookingMutation,
  useProposeSlotsMutation,
  useConfirmSlotMutation,
} from '../store/services/lawmateApi';
import ChatWindow from '../components/ChatWindow';

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  slots_proposed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  completed: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const statusLabels = {
  pending: 'Pending',
  slots_proposed: 'Slots Proposed',
  accepted: 'Accepted',
  rejected: 'Rejected',
  completed: 'Completed',
};

export default function Bookings() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: bookings = [], isLoading: loading } = useGetBookingsQuery();
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [rateBooking] = useRateBookingMutation();
  const [proposeSlots] = useProposeSlotsMutation();
  const [confirmSlot] = useConfirmSlotMutation();

  // Which booking is showing the slot proposal form
  const [proposingFor, setProposingFor] = useState(null);
  const [slotInputs, setSlotInputs] = useState([
    { date: '', hour: '10', minute: '00', period: 'AM' },
    { date: '', hour: '10', minute: '00', period: 'AM' },
  ]);

  // Which booking has the chat open
  const [chatOpenFor, setChatOpenFor] = useState(null);

  const updateStatus = (bookingId, status) => updateBookingStatus({ bookingId, status });
  const handleRate = (bookingId, rating) => rateBooking({ bookingId, rating });

  const handleProposeSlots = async (bookingId) => {
    const validSlots = slotInputs.filter(s => s.date);
    if (validSlots.length === 0) return;
    const slots = validSlots.map(s => ({
      date: s.date,
      time: `${s.hour}:${s.minute} ${s.period}`
    }));
    await proposeSlots({ bookingId, slots });
    setProposingFor(null);
    setSlotInputs([
      { date: '', hour: '10', minute: '00', period: 'AM' },
      { date: '', hour: '10', minute: '00', period: 'AM' },
    ]);
  };

  const handleConfirmSlot = async (bookingId, slotIndex) => {
    await confirmSlot({ bookingId, slotIndex });
  };

  const addSlotInput = () => {
    if (slotInputs.length >= 3) return;
    setSlotInputs([...slotInputs, { date: '', hour: '10', minute: '00', period: 'AM' }]);
  };

  const removeSlotInput = (idx) => {
    if (slotInputs.length <= 1) return;
    setSlotInputs(slotInputs.filter((_, i) => i !== idx));
  };

  const updateSlotInput = (idx, field, value) => {
    setSlotInputs(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

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
              disabled={!!booking.rating}
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
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                {/* Left Section */}
                <div className="flex-1">
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

                  {/* Confirmed Appointment */}
                  {b.confirmedSlot?.date && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                      <span className="text-green-600">📅</span>
                      <div>
                        <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wider">Confirmed Appointment</p>
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                          {new Date(b.confirmedSlot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at {b.confirmedSlot.time}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Proposed Slots (Client view) — pick one */}
                  {b.status === 'slots_proposed' && user?.role === 'user' && b.proposedSlots?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                        📋 Pick an Appointment Slot
                      </p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {b.proposedSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleConfirmSlot(b._id, idx)}
                            className="flex flex-col items-center p-3 rounded-xl border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition group"
                          >
                            <span className="text-sm font-bold text-default group-hover:text-indigo-600">
                              {new Date(slot.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                            <span className="text-xs text-muted mt-0.5">{slot.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Proposed Slots (Advocate view) — just show them */}
                  {b.status === 'slots_proposed' && user?.role === 'advocate' && b.proposedSlots?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                        📋 Waiting for Client to Pick a Slot
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {b.proposedSlots.map((slot, idx) => (
                          <div key={idx} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50">
                            {new Date(slot.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {slot.time}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-start md:items-end min-w-[140px]">

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      statusStyles[b.status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {statusLabels[b.status] || b.status}
                  </span>
                  
                  {/* Rating Stars Layer */}
                  {renderStars(b)}

                  {/* Action Buttons for Advocates */}
                  {user?.role === 'advocate' && b.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setProposingFor(proposingFor === b._id ? null : b._id);
                            setSlotInputs([{ date: '', time: '' }, { date: '', time: '' }]);
                          }}
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

                  {/* Chat Button — only for accepted (not completed) */}
                  {b.status === 'accepted' && (
                    <button
                      onClick={() => setChatOpenFor(chatOpenFor === b._id ? null : b._id)}
                      className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm flex items-center gap-1.5 ${
                        chatOpenFor === b._id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50'
                      }`}
                    >
                      💬 {chatOpenFor === b._id ? 'Close Chat' : 'Chat'}
                    </button>
                  )}
                </div>
              </div>

              {/* Slot Proposal Form (inline, for advocate) */}
              {proposingFor === b._id && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-default mb-3">📅 Propose Appointment Slots</p>
                  <p className="text-xs text-muted mb-3">Suggest 1–3 date/time options for the client to choose from.</p>
                  <div className="space-y-3">
                    {slotInputs.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted font-bold w-6">#{idx + 1}</span>
                        {/* Date */}
                        <input
                          type="date"
                          value={slot.date}
                          onChange={(e) => updateSlotInput(idx, 'date', e.target.value)}
                          className="input text-sm px-3 py-2 flex-1 min-w-[130px] focus:ring-2 focus:ring-indigo-500"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {/* Hour */}
                        <select
                          value={slot.hour}
                          onChange={(e) => updateSlotInput(idx, 'hour', e.target.value)}
                          className="input text-sm px-2 py-2 w-16 focus:ring-2 focus:ring-indigo-500"
                        >
                          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                        <span className="text-muted text-sm font-bold">:</span>
                        {/* Minute */}
                        <select
                          value={slot.minute}
                          onChange={(e) => updateSlotInput(idx, 'minute', e.target.value)}
                          className="input text-sm px-2 py-2 w-16 focus:ring-2 focus:ring-indigo-500"
                        >
                          {['00', '15', '30', '45'].map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        {/* AM / PM toggle */}
                        <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          {['AM', 'PM'].map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => updateSlotInput(idx, 'period', p)}
                              className={`px-3 py-2 text-xs font-bold transition ${
                                slot.period === p
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-white dark:bg-slate-800 text-muted hover:bg-slate-50 dark:hover:bg-slate-700'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                        {slotInputs.length > 1 && (
                          <button onClick={() => removeSlotInput(idx)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    {slotInputs.length < 3 && (
                      <button
                        onClick={addSlotInput}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                      >
                        + Add another slot
                      </button>
                    )}
                    <div className="flex-1" />
                    <button
                      onClick={() => setProposingFor(null)}
                      className="px-4 py-2 rounded-lg text-sm text-muted border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleProposeSlots(b._id)}
                      disabled={!slotInputs.some(s => s.date)}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm ${
                        slotInputs.some(s => s.date)
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Send Slots
                    </button>
                  </div>
                </div>
              )}

              {/* Chat Window (inline) */}
              {chatOpenFor === b._id && (
                <ChatWindow
                  bookingId={b._id}
                  userRole={user?.role}
                  onComplete={async () => {
                    await updateBookingStatus({ bookingId: b._id, status: 'completed' });
                    setChatOpenFor(null);
                  }}
                  onClose={() => setChatOpenFor(null)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
