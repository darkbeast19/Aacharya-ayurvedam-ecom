import { useState, useEffect } from 'react';
import { getApiPath } from '../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [homepageText, setHomepageText] = useState('Reclaim Your Balance. Rooted in 5,000 years of Ayurvedic tradition.');
  const [aboutText, setAboutText] = useState('We believe in natural healing.');
  const [message, setMessage] = useState('');

  // Load existing content
  useEffect(() => {
    fetch(getApiPath('/api/content/homepage'))
      .then(res => res.json())
      .then(data => {
        if(data && data.headline) setHomepageText(data.headline);
        if(data && data.about) setAboutText(data.about);
      }).catch(err => console.log(err));
  }, []);

  const handleSaveContent = async () => {
    try {
      const res = await fetch(getApiPath('/api/content/homepage'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            headline: homepageText,
            about: aboutText,
          }
        })
      });
      if(res.ok) {
        setMessage('Content saved successfully! It is now live.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch(err) {
      setMessage('Failed to save.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <h1>Admin Dashboard</h1>
      <p className="text-muted mb-4">Manage your products, view orders, and edit website text.</p>

      <div className="admin-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '48px' }}>
        <aside>
          <ul className="admin-nav" style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <button 
                className={`btn full-width ${activeTab === 'content' ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => setActiveTab('content')}
                style={{ marginBottom: '12px' }}
              >
                Website Content
              </button>
            </li>
            <li>
              <button 
                className={`btn full-width ${activeTab === 'products' ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => setActiveTab('products')}
                style={{ marginBottom: '12px' }}
              >
                Products
              </button>
            </li>
            <li>
              <button 
                className={`btn full-width ${activeTab === 'orders' ? 'btn-primary' : 'btn-outline'}`} 
                onClick={() => setActiveTab('orders')}
                style={{ marginBottom: '12px' }}
              >
                Orders
              </button>
            </li>
          </ul>
        </aside>

        <main className="admin-content card glass" style={{ padding: '32px', borderRadius: '16px' }}>
          {activeTab === 'content' && (
            <div>
              <h2>Edit Website Text</h2>
              {message && <div style={{ padding: '12px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '16px' }}>{message}</div>}
              
              <div className="input-group">
                <label>Homepage Main Headline (Hero Section)</label>
                <textarea 
                  className="input-field" 
                  rows="3" 
                  value={homepageText}
                  onChange={(e) => setHomepageText(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>About Us Page Text</label>
                <textarea 
                  className="input-field" 
                  rows="5" 
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                />
              </div>

              <button className="btn btn-primary mt-4" onClick={handleSaveContent}>Save Changes</button>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2>Manage Products</h2>
              <p>Product list and editor will appear here.</p>
              {/* Product table mapped from backend */}
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2>Customer Orders</h2>
              <p>Order tracking and status updates will appear here.</p>
              {/* Order table mapped from backend */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
