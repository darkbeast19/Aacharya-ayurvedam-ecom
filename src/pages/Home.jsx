import { useState, useEffect } from 'react';
import { ArrowRight, Leaf, ShieldCheck, HeartPulse, Loader, MessageCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getApiPath } from '../api';

const WHATSAPP_DEFAULT = '919999999999';

const Home = () => {
  const [headline, setHeadline] = useState('Balance Your Mind, Body & Spirit naturally.');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product) => {
    addToCart(product);
    navigate('/checkout');
  };
  const [aboutText, setAboutText] = useState('Discover authentic Ayurvedic formulations tailored to your unique dosha. Sourced from organic herbs, designed for modern life.');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_DEFAULT);

  const [showDoshaSection, setShowDoshaSection] = useState(true);
  const [doshaCards, setDoshaCards] = useState([
    { name: 'Vata', focus: 'Movement, Energy, Nervous System', description: 'Air and Space elements. Shop grounding and warming formulations.', image: '' },
    { name: 'Pitta', focus: 'Digestion, Metabolism, Skin', description: 'Fire and Water elements. Shop cooling and soothing formulations.', image: '' },
    { name: 'Kapha', focus: 'Structure, Immunity, Lubrication', description: 'Earth and Water elements. Shop stimulating and lighter formulations.', image: '' }
  ]);

  useEffect(() => {
    fetch(getApiPath('/api/content/homepage'))
      .then(res => res.json())
      .then(data => {
        if (data.headline) setHeadline(data.headline);
        if (data.about) setAboutText(data.about);
        if (data.showDoshaSection !== undefined) setShowDoshaSection(data.showDoshaSection);
        if (data.doshaCards) setDoshaCards(data.doshaCards);
      })
      .catch(err => console.log('Using default content', err));

    // Load WhatsApp settings
    fetch(getApiPath('/api/content/settings'))
      .then(res => res.json())
      .then(data => {
        if (data.whatsappNumber) setWhatsappNumber(data.whatsappNumber);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch(getApiPath('/api/products'))
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.slice(0, 3));
        setLoadingProducts(false);
      })
      .catch(err => {
        console.log('Could not load products', err);
        setLoadingProducts(false);
      });
  }, []);

  const openWhatsApp = () => {
    let num = whatsappNumber.replace(/\D/g, '');
    if (num.length === 10) num = '91' + num;
    const message = encodeURIComponent('Hello! I would like to place an order from Aacharya Ayurvedam. Please assist me.');
    window.open(`https://wa.me/${num}?text=${message}`, '_blank');
  };

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="pill badge delay-100">Ayurvedic Wellness</span>
            <h1 className="delay-200">{headline}</h1>
            <p className="delay-300 text-lg">
              {aboutText}
            </p>
            <div className="hero-actions delay-300">
              <Link to="/shop" className="btn btn-hero-primary">
                Buy Now <ArrowRight size={18} />
              </Link>
              <button onClick={openWhatsApp} className="btn btn-whatsapp">
                <MessageCircle size={18} />
                WhatsApp Order
              </button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img src="/images/hero.png" alt="Ayurvedic Wellness" className="hero-image float-animation" />
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="trust-section bg-surface">
        <div className="container trust-grid">
          <div className="trust-item">
            <Leaf size={32} className="trust-icon" />
            <h3>100% Organic</h3>
            <p>Sustainably harvested and pure herbal ingredients.</p>
          </div>
          <div className="trust-item">
            <ShieldCheck size={32} className="trust-icon" />
            <h3>GMP Certified</h3>
            <p>Manufactured in certified, high-quality facilities.</p>
          </div>
          <div className="trust-item">
            <HeartPulse size={32} className="trust-icon" />
            <h3>Holistic Balance</h3>
            <p>Treating root causes, not just temporary symptoms.</p>
          </div>
        </div>
      </section>

      {/* Shop By Dosha */}
      {showDoshaSection && (
        <section className="dosha-section">
          <div className="container">
            <div className="section-header text-center">
              <h2>Shop by Dosha</h2>
              <p>Ayurveda recognizes three main body types or 'Doshas'. Find formulations that balance yours.</p>
            </div>
            
            <div className="dosha-cards" style={{ display: 'grid', gridTemplateColumns: doshaCards.length > 0 ? `repeat(auto-fit, minmax(300px, 1fr))` : 'none', gap: '24px' }}>
              {doshaCards.map((dosha, index) => (
                <div key={index} className="dosha-card">
                  {dosha.image && <img src={dosha.image} alt={dosha.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />}
                  <h3>{dosha.name}</h3>
                  <span className="dosha-focus">{dosha.focus}</span>
                  <p>{dosha.description}</p>
                  <Link to="/shop" className="btn btn-outline dosha-btn">Shop {dosha.name}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="featured-section bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <h2>Featured Rituals</h2>
            <p>Elevate your daily routine with our most loved formulations.</p>
          </div>
          
          {loadingProducts ? (
            <div className="text-center" style={{ padding: '60px 0' }}>
              <Loader size={36} style={{ color: 'var(--color-primary)', margin: '0 auto', animation: 'spin 1s linear infinite', display: 'block' }} />
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h4 style={{ transition: 'color var(--transition-fast)' }} onMouseOver={(e) => e.target.style.color = 'var(--color-primary-light)'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                        {product.name}
                      </h4>
                    </Link>
                    <p className="product-price">₹{Number(product.price).toFixed(2)}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                      <button 
                        className="btn btn-outline" 
                        onClick={() => addToCart(product)}
                        style={{ padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleBuyNow(product)}
                        style={{ padding: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <CreditCard size={14} /> Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <style>{`
        .hero-section {
          padding: 120px 0 80px;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }
        .hero-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .pill.badge {
          display: inline-block;
          padding: 6px 16px;
          background-color: var(--color-surface);
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          border-radius: var(--radius-full);
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }
        .hero-content h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          margin-bottom: 24px;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          margin-top: 40px;
          flex-wrap: wrap;
        }

        /* Hero CTA Buttons */
        .btn-hero-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 36px;
          background: linear-gradient(135deg, var(--color-primary) 0%, #4a7c59 100%);
          color: #fff;
          border: none;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: 0 4px 20px rgba(74, 124, 89, 0.35);
          letter-spacing: 0.3px;
        }
        .btn-hero-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(74, 124, 89, 0.45);
          background: linear-gradient(135deg, #4a7c59 0%, var(--color-primary) 100%);
        }
        .btn-hero-primary:active {
          transform: translateY(-1px);
        }

        .btn-whatsapp {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #fff;
          border: none;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
          letter-spacing: 0.3px;
        }
        .btn-whatsapp:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
          background: linear-gradient(135deg, #128C7E 0%, #25D366 100%);
        }
        .btn-whatsapp:active {
          transform: translateY(-1px);
        }

        .hero-image-wrapper {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
        }
        .hero-image {
          width: 100%;
          border-radius: var(--radius-lg);
          object-fit: cover;
          height: 600px;
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        .trust-section { background-color: var(--color-surface); padding: 60px 0; }
        .trust-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; text-align: center; }
        .trust-icon { color: var(--color-accent); margin-bottom: 16px; }
        .dosha-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; }
        .dosha-card {
          background: var(--color-surface);
          padding: 40px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          text-align: center;
          transition: transform var(--transition-normal);
        }
        .dosha-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-lg); }
        .dosha-focus { display: block; color: var(--color-accent); font-weight: 500; margin-bottom: 16px; }
        .dosha-card p { margin-bottom: 24px; color: var(--color-text-muted); }
        .dosha-btn { width: 100%; }
        
        .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; }
        .product-card {
          background: var(--color-surface);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
        }
        .product-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-md); }
        .product-image-container { position: relative; height: 300px; overflow: hidden; background: #eef2ed; }
        .product-image-container img { width: 100%; height: 100%; object-fit: cover; }
        .product-badges { position: absolute; top: 16px; left: 16px; display: flex; flex-direction: column; gap: 8px; }
        .badge.small { background: var(--color-bg); padding: 4px 12px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: var(--color-primary); }
        .product-info { padding: 24px; }
        .product-category { font-size: 0.8rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .product-info h4 { margin: 8px 0; font-size: 1.2rem; }
        .product-price { font-weight: 600; font-size: 1.1rem; color: var(--color-primary); }
        .full-width { width: 100%; }
        .mt-4 { margin-top: 16px; }
        
        @media(max-width: 768px) {
          .hero-container, .trust-grid, .dosha-cards, .products-grid { grid-template-columns: 1fr; }
          .hero-content h1 { font-size: 2.5rem; }
          .hero-image { height: 400px; }
          .hero-actions { flex-direction: column; }
          .btn-hero-primary, .btn-whatsapp { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Home;
