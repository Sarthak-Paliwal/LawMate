import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { IoChevronForward } from 'react-icons/io5';
import { useGetLegalActByIdQuery } from '../store/services/lawmateApi';

export default function LegalActDetail() {
  const { id } = useParams();
  const [expandedSections, setExpandedSections] = useState({});
  const { t } = useLanguage();

  const { data: act, isLoading: loading } = useGetLegalActByIdQuery(id);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleAll = () => {
    const sections = act?.sections || [];
    const allExpanded = sections.every((_, i) => expandedSections[i]);

    if (allExpanded) {
      setExpandedSections({});
    } else {
      const all = {};
      sections.forEach((_, i) => { all[i] = true; });
      setExpandedSections(all);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse card p-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full mb-2" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
      </div>
    );
  }

  if (!act) {
    return (
      <div className="text-center py-16">
        <p className="text-muted mb-4">{t('noActs')}</p>
        <Link
          to="/legal-acts"
          className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {t('legalActs')}
        </Link>
      </div>
    );
  }

  const sections = act.sections || [];
  const allExpanded = sections.length > 0 && sections.every((_, i) => expandedSections[i]);

  return (
    <div className="max-w-4xl mx-auto">

      {/* Back Link */}
      <Link
        to="/legal-acts"
        className="text-sm text-indigo-600 hover:text-indigo-700 transition mb-6 inline-block"
      >
        ← {t('legalActs')}
      </Link>

      {/* Document Container */}
      <div className="card p-8 shadow-sm">

        {/* Title */}
        <h1 className="text-3xl font-semibold text-default leading-tight">
          {act.name}
        </h1>

        {/* Metadata */}
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted items-center">
          {act.category && (
            <span className={`category-badge ${act.category.toLowerCase()}`}>
              {t(act.category.toLowerCase()) || act.category}
            </span>
          )}
          {act.shortName && (
            <span className="text-indigo-600 font-medium">
              {act.shortName}
            </span>
          )}
          {act.year && (
            <span>
              {t('year')}: {act.year}
            </span>
          )}
        </div>

        {/* Description */}
        {act.description && (
          <p className="mt-6 text-muted leading-relaxed">
            {act.description}
          </p>
        )}

        {/* Sections Header */}
        <div className="mt-10 mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-default">
            {t('sections')} ({sections.length})
          </h2>

          {sections.length > 0 && (
            <button className="toggle-all-btn" onClick={toggleAll}>
              {allExpanded ? t('collapseAll') : t('expandAll')}
            </button>
          )}
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-3">
          {sections.map((sec, i) => (
            <div key={i} className="collapsible-section">
              <button
                className="collapsible-header"
                onClick={() => toggleSection(i)}
              >
                <div>
                  <span className="text-indigo-600 font-semibold">
                    {t('sectionLabel')} {sec.number}
                  </span>
                  {sec.title && (
                    <span className="text-default font-medium ml-2">
                      - {sec.title}
                    </span>
                  )}
                </div>
                <span className={`collapsible-arrow ${expandedSections[i] ? 'expanded' : ''}`}>
                  <IoChevronForward size={14} />
                </span>
              </button>

              {expandedSections[i] && (
                <div className="collapsible-body">
                  {sec.content}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
