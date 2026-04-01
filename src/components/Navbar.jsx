import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingBag, Menu, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItemCount, setCartOpen } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navClass = `navbar ${isScrolled ? 'scrolled' : ''}`;

  return (
    <>
      <nav className={navClass}>
        <div className="container navbar-container">
          <Link to="/" className="logo">
            <Leaf size={28} className="logo-icon" />
            <span>Aacharya ayurvedam</span>
          </Link>
          
          <div className="nav-links desktop-only">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            <Link to="/shop" className={location.pathname === '/shop' ? 'active' : ''}>Shop</Link>
            <Link to="/consultation" className={location.pathname === '/consultation' ? 'active' : ''}>Consultations</Link>
            <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>Our Story</Link>
            <Link to="/support" className={location.pathname === '/support' ? 'active' : ''}>Support</Link>
          </div>

          <div className="nav-icons">
            <Link to={user ? "/profile" : "/auth"} className="icon-btn"><User size={20} /></Link>
            <button className="icon-btn cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <ShoppingBag size={20} />
              {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
            </button>
            <button className="icon-btn mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu glass">
          <div className="mobile-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to="/consultation" onClick={() => setMobileMenuOpen(false)}>Consultations</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>
            <Link to="/support" onClick={() => setMobileMenuOpen(false)}>Support</Link>
            <Link to={user ? "/profile" : "/auth"} onClick={() => setMobileMenuOpen(false)}>{user ? "Profile & Orders" : "Login / Sign Up"}</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
