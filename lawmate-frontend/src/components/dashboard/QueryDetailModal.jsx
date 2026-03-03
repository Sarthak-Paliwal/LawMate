import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function QueryDetailModal({ isOpen, onClose, query }) {
  if (!isOpen || !query) return null;

  const { decision = {}, aiAnalysis = {}, description, question, createdAt, category, subCategory } = query;
  const { legalNature, severity, recommendedAction = [], relevantActs = [], estimatedTime, estimatedCost } = decision;

  const severityColor = {
    Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Critical: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200',
  }[severity] || 'bg-slate-100 text-slate-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-bold text-default">Query Details</h3>
            <p className="text-xs text-muted">Created on {new Date(createdAt).toLocaleString()}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-default text-2xl">&times;</button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <section>
             <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-2">User Query</h4>
             <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
               <p className="text-sm text-default italic">"{description || question}"</p>
             </div>
          </section>

          {legalNature ? (
            <>
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-1">Legal Nature</h4>
                  <p className="text-sm font-semibold">{legalNature}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${severityColor}`}>
                  {severity} Severity
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700">
                  <span className="block text-[10px] uppercase font-bold text-muted mb-1">Est. Time</span>
                  <span className="text-sm font-bold">{estimatedTime || 'N/A'}</span>
                </Card>
                <Card className="p-3 bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700">
                  <span className="block text-[10px] uppercase font-bold text-muted mb-1">Est. Cost</span>
                  <span className="text-sm font-bold">{estimatedCost || 'N/A'}</span>
                </Card>
              </div>

              <section className="space-y-3">
                <h4 className="text-sm font-bold text-default">Relevant Acts</h4>
                <div className="flex flex-wrap gap-2">
                  {relevantActs.map((act, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-border">
                      {act}
                    </span>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-bold text-default">Recommended Actions</h4>
                <ul className="space-y-2">
                  {recommendedAction.map((action, i) => (
                    <li key={i} className="text-xs text-default flex items-start gap-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
             <section className="space-y-3">
                <h4 className="text-sm font-bold text-default">AI Response</h4>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm leading-relaxed">
                  {query.response || aiAnalysis.legalInsight}
                </div>
             </section>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
}
