import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Check, ShieldCheck, Loader, Truck, RotateCcw, XCircle, Clock, MessageCircle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getApiPath } from '../api';

const WHATSAPP_DEFAULT = '919999999999';

const defaultExtraInfo = {
  estimatedDelivery: '3-7 business days (Metro: 3-5 days, Others: 5-7 days)',
  returnExchange: 'Returns accepted within 7 days of delivery. Product must be unused & sealed.',
  cancellationRefund: 'Cancel within 2 hours of placement. Refund processed in 5-10 business days.',
  additionalInfo: 'All products are GMP certified, 100% organic, and lab-tested for purity.',
};

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [extraInfo, setExtraInfo] = useState(defaultExtraInfo);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_DEFAULT);

  useEffect(() => {
    fetch(getApiPath(`/api/products/${id}`))
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Load extra info from admin settings
    fetch(getApiPath('/api/content/productExtraInfo'))
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          setExtraInfo(prev => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    // Load WhatsApp settings
    fetch(getApiPath('/api/content/settings'))
      .then(res => res.json())
      .then(data => {
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      })
      .catch(() => {});
  }, [id]);

  const openWhatsApp = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hello! I'd like to order:\n\n*${product.name}*\nPrice: ₹${Number(product.price).toFixed(2)}\nProduct Link: ${window.location.href}\n\nPlease confirm availability and proceed with my order.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: '200px' }}>
        <Loader size={48} style={{ color: 'var(--color-primary)', margin: '0 auto', animation: 'spin 1s linear infinite', display: 'block' }} />
        <p className="text-muted mt-4">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container text-center" style={{ paddingTop: '150px' }}>
        <h2>Product not found</h2>
        <Link to="/shop" className="btn btn-primary mt-4">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="product-details-page fade-in">
      <div className="container" style={{ paddingTop: '120px' }}>
        <Link to="/shop" className="back-link"><ArrowLeft size={16} /> Back to Shop</Link>

        <div className="details-grid">
          <div className="details-image-section">
            <img src={product.image} alt={product.name} className="main-image" />
          </div>

          <div className="details-info-section">
            <span className="product-category text-sm text-muted">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="price text-xl">₹{Number(product.price).toFixed(2)}</p>

            <p className="description mt-4">{product.description}</p>

            <div className="features mt-6">
              {product.dosha && (
                <div className="feature-item">
                  <ShieldCheck size={20} className="text-primary" />
                  <span>Balancing for Dosha: <strong>{product.dosha}</strong></span>
                </div>
              )}
              {product.ingredients && (
                <div className="feature-item">
                  <Check size={20} className="text-primary" />
                  <span>Ingredients: <strong>{product.ingredients}</strong></span>
                </div>
              )}
            </div>

            <div className="stock-info mt-4">
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: '20px',
                background: product.countInStock > 0 ? '#d4edda' : '#f8d7da',
                color: product.countInStock > 0 ? '#155724' : '#721c24',
                fontSize: '0.85rem', fontWeight: '600'
              }}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} left)` : 'Out of Stock'}
              </span>
            </div>

            <div className="actions">
              <button
                className="btn btn-primary full-width mt-8"
                style={{ padding: '16px', fontWeight: 700, fontSize: '1.05rem' }}
                disabled={product.countInStock === 0}
                onClick={() => addToCart(product)}
              >
                Buy Now — Add to Cart
              </button>
              <button
                className="btn-whatsapp-product full-width"
                onClick={openWhatsApp}
              >
                <MessageCircle size={18} />
                WhatsApp Order
              </button>
              <p className="text-sm text-muted text-center mt-4">Safe & secure checkout. 30-day holistic guarantee.</p>
            </div>
          </div>
        </div>

        {/* Extra Product Info Section */}
        <div className="product-extra-info">
          <div className="extra-info-header">
            <Info size={20} />
            <h3>Order & Delivery Information</h3>
          </div>
          <div className="extra-info-grid">
            <div className="extra-info-item">
              <div className="extra-info-icon">
                <Truck size={22} />
              </div>
              <div>
                <h4>Estimated Delivery</h4>
                <p>{product.estimatedDelivery || extraInfo.estimatedDelivery}</p>
              </div>
            </div>
            <div className="extra-info-item">
              <div className="extra-info-icon">
                <RotateCcw size={22} />
              </div>
              <div>
                <h4>Return & Exchange</h4>
                <p>{product.returnExchangeInfo || extraInfo.returnExchange}</p>
              </div>
            </div>
            <div className="extra-info-item">
              <div className="extra-info-icon">
                <XCircle size={22} />
              </div>
              <div>
                <h4>Cancellation & Refund</h4>
                <p>{product.cancellationRefundInfo || extraInfo.cancellationRefund}</p>
              </div>
            </div>
            <div className="extra-info-item">
              <div className="extra-info-icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4>Quality Assurance</h4>
                <p>{product.additionalInfo || extraInfo.additionalInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--color-text-muted); margin-bottom: 32px; font-weight: 500; transition: color var(--transition-fast); }
        .back-link:hover { color: var(--color-primary); }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: flex-start; }
        .main-image { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
        .price { color: var(--color-primary); font-weight: 600; margin-top: 16px; }
        .description { line-height: 1.8; color: var(--color-text-muted); }
        .feature-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 16px; background: var(--color-surface); border-radius: var(--radius-sm); border-left: 4px solid var(--color-primary); }

        .btn-whatsapp-product {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          margin-top: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #fff;
          border: none;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: 0 4px 16px rgba(37, 211, 102, 0.25);
          font-family: var(--font-family);
        }
        .btn-whatsapp-product:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(37, 211, 102, 0.35);
          background: linear-gradient(135deg, #128C7E 0%, #25D366 100%);
        }

        /* Extra Product Info Section */
        .product-extra-info {
          margin-top: 64px;
          margin-bottom: 40px;
          padding: 32px;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          border: 1px solid rgba(0,0,0,0.04);
        }
        [data-theme='dark'] .product-extra-info {
          border-color: rgba(255,255,255,0.06);
        }
        .extra-info-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(0,0,0,0.05);
          color: var(--color-primary);
        }
        [data-theme='dark'] .extra-info-header {
          border-color: rgba(255,255,255,0.08);
        }
        .extra-info-header h3 {
          margin: 0;
          font-size: 1.15rem;
        }
        .extra-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .extra-info-item {
          display: flex;
          gap: 14px;
          padding: 20px;
          background: var(--color-bg);
          border-radius: var(--radius-sm);
          transition: transform var(--transition-fast);
        }
        .extra-info-item:hover {
          transform: translateY(-2px);
        }
        .extra-info-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          flex-shrink: 0;
        }
        .extra-info-item h4 {
          font-size: 0.95rem;
          margin: 0 0 4px;
          color: var(--color-text);
        }
        .extra-info-item p {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin: 0;
        }

        @media(max-width: 768px) { 
          .details-grid { grid-template-columns: 1fr; gap: 40px; }
          .extra-info-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
