import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Button from './common/Button';
import { MdMenuBook } from 'react-icons/md';

/* -------------------- Avatar Dropdown Component -------------------- */

const AvatarDropdown = ({ user, logout, t, isMobile = false, closeMobileMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    if (closeMobileMenu) closeMobileMenu();
    navigate('/');
  };

  if (isMobile) {
    return (
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
        <div className="flex items-center gap-3 px-2 mb-4">
           {user.profileImage ? (
             <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
           ) : (
             <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
               {user.name?.charAt(0).toUpperCase()}
             </div>
           )}
           <div>
             <p className="text-sm font-bold text-default">{user.name}</p>
             <p className="text-[10px] text-muted uppercase tracking-tighter">{user.role}</p>
           </div>
        </div>
        <div className="space-y-1">
          {user.role === 'advocate' ? (
            <>
              <Link to="/advocate-profile" className="block px-2 py-2 text-sm text-default hover:text-indigo-600" onClick={closeMobileMenu}>{t('myProfile')}</Link>
              <Link to="/bookings" className="block px-2 py-2 text-sm text-default hover:text-indigo-600" onClick={closeMobileMenu}>{t('myBookings')}</Link>
            </>
          ) : (
            <Link to="/dashboard" className="block px-2 py-2 text-sm text-default hover:text-indigo-600" onClick={closeMobileMenu}>{t('dashboard')}</Link>
          )}
          <button onClick={handleLogout} className="block w-full text-left px-2 py-2 text-sm text-red-500 hover:text-red-600">
            {t('logout')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group focus:outline-none"
      >
        <div className="flex flex-col items-end mr-1">
          <span className="text-default text-xs font-bold leading-tight group-hover:text-indigo-600 transition">{user.name}</span>
          <span className="text-muted text-[10px] uppercase tracking-tighter">{user.role}</span>
        </div>
        {user.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:ring-2 group-hover:ring-indigo-100 transition" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:ring-2 group-hover:ring-indigo-100 transition">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-fadeInScale">
          {user.role === 'advocate' ? (
            <>
              <Link to="/advocate-profile" className="block px-4 py-2 text-sm text-default hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setIsOpen(false)}>{t('myProfile')}</Link>
              <Link to="/bookings" className="block px-4 py-2 text-sm text-default hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setIsOpen(false)}>{t('myBookings')}</Link>
            </>
          ) : (
            <Link to="/dashboard" className="block px-4 py-2 text-sm text-default hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setIsOpen(false)}>{t('dashboard')}</Link>
          )}
          <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
          <button 
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition"
          >
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
};

/* -------------------- Main Navbar Component -------------------- */

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 navbar shadow-sm backdrop-blur-md bg-white/80 dark:bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo & Navigation */}
        <div className="flex items-center gap-10">
          <Link 
            to="/" 
            className="flex items-center gap-2"
            onClick={closeMenu}
          >
            <span className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center">
              <MdMenuBook size={20} />
            </span>
            <span className="text-[22px] tracking-tight text-slate-900 dark:text-white font-black">
              Law<span className="text-indigo-600 dark:text-indigo-400 font-bold">Mate</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/" className="hover:text-indigo-600 transition">{t('home')}</Link>
            
            {(!user || user.role === 'user') ? (
              <>
                <Link to="/legal-acts" className="hover:text-indigo-600 transition">{t('shortActs')}</Link>
                <Link to="/advocates" className="hover:text-indigo-600 transition">{t('shortAdvocates')}</Link>
                <Link to="/resolve" className="hover:text-indigo-600 transition">{t('resolveQuery')}</Link>
              </>
            ) : (
              <Link to="/dashboard" className="hover:text-indigo-600 transition">{t('dashboard')}</Link>
            )}
          </nav>
        </div>

        {/* Right Section Desktop */}
        <div className="hidden md:flex items-center gap-5">
            {/* Ask LawMate Button - For Citizens/Guests */}
            {(!user || user.role === 'user') && (
              <Link to="/legal-query">
                <Button variant="primary" size="sm" className="rounded-full px-5 shadow-lg shadow-indigo-600/20">
                  {t('askLawMate')}
                </Button>
              </Link>
            )}

            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-5">
                {/* Language Toggle */}
                <button 
                  onClick={() => setLanguage(lang === 'en' ? 'hi' : 'en')}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold transition text-default border border-slate-200 dark:border-slate-700"
                >
                  {lang === 'en' ? 'HI' : 'EN'}
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
                >
                  {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </button>

                {user ? (
                  <AvatarDropdown user={user} logout={logout} t={t} />
                ) : (
                  <div className="flex items-center gap-2 ml-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="!px-3 text-xs">{t('login')}</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="primary" size="sm" className="!px-4 text-xs rounded-full">{t('register')}</Button>
                    </Link>
                  </div>
                )}
            </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-600 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

       {/* Mobile Menu */}
       <div className={`
         fixed inset-x-0 top-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 transition-all duration-300 md:hidden
         ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}
       `}>
          <div className="px-6 py-6 space-y-4">
            <Link to="/" className="block text-sm font-bold text-default" onClick={closeMenu}>{t('home')}</Link>
            
            {(!user || user.role === 'user') ? (
              <>
                <Link to="/legal-acts" className="block text-sm font-bold text-default" onClick={closeMenu}>{t('shortActs')}</Link>
                <Link to="/advocates" className="block text-sm font-bold text-default" onClick={closeMenu}>{t('shortAdvocates')}</Link>
                <Link to="/resolve" className="block text-sm font-bold text-default" onClick={closeMenu}>{t('resolveQuery')}</Link>
                <Link to="/legal-query" className="block text-sm text-indigo-600 font-bold" onClick={closeMenu}>{t('askLawMate')}</Link>
              </>
            ) : (
              <Link to="/dashboard" className="block text-sm font-bold text-default" onClick={closeMenu}>{t('dashboard')}</Link>
            )}

            {user ? (
              <AvatarDropdown user={user} logout={logout} t={t} isMobile={true} closeMobileMenu={closeMenu} />
            ) : (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                <Link to="/login" onClick={closeMenu} className="flex-1">
                  <Button variant="ghost" className="w-full justify-center text-sm">{t('login')}</Button>
                </Link>
                <Link to="/register" onClick={closeMenu} className="flex-1">
                  <Button variant="primary" className="w-full justify-center text-sm rounded-full">{t('register')}</Button>
                </Link>
              </div>
            )}
            
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4">
               <button 
                  onClick={() => setLanguage(lang === 'en' ? 'hi' : 'en')}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-bold"
               >
                 {lang === 'en' ? 'Hindi' : 'English'}
               </button>
               <button onClick={toggleTheme} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  {theme === 'light' ? '🌙' : '☀️'}
               </button>
            </div>
          </div>
       </div>
    </header>
  );
}
