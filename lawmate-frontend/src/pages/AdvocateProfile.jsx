import { useState, useRef } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  useGetMyAdvocateProfileQuery,
  useUpdateAdvocateProfileMutation,
  useUploadAdvocateProfilePictureMutation,
} from '../store/services/lawmateApi';

export default function AdvocateProfile() {
  const { t } = useLanguage();

  // RTK Query: fetch profile (cached — no re-fetch on every navigation)
  const { data: profile, isLoading } = useGetMyAdvocateProfileQuery();

  // RTK Query mutations
  const [updateProfile, { isLoading: saving }] = useUpdateAdvocateProfileMutation();
  const [uploadPicture, { isLoading: picUploading }] = useUploadAdvocateProfilePictureMutation();

  // Local form state (initialised from RTK Query data when available)
  const [form, setForm] = useState(null); // null = not yet initialised
  const [specInput, setSpecInput] = useState('');
  const [message, setMessage] = useState('');

  // Profile picture local state
  const [picPreview, setPicPreview] = useState(null);
  const [picFile, setPicFile] = useState(null);
  const [picMessage, setPicMessage] = useState('');
  const fileInputRef = useRef(null);

  // Initialise form once profile data arrives (only once)
  if (profile && form === null) {
    setForm({
      bio: profile.bio || '',
      specialization: Array.isArray(profile.specialization) ? profile.specialization : [],
      experience: profile.experience ?? '',
      barCouncilNumber: profile.barCouncilNumber || '',
      hourlyRate: profile.hourlyRate ?? '',
      isAvailable: profile.isAvailable !== false,
      location: profile.location || '',
    });
  }

  /* ---- Specialization helpers ---- */
  const addSpec = () => {
    const v = specInput.trim();
    if (v && !form.specialization.includes(v)) {
      setForm((f) => ({ ...f, specialization: [...f.specialization, v] }));
      setSpecInput('');
    }
  };

  const removeSpec = (s) =>
    setForm((f) => ({ ...f, specialization: f.specialization.filter((x) => x !== s) }));

  /* ---- Submit profile form ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await updateProfile({
        ...form,
        experience: form.experience === '' ? 0 : Number(form.experience),
        hourlyRate: form.hourlyRate === '' ? undefined : Number(form.hourlyRate),
      }).unwrap();
      setMessage('success');
    } catch {
      setMessage('error');
    }
  };

  /* ---- Profile picture handlers ---- */
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPicFile(file);
    setPicPreview(URL.createObjectURL(file));
    setPicMessage('');
  };

  const handlePicUpload = async () => {
    if (!picFile) return;
    setPicMessage('');
    try {
      const formData = new FormData();
      formData.append('profilePicture', picFile);
      await uploadPicture(formData).unwrap();
      // Cache invalidation in lawmateApi automatically refetches profile + navbar
      setPicPreview(null);
      setPicFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setPicMessage('success');
    } catch {
      setPicMessage('error');
    }
  };

  const handlePicCancel = () => {
    setPicPreview(null);
    setPicFile(null);
    setPicMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ---- Loading skeleton ---- */
  if (isLoading || form === null) {
    return (
      <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6" />
        <div className="h-4 bg-slate-100 rounded w-full mb-2" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
    );
  }

  const displayPic = picPreview || profile?.profilePicture;

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-default">{t('myProfile')}</h1>
        <p className="text-muted text-sm mt-2">Update your professional details and availability.</p>
      </div>

      {/* ---- Profile Picture Card ---- */}
      <div className="card p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-semibold text-default mb-4">Profile Picture</h2>

        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            {displayPic ? (
              <img src={displayPic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-indigo-200 shadow" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A8.966 8.966 0 0112 15c2.21 0 4.228.797 5.879 2.11M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1.5 hover:bg-indigo-700 transition shadow" title="Change photo">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.929a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted mb-3">JPEG, PNG or WebP · Max 5 MB</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePicChange} />

            {picFile ? (
              <div className="flex gap-2 flex-wrap">
                <button type="button" onClick={handlePicUpload} disabled={picUploading}
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-60">
                  {picUploading ? 'Uploading…' : 'Save Photo'}
                </button>
                <button type="button" onClick={handlePicCancel}
                  className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-default text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-default text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                {profile?.profilePicture ? 'Change Photo' : 'Upload Photo'}
              </button>
            )}

            {picMessage && (
              <p className={`mt-2 text-sm ${picMessage === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {picMessage === 'success' ? 'Profile picture updated!' : 'Upload failed. Please try again.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Profile Details Form ---- */}
      <form onSubmit={handleSubmit} autoComplete="off" className="card p-8 space-y-8 shadow-sm">
        {message && (
          <div className={`px-4 py-2 rounded-md text-sm ${
            message === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message === 'success' ? t('profileUpdated') : t('errorGeneric')}
          </div>
        )}

        {/* Bio */}
        <div>
          <h2 className="text-lg font-semibold text-default mb-3">{t('bio')}</h2>
          <textarea name="bio" autoComplete="off" value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            className="input min-h-[100px] focus:ring-2 focus:ring-indigo-500" />
        </div>

        {/* Specialization */}
        <div>
          <h2 className="text-lg font-semibold text-default mb-3">{t('specialization')}</h2>
          <div className="flex gap-2 mb-3">
            <input type="text" name="specializationInput" autoComplete="off" value={specInput}
              onChange={(e) => setSpecInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
              className="flex-1 input focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Criminal, Civil" />
            <button type="button" onClick={addSpec}
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.specialization.map((s) => (
              <span key={s} className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
                {s}
                <button type="button" onClick={() => removeSpec(s)} className="text-slate-400 hover:text-red-600 transition">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Experience, Bar Council, Rate */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-default mb-1">{t('experience')}</label>
            <input type="number" name="experience" autoComplete="off" min="0" value={form.experience}
              onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
              className="input focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-default mb-1">Bar Council Number</label>
            <input type="text" name="barCouncilNumber" autoComplete="off" value={form.barCouncilNumber}
              onChange={(e) => setForm((f) => ({ ...f, barCouncilNumber: e.target.value }))}
              className="input focus:ring-2 focus:ring-indigo-500" placeholder="e.g. MAH/1234/2020" />
          </div>
          <div>
            <label className="block text-sm font-medium text-default mb-1">Hourly Rate (₹)</label>
            <input type="number" name="hourlyRate" autoComplete="off" min="0" value={form.hourlyRate}
              onChange={(e) => setForm((f) => ({ ...f, hourlyRate: e.target.value }))}
              className="input focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 1500" />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-default mb-1">Primary Practice Location</label>
          <input type="text" name="location" autoComplete="off" value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="input focus:ring-2 focus:ring-indigo-500" placeholder="e.g. New Delhi, Mumbai, etc." />
        </div>

        {/* Availability */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg">
          <span className="text-sm text-default">Available for bookings</span>
          <input type="checkbox" checked={form.isAvailable}
            onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))}
            className="w-4 h-4 accent-indigo-600" />
        </div>

        {/* Submit */}
        <button type="submit" disabled={saving}
          className="w-full py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-60">
          {saving ? 'Saving...' : t('updateProfile')}
        </button>
      </form>
    </div>
  );
}
