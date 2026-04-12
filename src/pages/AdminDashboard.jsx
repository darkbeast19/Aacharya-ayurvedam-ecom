import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiPath } from '../api';
import { Save, CheckCircle, FileText, Settings, Package, ShoppingBag, MessageCircle, Truck, RotateCcw, XCircle, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('content');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Website Content
  const [homepageText, setHomepageText] = useState('Reclaim Your Balance. Rooted in 5,000 years of Ayurvedic tradition.');
  const [aboutText, setAboutText] = useState('We believe in natural healing.');

  // Policies
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('');
  const [returnExchangePolicy, setReturnExchangePolicy] = useState('');
  const [shippingPolicy, setShippingPolicy] = useState('');

  // Product Extra Info
  const [estimatedDelivery, setEstimatedDelivery] = useState('3-7 business days (Metro: 3-5 days, Others: 5-7 days)');
  const [returnExchangeInfo, setReturnExchangeInfo] = useState('Returns accepted within 7 days of delivery. Product must be unused & sealed.');
  const [cancellationRefundInfo, setCancellationRefundInfo] = useState('Cancel within 2 hours of placement. Refund processed in 5-10 business days.');
  const [additionalInfo, setAdditionalInfo] = useState('All products are GMP certified, 100% organic, and lab-tested for purity.');

  // WhatsApp Settings
  const [whatsappNumber, setWhatsappNumber] = useState('919999999999');

  // Load existing content
  useEffect(() => {
    // Homepage content
    fetch(getApiPath('/api/content/homepage'))
      .then(res => res.json())
      .then(data => {
        if (data?.headline) setHomepageText(data.headline);
        if (data?.about) setAboutText(data.about);
      }).catch(() => {});

    // Policies
    fetch(getApiPath('/api/content/policies'))
      .then(res => res.json())
      .then(data => {
        if (data?.cancellation) setCancellationPolicy(data.cancellation);
        if (data?.refund) setRefundPolicy(data.refund);
        if (data?.returnExchange) setReturnExchangePolicy(data.returnExchange);
        if (data?.shipping) setShippingPolicy(data.shipping);
      }).catch(() => {});

    // Product Extra Info
    fetch(getApiPath('/api/content/productExtraInfo'))
      .then(res => res.json())
      .then(data => {
        if (data?.estimatedDelivery) setEstimatedDelivery(data.estimatedDelivery);
        if (data?.returnExchange) setReturnExchangeInfo(data.returnExchange);
        if (data?.cancellationRefund) setCancellationRefundInfo(data.cancellationRefund);
        if (data?.additionalInfo) setAdditionalInfo(data.additionalInfo);
      }).catch(() => {});

    // Settings
    fetch(getApiPath('/api/content/settings'))
      .then(res => res.json())
      .then(data => {
        if (data?.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      }).catch(() => {});
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const saveSection = async (section, data) => {
    setSaving(true);
    try {
      const res = await fetch(getApiPath(`/api/content/${section}`), {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify({ data })
      });
      if (res.ok) {
        showMessage('✅ Saved successfully! Changes are now live.');
      } else {
        showMessage('❌ Failed to save. Please try again.');
      }
    } catch {
      showMessage('❌ Network error. Check your connection.');
    }
    setSaving(false);
  };

  const handleSaveContent = () => {
    saveSection('homepage', { headline: homepageText, about: aboutText });
  };

  const handleSavePolicies = () => {
    saveSection('policies', {
      cancellation: cancellationPolicy,
      refund: refundPolicy,
      returnExchange: returnExchangePolicy,
      shipping: shippingPolicy,
    });
  };

  const handleSaveProductInfo = () => {
    saveSection('productExtraInfo', {
      estimatedDelivery,
      returnExchange: returnExchangeInfo,
      cancellationRefund: cancellationRefundInfo,
      additionalInfo,
    });
  };

  const handleSaveSettings = () => {
    saveSection('settings', { whatsappNumber });
  };

  const tabs = [
    { key: 'content', label: 'Website Content', icon: FileText },
    { key: 'policies', label: 'Policies', icon: Shield },
    { key: 'productInfo', label: 'Product Info', icon: Package },
    { key: 'settings', label: 'Settings', icon: Settings },
    { key: 'products', label: 'Products', icon: ShoppingBag },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
  ];

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <h1>Admin Dashboard</h1>
      <p className="text-muted" style={{ marginBottom: '32px' }}>Manage your website content, policies, product info, and settings.</p>

      {/* Success/Error Message */}
      {message && (
        <div style={{
          padding: '14px 20px',
          background: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
          color: message.startsWith('✅') ? '#155724' : '#721c24',
          borderRadius: '10px',
          marginBottom: '24px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.3s ease',
        }}>
          <CheckCircle size={18} /> {message}
        </div>
      )}

      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-sidebar-menu">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  className={`admin-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <TabIcon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          <button 
            className="admin-logout-btn" 
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="admin-content glass">
          
          {/* Website Content Tab */}
          {activeTab === 'content' && (
            <div>
              <h2><FileText size={20} style={{ display: 'inline', marginRight: '8px' }} />Edit Website Text</h2>
              <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
                Update the headline and about text shown on the homepage.
              </p>
              
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
                <label>Homepage About Text</label>
                <textarea 
                  className="input-field" 
                  rows="5" 
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                />
              </div>

              <button className="btn btn-primary" onClick={handleSaveContent} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === 'policies' && (
            <div>
              <h2><Shield size={20} style={{ display: 'inline', marginRight: '8px' }} />Edit Policies</h2>
              <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
                Update your store policies. Content supports Markdown formatting (## headings, **bold**, - lists, | tables |).
              </p>
              
              <div className="input-group">
                <label><XCircle size={14} style={{ display: 'inline', marginRight: '6px' }} />Cancellation Policy</label>
                <textarea 
                  className="input-field admin-textarea" 
                  rows="10" 
                  value={cancellationPolicy}
                  onChange={(e) => setCancellationPolicy(e.target.value)}
                  placeholder="Enter your cancellation policy using Markdown format..."
                />
              </div>

              <div className="input-group">
                <label><RotateCcw size={14} style={{ display: 'inline', marginRight: '6px' }} />Refund Policy</label>
                <textarea 
                  className="input-field admin-textarea" 
                  rows="10" 
                  value={refundPolicy}
                  onChange={(e) => setRefundPolicy(e.target.value)}
                  placeholder="Enter your refund policy using Markdown format..."
                />
              </div>

              <div className="input-group">
                <label><RotateCcw size={14} style={{ display: 'inline', marginRight: '6px' }} />Return & Exchange Policy</label>
                <textarea 
                  className="input-field admin-textarea" 
                  rows="10" 
                  value={returnExchangePolicy}
                  onChange={(e) => setReturnExchangePolicy(e.target.value)}
                  placeholder="Enter your return/exchange policy using Markdown format..."
                />
              </div>

              <div className="input-group">
                <label><Truck size={14} style={{ display: 'inline', marginRight: '6px' }} />Shipping & Delivery Policy</label>
                <textarea 
                  className="input-field admin-textarea" 
                  rows="10" 
                  value={shippingPolicy}
                  onChange={(e) => setShippingPolicy(e.target.value)}
                  placeholder="Enter your shipping/delivery policy using Markdown format..."
                />
              </div>

              <button className="btn btn-primary" onClick={handleSavePolicies} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save All Policies'}
              </button>
            </div>
          )}

          {/* Product Extra Info Tab */}
          {activeTab === 'productInfo' && (
            <div>
              <h2><Package size={20} style={{ display: 'inline', marginRight: '8px' }} />Product Page Info</h2>
              <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
                This information is displayed below every product detail page. Update delivery times, return info, etc.
              </p>
              
              <div className="input-group">
                <label><Truck size={14} style={{ display: 'inline', marginRight: '6px' }} />Estimated Delivery Time</label>
                <textarea 
                  className="input-field" 
                  rows="2" 
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  placeholder="e.g., 3-7 business days"
                />
              </div>

              <div className="input-group">
                <label><RotateCcw size={14} style={{ display: 'inline', marginRight: '6px' }} />Return & Exchange Info</label>
                <textarea 
                  className="input-field" 
                  rows="2" 
                  value={returnExchangeInfo}
                  onChange={(e) => setReturnExchangeInfo(e.target.value)}
                  placeholder="e.g., Returns accepted within 7 days..."
                />
              </div>

              <div className="input-group">
                <label><XCircle size={14} style={{ display: 'inline', marginRight: '6px' }} />Cancellation & Refund Info</label>
                <textarea 
                  className="input-field" 
                  rows="2" 
                  value={cancellationRefundInfo}
                  onChange={(e) => setCancellationRefundInfo(e.target.value)}
                  placeholder="e.g., Cancel within 2 hours of placement..."
                />
              </div>

              <div className="input-group">
                <label><Shield size={14} style={{ display: 'inline', marginRight: '6px' }} />Additional Details / Quality Assurance</label>
                <textarea 
                  className="input-field" 
                  rows="2" 
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g., GMP certified, 100% organic..."
                />
              </div>

              <button className="btn btn-primary" onClick={handleSaveProductInfo} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Product Info'}
              </button>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2><Settings size={20} style={{ display: 'inline', marginRight: '8px' }} />Store Settings</h2>
              <p className="text-muted text-sm" style={{ marginBottom: '24px' }}>
                Configure WhatsApp order settings and other store preferences.
              </p>
              
              <div className="settings-card">
                <div className="settings-card-header">
                  <MessageCircle size={20} style={{ color: '#25D366' }} />
                  <h3>WhatsApp Order Settings</h3>
                </div>
                <div className="input-group">
                  <label>WhatsApp Phone Number (with country code, no + sign)</label>
                  <input 
                    type="text"
                    className="input-field" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g., 919876543210"
                  />
                  <span className="text-sm text-muted" style={{ marginTop: '4px', display: 'block' }}>
                    Format: Country code + number. Example: 91 for India + 10-digit number = 919876543210
                  </span>
                </div>
                <div style={{ padding: '12px 16px', background: 'rgba(37, 211, 102, 0.08)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                  💡 This number will be used for the WhatsApp Order buttons on the homepage, product pages, and checkout page.
                </div>
              </div>

              <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={handleSaveSettings} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <h2>Manage Products</h2>
              <p className="text-muted">Product list and editor will appear here.</p>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2>Customer Orders</h2>
              <p className="text-muted">Order tracking and status updates will appear here.</p>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .admin-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          align-items: start;
        }
        .admin-sidebar {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: sticky;
          top: 100px;
          height: calc(100vh - 140px);
        }
        .admin-sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border: none;
          background: transparent;
          color: #ef4444;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
          font-family: var(--font-family);
          border-radius: var(--radius-sm);
          margin-top: 24px;
        }
        .admin-logout-btn:hover {
          background: #fef2f2;
        }
        .admin-tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border: 2px solid transparent;
          border-radius: var(--radius-sm);
          background: var(--color-surface);
          color: var(--color-text);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
          font-family: var(--font-family);
        }
        .admin-tab-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        .admin-tab-btn.active {
          background: var(--color-primary);
          color: #fff;
          border-color: var(--color-primary);
          box-shadow: var(--shadow-sm);
        }
        .admin-content {
          padding: 32px;
          border-radius: var(--radius-md);
          min-height: 500px;
        }
        .admin-content h2 {
          margin-bottom: 8px;
        }
        .admin-textarea {
          font-family: 'Courier New', monospace;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .settings-card {
          padding: 24px;
          background: var(--color-surface);
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
        }
        .settings-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .settings-card-header h3 {
          margin: 0;
          font-size: 1.05rem;
        }

        @media (max-width: 768px) {
          .admin-layout {
            grid-template-columns: 1fr;
          }
          .admin-sidebar {
            position: static;
            flex-direction: row;
            overflow-x: auto;
            gap: 6px;
            height: auto;
          }
          .admin-sidebar-menu {
            flex-direction: row;
            gap: 6px;
          }
          .admin-logout-btn {
            margin-top: 0;
            padding: 10px 14px;
          }
          .admin-logout-btn span { display: none; }
          .admin-tab-btn {
            white-space: nowrap;
            padding: 10px 14px;
            font-size: 0.82rem;
          }
          .admin-tab-btn span { display: none; }
          .admin-content { padding: 24px; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
