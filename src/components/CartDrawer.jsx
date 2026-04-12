import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useCart();
  const { user } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${cartOpen ? 'open' : ''}`}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={22} />
            <h3>Your Cart</h3>
            {cartItemCount > 0 && <span className="cart-count-pill">{cartItemCount}</span>}
          </div>
          <button className="cart-close-btn" onClick={() => setCartOpen(false)}>
            <X size={22} />
          </button>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={64} strokeWidth={1} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} />
            <h4>Your cart is empty</h4>
            <p className="text-muted">Add some Ayurvedic products to begin your wellness journey.</p>
            <button className="btn btn-primary mt-4" onClick={() => setCartOpen(false)}>
              <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Browse Products</Link>
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="cart-items">
              {cart.map(item => {
                const itemId = item._id || item.id;
                return (
                  <div key={itemId} className="cart-item">
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-item-details">
                      <p className="cart-item-category">{item.category}</p>
                      <h4 className="cart-item-name">{item.name}</h4>
                      <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>

                      {/* Quantity Controls */}
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(itemId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(itemId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          className="qty-remove"
                          onClick={() => removeFromCart(itemId)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-subtotal">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
              <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '16px' }}>
                Shipping & taxes calculated at checkout
              </p>

              {user ? (
                // Logged-in: go to checkout
                <Link
                  to="/checkout"
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => setCartOpen(false)}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              ) : (
                // Guest: show sign-in prompt
                <div className="guest-checkout-prompt">
                  <div className="guest-prompt-message">
                    <LogIn size={18} />
                    <span>Sign in to place your order</span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.8rem', margin: '8px 0 14px', textAlign: 'center' }}>
                    You need an account to complete your purchase.
                  </p>
                  <Link
                    to="/auth"
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => setCartOpen(false)}
                  >
                    <LogIn size={18} /> Sign In / Create Account
                  </Link>
                </div>
              )}

              <button
                className="btn btn-outline"
                style={{ width: '100%', marginTop: '10px' }}
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .cart-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px); z-index: 1010;
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .cart-backdrop.open { opacity: 1; pointer-events: all; }

        .cart-drawer {
          position: fixed; top: 0; right: 0; height: 100vh;
          width: 420px; max-width: 95vw;
          background: var(--color-bg);
          box-shadow: -8px 0 40px rgba(0,0,0,0.15);
          z-index: 1020; display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .cart-drawer.open { transform: translateX(0); }

        .cart-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px; border-bottom: 1px solid rgba(0,0,0,0.08);
          flex-shrink: 0;
        }
        [data-theme='dark'] .cart-header { border-color: rgba(255,255,255,0.08); }
        .cart-title { display: flex; align-items: center; gap: 10px; }
        .cart-title h3 { margin: 0; font-size: 1.2rem; }
        .cart-count-pill {
          background: var(--color-primary); color: white;
          border-radius: 20px; padding: 2px 10px; font-size: 0.8rem; font-weight: 700;
        }
        .cart-close-btn {
          background: var(--color-surface); border: none; border-radius: 50%;
          width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
          color: var(--color-text);
        }
        .cart-close-btn:hover { background: var(--color-primary); color: white; }

        .cart-empty {
          flex: 1; display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center; padding: 40px;
          gap: 12px;
        }
        .cart-empty h4 { font-size: 1.2rem; margin: 8px 0 0; }

        .cart-items {
          flex: 1; overflow-y: auto; padding: 16px 24px;
          display: flex; flex-direction: column; gap: 20px;
        }

        .cart-item {
          display: grid; grid-template-columns: 72px 1fr auto;
          gap: 14px; align-items: start;
          padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        [data-theme='dark'] .cart-item { border-color: rgba(255,255,255,0.06); }
        .cart-item:last-child { border-bottom: none; }

        .cart-item-image {
          width: 72px; height: 72px; border-radius: 10px;
          background: var(--color-surface);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; padding: 8px;
        }
        .cart-item-image img { max-width: 100%; max-height: 100%; object-fit: contain; mix-blend-mode: multiply; }
        [data-theme='dark'] .cart-item-image img { mix-blend-mode: normal; }

        .cart-item-category { font-size: 0.7rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; margin: 0 0 4px; }
        .cart-item-name { font-size: 0.95rem; font-weight: 600; margin: 0 0 4px; line-height: 1.3; }
        .cart-item-price { font-size: 0.9rem; color: var(--color-primary); font-weight: 600; margin: 0 0 10px; }

        .quantity-controls {
          display: flex; align-items: center; gap: 8px;
        }
        .qty-btn {
          width: 28px; height: 28px; border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.15); background: var(--color-surface);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: var(--color-text);
        }
        [data-theme='dark'] .qty-btn { border-color: rgba(255,255,255,0.15); }
        .qty-btn:hover { background: var(--color-primary); border-color: var(--color-primary); color: white; }
        .qty-value { font-weight: 700; min-width: 20px; text-align: center; font-size: 0.95rem; }
        .qty-remove {
          width: 28px; height: 28px; border-radius: 8px;
          border: 1px solid rgba(220, 53, 69, 0.3); background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: #dc3545; margin-left: 4px;
        }
        .qty-remove:hover { background: #dc3545; color: white; border-color: #dc3545; }

        .cart-item-subtotal {
          font-weight: 700; font-size: 0.95rem; white-space: nowrap;
          color: var(--color-text); padding-top: 4px;
        }

        .cart-footer {
          padding: 20px 24px; border-top: 1px solid rgba(0,0,0,0.08);
          flex-shrink: 0; background: var(--color-surface);
        }
        [data-theme='dark'] .cart-footer { border-color: rgba(255,255,255,0.08); }
        .cart-total-row {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 1.1rem; margin-bottom: 8px;
        }
        .cart-total-row strong { font-size: 1.3rem; color: var(--color-primary); }
        .mt-4 { margin-top: 16px; }
        .guest-checkout-prompt {
          background: var(--color-bg);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 0;
        }
        [data-theme='dark'] .guest-checkout-prompt { border-color: rgba(255,255,255,0.08); }
        .guest-prompt-message {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; font-weight: 600; font-size: 0.95rem;
          color: var(--color-text); margin-bottom: 4px;
        }
      `}</style>
    </>
  );
};

export default CartDrawer;
