import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import React, { useState, useEffect, useMemo } from 'react';
import { IoSearch } from 'react-icons/io5';
import { useGetAdvocatesQuery } from '../store/services/lawmateApi';

const TypewriterText = ({ text, delay = 80, onComplete, start = true, textClassName = "" }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      const pause = setTimeout(onComplete, 500);
      return () => clearTimeout(pause);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, delay, text, start]);

  return (
    <span className="relative inline-block">
      <span className={textClassName}>{displayText}</span>
      {start && currentIndex < text.length && (
        <span className="inline-block w-[3px] h-[0.9em] bg-indigo-600 dark:bg-indigo-400 ml-1 animate-pulse" style={{ verticalAlign: 'middle' }}></span>
      )}
    </span>
  );
};

export default function Home() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const CATEGORIES = [
    { id: 'traffic', dbCat: 'Traffic Law', label: t('catTraffic'), icon: '🚦', desc: t('catTrafficDesc') },
    { id: 'property', dbCat: 'Land & Property', label: t('catProperty'), icon: '🏠', desc: t('catPropertyDesc') },
    { id: 'criminal', dbCat: 'Criminal Defense', label: t('catCriminal'), icon: '⚖️', desc: t('catCriminalDesc') },
    { id: 'family', dbCat: 'Family Law', label: t('catFamily'), icon: '👨‍👩‍👧', desc: t('catFamilyDesc') },
    { id: 'labor', dbCat: 'Employment', label: t('catLabor'), icon: '💼', desc: t('catLaborDesc') },
    { id: 'consumer', dbCat: 'Consumer Rights', label: t('catConsumer'), icon: '🛒', desc: t('catConsumerDesc') },
    { id: 'constitutional', dbCat: 'Constitution', label: t('catConstitutional'), icon: '🇮🇳', desc: t('catConstitutionalDesc') },
    { id: 'business', dbCat: 'Business Law', label: t('catBusiness'), icon: '🏢', desc: t('catBusinessDesc') },
    { id: 'cyber', dbCat: 'Cyber Law', label: t('catCyber'), icon: '💻', desc: t('catCyberDesc') },
    { id: 'health', dbCat: 'Health & Medical', label: t('catHealth'), icon: '🏥', desc: t('catHealthDesc') },
    { id: 'education', dbCat: 'Education Law', label: t('catEducation'), icon: '🎓', desc: t('catEducationDesc') },
    { id: 'humanrights', dbCat: 'Human Rights', label: t('catHumanRights'), icon: '🤝', desc: t('catHumanRightsDesc') },
  ];

  const [startSecondLine, setStartSecondLine] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [heroQuery, setHeroQuery] = useState('');
  const [typingSpeed, setTypingSpeed] = useState(100);

  const PLACEHOLDERS = [
    t('placeholder1'),
    t('placeholder2'),
    t('placeholder3'),
    t('placeholder4'),
    t('placeholder5'),
    t('placeholder6')
  ];

  // Reset typing animations when the language changes
  useEffect(() => {
    setStartSecondLine(false);
    setCurrentPlaceholder('');
    setIsDeleting(false);
    setLoopNum(0);
    setTypingSpeed(100);
  }, [lang]);

  useEffect(() => {
    let timer;
    const handleTyping = () => {
      const i = loopNum % PLACEHOLDERS.length;
      const fullText = PLACEHOLDERS[i] || ''; // fallback in case t() is empty

      setCurrentPlaceholder(
        isDeleting 
          ? fullText.substring(0, currentPlaceholder.length - 1)
          : fullText.substring(0, currentPlaceholder.length + 1)
      );

      setTypingSpeed(isDeleting ? 40 : 80);

      if (!isDeleting && currentPlaceholder === fullText) {
        setTypingSpeed(2000); // Wait at end
        setIsDeleting(true);
      } else if (isDeleting && currentPlaceholder === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Wait before next
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentPlaceholder, isDeleting, loopNum, typingSpeed]);

  // Shared cache with the Advocates page — no extra network request if already visited
  // We use useMemo so the object reference doesn't change every 40ms during the typewriter text render
  const queryParams = useMemo(() => ({ sortBy: 'score' }), []);
  const { data: allAdvocates = [], isLoading: loadingAdvocates } = useGetAdvocatesQuery(queryParams);
  const topAdvocates = allAdvocates.slice(0, 3);


  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden min-h-[85vh] flex items-center">
        {/* Advanced Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[120px] animate-drift -z-10"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px] animate-drift -z-10" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-[20%] right-[15%] w-[20%] h-[20%] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px] animate-glow -z-10"></div>

        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <div className="inline-block py-1.5 px-4 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-fadeInUp">
            Verified Legal Guidance • Real-Time Assistance
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2] mb-8 animate-fadeInUp">
            <span className="block min-h-[1.2em]">
              <TypewriterText 
                key={`line1-${lang}`}
                text={t('heroLine1')} 
                delay={60} 
                onComplete={() => setStartSecondLine(true)} 
              />
            </span>
            <span className="block min-h-[1.2em]">
              <TypewriterText 
                key={`line2-${lang}`}
                text={t('heroLine2')} 
                delay={50} 
                start={startSecondLine} 
                textClassName="hero-gradient-text drop-shadow-sm"
              />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            {t('heroDesc')}
          </p>

          <div className="max-w-2xl mx-auto glass-card p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex-1 flex items-center px-4 gap-4">
              <IoSearch className="text-2xl opacity-70" />
              <input 
                type="text" 
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={currentPlaceholder} 
                className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white py-4 text-base placeholder:text-slate-400 dark:placeholder:text-slate-500"
                onKeyPress={(e) => e.key === 'Enter' && navigate(heroQuery.trim() ? `/legal-query?q=${encodeURIComponent(heroQuery.trim())}` : '/legal-query')}
              />
            </div>
            <Button 
              size="lg" 
              className="sm:w-auto w-full rounded-xl px-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
              onClick={() => navigate(heroQuery.trim() ? `/legal-query?q=${encodeURIComponent(heroQuery.trim())}` : '/legal-query')}
            >
              {t('askLawMate')}
            </Button>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Button 
               variant="primary" 
               size="lg" 
               className="rounded-xl px-10 py-4 shadow-xl shadow-indigo-600/10"
               onClick={() => navigate('/legal-query')}
            >
              {t('startLegalQuery')}
            </Button>
            <Button 
               variant="ghost" 
               size="lg" 
               className="rounded-xl border border-slate-200 dark:border-slate-800 px-10 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
               onClick={() => navigate('/advocates')}
            >
              {t('browseAdvocates')}
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-default mb-4">{t('whatNeedHelpWith')}</h2>
          <p className="text-muted max-w-xl mx-auto text-sm">{t('selectCategoryDesc')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <Card 
              key={cat.id} 
              hover={true} 
              className="group cursor-pointer p-8 relative overflow-hidden h-full border-slate-200 dark:border-slate-800"
              onClick={() => navigate(`/legal-acts?category=${cat.dbCat}`)}
            >
              {/* Hover Glow */}
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity text-5xl grayscale group-hover:grayscale-0">
                {cat.icon}
              </div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="bg-indigo-50 dark:bg-indigo-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-default mb-2 group-hover:text-indigo-600 transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-indigo-600 uppercase tracking-widest gap-1 group-hover:gap-2 transition-all">
                   Browse &rarr;
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= Top Advocates Preview ================= */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">Expert Marketplace</div>
            <h2 className="text-3xl font-bold text-default mb-4">{t('topAdvocatesTitle')}</h2>
            <p className="text-muted text-sm">{t('topAdvocatesDesc')}</p>
          </div>
          <Button 
             variant="ghost" 
             className="text-indigo-600 hover:gap-3 transition-all p-0"
             onClick={() => navigate('/advocates')}
          >
            {t('browseAdvocates')} &rarr;
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingAdvocates ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-50 dark:bg-slate-800/50 rounded-2xl animate-pulse" />)
          ) : topAdvocates.length > 0 ? (
            topAdvocates.map((adv) => (
              <Card key={adv._id} className="p-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between group hover:border-indigo-200 transition-all">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                       {adv.user?.name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-default group-hover:text-indigo-600 transition-colors">{adv.user?.name}</h4>
                      <div className="flex text-amber-500 text-[10px] items-center gap-1">
                        ★ <span className="font-bold">{adv.rating || 0}</span>
                         <span className="text-muted">({adv.reviewCount || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted line-clamp-2 mb-4 leading-relaxed italic">
                    "{adv.bio || 'Experienced legal professional dedicated to citizen empowerment.'}"
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {adv.specialization?.slice(0, 2).map(s => (
                       <span key={s} className="text-[9px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
                          {s}
                       </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
                   <span className="text-muted uppercase tracking-wider font-semibold">{adv.experience}Yrs Exp.</span>
                   <span className="text-indigo-600 font-bold">₹{adv.hourlyRate}/Hr</span>
                </div>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-muted text-sm italic py-10">{t('noAdvocates')}</p>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 border-y border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
           <h2 className="text-3xl font-bold text-default mb-16 underline decoration-indigo-200 decoration-4 underline-offset-8">
             {t('howItWorksTitle')}
           </h2>

           <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Connector Lines (Desktop Only) */}
             <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-slate-200 dark:bg-slate-700 -z-10"></div>

              <div className="space-y-4">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl mx-auto border-4 border-slate-50 dark:border-slate-900">
                  1
                </div>
                <h4 className="text-xl font-bold text-default">{t('step1Title')}</h4>
                <p className="text-sm text-muted">{t('step1Desc')}</p>
              </div>

              <div className="space-y-4">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl mx-auto border-4 border-slate-50 dark:border-slate-900">
                  2
                </div>
                <h4 className="text-xl font-bold text-default">{t('step2Title')}</h4>
                <p className="text-sm text-muted">{t('step2Desc')}</p>
              </div>

              <div className="space-y-4">
                <div className="w-20 h-20 bg-white dark:bg-slate-800 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold shadow-xl mx-auto border-4 border-slate-50 dark:border-slate-900">
                  3
                </div>
                <h4 className="text-xl font-bold text-default">{t('step3Title')}</h4>
                <p className="text-sm text-muted">{t('step3Desc')}</p>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold text-default mb-12">{t('builtForCitizen')}</h2>
        <div className="grid sm:grid-cols-2 gap-8 text-left">
           <div className="flex gap-4 p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/30">
               <span className="text-3xl">📚</span>
              <div>
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">{t('govVerified')}</h4>
                <p className="text-sm text-indigo-800/70 dark:text-indigo-300/70">{t('govVerifiedDesc')}</p>
              </div>
           </div>
           <div className="flex gap-4 p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/30">
               <span className="text-3xl">🇮🇳</span>
              <div>
                <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-1">{t('trulyInclusive')}</h4>
                <p className="text-sm text-indigo-800/70 dark:text-indigo-300/70">{t('trulyInclusiveDesc')}</p>
              </div>
           </div>
        </div>

        <div className="mt-20 p-10 bg-indigo-600 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden">
           {/* Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
           
           <h3 className="text-3xl font-bold mb-4 relative z-10">{t('ctaTitle')}</h3>
           <p className="text-indigo-100 mb-8 max-w-md mx-auto relative z-10">{t('ctaDesc')}</p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 border-none"
                onClick={() => navigate('/register')}
              >
                {t('createFreeAccount')}
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="text-white hover:bg-indigo-700 bg-indigo-700/50 border border-indigo-400/50"
                onClick={() => navigate('/legal-acts')}
              >
                {t('legalActs')}
              </Button>
           </div>
        </div>
      </section>

    </div>
  );
}

