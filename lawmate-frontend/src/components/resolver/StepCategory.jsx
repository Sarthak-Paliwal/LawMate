import React from 'react';
import Card from '../common/Card';

const CATEGORIES = [
  { id: 'criminal', label: 'Criminal Defense', icon: '⚖️' },
  { id: 'civil', label: 'Civil Litigation', icon: '📝' },
  { id: 'family', label: 'Family Law', icon: '👨‍👩‍👧‍👦' },
  { id: 'corporate', label: 'Corporate Law', icon: '🏢' },
  { id: 'property', label: 'Property Dispute', icon: '🏠' },
  { id: 'cyber', label: 'Cyber Crime', icon: '💻' },
  { id: 'labor', label: 'Labor & Employment', icon: '👷' },
  { id: 'traffic', label: 'Traffic & Motor Vehicle', icon: '🚦' },
  { id: 'consumer', label: 'Consumer Protection', icon: '🛒' },
  { id: 'constitutional', label: 'Constitutional Rights', icon: '🇮🇳' },
  { id: 'education', label: 'Education Law', icon: '🎓' },
  { id: 'health', label: 'Health & Medical', icon: '🏥' },
  { id: 'humanrights', label: 'Human Rights', icon: '🤝' },
  { id: 'tax', label: 'Tax & Revenue', icon: '💰' },
  { id: 'environment', label: 'Environment & Wildlife', icon: '🌿' },
  { id: 'realestate', label: 'Real Estate (RERA)', icon: '🏗️' },
  { id: 'other', label: 'Other Legal Issue', icon: '❓' },
];

export default function StepCategory({ onSelect, selected }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-default mb-4">
        Select a Category
      </h2>
      <p className="text-muted mb-6">
        Choose the category that best fits your legal situation.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CATEGORIES.map((cat) => (
          <Card
            key={cat.id}
            hover
            className={`cursor-pointer border transition-all ${
              selected === cat.id
                ? 'border-indigo-600 ring-2 ring-indigo-100 dark:ring-indigo-900/30 bg-indigo-50 dark:bg-indigo-900/10'
                : 'border-transparent hover:border-indigo-300'
            }`}
            onClick={() => onSelect(cat.id)}
          >
            <div className="text-center p-2">
              <div className="text-4xl mb-3">{cat.icon}</div>
              <h3 className="font-medium text-default text-sm">{cat.label}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
