import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../api/auth';

const commonPasswords = ['password', '12345678', 'qwerty123', 'letmein123'];

function getPasswordChecks(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    common: password && !commonPasswords.includes(password.toLowerCase()),
  };
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checks = useMemo(() => getPasswordChecks(form.password), [form.password]);
  const isStrong = Object.values(checks).every(Boolean);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!isStrong) {
      setError('Please choose a stronger password.');
      return;
    }

    setLoading(true);
    try {
      await signUp(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">Get started</p>
          <h1>Create account</h1>
          <p>Build better money habits in minutes.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input type="text" name="username" value={form.username} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          <div className="password-rules">
            <p>Strong password requirements:</p>
            <ul>
              <li className={checks.length ? 'valid' : ''}>At least 8 characters</li>
              <li className={checks.upper ? 'valid' : ''}>1 uppercase letter</li>
              <li className={checks.lower ? 'valid' : ''}>1 lowercase letter</li>
              <li className={checks.number ? 'valid' : ''}>1 number</li>
              <li className={checks.symbol ? 'valid' : ''}>1 symbol</li>
              <li className={checks.common ? 'valid' : ''}>Not a common password</li>
            </ul>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
