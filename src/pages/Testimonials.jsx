import { useState, useEffect } from 'react';
import { Star, Quote, Truck, ShieldCheck, HeartPulse, Award, ThumbsUp, Leaf } from 'lucide-react';
import { getApiPath } from '../api';

const defaultTestimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    review: 'I have been using the Triphala Churna for 3 months now and the results are amazing! My digestion has improved significantly. The products are genuine and delivery was fast.',
    product: 'Triphala Churna',
    avatar: '🧘‍♀️',
    date: '2 weeks ago',
  },
  {
    name: 'Rahul Verma',
    location: 'Delhi, NCR',
    rating: 5,
    review: 'The Ashwagandha tablets have helped me manage stress like nothing else. I feel more energetic and focused throughout the day. Highly recommend Aacharya Ayurvedam!',
    product: 'Ashwagandha Tablets',
    avatar: '🧑‍💼',
    date: '1 month ago',
  },
  {
    name: 'Anjali Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 4,
    review: 'Great quality products. The packaging is premium and eco-friendly. I ordered the immunity booster kit and it arrived well within the estimated delivery time.',
    product: 'Immunity Booster Kit',
    avatar: '👩‍⚕️',
    date: '3 weeks ago',
  },
  {
    name: 'Vikram Singh',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    review: 'Best Ayurvedic store online! The customer support was super helpful — they even recommended the right product for my dosha type. Will definitely order again.',
    product: 'Vata Balance Oil',
    avatar: '🧔',
    date: '1 week ago',
  },
  {
    name: 'Sneha Iyer',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    review: 'I tried many brands before, but nothing compares to the purity and effectiveness of these formulations. My skin has transformed with their Kumkumadi Tailam!',
    product: 'Kumkumadi Tailam',
    avatar: '👩',
    date: '2 months ago',
  },
  {
    name: 'Arjun Nair',
    location: 'Kochi, Kerala',
    rating: 4,
    review: 'As someone from Kerala, I am very particular about Ayurvedic quality. Aacharya Ayurvedam exceeded my expectations. Authentic ingredients, no fillers.',
    product: 'Brahmi Ghrita',
    avatar: '🧑',
    date: '5 weeks ago',
  },
];

const serviceHighlights = [
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    description: 'We deliver across India within 3-7 business days. Orders above ₹999 qualify for free shipping.',
  },
  {
    icon: ShieldCheck,
    title: '100% Authentic Products',
    description: 'Every product is GMP-certified, lab-tested, and sourced from trusted Ayurvedic manufacturers.',
  },
  {
    icon: HeartPulse,
    title: 'Expert Consultation',
    description: 'Our Ayurvedic practitioners are available to help you choose the right products for your dosha.',
  },
  {
    icon: Award,
    title: 'Quality Guarantee',
    description: 'Not satisfied? We offer hassle-free returns and exchanges within our policy window.',
  },
];

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '500+', label: 'Products Delivered Daily' },
  { value: '99%', label: 'Satisfaction Rate' },
];

const StarRating = ({ rating }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        fill={star <= rating ? '#e6a817' : 'none'}
        stroke={star <= rating ? '#e6a817' : '#d1d5db'}
        strokeWidth={2}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    fetch(getApiPath('/api/content/testimonials'))
      .then(res => res.json())
      .then(data => {
        if (data.reviews && data.reviews.length > 0) {
          setTestimonials(data.reviews);
        }
      })
      .catch(() => {/* Use defaults */});
  }, []);

  return (
    <div className="testimonials-page fade-in">
      {/* Hero Banner */}
      <section className="testimonials-hero">
        <div className="container text-center">
          <span className="pill badge">Trusted by Thousands</span>
          <h1>What Our Customers Say</h1>
          <p className="text-lg text-muted" style={{ maxWidth: '640px', margin: '0 auto' }}>
            Real stories from real people who have transformed their wellness journey with authentic Ayurvedic formulations.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Cards */}
      <section className="testimonials-cards-section">
        <div className="container">
          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card glass">
                <div className="testimonial-quote-icon">
                  <Quote size={24} />
                </div>
                <StarRating rating={t.rating} />
                <p className="testimonial-text">{t.review}</p>
                <div className="testimonial-footer">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <h4 className="testimonial-name">{t.name}</h4>
                    <p className="testimonial-location">{t.location}</p>
                  </div>
                </div>
                {t.product && (
                  <span className="testimonial-product">
                    <ThumbsUp size={12} /> Purchased: {t.product}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Quality Section */}
      <section className="service-quality-section bg-surface">
        <div className="container">
          <div className="section-header text-center">
            <span className="pill badge">Why Choose Us</span>
            <h2>Our Commitment to Excellence</h2>
            <p className="text-muted" style={{ maxWidth: '560px', margin: '0 auto' }}>
              We go beyond selling products — we deliver wellness experiences backed by tradition, quality, and care.
            </p>
          </div>
          <div className="service-grid">
            {serviceHighlights.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div key={idx} className="service-card">
                  <div className="service-icon-wrap">
                    <IconComp size={28} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust CTA */}
      <section className="trust-cta-section">
        <div className="container text-center">
          <Leaf size={40} style={{ color: 'var(--color-accent)', marginBottom: '16px' }} />
          <h2>Join Our Growing Community</h2>
          <p className="text-muted text-lg" style={{ maxWidth: '560px', margin: '0 auto 32px' }}>
            Thousands of families across India trust Aacharya Ayurvedam for their holistic wellness needs.
          </p>
          <a href="/shop" className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.05rem' }}>
            Explore Our Products
          </a>
        </div>
      </section>

      <style>{`
        .testimonials-hero {
          padding: 140px 0 60px;
          background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%);
        }
        .testimonials-hero h1 {
          font-size: 3rem;
          margin-top: 16px;
          margin-bottom: 16px;
        }
        .testimonials-hero .pill.badge {
          display: inline-block;
          padding: 6px 16px;
          background-color: var(--color-surface);
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          border-radius: var(--radius-full);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .stats-section { 
          padding: 40px 0;
          background: var(--color-primary);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          text-align: center;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-value {
          font-family: var(--font-headline);
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
        }
        .stat-label {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.75);
        }

        .testimonials-cards-section { padding: 80px 0; }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .testimonial-card {
          padding: 28px;
          border-radius: var(--radius-md);
          position: relative;
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-lg);
        }
        .testimonial-quote-icon {
          color: var(--color-accent);
          opacity: 0.5;
        }
        .star-rating {
          display: flex;
          gap: 2px;
        }
        .testimonial-text {
          color: var(--color-text-muted);
          line-height: 1.7;
          font-size: 0.95rem;
          flex: 1;
        }
        .testimonial-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        [data-theme='dark'] .testimonial-footer {
          border-color: rgba(255,255,255,0.08);
        }
        .testimonial-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }
        .testimonial-name {
          font-size: 0.95rem;
          margin: 0;
          color: var(--color-text);
        }
        .testimonial-location {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin: 0;
        }
        .testimonial-product {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: var(--color-primary);
          background: var(--color-surface);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          width: fit-content;
          font-weight: 500;
        }

        .service-quality-section { padding: 80px 0; }
        .service-quality-section .section-header { margin-bottom: 48px; }
        .service-quality-section .pill.badge {
          display: inline-block;
          padding: 6px 16px;
          background-color: var(--color-bg);
          border: 1px solid var(--color-primary);
          color: var(--color-primary);
          border-radius: var(--radius-full);
          font-weight: 500;
          font-size: 0.9rem;
          margin-bottom: 16px;
        }
        .service-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }
        .service-card {
          background: var(--color-bg);
          padding: 32px 24px;
          border-radius: var(--radius-md);
          text-align: center;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
        }
        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
        }
        .service-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: var(--color-primary);
        }
        .service-card h3 {
          font-size: 1.05rem;
          margin-bottom: 8px;
        }
        .service-card p {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        .trust-cta-section {
          padding: 80px 0;
        }
        .trust-cta-section h2 {
          margin-bottom: 12px;
        }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          .service-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .testimonials-hero h1 { font-size: 2.2rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .stat-value { font-size: 1.5rem; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .service-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
