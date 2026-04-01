const About = () => {
  return (
    <div className="about-page fade-in">
      <div className="container" style={{ padding: '140px 24px 80px' }}>
        <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="mb-4">Our Heritage</h1>
          <p className="text-xl text-muted">
            Rooted in the ancient healing traditions of India, AyurVeda aims to make holistic, natural medicine accessible to the modern world.
          </p>
        </div>
        
        <div className="story-grid mt-8">
          <div className="story-text">
            <h2>The Science of Life</h2>
            <p>Ayurveda, literally translating to the "Science of Life", is a 5,000-year-old system of natural healing that has its origins in the Vedic culture of India. While western medicine often focuses on treating specific symptoms, Ayurveda focuses on the individual as a whole.</p>
            <p className="mt-4">We believe that every individual holds the power to heal themselves given the right natural tools, diet, and lifestyle adjustments. Our products are carefully crafted using time-tested formulas and sustainably sourced herbs.</p>
          </div>
          <div className="story-stats bg-surface p-8">
            <div className="stat-item">
              <h3 className="text-primary text-xl">100%</h3>
              <p className="text-muted">Organic Sourcing</p>
            </div>
            <div className="stat-item">
              <h3 className="text-primary text-xl">50+</h3>
              <p className="text-muted">Potent Herbs Used</p>
            </div>
            <div className="stat-item">
              <h3 className="text-primary text-xl">15+</h3>
              <p className="text-muted">Expert Practitioners</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mb-4 { margin-bottom: 24px; }
        .about-page p { line-height: 1.8; }
        .story-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 64px; align-items: center; margin-top: 80px;}
        .story-text h2 { margin-bottom: 24px; }
        .story-stats { display: flex; flex-direction: column; gap: 32px; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
        .stat-item { border-left: 4px solid var(--color-primary); padding-left: 24px; }
        .stat-item h3 { font-size: 2.5rem; margin-bottom: 8px; }
        @media(max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default About;
