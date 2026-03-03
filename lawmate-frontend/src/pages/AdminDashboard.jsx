import React from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useGetPendingAdvocatesQuery, useVerifyAdvocateMutation } from '../store/services/lawmateApi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: pendingAdvocates = [], isLoading: loading, error: fetchError } = useGetPendingAdvocatesQuery();
  const [verifyAdvocate] = useVerifyAdvocateMutation();
  const error = fetchError ? 'Failed to fetch pending advocates.' : '';

  const handleVerify = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this advocate?`)) return;
    try {
      await verifyAdvocate({ id, action }).unwrap();
    } catch {
      alert(`Failed to ${action} advocate.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-8">Manage users, advocates, and platform settings.</p>

      <section>
        <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
          <span>🛡️</span> Pending Advocate Verifications
        </h2>

        {loading ? (
          <p className="text-muted">Loading pending applications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : pendingAdvocates.length === 0 ? (
          <Card className="p-8 text-center text-muted">
            All caught up! No pending advocates to verify.
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingAdvocates.map(adv => (
              <Card key={adv._id} className="p-6 flex flex-col md:flex-row gap-6 md:items-start justify-between">
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-default">{adv.name}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Pending Approval</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-default mt-4">
                    <div>
                      <p className="text-muted text-[10px] uppercase font-semibold">Email</p>
                      <p>{adv.email}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase font-semibold">Phone</p>
                      <p>{adv.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase font-semibold">Bar Council ID</p>
                      <p className="font-mono text-indigo-600 dark:text-indigo-400">{adv.barCouncilId || 'Not Provided'}</p>
                    </div>
                    <div>
                      <p className="text-muted text-[10px] uppercase font-semibold">State / Year</p>
                      <p>{adv.stateBarCouncil || 'N/A'} - {adv.enrollmentYear || 'N/A'}</p>
                    </div>
                  </div>

                  {adv.idProofDocumentUrl ? (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-muted text-[10px] uppercase font-semibold mb-2">ID Proof Document</p>
                      <a 
                        href={adv.idProofDocumentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                      >
                        📄 View Uploaded Document
                      </a>
                      <img 
                        src={adv.idProofDocumentUrl} 
                        alt="ID Proof" 
                        className="mt-3 max-h-48 rounded-lg border border-slate-200 dark:border-slate-700 object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-amber-600 text-sm font-medium">⚠️ User has not uploaded an ID proof yet.</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:w-48">
                  <Button 
                    onClick={() => handleVerify(adv._id, 'approve')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Approve Advocate
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleVerify(adv._id, 'reject')}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                  >
                    Reject & Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
