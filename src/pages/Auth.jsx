import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, AlertCircle, Loader } from 'lucide-react';
import { getApiPath } from '../api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  // Redirect to where they came from, or /profile as default
  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { name, email, password };

      const res = await fetch(getApiPath(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user info in context + localStorage
        login({ ...data });
        localStorage.setItem('token', data.token);
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
      <div className="glass login-card" style={{ padding: '40px', borderRadius: '24px', maxWidth: '450px', width: '100%' }}>
        <h2 className="section-title text-center" style={{ marginBottom: '8px' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-muted text-center" style={{ marginBottom: '32px', fontSize: '0.95rem' }}>
          {isLogin ? 'Sign in to your account to continue' : 'Join the Aacharya Ayurvedam community'}
        </p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: '#fff5f5', border: '1px solid #fc8181', borderRadius: '10px', marginBottom: '24px' }}>
            <AlertCircle size={18} style={{ color: '#e53e3e', flexShrink: 0 }} />
            <p style={{ color: '#c53030', fontSize: '0.9rem', margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  className="input-field"
                  style={{ paddingLeft: '48px' }}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                className="input-field"
                style={{ paddingLeft: '48px' }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="password"
                required
                className="input-field"
                style={{ paddingLeft: '48px' }}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength="6"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary full-width"
            style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={loading}
          >
            {loading ? (
              <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {isLogin ? 'Signing in...' : 'Creating account...'}</>
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="text-primary font-medium"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'var(--color-primary)' }}
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .full-width { width: 100%; }
        .mt-6 { margin-top: 24px; }
      `}</style>
    </div>
  );
};

export default Auth;
