import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';
import { useLanguage } from '../i18n/LanguageContext';
import { IoSearch } from 'react-icons/io5';
import { MdMenuBook } from 'react-icons/md';
import { useGetLegalActsQuery, useGetLegalActCategoriesQuery } from '../store/services/lawmateApi';

export default function LegalActs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const { t } = useLanguage();

  const { data: categories = [] } = useGetLegalActCategoriesQuery();
  const queryParams = {};
  if (search) queryParams.search = search;
  if (category) queryParams.category = category;
  const { data: acts = [], isFetching: loading } = useGetLegalActsQuery(queryParams);

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-indigo-100 text-indigo-900 rounded-px px-0.5">{part}</mark> : part
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Filters */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-3">
            {t('legalActs')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg">
            {t('browseActsDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={t('searchActsPlaceholder')}
              className="input pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="input h-11 sm:w-48"
            value={category}
            onChange={(e) => {
              const val = e.target.value;
              setCategory(val);
              if (val) {
                setSearchParams({ ...Object.fromEntries(searchParams), category: val });
              } else {
                const newParams = Object.fromEntries(searchParams);
                delete newParams.category;
                setSearchParams(newParams);
              }
            }}
          >
            <option value="">{t('allCategories') || 'All Categories'}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 h-full space-y-4 border-slate-200 dark:border-slate-800">
              <Skeleton width="40%" height="1.25rem" rounded="full" />
              <Skeleton width="80%" height="1.5rem" />
              <div className="space-y-2">
                <Skeleton height="0.75rem" />
                <Skeleton height="0.75rem" />
                <Skeleton width="60%" height="0.75rem" />
              </div>
              <Skeleton width="100px" height="1rem" className="mt-4" />
            </div>
          ))}
        </div>
      ) : acts.length === 0 ? (
        <div className="text-center text-slate-500 py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
           <MdMenuBook className="text-5xl mb-4 mx-auto text-slate-400" />
           <p className="font-medium">{t('noActs') || 'No legal acts found matching your search.'}</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {acts.map((act) => (
            <li
              key={act._id}
              className="group card p-8 h-full flex flex-col justify-between hover:border-indigo-400 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle pattern */}
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                 <div className="text-7xl font-bold">{act.shortName || act.name.charAt(0)}</div>
              </div>

              <div className="relative z-10">
                {/* Category Badge */}
                {act.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 mb-6">
                    {act.category}
                  </span>
                )}

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 transition-colors">
                  {highlightText(act.name, search)}
                </h3>

                <div className="flex items-center text-xs font-medium text-slate-500 mb-4">
                  {act.shortName && (
                    <span className="text-indigo-600 font-bold mr-2">
                      {act.shortName}
                    </span>
                  )}
                  {act.year && <span className="opacity-60">Est. {act.year}</span>}
                </div>

                {act.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                    {highlightText(act.description, search)}
                  </p>
                )}
              </div>

              <Link
                to={`/legal-acts/${act._id}`}
                className="mt-4 flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:gap-4 transition-all"
              >
                {t('viewDetails')} &rarr;
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
