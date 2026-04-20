const About = () => {
  return (
    <div className="about-page fade-in">
      <div className="container" style={{ padding: '140px 24px 80px' }}>
        <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="mb-4">About Us – Acharya Ayurvedam</h1>
          <p className="text-xl text-muted">
            At Acharya Ayurvedam, we believe that true wellness comes from nature. Rooted in the timeless science of Ayurveda, our mission is to bring safe, effective, and natural health solutions to every home.
          </p>
        </div>
        
        <div className="story-grid mt-8">
          <div className="story-text">
            <h2>Our Story</h2>
            <p>We combine ancient Ayurvedic wisdom with modern quality standards to create products that support a healthier and more balanced lifestyle. Each formulation is carefully prepared using authentic herbs, traditional methods, and strict quality control, ensuring purity and effectiveness in every product.</p>
            
            <h2 className="mt-8">Our Vision</h2>
            <p>To revive and promote Ayurveda as a trusted, natural way of living, helping people achieve long-term health without harmful chemicals.</p>

            <h2 className="mt-8">Our Mission</h2>
            <ul>
              <li>To provide high-quality Ayurvedic products that are safe and reliable</li>
              <li>To educate people about the benefits of natural healing</li>
              <li>To make Ayurveda accessible and affordable for everyone</li>
            </ul>

            <h2 className="mt-8">Our Commitment</h2>
            <p>We are dedicated to maintaining the highest standards of purity, transparency, and trust. Our goal is not just to sell products, but to build a community that embraces natural wellness and holistic living.</p>
            
            <h2 className="mt-8">Join Our Journey</h2>
            <p>Experience the power of Ayurveda with Acharya Ayurvedam and take a step towards a healthier, more balanced life—naturally.</p>
          </div>
          
          <div className="story-stats bg-surface p-8">
            <h3 className="mb-6">Why Choose Acharya Ayurvedam?</h3>
            <div className="stat-item">
              <h3 className="text-primary text-xl">🌿</h3>
              <p className="text-muted"><strong>100% Natural Ingredients</strong><br/>No harmful chemicals or additives</p>
            </div>
            <div className="stat-item">
              <h3 className="text-primary text-xl">🧪</h3>
              <p className="text-muted"><strong>Quality Assured</strong><br/>Carefully sourced herbs and tested formulations</p>
            </div>
            <div className="stat-item">
              <h3 className="text-primary text-xl">📜</h3>
              <p className="text-muted"><strong>Traditional Knowledge</strong><br/>Inspired by authentic Ayurvedic practices</p>
            </div>
            <div className="stat-item">
              <h3 className="text-primary text-xl">🤝</h3>
              <p className="text-muted"><strong>Customer First Approach</strong><br/>Your health and satisfaction are our priority</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .mb-4 { margin-bottom: 24px; }
        .mb-6 { margin-bottom: 32px; }
        .mt-8 { margin-top: 48px; }
        .about-page p { line-height: 1.8; }
        .story-text ul { list-style-type: disc; padding-left: 20px; line-height: 1.8; margin-top: 16px; }
        .story-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 64px; align-items: start; margin-top: 80px;}
        .story-text h2 { margin-bottom: 16px; font-size: 1.8rem; }
        .story-stats { display: flex; flex-direction: column; gap: 32px; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); position: sticky; top: 120px; }
        .stat-item { border-left: 4px solid var(--color-primary); padding-left: 24px; }
        .stat-item h3 { font-size: 2rem; margin-bottom: 8px; }
        @media(max-width: 900px) {
          .story-grid { grid-template-columns: 1fr; }
          .story-stats { position: static; }
        }
      `}</style>
    </div>
  );
};

export default About;
