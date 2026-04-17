import { Calendar, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { getApiPath } from '../api';

const Consultation = () => {
  const [formData, setFormData] = useState({ name: '', email: '', concern: '', preferredDate: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(getApiPath('/api/consultations'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('✅ Appointment requested successfully. We will email you to confirm the time.');
        setFormData({ name: '', email: '', concern: '', preferredDate: '' });
      } else {
        setStatus('❌ Failed to request appointment. Please try again.');
      }
    } catch {
      setStatus('❌ Network error. Check your connection.');
    }
  };
  return (
    <div className="consultation-page fade-in">
      <div className="consult-hero">
        <div className="container text-center">
          <h1>Ayurvedic Consultation</h1>
          <p className="text-lg text-muted">A personalized roadmap to deep, lasting wellness.</p>
        </div>
      </div>

      <div className="container mt-8 consult-grid">
        <div className="consult-info bg-surface glass p-8">
          <h2>Why book a consultation?</h2>
          <p className="text-muted mt-4 mb-6">In Ayurveda, there is no generic remedy. Every individual is a unique combination of elements (Doshas). A 1-on-1 consultation allows our practitioners to uncover the root cause of imbalances rather than just treating symptoms.</p>
          
          <ul className="benefits-list mt-6">
            <li><strong>Discover your Prakriti:</strong> Understand your unique mind-body type.</li>
            <li><strong>Personalized Diet:</strong> Learn which foods heal and which harm your body.</li>
            <li><strong>Herbal Protocol:</strong> Receive custom botanical prescriptions.</li>
            <li><strong>Lifestyle Shifts:</strong> Gentle daily practices designed just for you.</li>
          </ul>
        </div>
        
        <div className="consult-form bg-surface p-8">
          <h3>Request an Appointment</h3>
          {status && (
            <div style={{ padding: '12px', background: status.includes('✅') ? '#d4edda' : '#f8d7da', color: status.includes('✅') ? '#155724' : '#721c24', borderRadius: '8px', marginTop: '16px', marginBottom: '8px', fontSize: '0.9rem' }}>
              {status}
            </div>
          )}
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="input-field" placeholder="E.g. Maya Sharma" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" className="input-field" placeholder="maya@example.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Primary Health Concern</label>
              <select className="input-field" required value={formData.concern} onChange={(e) => setFormData({...formData, concern: e.target.value})}>
                <option value="">Select an area</option>
                <option value="digestion">Digestive Health</option>
                <option value="stress">Stress & Anxiety</option>
                <option value="skin">Skin Conditions</option>
                <option value="immunity">Low Immunity</option>
                <option value="other">Other / General Checkup</option>
              </select>
            </div>
            <div className="input-group">
              <label>Preferred Date</label>
              <input type="date" className="input-field" required value={formData.preferredDate} onChange={(e) => setFormData({...formData, preferredDate: e.target.value})} />
            </div>
            <button className="btn btn-primary full-width mt-4" type="submit">
              <Calendar size={18} /> Schedule Consultation
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .consult-hero { padding: 140px 0 80px; background-color: var(--color-bg); border-bottom: 1px solid rgba(0,0,0,0.05); }
        .consult-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 80px; }
        .p-8 { padding: 40px; border-radius: var(--radius-md); box-shadow: var(--shadow-md); }
        .benefits-list li { margin-bottom: 16px; padding-left: 24px; position: relative; }
        .benefits-list li::before { content: '•'; color: var(--color-primary); position: absolute; left: 0; font-size: 1.5rem; line-height: 1; }
        @media(max-width: 900px) {
          .consult-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Consultation;
