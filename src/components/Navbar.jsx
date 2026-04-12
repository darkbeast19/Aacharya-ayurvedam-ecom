import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingBag, Menu, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/consultation', label: 'Consultations' },
  { to: '/about', label: 'Our Story' },
  { to: '/support', label: 'Support' },
];

const MENU_LINKS = [
  ...NAV_LINKS,
  { to: '/policies', label: 'Policies' },
];

const MOBILE_BREAKPOINT = 850; // px

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const location = useLocation();
  const { cartItemCount, setCartOpen } = useCart();
  const { user } = useAuth();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Resize detection
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1000,
        padding: isScrolled ? '12px 0' : '20px 0',
        backgroundColor: isScrolled ? 'var(--color-bg)' : 'transparent',
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', flexShrink: 0 }}>
            <Leaf size={26} style={{ color: 'var(--color-accent)' }} />
            <span>Aacharya ayurvedam</span>
          </Link>

          {/* Desktop Nav Links — only shown when NOT mobile */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              {NAV_LINKS.map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive(to) ? 'var(--color-primary)' : 'var(--color-text)',
                  textDecoration: 'none',
                  borderBottom: isActive(to) ? '2px solid var(--color-accent)' : '2px solid transparent',
                  paddingBottom: '4px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}>
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {!isMobile && (
              <Link to={user ? '/profile' : '/auth'} style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}>
                <User size={22} />
              </Link>
            )}
            <button
              onClick={() => setCartOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', position: 'relative', display: 'flex', alignItems: 'center' }}
              aria-label="Open cart"
            >
              <ShoppingBag size={22} />
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-8px',
                  background: 'var(--color-accent)', color: '#fff',
                  fontSize: '0.65rem', fontWeight: 700, borderRadius: '9999px',
                  width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Hamburger — only on mobile */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', padding: '4px' }}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ─── MOBILE FULLSCREEN MENU ─── */}
      {menuOpen && isMobile && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 990,
            backgroundColor: 'rgba(255,255,255,0.97)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '64px',
          }}
        >
          {/* Prevent clicks from propagating on the menu itself */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '360px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '4px' }}
          >
            {MENU_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  fontSize: '1.15rem',
                  fontWeight: isActive(to) ? 700 : 500,
                  color: isActive(to) ? 'var(--color-primary)' : 'var(--color-text)',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  backgroundColor: isActive(to) ? 'var(--color-surface)' : 'transparent',
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  textAlign: 'left',
                }}
              >
                {label}
              </Link>
            ))}

            <Link
              to={user ? '/profile' : '/auth'}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                marginTop: '12px',
                padding: '14px 16px',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#fff',
                background: 'var(--color-primary)',
                borderRadius: '10px',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              {user ? '👤  Profile & Orders' : '🔑  Login / Sign Up'}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
