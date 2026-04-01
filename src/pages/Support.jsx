import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const Support = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Your message has been sent. Our Vaidya will get back to you soon.');
        e.target.reset();
    };

    return (
        <div style={{ paddingTop: '100px', backgroundColor: 'var(--beige-light)', minHeight: '100vh' }}>
            <div className="container" style={{ paddingBottom: '80px' }}>
                <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                    <h1 className="section-title">Help & Support</h1>
                    <p className="section-subtitle">We are here to assist you with your queries and concerns.</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
                    {/* Contact Information */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <div className="glass" style={{ padding: '32px', borderRadius: '16px', backgroundColor: 'var(--white)' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Get in Touch</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Call Us</h3>
                                        <p className="text-muted">+91 98765 43210</p>
                                        <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>Mon-Sat 9:00 AM to 6:00 PM</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Email Us</h3>
                                        <p className="text-muted">support@aacharyaayurvedam.com</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Visit Our Clinic</h3>
                                        <p className="text-muted" style={{ lineHeight: '1.5' }}>
                                            123, Vedic Marg, Sector 4<br />
                                            Near Dhanvantari Park<br />
                                            New Delhi, 110001
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div style={{ flex: '1.5', minWidth: '300px' }}>
                        <div className="glass" style={{ padding: '40px', borderRadius: '16px', backgroundColor: 'var(--white)' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <MessageCircle size={24} className="text-primary" /> Send a Message
                            </h2>
                            {status && <div style={{ padding: '16px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '24px' }}>{status}</div>}
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    <div className="input-group" style={{ flex: '1', minWidth: '200px' }}>
                                        <label>Your Name</label>
                                        <input type="text" className="input-field" required placeholder="John Doe" />
                                    </div>
                                    <div className="input-group" style={{ flex: '1', minWidth: '200px' }}>
                                        <label>Email Address</label>
                                        <input type="email" className="input-field" required placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>Subject</label>
                                    <select className="input-field" required>
                                        <option value="">Select a topic</option>
                                        <option value="order">Order Inquiry</option>
                                        <option value="product">Product Information</option>
                                        <option value="consultation">Consultation Booking</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Message</label>
                                    <textarea className="input-field" rows="5" required placeholder="How can we help you today?"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 32px' }}>
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
