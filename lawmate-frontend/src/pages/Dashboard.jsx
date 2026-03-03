import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  useGetQueriesQuery,
  useGetMyDocumentsQuery,
  useGetBookingsQuery,
  useDeleteQueryMutation,
  useDeleteDocumentMutation,
  useUploadProfileImageMutation,
  useUploadIdProofMutation,
} from '../store/services/lawmateApi';
import Skeleton from '../components/common/Skeleton';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import QueryDetailModal from '../components/dashboard/QueryDetailModal';
import DocumentDetailModal from '../components/dashboard/DocumentDetailModal';
import { MdMenu, MdClose, MdDelete } from 'react-icons/md';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [idUploadMsg, setIdUploadMsg] = useState('');
  const idInputRef = useRef(null);

  // RTK Query — all cached
  const { data: recentQueries = [], isLoading: qLoading } = useGetQueriesQuery();
  const { data: recentDocs = [], isLoading: dLoading } = useGetMyDocumentsQuery();
  const { data: recentBookings = [], isLoading: bLoading } = useGetBookingsQuery();
  const loading = qLoading || dLoading || bLoading;

  const stats = {
    queries: recentQueries.length,
    docs: recentDocs.length,
    bookings: recentBookings.length,
  };

  // Mutations
  const [deleteQuery] = useDeleteQueryMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [uploadProfileImage, { isLoading: uploadingImage }] = useUploadProfileImageMutation();
  const [uploadIdProof, { isLoading: uploadingId }] = useUploadIdProofMutation();

  const handleUploadProfileImage = async () => {
    if (!profileFile) return;
    setUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('profileImage', profileFile);
      await uploadProfileImage(formData).unwrap();
      setUploadMsg('✓ Profile picture updated!');
      setProfileFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await refreshUser();
    } catch {
      setUploadMsg('✕ Upload failed. Please try again.');
    }
  };

  const handleUploadIdProof = async () => {
    if (!idProofFile) return;
    setIdUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('idProof', idProofFile);
      await uploadIdProof(formData).unwrap();
      setIdUploadMsg('✓ ID Proof uploaded! Awaiting admin approval.');
      setIdProofFile(null);
      if (idInputRef.current) idInputRef.current.value = '';
      await refreshUser();
    } catch {
      setIdUploadMsg('✕ Upload failed. Please try again.');
    }
  };

  const PANELS = {
    overview: () => (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6">{t('welcomeBack')} {user?.name}!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-1">{t('savedQueries')}</p>
            <p className="text-3xl font-bold text-default">{stats.queries}</p>
          </Card>
          <Card className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30">
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">{t('myDocuments')}</p>
            <p className="text-3xl font-bold text-default">{stats.docs}</p>
          </Card>
          <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30">
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mb-1">{t('bookingHistory')}</p>
            <p className="text-3xl font-bold text-default">{stats.bookings}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <section>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <span>🤖</span> {t('savedQueries')}
              </h3>
              <div className="space-y-3">
                 {recentQueries.filter(q => q.isSaved).length > 0 ? recentQueries.filter(q => q.isSaved).slice(0, 5).map(q => (
                   <div key={q._id} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex justify-between items-center text-sm">
                      <p className="font-medium truncate max-w-[70%]">{q.description || q.question || t('noDescription')}</p>
                      <span className="text-[10px] text-muted">{new Date(q.createdAt).toLocaleDateString()}</span>
                   </div>
                 )) : <p className="text-xs text-muted italic">{t('noSavedQueries')}</p>}
              </div>
           </section>

           <section>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <span>📄</span> {t('myDocuments')}
              </h3>
              <div className="space-y-3">
                 {recentDocs.length > 0 ? recentDocs.slice(0, 5).map(d => (
                   <div key={d._id} className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex justify-between items-center text-sm">
                      <p className="font-medium truncate max-w-[70%]">{d.type}</p>
                      <span className="text-[10px] text-muted">{new Date(d.createdAt).toLocaleDateString()}</span>
                   </div>
                 )) : <p className="text-xs text-muted italic">{t('noDocuments')}</p>}
              </div>
           </section>
        </div>
      </div>
    ),
    profile: () => (
      <div className="animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-6">{t('myProfile')}</h2>
        
        <Card className="p-8 max-w-lg">
          {/* Avatar Display */}
          <div className="flex flex-col items-center mb-8">
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900/30 shadow-lg mb-4"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4 border-4 border-indigo-100 dark:border-indigo-900/30">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="text-lg font-bold text-default">{user?.name}</h3>
            <p className="text-sm text-muted">{user?.email}</p>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-0.5 rounded-full">{user?.role}</span>
          </div>

          {/* Upload Section */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-sm font-semibold text-default mb-3">{t('updateProfilePicture')}</p>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  setProfileFile(e.target.files[0]);
                  setUploadMsg('');
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2.5 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition text-muted hover:text-default text-left truncate"
              >
                {profileFile ? profileFile.name : 'Choose an image (JPG, PNG, WebP)'}
              </button>
              <button
                disabled={!profileFile || uploadingImage}
                onClick={handleUploadProfileImage}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {uploadingImage ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {uploadMsg && (
              <p className={`text-xs mt-3 font-medium ${uploadMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
                {uploadMsg}
              </p>
            )}
            <p className="text-[10px] text-muted mt-2">Max file size: 5 MB. Accepted: JPG, PNG, WebP.</p>
          </div>

          {/* Advocate Verification Section */}
          {user?.role === 'advocate' && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-default">{t('advocateVerification')}</p>
                <div className={`px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-wider ${user?.isVerified ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                  {user?.isVerified ? 'Verified' : 'Pending Verification'}
                </div>
              </div>

              {!user?.isVerified && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl mb-4">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    To appear in the advocates directory, please upload a clear, legible picture of your State Bar Council ID for Admin verification.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3">
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
                <button
                  onClick={() => idInputRef.current?.click()}
                  className="flex-1 px-4 py-2.5 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition text-muted hover:text-default text-left truncate"
                >
                  {idProofFile ? idProofFile.name : 'Upload Bar Council ID (JPG, PNG, WebP)'}
                </button>
                <button
                  disabled={!idProofFile || uploadingId}
                  onClick={handleUploadIdProof}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-sm font-medium hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {uploadingId ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              {idUploadMsg && (
                <p className={`text-xs mt-3 font-medium ${idUploadMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
                  {idUploadMsg}
                </p>
              )}
            </div>
          )}
        </Card>
      </div>
    ),
    queries: () => (
      <div className="animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t('savedQueries')}</h2>
        </div>
        
        <div className="space-y-4">
          {recentQueries.filter(q => q.isSaved).length > 0 ? recentQueries.filter(q => q.isSaved).map(q => (
            <Card key={q._id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded">
                    {q.category || 'Chat'}
                  </span>
                  <span className="text-[10px] text-muted">{new Date(q.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm font-medium text-default truncate">
                  {q.description || q.question}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setSelectedQuery(q);
                    setModalOpen(true);
                  }}
                >
                  {t('viewDetails')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                  onClick={async () => {
                    if (window.confirm(t('deleteConfirm'))) {
                      try {
                        await deleteQuery(q._id).unwrap();
                      } catch (err) {
                        console.error("Delete query error:", err);
                      }
                    }
                  }}
                >
                  <MdDelete size={16} />
                </Button>
              </div>
            </Card>
          )) : <p className="text-muted italic text-center py-10">{t('noSavedQueries')}</p>}
        </div>
      </div>
    ),
    documents: () => (
      <div className="animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t('myDocuments')}</h2>
          <Button onClick={() => navigate('/document-generator')} size="sm">
            + {t('generateDocument')}
          </Button>
        </div>
        
        <div className="space-y-4">
          {recentDocs.length > 0 ? recentDocs.map(d => (
            <Card key={d._id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded">
                    {d.type}
                  </span>
                  <span className="text-[10px] text-muted">{new Date(d.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm font-medium text-default truncate">
                   {t('viewDetails')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setSelectedDoc(d);
                    setDocModalOpen(true);
                  }}
                >
                  {t('viewDetails')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={async () => {
                    if (window.confirm(t('deleteConfirm'))) {
                      try {
                        await deleteDocument(d._id).unwrap();
                      } catch (err) {
                        console.error("Delete document error:", err);
                      }
                    }
                  }}
                >
                  <MdDelete size={16} />
                </Button>
              </div>
            </Card>
          )) : <p className="text-muted italic text-center py-10">{t('noDocuments')}</p>}
        </div>
      </div>
    ),
    bookings: () => {
      setTimeout(() => navigate('/bookings'), 0);
      return null;
    },
    generator: () => {
      // Small delay to prevent React state collision during render
      setTimeout(() => navigate('/document-generator'), 0);
      return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden mb-6 flex items-center gap-2 text-indigo-600 font-medium"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <span>{sidebarOpen ? <MdClose size={18} /> : <MdMenu size={18} />}</span>
        <span>Menu</span>
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setSidebarOpen(false); // auto-close on mobile
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
             <div className="space-y-6">
                <Skeleton height="3rem" width="60%" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton height="100px" rounded="xl" />
                    <Skeleton height="100px" rounded="xl" />
                    <Skeleton height="100px" rounded="xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <Skeleton height="300px" rounded="xl" />
                   <Skeleton height="300px" rounded="xl" />
                </div>
             </div>
          ) : (
            PANELS[activeTab]?.()
          )}
        </div>
      </div>

      <QueryDetailModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        query={selectedQuery} 
      />

      <DocumentDetailModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        doc={selectedDoc}
      />
    </div>
  );
}
