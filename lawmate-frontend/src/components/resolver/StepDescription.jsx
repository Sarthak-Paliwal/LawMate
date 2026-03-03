import React from 'react';

export default function StepDescription({ value, onChange }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-default mb-4">
        Describe Your Situation
      </h2>
      <p className="text-muted mb-6">
        Please provide as much detail as possible. Do not include sensitive personal information like bank account numbers or passwords.
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. I was involved in a car accident last week..."
        className="w-full h-48 input resize-none text-base leading-relaxed p-4"
      />

      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>Min 20 characters</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  );
}
