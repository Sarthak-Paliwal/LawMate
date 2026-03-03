import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useCreateBookingMutation } from '../store/services/lawmateApi';

export default function BookAdvocateModal({ advocate, onClose, onSuccess }) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const [createBooking, { isLoading: loading }] = useCreateBookingMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (advocate.isAvailable === false) {
      setError("This advocate is currently not taking any bookings.");
      return;
    }
    setError('');
    try {
      const advocateId = advocate.user?._id || advocate.user;
      await createBooking({ advocateId, message }).unwrap();
      onSuccess();
    } catch (err) {
      setError(err.data?.message || t('errorGeneric'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="card p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">{t('bookingRequest')}</h3>
        <p className="text-slate-600 text-sm mb-4">{advocate.user?.name || 'Advocate'}</p>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('message')}</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input min-h-[80px]"
            placeholder={t('message')}
          />
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? '...' : t('sendRequest')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
