import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StepCategory from '../components/resolver/StepCategory';
import StepSubcategory from '../components/resolver/StepSubcategory';
import StepDescription from '../components/resolver/StepDescription';
import StepSummary from '../components/resolver/StepSummary';
import StepResult from '../components/resolver/StepResult';
import Button from '../components/common/Button';
import { useLanguage } from '../i18n/LanguageContext';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/auth/AuthModal';

const TOTAL_STEPS = 4;

export default function QueryResolver() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [direction, setDirection] = useState('forward');

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection('forward');
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection('backward');
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!formData.category;
      case 2:
        return !!formData.subcategory;
      case 3:
        return formData.description.length >= 20;
      default:
        return true;
    }
  };

  const updateData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // user state will update via context, triggering useEffect
  };

  // Auto-submit after login
  useEffect(() => {
    if (user && pendingSubmit) {
      setPendingSubmit(false);
      submitQuery();
    }
  }, [user, pendingSubmit]);

  const submitQuery = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/queries/analyze', formData);
      setAiResult(data.data || data);
      setStep(5); // Move to Result step
    } catch (error) {
      console.error("Query Analysis Error:", error);
      alert("Failed to analyze query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setPendingSubmit(true);
      setShowAuthModal(true);
      return;
    }
    submitQuery();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepCategory
            selected={formData.category}
            onSelect={(val) => {
              updateData('category', val);
              // Auto advance
              // setTimeout(() => setStep(2), 200); 
            }}
          />
        );
      case 2:
        return (
          <StepSubcategory
            category={formData.category}
            selected={formData.subcategory}
            onSelect={(val) => {
              updateData('subcategory', val);
              // Auto advance
              // setTimeout(() => setStep(3), 200);
            }}
          />
        );
      case 3:
        return (
          <StepDescription
            value={formData.description}
            onChange={(val) => updateData('description', val)}
          />
        );
      case 4:
        return <StepSummary data={formData} />;
      case 5:
        return <StepResult result={aiResult} />;
      default:
        return null;
    }
  };

  const progress = Math.min((step / TOTAL_STEPS) * 100, 100);
  const displayStep = Math.min(step, TOTAL_STEPS);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-muted uppercase tracking-wider mb-2">
          <span>Step {displayStep} of {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="card p-6 md:p-10 shadow-lg min-h-[400px] flex flex-col justify-between relative">
        
        {/* Step Content */}
        <div 
          key={step}
          className={`flex-1 ${direction === 'forward' ? 'step-forward' : 'step-backward'}`}
        >
          {renderStep()}
        </div>

        {/* Actions */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className={step === 1 ? 'invisible' : ''}
          >
            ← Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next Step →
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              className={step === 5 ? 'hidden' : 'min-w-[120px]'}
            >
              {t('submitQuery')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
