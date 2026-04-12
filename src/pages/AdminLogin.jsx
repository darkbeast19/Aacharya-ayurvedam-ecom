import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiPath } from '../api';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in as admin, redirect to dashboard
  if (user && user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(getApiPath('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.isAdmin) {
          login(data);
          navigate('/admin');
        } else {
          setError('Unauthorized. This portal is strictly for administrators.');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <div className="admin-logo-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>Admin Portal</h2>
          <p>Sign in to manage your store</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}

        <form onSubmit={handleAdminLogin} className="admin-login-form">
          <div className="admin-input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                Secure Login <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>Aacharya Ayurvedam &copy; {new Date().getFullYear()}</p>
        </div>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f4f7f6;
          font-family: var(--font-family);
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
        }
        
        .admin-login-container {
          background: white;
          padding: 48px;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          width: 100%;
          max-width: 440px;
          animation: slideUp 0.4s ease-out;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .admin-logo-icon {
          background: rgba(30, 77, 63, 0.1);
          color: var(--color-primary);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .admin-login-header h2 {
          color: #1a1a1a;
          margin: 0 0 8px;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .admin-login-header p {
          color: #666;
          margin: 0;
          font-size: 0.95rem;
        }

        .admin-login-error {
          background: #fee2e2;
          color: #b91c1c;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 0.9rem;
          text-align: center;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-input-group {
          position: relative;
        }

        .admin-input-group .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .admin-input-group input {
          width: 100%;
          padding: 16px 16px 16px 48px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #fafafa;
        }

        .admin-input-group input:focus {
          outline: none;
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(30, 77, 63, 0.1);
        }

        .admin-login-btn {
          background: var(--color-primary);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          margin-top: 8px;
        }

        .admin-login-btn:hover:not(:disabled) {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        .admin-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .admin-login-footer {
          margin-top: 32px;
          text-align: center;
          color: #aaa;
          font-size: 0.85rem;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
