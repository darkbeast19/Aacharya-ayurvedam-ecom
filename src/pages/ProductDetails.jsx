import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Check, ShieldCheck, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`)
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
  }, [id]);

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
            <p className="price text-xl">${Number(product.price).toFixed(2)}</p>

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
                style={{ padding: '16px' }}
                disabled={product.countInStock === 0}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <p className="text-sm text-muted text-center mt-4">Safe & secure checkout. 30-day holistic guarantee.</p>
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
        @media(max-width: 768px) { .details-grid { grid-template-columns: 1fr; gap: 40px; } }
      `}</style>
    </div>
  );
};

export default ProductDetails;
