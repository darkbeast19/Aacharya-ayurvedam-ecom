import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, User, LogOut, Plus, Trash2, Loader, Clock, CheckCircle, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApiPath } from '../api';

const Profile = () => {
  const { user, updateAddress, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [newAddress, setNewAddress] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Fetch real orders from DB
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(getApiPath('/api/orders/myorders'), {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setOrdersLoading(false); })
      .catch(() => setOrdersLoading(false));
  }, []);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (newAddress.trim()) {
      const addresses = user.address || [];
      updateAddress([...addresses, newAddress]);
      setNewAddress('');
      setIsAddingAddress(false);
    }
  };

  const removeAddress = (index) => {
    const addresses = [...(user.address || [])];
    addresses.splice(index, 1);
    updateAddress(addresses);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="section-header text-center">
        <h1 className="section-title">My Account</h1>
        <p className="section-subtitle">Manage your profile, orders, and addresses</p>
      </div>

      <div style={{ display: 'flex', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div style={{ flex: '1', minWidth: '250px', background: 'var(--white)', padding: '24px', borderRadius: '16px', height: 'fit-content' }} className="glass">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.name}</h3>
              <p className="text-muted" style={{ fontSize: '14px' }}>{user.email}</p>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: activeTab === 'orders' ? 'var(--primary-light)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'orders' ? 'bold' : 'normal', color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-color)' }}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={20} /> My Orders
            </button>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: activeTab === 'addresses' ? 'var(--primary-light)' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === 'addresses' ? 'bold' : 'normal', color: activeTab === 'addresses' ? 'var(--primary)' : 'var(--text-color)' }}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={20} /> Saved Addresses
            </button>
            <button 
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--accent)', marginTop: '24px' }}
              onClick={handleLogout}
            >
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </div>

        {/* Content area */}
        <div style={{ flex: '3', minWidth: '300px' }}>
          {activeTab === 'orders' && (
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', background: 'var(--white)' }}>
              <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Order History</h2>
              
              {ordersLoading ? (
                <div className="text-center" style={{ padding: '48px 0' }}>
                  <Loader size={36} style={{ color: 'var(--color-primary)', margin: '0 auto', animation: 'spin 1s linear infinite', display: 'block' }} />
                </div>
              ) : orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map((order) => {
                    const statusColors = {
                      Pending: { bg: '#fff3cd', color: '#856404' },
                      Confirmed: { bg: '#cce5ff', color: '#004085' },
                      Shipped: { bg: '#d1ecf1', color: '#0c5460' },
                      Delivered: { bg: '#d4edda', color: '#155724' },
                      Cancelled: { bg: '#f8d7da', color: '#721c24' },
                    };
                    const sc = statusColors[order.status] || statusColors.Pending;
                    return (
                      <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                          <p style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                            Order #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-muted" style={{ fontSize: '14px' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.orderItems.length} item(s)
                          </p>
                          <p className="text-muted" style={{ fontSize: '13px' }}>{order.paymentMethod}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>₹{order.totalPrice}</p>
                          <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: sc.bg, color: sc.color }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center" style={{ padding: '48px 0' }}>
                  <Package size={48} className="text-muted" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p className="text-muted">You haven't placed any orders yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="glass" style={{ padding: '32px', borderRadius: '16px', background: 'var(--white)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Saved Addresses</h2>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}
                >
                  <Plus size={18} /> Add New
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} style={{ background: 'var(--gray-light)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                  <div className="input-group">
                    <label>Complete Address</label>
                    <textarea 
                      required 
                      className="input-field" 
                      rows="3" 
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="Enter house no, building name, street, city, state, and PIN code."
                      style={{ resize: 'vertical' }}
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setIsAddingAddress(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Address</button>
                  </div>
                </form>
              )}

              {user.address && user.address.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {user.address.map((addr, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px', border: '1px solid var(--gray-medium)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <MapPin className="text-primary mt-1" />
                        <p style={{ lineHeight: '1.6', fontSize: '15px' }}>{addr}</p>
                      </div>
                      <button 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: '4px' }}
                        onClick={() => removeAddress(index)}
                        title="Delete Address"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center" style={{ padding: '48px 0' }}>
                  <MapPin size={48} className="text-muted" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                  <p className="text-muted">You haven't saved any addresses yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Inject spin animation if not already present
if (!document.getElementById('profile-spin-style')) {
  const s = document.createElement('style');
  s.id = 'profile-spin-style';
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

export default Profile;
