import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader, ShoppingBag, MapPin, CreditCard, AlertCircle, MessageCircle } from 'lucide-react';
import { getApiPath } from '../api';

// Load Razorpay script once
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const WHATSAPP_DEFAULT = '919999999999';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_DEFAULT);

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const shippingPrice = cartTotal > 999 ? 0 : 99;
  const totalPrice = cartTotal + shippingPrice;

  useEffect(() => {
    if (cart.length === 0 && !isSuccess) navigate('/shop');
  }, [cart]);

  useEffect(() => {
    fetch(getApiPath('/api/content/settings'))
      .then(res => res.json())
      .then(data => {
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  // Real-time validation
  const validateField = (name, value) => {
    let err = '';
    if (!value || value.toString().trim() === '') {
      err = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    } else {
      if (name === 'phone' && !/^\d{10}$/.test(value)) {
        err = 'Phone must be exactly 10 digits';
      }
      if (name === 'postalCode' && !/^\d{6}$/.test(value)) {
        err = 'PIN Code must be exactly 6 digits';
      }
      if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
        err = 'Invalid email format';
      }
    }
    setFieldErrors(prev => ({ ...prev, [name]: err }));
    return err === '';
  };

  // Auto-fetch City & State from PIN Code
  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (shipping.postalCode.length === 6) {
        setPincodeLoading(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${shipping.postalCode}`);
          const data = await res.json();
          
          if (data[0].Status === 'Success') {
            const details = data[0].PostOffice[0];
            setShipping(prev => ({
              ...prev,
              city: details.District,
              state: details.State
            }));
            setFieldErrors(prev => ({ ...prev, postalCode: '', city: '', state: '' }));
          } else {
            setFieldErrors(prev => ({ ...prev, postalCode: 'Invalid PIN Code not found' }));
          }
        } catch (err) {
          console.error('PIN fetch error', err);
        } finally {
          setPincodeLoading(false);
        }
      }
    };

    if (/^\d{6}$/.test(shipping.postalCode)) {
      fetchPincodeDetails();
    }
  }, [shipping.postalCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Numeric filters
    if (name === 'phone' || name === 'postalCode') {
      const numericValue = value.replace(/\D/g, '');
      if (name === 'phone' && numericValue.length > 10) return;
      if (name === 'postalCode' && numericValue.length > 6) return;
      setShipping({ ...shipping, [name]: numericValue });
      validateField(name, numericValue);
    } else {
      setShipping({ ...shipping, [name]: value });
      validateField(name, value);
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    
    // Final check
    const fieldsToValidate = ['name', 'phone', 'email', 'address', 'city', 'state', 'postalCode'];
    let isValid = true;

    fieldsToValidate.forEach(field => {
      if (!validateField(field, shipping[field])) {
        isValid = false;
      }
    });

    if (isValid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError('Please fix all errors before proceeding.');
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setError('');

    const loaded = await loadRazorpay();
    if (!loaded) {
      setError('Razorpay failed to load. Check your internet connection.');
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const rzpRes = await fetch(getApiPath('/api/orders/razorpay/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: totalPrice }),
      });
      const rzpOrder = await rzpRes.json();

      if (!rzpRes.ok) throw new Error(rzpOrder.message || 'Could not create payment');

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'Aacharya Ayurvedam',
        description: `Order of ${cart.length} item(s)`,
        order_id: rzpOrder.id,
        prefill: {
          name: shipping.name,
          email: shipping.email,
          contact: shipping.phone,
        },
        theme: { color: '#4a7c59' },
        handler: async (response) => {
          await saveOrder({
            id: response.razorpay_payment_id,
            status: 'COMPLETED',
            update_time: new Date().toISOString(),
          }, 'Razorpay');
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setError('Payment was cancelled. Please try again.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  const handleCOD = async () => {
    setIsProcessing(true);
    setError('');
    await saveOrder(null, 'Cash on Delivery');
  };

  const handleWhatsAppOrder = () => {
    const itemsList = cart.map(item => `• ${item.name} x${item.quantity} — ₹${(Number(item.price) * item.quantity).toFixed(2)}`).join('\n');
    const message = encodeURIComponent(
      `Hello! I'd like to place an order:\n\n${itemsList}\n\n` +
      `Subtotal: ₹${cartTotal.toFixed(2)}\n` +
      `Shipping: ${shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}\n` +
      `Total: ₹${totalPrice.toFixed(2)}\n\n` +
      `Shipping Details:\n` +
      `Name: ${shipping.name}\n` +
      `Phone: ${shipping.phone}\n` +
      `Address: ${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.postalCode}\n\n` +
      `Please confirm my order. Thank you!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const saveOrder = async (paymentResult, paymentMethod) => {
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item._id || item.id,
        })),
        customerName: shipping.name,
        customerEmail: shipping.email,
        customerPhone: shipping.phone,
        shippingAddress: {
          address: shipping.address,
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.postalCode,
          country: shipping.country,
        },
        paymentMethod,
        paymentResult,
        itemsPrice: cartTotal,
        shippingPrice,
        totalPrice,
      };

      const res = await fetch(getApiPath('/api/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save order');

      setOrderId(data._id);
      setIsSuccess(true);
      clearCart();
      setIsProcessing(false);
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px', display: 'flex', justifyContent: 'center' }}>
        <div className="glass text-center" style={{ padding: '56px 48px', borderRadius: '24px', maxWidth: '480px', width: '100%' }}>
          <div style={{ width: '80px', height: '80px', background: '#d4edda', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={48} style={{ color: '#155724' }} />
          </div>
          <h2 style={{ marginBottom: '12px' }}>Order Placed! 🎉</h2>
          <p className="text-muted" style={{ marginBottom: '8px' }}>Your Ayurvedic order has been confirmed.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
            Order ID: <strong style={{ fontFamily: 'monospace' }}>{orderId.slice(-8).toUpperCase()}</strong>
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/profile')}>
            View My Orders
          </button>
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '12px' }} onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <h1 className="text-center" style={{ marginBottom: '12px' }}>Secure Checkout</h1>

      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span>Shipping</span>
        </div>
        <div className="step-line" />
        <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span>Payment</span>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="checkout-left">
          {step === 1 && (
            <div className="glass checkout-card">
              <h2><MapPin size={20} style={{ display: 'inline', marginRight: '8px' }} />Shipping Details</h2>
              
              {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #fc8181', borderRadius: '10px', padding: '12px 16px', marginTop: '16px', color: '#c53030', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <form onSubmit={handleShippingSubmit} style={{ marginTop: '24px' }}>
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      name="name"
                      className={`input-field ${fieldErrors.name ? 'error' : ''}`} 
                      required 
                      value={shipping.name}
                      onChange={handleInputChange} 
                      placeholder="Your full name" 
                    />
                    {fieldErrors.name && <span className="error-text">{fieldErrors.name}</span>}
                  </div>
                  <div className="input-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phone"
                      className={`input-field ${fieldErrors.phone ? 'error' : ''}`} 
                      required 
                      value={shipping.phone}
                      onChange={handleInputChange} 
                      placeholder="10-digit mobile number" 
                    />
                    {fieldErrors.phone && <span className="error-text">{fieldErrors.phone}</span>}
                  </div>
                </div>

                <div className="input-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    name="email"
                    className={`input-field ${fieldErrors.email ? 'error' : ''}`} 
                    required 
                    value={shipping.email}
                    onChange={handleInputChange} 
                    placeholder="you@email.com" 
                  />
                  {fieldErrors.email && <span className="error-text">{fieldErrors.email}</span>}
                </div>

                <div className="input-group">
                  <label>Street Address *</label>
                  <input 
                    type="text" 
                    name="address"
                    className={`input-field ${fieldErrors.address ? 'error' : ''}`} 
                    required 
                    value={shipping.address}
                    onChange={handleInputChange} 
                    placeholder="House no., Street, Area" 
                  />
                  {fieldErrors.address && <span className="error-text">{fieldErrors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>PIN Code * {pincodeLoading && <Loader size={12} className="inline-loader" />}</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      className={`input-field ${fieldErrors.postalCode ? 'error' : ''}`} 
                      required 
                      value={shipping.postalCode}
                      onChange={handleInputChange} 
                      placeholder="6 digit PIN" 
                      maxLength={6} 
                    />
                    {fieldErrors.postalCode && <span className="error-text">{fieldErrors.postalCode}</span>}
                  </div>
                  <div className="input-group">
                    <label>City *</label>
                    <input 
                      type="text" 
                      name="city"
                      className={`input-field ${fieldErrors.city ? 'error' : ''}`} 
                      required 
                      value={shipping.city}
                      onChange={handleInputChange} 
                      placeholder="City Name" 
                    />
                    {fieldErrors.city && <span className="error-text">{fieldErrors.city}</span>}
                  </div>
                </div>

                <div className="input-group">
                  <label>State *</label>
                  <input 
                    type="text" 
                    name="state"
                    className={`input-field ${fieldErrors.state ? 'error' : ''}`} 
                    required 
                    value={shipping.state}
                    onChange={handleInputChange} 
                    placeholder="State Name" 
                  />
                  {fieldErrors.state && <span className="error-text">{fieldErrors.state}</span>}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '14px' }}>
                  Continue to Payment →
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="glass checkout-card">
              <h2><CreditCard size={20} style={{ display: 'inline', marginRight: '8px' }} />Choose Payment</h2>

              {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #fc8181', borderRadius: '10px', padding: '12px 16px', marginTop: '16px', color: '#c53030', fontSize: '0.9rem' }}>
                  {error}
                </div>
              )}

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <button className="payment-option-btn" onClick={handleRazorpayPayment} disabled={isProcessing}>
                  <div className="payment-option-icon" style={{ background: '#072654' }}>💳</div>
                  <div>
                    <h4>Pay Online</h4>
                    <p>UPI, Cards, Net Banking, Wallets via Razorpay</p>
                  </div>
                  {isProcessing && <Loader size={20} style={{ marginLeft: 'auto', animation: 'spin 1s linear infinite' }} />}
                </button>

                <button className="payment-option-btn" onClick={handleCOD} disabled={isProcessing}>
                  <div className="payment-option-icon" style={{ background: '#2d6a4f' }}>💵</div>
                  <div>
                    <h4>Cash on Delivery</h4>
                    <p>Pay when your order arrives</p>
                  </div>
                  {isProcessing && <Loader size={20} style={{ marginLeft: 'auto', animation: 'spin 1s linear infinite' }} />}
                </button>

                <button className="payment-option-btn whatsapp-payment-btn" onClick={handleWhatsAppOrder} disabled={isProcessing}>
                  <div className="payment-option-icon" style={{ background: '#25D366' }}>
                    <MessageCircle size={20} color="#fff" />
                  </div>
                  <div>
                    <h4>WhatsApp Order</h4>
                    <p>Place your order directly via WhatsApp chat</p>
                  </div>
                </button>
              </div>

              <button className="btn btn-outline" style={{ width: '100%', marginTop: '20px' }} onClick={() => setStep(1)}>
                ← Back to Shipping
              </button>
            </div>
          )}
        </div>

        <div className="checkout-right">
          <div className="glass checkout-card">
            <h2><ShoppingBag size={20} style={{ display: 'inline', marginRight: '8px' }} />Order Summary</h2>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map(item => (
                <div key={item._id || item.id} className="summary-item">
                  <div className="summary-item-img">
                    <img src={item.image} alt={item.name} />
                    <span className="summary-qty">{item.quantity}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{item.category}</p>
                  </div>
                  <strong>₹{(Number(item.price) * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', marginTop: '20px', paddingTop: '20px' }}>
              <div className="total-row"><span className="text-muted">Subtotal</span> <span>₹{cartTotal.toFixed(2)}</span></div>
              <div className="total-row">
                <span className="text-muted">Shipping</span>
                <span style={{ color: shippingPrice === 0 ? '#155724' : 'inherit' }}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
              </div>
              {shippingPrice === 0 && <p style={{ fontSize: '0.75rem', color: '#155724', textAlign: 'right', marginTop: '-8px' }}>Free shipping on orders above ₹999!</p>}
              <div className="total-row grand-total"><span>Total</span> <strong style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>₹{totalPrice.toFixed(2)}</strong></div>
            </div>

            <div style={{ marginTop: '20px', background: '#e8f4fd', borderRadius: '10px', padding: '12px 16px', fontSize: '0.82rem', color: '#0369a1', textAlign: 'center' }}>
              🇮🇳 Fast Delivery to {shipping.city || 'all over India'}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .checkout-steps { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 48px; margin-top: 24px; }
        .checkout-step { display: flex; flex-direction: column; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 500; color: var(--color-text-muted); }
        .checkout-step.active { color: var(--color-primary); }
        .step-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; transition: all 0.3s; }
        .checkout-step.active .step-circle { background: var(--color-primary); border-color: var(--color-primary); color: white; }
        .step-line { width: 80px; height: 2px; background: rgba(0,0,0,0.1); margin: 0 8px; margin-bottom: 22px; }
        [data-theme='dark'] .step-line { background: rgba(255,255,255,0.1); }

        .checkout-grid { display: grid; grid-template-columns: 1fr 420px; gap: 32px; align-items: start; }
        .checkout-card { padding: 32px; border-radius: 20px; }
        .checkout-card h2 { font-size: 1.25rem; margin-bottom: 0; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .input-group { margin-bottom: 16px; position: relative; }
        .input-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; color: var(--color-text); }
        .input-field.error { border-color: #ef4444 !important; background: #fef2f2; }
        .error-text { color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block; }
        .inline-loader { animation: spin 1s linear infinite; vertical-align: middle; margin-left: 5px; }

        .payment-option-btn { width: 100%; display: flex; align-items: center; gap: 16px; background: var(--color-surface); border: 2px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 16px 20px; cursor: pointer; text-align: left; transition: all 0.2s; color: var(--color-text); font-family: var(--font-family); }
        [data-theme='dark'] .payment-option-btn { border-color: rgba(255,255,255,0.06); }
        .payment-option-btn:hover:not(:disabled) { border-color: var(--color-primary); background: rgba(74,124,89,0.05); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .payment-option-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .payment-option-btn h4 { margin: 0 0 2px; font-size: 1rem; }
        .payment-option-btn p { margin: 0; font-size: 0.8rem; color: var(--color-text-muted); }
        .payment-option-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }

        .whatsapp-payment-btn:hover:not(:disabled) {
          border-color: #25D366;
          background: rgba(37, 211, 102, 0.05);
        }

        .summary-item { display: flex; align-items: center; gap: 12px; }
        .summary-item-img { position: relative; width: 52px; height: 52px; border-radius: 8px; background: var(--color-surface); overflow: hidden; flex-shrink: 0; }
        .summary-item-img img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
        .summary-qty { position: absolute; top: -6px; right: -6px; background: var(--color-primary); color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; justify-content: center; }

        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.95rem; }
        .grand-total { border-top: 1px solid rgba(0,0,0,0.08); padding-top: 12px; margin-top: 6px; font-size: 1rem; }
        [data-theme='dark'] .grand-total { border-color: rgba(255,255,255,0.08); }

        @media(max-width: 950px) { .checkout-grid { grid-template-columns: 1fr; } .checkout-right { order: 1; } }
        @media(max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Checkout;
