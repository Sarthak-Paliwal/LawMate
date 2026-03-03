import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import html2pdf from 'html2pdf.js';

export default function DocumentDetailModal({ isOpen, onClose, doc }) {
  const printRef = useRef();
  const [downloading, setDownloading] = React.useState(false);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    
    setDownloading(true);
    
    try {
      const element = printRef.current;
      const opt = {
        margin:       1,
        filename:     `${doc?.type || 'Legal_Document'}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setDownloading(false);
    }
  };

  if (!isOpen || !doc) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h3 className="text-xl font-bold text-default">{doc.type}</h3>
            <p className="text-xs text-muted">Generated on {new Date(doc.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleDownloadPdf} disabled={downloading}>
              {downloading ? '⏳ Generating PDF...' : '⬇️ Download PDF'}
            </Button>
            <button onClick={onClose} className="text-muted hover:text-default text-3xl ml-2">&times;</button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-slate-100 dark:bg-slate-950 flex-1">
          <div 
            ref={printRef}
            className="bg-white text-black p-12 shadow-sm min-h-screen text-sm leading-relaxed whitespace-pre-wrap font-serif"
          >
            {doc.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
