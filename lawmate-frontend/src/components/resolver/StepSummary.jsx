import React from 'react';

export default function StepSummary({ data }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-default mb-6">
        Review Your Query
      </h2>

      <div className="space-y-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">
            Category
          </h3>
          <p className="text-lg font-medium text-default capitalize">
            {data.category}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">
            Specific Issue
          </h3>
          <p className="text-lg font-medium text-default capitalize">
            {data.subcategory}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">
            Description
          </h3>
          <p className="text-default whitespace-pre-wrap leading-relaxed">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}
