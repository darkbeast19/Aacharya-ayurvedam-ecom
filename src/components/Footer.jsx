const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2>Aacharya ayurvedam</h2>
          <p className="text-muted">Awakening the body’s innate wisdom through ancient science and pure botanical remedies.</p>
        </div>
        
        <div className="footer-links-group">
          <h4>Shop</h4>
          <ul>
            <li><a href="/shop">By Dosha</a></li>
            <li><a href="/shop">By Goal</a></li>
            <li><a href="/shop">Best Sellers</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Discover</h4>
          <ul>
            <li><a href="/consultation">Consultations</a></li>
            <li><a href="/about">Our Story</a></li>
            <li><a href="#">Ayurveda 101</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Balanced</h4>
          <p className="text-muted text-sm">Join our newsletter for holistic tips and gentle updates.</p>
          <div className="newsletter-input">
            <input type="email" placeholder="Email address" className="input-field" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container text-center text-muted text-sm">
          &copy; {new Date().getFullYear()} Aacharya ayurvedam Wellness. All rights reserved. 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
