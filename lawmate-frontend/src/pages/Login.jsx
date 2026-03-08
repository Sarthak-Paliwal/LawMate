import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errors = {};
    if (!email) errors.email = t('emailRequired') || 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = t('emailInvalid') || 'Email is invalid';
    
    if (!password) errors.password = t('passwordRequired') || 'Password is required';
    else if (password.length < 6) errors.password = t('passwordTooShort') || 'Password must be at least 6 characters';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      if (err.status === 403 && err.data?.message?.includes('verify')) {
        toast.error('Account not fully verified. Please refer to your registration confirmation.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center relative">

      {/* Soft Background Accent */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40"></div>

      <div className="relative w-full max-w-md card shadow-sm p-8">

        <h2 className="text-2xl font-semibold text-default mb-2">
          {t('login')}
        </h2>

        <p className="text-sm text-muted mb-6">
          Access your LawMate account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
            className={fieldErrors.email ? 'field-error' : ''}
            required
          />

          <Input
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password}
            className={fieldErrors.password ? 'field-error' : ''}
            required
          />

          <Button
            type="submit"
            loading={submitting}
            className="w-full"
          >
            {t('login')}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted text-center">
          {t('dontHaveAccount')}{' '}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
