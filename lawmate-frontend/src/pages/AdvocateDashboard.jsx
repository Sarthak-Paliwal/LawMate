import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import {
  useGetMyAdvocateProfileQuery,
  useGetBookingsQuery,
  useUpdateAdvocateProfileMutation,
  useUploadIdProofMutation,
} from '../store/services/lawmateApi';

export default function AdvocateDashboard() {
  const { user, refreshUser } = useAuth();
  const [idProofFile, setIdProofFile] = useState(null);
  const [idUploadMsg, setIdUploadMsg] = useState('');
  const idInputRef = useRef(null);
  const { t } = useLanguage();

  // RTK Query — both cached
  const { data: profile, isLoading } = useGetMyAdvocateProfileQuery();
  const { data: bookings = [] } = useGetBookingsQuery();

  const stats = {
    pending: bookings.filter(x => x.status === 'pending').length,
    accepted: bookings.filter(x => x.status === 'accepted').length,
    total: bookings.length,
  };

  const [updateProfile, { isLoading: updatingAvailability }] = useUpdateAdvocateProfileMutation();
  const [uploadIdProof, { isLoading: uploadingId }] = useUploadIdProofMutation();

  const toggleAvailability = () =>
    updateProfile({ isAvailable: !profile?.isAvailable });

  const handleUploadIdProof = async () => {
    if (!idProofFile) return;
    setIdUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('idProof', idProofFile);
      await uploadIdProof(formData).unwrap();
      setIdUploadMsg('✓ ID uploaded! Awaiting approval.');
      setIdProofFile(null);
      if (idInputRef.current) idInputRef.current.value = '';
      await refreshUser();
    } catch {
      setIdUploadMsg('✕ Upload failed. Please try again.');
    }
  };

  const loading = isLoading;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-default">{t('advocateDashboard')}</h1>
            {user?.isAdvocateVerified && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-green-200 dark:border-green-800/50">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                Verified
              </span>
            )}
          </div>
          <p className="text-muted mt-2">Manage your practice and consultations.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t('currentAvailability')}</span>
            <span className={`text-sm font-bold ${profile?.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
              {profile?.isAvailable ? '● Accepting Bookings' : '○ Offline'}
            </span>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={updatingAvailability}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              profile?.isAvailable 
                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
          >
            {updatingAvailability ? '...' : (profile?.isAvailable ? 'Go Offline' : 'Go Online')}
          </button>
        </div>
      </div>

      {/* Advocate Verification Banner */}
      {!user?.isAdvocateVerified && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-default">{t('advocateVerification')}</h2>
                <div className="px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                  Pending Verification
                </div>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-400 max-w-2xl">
                To appear in the public advocates directory and receive bookings, you must be verified by an admin. Please upload a clear picture of your <strong>State Bar Council ID</strong>.
              </p>
            </div>

            <div className="flex flex-col gap-3 min-w-[280px]">
              <input
                ref={idInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setIdProofFile(e.target.files[0]);
                  setIdUploadMsg('');
                }}
                className="hidden"
              />
              
              <div className="flex gap-2">
                <button
                  onClick={() => idInputRef.current?.click()}
                  className="flex-1 px-4 py-2.5 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition text-muted hover:text-default text-left truncate"
                  title={idProofFile ? idProofFile.name : 'Upload Bar Council ID'}
                >
                  {idProofFile ? idProofFile.name : 'Choose ID Image'}
                </button>
                <button
                  disabled={!idProofFile || uploadingId}
                  onClick={handleUploadIdProof}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {uploadingId ? '...' : 'Save'}
                </button>
              </div>
              
              {idUploadMsg && (
                <p className={`text-xs font-medium ${idUploadMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {idUploadMsg}
                </p>
              )}
            </div>
          </div>
          
          {/* Soft Background Accent for the banner */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl opacity-50 z-0"></div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-amber-500">
          <div className="text-amber-500 text-sm font-bold uppercase mb-1">{t('pendingRequests')}</div>
          <div className="text-4xl font-bold text-default">{stats.pending}</div>
          <p className="text-xs text-muted mt-2">{t('newConsultationRequests')}</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="text-green-500 text-sm font-bold uppercase mb-1">{t('acceptedCases')}</div>
          <div className="text-4xl font-bold text-default">{stats.accepted}</div>
          <p className="text-xs text-muted mt-2">{t('ongoingConsultations')}</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-indigo-500">
          <div className="text-indigo-500 text-sm font-bold uppercase mb-1">{t('totalBookings')}</div>
          <div className="text-4xl font-bold text-default">{stats.total}</div>
          <p className="text-xs text-muted mt-2">{t('allTimeHistory')}</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-default">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/bookings" className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition">📅</span>
            <span className="text-sm font-medium text-default">{t('viewBookings')}</span>
          </Link>
          <Link to="/advocate-profile" className="relative flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition group">
            {(!profile?.bio || profile.bio.length < 10 || !profile?.specialization?.length) && (
              <span className="absolute top-3 right-3 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
            <span className="text-3xl mb-2 group-hover:scale-110 transition">👤</span>
            <span className="text-sm font-medium text-default">{t('editProfile')}</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
