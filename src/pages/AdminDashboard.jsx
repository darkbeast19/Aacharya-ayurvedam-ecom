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

  // Products
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

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

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch(getApiPath('/api/products'));
      const data = await res.json();
      setProducts(data);
    } catch {
      showMessage('❌ Failed to fetch products');
    }
    setIsLoadingProducts(false);
  };

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
  }, [activeTab]);

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

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const isNew = !editingProduct._id;
      const url = isNew ? '/api/products' : `/api/products/${editingProduct._id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(getApiPath(url), {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`
        },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        showMessage('✅ Product saved successfully!');
        setEditingProduct(null);
        fetchProducts();
      } else {
        const err = await res.json();
        showMessage(`❌ Failed to save: ${err.message}`);
      }
    } catch {
      showMessage('❌ Network error. Check your connection.');
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(getApiPath(`/api/products/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        showMessage('✅ Product deleted.');
        fetchProducts();
      } else {
        showMessage('❌ Failed to delete.');
      }
    } catch {
      showMessage('❌ Network error.');
    }
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ margin: 0 }}><ShoppingBag size={20} style={{ display: 'inline', marginRight: '8px' }} />Manage Products</h2>
                  <p className="text-muted text-sm">Add, edit, or remove store products.</p>
                </div>
                {!editingProduct && (
                  <button className="btn btn-primary" onClick={() => setEditingProduct({ name: '', price: '', category: '', image: '', description: '', ingredients: '', dosha: '', countInStock: '' })}>
                    + Add New Product
                  </button>
                )}
              </div>

              {editingProduct ? (
                <form onSubmit={handleSaveProduct} style={{ background: 'var(--color-surface)', padding: '24px', borderRadius: '12px' }}>
                  <h3>{editingProduct._id ? 'Edit Product' : 'Create New Product'}</h3>
                  <div className="input-group" style={{ marginTop: '16px' }}>
                    <label>Product Name</label>
                    <input required className="input-field" type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Price (₹)</label>
                      <input required className="input-field" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                      <label>Stock Count</label>
                      <input required className="input-field" type="number" value={editingProduct.countInStock} onChange={(e) => setEditingProduct({ ...editingProduct, countInStock: e.target.value })} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Category (e.g., Supplements, Oils)</label>
                    <input required className="input-field" type="text" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Image URL (Optional)</label>
                    <input className="input-field" type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Dosha (e.g., Vata, Pitta, Kapha, Tridoshic)</label>
                    <input className="input-field" type="text" value={editingProduct.dosha} onChange={(e) => setEditingProduct({ ...editingProduct, dosha: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Key Ingredients</label>
                    <input className="input-field" type="text" value={editingProduct.ingredients} onChange={(e) => setEditingProduct({ ...editingProduct, ingredients: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Full Description</label>
                    <textarea required className="input-field" rows="4" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditingProduct(null)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {isLoadingProducts ? (
                    <p>Loading products...</p>
                  ) : products.length > 0 ? (
                    products.map(product => (
                      <div key={product._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--color-surface)', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '1rem' }}>{product.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>₹{product.price} | Stock: {product.countInStock}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setEditingProduct(product)}>Edit</button>
                          <button style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No products found. Add a new product to get started.</p>
                  )}
                </div>
              )}
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
