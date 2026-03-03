import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { useReactToPrint } from 'react-to-print';
import { MdDescription, MdCheckCircle, MdWarning, MdGavel } from 'react-icons/md';
import {
  useGetDocumentTemplatesQuery,
  useGenerateDocumentMutation,
} from '../store/services/lawmateApi';

export default function DocumentGenerator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedDoc, setGeneratedDoc] = useState(null);

  const { t } = useLanguage();
  const printRef = useRef();

  // RTK Query: templates cached after first load
  const { data: templates = [] } = useGetDocumentTemplatesQuery();
  const [generateDocument, { isLoading: loading }] = useGenerateDocumentMutation();

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({}); // Reset form
    setStep(2);
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    try {
      const result = await generateDocument({
        templateId: selectedTemplate.id,
        data: formData
      }).unwrap();
      setGeneratedDoc(result.document);
      setStep(3);
    } catch (error) {
      console.error("Generation failed", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: generatedDoc?.type || 'Legal Document',
  });

  /* -------------------- Render Steps -------------------- */

  // Step 1: Select Template
  if (step === 1) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-default mb-2">Legal Document Generator</h1>
        <p className="text-muted mb-8">Select a template to get started.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(tmpl => (
            <Card 
              key={tmpl.id} 
              className="cursor-pointer hover:border-indigo-400 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50"
              onClick={() => handleTemplateSelect(tmpl)}
            >
              <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-2xl mb-4">
                <MdDescription className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-semibold text-default text-lg mb-2">{tmpl.name}</h3>
              <p className="text-sm text-muted">{tmpl.description}</p>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Fill Details
  if (step === 2 && selectedTemplate) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button onClick={() => setStep(1)} className="text-sm text-indigo-500 hover:underline mb-6 flex items-center gap-1">
          <span>&larr;</span> Back to Templates
        </button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-default mb-6">
              Fill Details for {selectedTemplate.name}
            </h2>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                {selectedTemplate.fields.map(field => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-default mb-1">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="input w-full h-32"
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={`Enter ${field.label}...`}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <Button onClick={handleGenerate} loading={loading} className="w-full md:w-auto">
                  {loading ? 'Generating...' : 'Generate Preview'}
                </Button>
              </div>
            </div>
          </div>

          {/* Requirements Sidebar */}
          <div className="space-y-6">
            <Card className="bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-4 flex items-center gap-2">
                <MdGavel size={20} /> Legal Requirements
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Stamp Paper:</span>
                  <span className="font-bold text-default">{selectedTemplate.requirements?.stampPaper || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Notary Required:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${selectedTemplate.requirements?.notaryRequired ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {selectedTemplate.requirements?.notaryRequired ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted">Witnesses:</span>
                  <span className="font-bold text-default">{selectedTemplate.requirements?.witnesses || 0}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-100 dark:border-indigo-800/50">
                 <p className="text-[11px] text-indigo-800/70 dark:text-indigo-300/70 leading-relaxed">
                   <strong>Tip:</strong> Ensure all details match your official Government IDs (Aadhaar/PAN) to avoid rejection.
                 </p>
              </div>
            </Card>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
               <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Quick Checklist</h4>
                <ul className="text-xs space-y-2 text-default">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Fill all required fields accurately
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Review preview for typos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Print on appropriate stamp paper
                  </li>
                  {selectedTemplate.requirements?.notaryRequired && (
                    <li className="flex items-center gap-2">
                      <span className="text-amber-500">⚠</span> Visit a notary after printing
                    </li>
                  )}
                </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Step 3: Preview & Print
  if (step === 3 && generatedDoc) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button onClick={() => setStep(2)} className="text-sm text-indigo-500 hover:underline">
            &larr; Edit Details
          </button>
          <div className="flex flex-wrap gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <MdCheckCircle className="text-emerald-600 dark:text-emerald-400" size={18} /> {t('savedToDashboard')}
              </span>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="primary">
              {t('viewInDashboard')}
            </Button>
            <Button onClick={() => setStep(1)} variant="secondary">
              {t('createNew')}
            </Button>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-900/50 p-8 rounded-xl overflow-auto border border-slate-200 dark:border-slate-800">
          <div 
            ref={printRef}
            className="bg-white text-black p-6 sm:p-12 max-w-[210mm] mx-auto min-h-[297mm] shadow-lg text-sm leading-relaxed whitespace-pre-wrap font-serif"
          >
            {generatedDoc.content}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
