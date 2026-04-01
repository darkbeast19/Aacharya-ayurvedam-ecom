import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getApiPath } from '../api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const { addToCart } = useCart();

  const categories = ['All', 'Stress Relief', 'Digestive Health', 'Hair Care', 'Immunity'];

  useEffect(() => {
    fetch(getApiPath('/api/products'))
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load products. Please try again.');
        setLoading(false);
      });
  }, []);

  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => p.category === filter);

  const renderStars = () => (
    <div className="flex gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className="star-icon" fill={i < 4 ? "var(--color-primary)" : "none"} stroke="var(--color-primary)" />
      ))}
      <span className="text-muted text-sm ml-2">(12)</span>
    </div>
  );

  return (
    <div className="shop-page container fade-in" style={{ paddingTop: '120px' }}>
      <div className="shop-header">
        <h1>Shop Botanicals</h1>
        <p className="text-muted text-lg">Pure, potent remedies rooted in 5,000 years of Ayurvedic wisdom.</p>
      </div>

      <div className="shop-layout">
        <aside className="shop-sidebar">
          <h3>Filter by Goal</h3>
          <ul className="filter-list">
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="shop-content">
          {loading && (
            <div className="loading-state text-center" style={{ padding: '80px 0' }}>
              <Loader size={40} className="spin-animation" style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
              <p className="text-muted">Loading products...</p>
            </div>
          )}

          {error && (
            <div className="error-state text-center" style={{ padding: '80px 0' }}>
              <p style={{ color: '#e53e3e', marginBottom: '16px' }}>{error}</p>
              <button className="btn btn-outline" onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product._id} className="product-card">
                  <Link to={`/product/${product._id}`} className="product-image-container">
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <Link to={`/product/${product._id}`}>
                      <h4>{product.name}</h4>
                    </Link>
                    {renderStars()}
                    <p className="product-price">${Number(product.price).toFixed(2)}</p>
                    <div className="card-actions">
                      <button
                        className="btn btn-primary full-width mt-4"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingBag size={18} /> Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state text-center" style={{ padding: '80px 0' }}>
              <h3>No products found for this goal yet.</h3>
              <button className="btn btn-primary mt-4" onClick={() => setFilter('All')}>View All</button>
            </div>
          )}
        </main>
      </div>

      <style>{`
        .shop-header { margin-bottom: 48px; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 24px; }
        .shop-layout { display: grid; grid-template-columns: 250px 1fr; gap: 48px; }
        .filter-list li { margin-bottom: 12px; }
        .filter-btn {
          background: transparent; border: none; font-size: 1rem;
          color: var(--color-text-muted); cursor: pointer; transition: var(--transition-fast);
          text-align: left; width: 100%; padding: 8px 12px; border-radius: var(--radius-sm);
        }
        .filter-btn:hover, .filter-btn.active {
          background-color: var(--color-surface); color: var(--color-primary); font-weight: 600;
        }
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .product-card {
          background: var(--color-surface); border-radius: var(--radius-md); overflow: hidden;
          box-shadow: var(--shadow-sm); transition: var(--transition-normal);
          display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.05);
        }
        [data-theme='dark'] .product-card { border-color: rgba(255,255,255,0.05); }
        .product-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
        .product-image-container {
          width: 100%; aspect-ratio: 1; background: #fff; padding: 32px;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
        }
        [data-theme='dark'] .product-image-container { background: #1a1e18; }
        .product-image-container img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform var(--transition-slow); mix-blend-mode: multiply; }
        [data-theme='dark'] .product-image-container img { mix-blend-mode: normal; }
        .product-card:hover .product-image-container img { transform: scale(1.08); }
        .product-info { padding: 24px; display: flex; flex-direction: column; flex: 1; }
        .product-category { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-weight: 600; }
        .product-info h4 { margin: 0 0 8px 0; font-size: 1.15rem; line-height: 1.3; transition: color var(--transition-fast); }
        .product-info h4:hover { color: var(--color-primary-light); }
        .product-price { font-weight: 700; font-size: 1.1rem; color: var(--color-text); margin-bottom: auto; margin-top: 8px; }
        .card-actions { margin-top: 20px; }
        .full-width { width: 100%; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-animation { animation: spin 1s linear infinite; display: block; }
        @media(max-width: 1024px) { .products-grid { grid-template-columns: repeat(2, 1fr); } }
        @media(max-width: 768px) { .shop-layout { grid-template-columns: 1fr; } }
        @media(max-width: 640px) { .products-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Shop;
