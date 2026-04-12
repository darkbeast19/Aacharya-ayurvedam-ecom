import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <h2>Aacharya ayurvedam</h2>
          <p className="text-muted">Awakening the body's innate wisdom through ancient science and pure botanical remedies.</p>
        </div>
        
        <div className="footer-links-group">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">By Dosha</Link></li>
            <li><Link to="/shop">By Goal</Link></li>
            <li><Link to="/shop">Best Sellers</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Discover</h4>
          <ul>
            <li><Link to="/consultation">Consultations</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Help & Info</h4>
          <ul>
            <li><Link to="/support">Support</Link></li>
            <li><Link to="/policies">Policies</Link></li>
            <li><Link to="/policies">Shipping Info</Link></li>
          </ul>
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
