import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if(res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid login');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the backend is running.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
      <div className="glass login-card" style={{ padding: '40px', borderRadius: '16px', maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center" style={{ marginBottom: '24px' }}>Admin Login</h2>
        {error && <div style={{ padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              required
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary full-width" style={{ marginTop: '16px', width: '100%' }}>
            Secure Login
          </button>
          
          <p className="text-center text-muted" style={{ marginTop: '24px', fontSize: '12px' }}>
            <span style={{ fontWeight: 'bold' }}>Default Test Admin:</span><br/>
            Email: admin@example.com<br/>
            Password: password
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
