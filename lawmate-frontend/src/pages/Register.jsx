import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    barCouncilId: '',
    enrollmentYear: '',
    stateBarCouncil: ''
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!form.name) errors.name = t('nameRequired') || 'Name is required';
    if (!form.email) errors.email = t('emailRequired') || 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = t('emailInvalid') || 'Email is invalid';
    
    if (!form.password) errors.password = t('passwordRequired') || 'Password is required';
    else if (form.password.length < 6) errors.password = t('passwordTooShort') || 'Password must be at least 6 characters';
    
    if (form.role === 'advocate') {
      if (!form.barCouncilId) errors.barCouncilId = 'Bar Council ID is required';
      if (!form.enrollmentYear) errors.enrollmentYear = 'Enrollment Year is required';
      if (!form.stateBarCouncil) errors.stateBarCouncil = 'State Bar Council is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validate()) return;
    
    setSubmitting(true);

    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center relative">

      {/* Soft Background Accents */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-40"></div>

      <div className="relative w-full max-w-md card shadow-sm p-8">

        <h2 className="text-2xl font-semibold text-default mb-2">
          {t('register')}
        </h2>

        <p className="text-sm text-muted mb-6">
          Create your LawMate account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-md animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <Input
            label={t('name')}
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
            error={fieldErrors.name}
            className={fieldErrors.name ? 'field-error' : ''}
            required
          />

          <Input
            label={t('email')}
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
            error={fieldErrors.email}
            className={fieldErrors.email ? 'field-error' : ''}
            required
          />

          <Input
            label={t('password')}
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            minLength={6}
            error={fieldErrors.password}
            className={fieldErrors.password ? 'field-error' : ''}
            required
          />

          <Input
            label={t('phone')}
            type="tel"
            value={form.phone}
            onChange={(e) =>
              setForm((f) => ({ ...f, phone: e.target.value }))
            }
          />

          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-default mb-1">
              {t('role')}
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({ ...f, role: e.target.value }))
              }
              className="input bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="user">{t('user')}</option>
              <option value="advocate">{t('advocate')}</option>
            </select>
          </div>

          {form.role === 'advocate' && (
            <div className="space-y-4 p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl mt-4 animate-fadeIn">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Advocate Verification Details</p>
              
              <Input
                label="Bar Council ID"
                placeholder="e.g. D/1234/2020"
                value={form.barCouncilId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, barCouncilId: e.target.value }))
                }
                error={fieldErrors.barCouncilId}
                className={fieldErrors.barCouncilId ? 'field-error' : ''}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Enrollment Year"
                  type="number"
                  placeholder="e.g. 2020"
                  value={form.enrollmentYear}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, enrollmentYear: e.target.value }))
                  }
                  error={fieldErrors.enrollmentYear}
                  className={fieldErrors.enrollmentYear ? 'field-error' : ''}
                  required
                />
                <Input
                  label="State Bar Council"
                  placeholder="e.g. Delhi"
                  value={form.stateBarCouncil}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stateBarCouncil: e.target.value }))
                  }
                  error={fieldErrors.stateBarCouncil}
                  className={fieldErrors.stateBarCouncil ? 'field-error' : ''}
                  required
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            loading={submitting}
            className="w-full !mt-6"
          >
            {t('register')}
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted text-center">
          {t('alreadyHaveAccount')}{' '}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
