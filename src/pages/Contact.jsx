import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page animate-fade-in" style={{ paddingTop: '8.5rem', marginBottom: '5rem' }}>
            <div className="container">
                <header className="shop-header" style={{ marginBottom: '3.5rem' }}>
                    <h1 className="section-title">Contact <span>Support</span></h1>
                    <p className="shop-intro">
                        Have questions about custom kits, B2B procurement, or medical grade steel certifications?
                        Our clinical support desk is here to assist you.
                    </p>
                </header>

                <div className="contact-grid-container">
                    {/* Left Column: B2B Desk Details */}
                    <div className="contact-info-col" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-heading)', fontWeight: '500', fontSize: '1.5rem', marginBottom: '0.5rem' }}>B2B Corporate Desk</h2>
                        
                        <div className="contact-info-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                            <Phone size={24} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Direct Phone</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>+92 321 4555949</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Monday – Friday: 9AM – 6PM EST</span>
                            </div>
                        </div>

                        <div className="contact-info-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                            <Mail size={24} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Support Email</h3>
                                <a href="mailto:info@themetalstrips.com" style={{ fontSize: '0.95rem', color: 'var(--accent-gold)', textDecoration: 'none', transition: 'color 0.2s' }}>info@themetalstrips.com</a>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Response within 1 business day</p>
                            </div>
                        </div>

                        <div className="contact-info-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                            <MapPin size={24} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Headquarters</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>The Metal Strips</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sialkot 51310, Punjab, Pakistan</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Form */}
                    <div className="contact-form-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '3rem' }}>
                        {submitted ? (
                            <div className="form-success-state" style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <CheckCircle size={56} style={{ color: 'var(--accent-gold)', marginBottom: '1.5rem' }} />
                                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-heading)', fontWeight: '500', marginBottom: '0.75rem' }}>Message Transmitted Successfully</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto' }}>
                                    Thank you for contacting The Metal Strips B2B desk. A clinical account manager has been assigned to your inquiry and will follow up shortly.
                                </p>
                                <button className="btn btn-outline" style={{ marginTop: '2rem' }} onClick={() => setSubmitted(false)}>Send Another Message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-heading)', fontWeight: '500', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Send a Message</h2>
                                
                                <div className="contact-inputs-row">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label htmlFor="name" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            name="name" 
                                            required 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', color: 'var(--text-heading)', fontSize: '0.95rem', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label htmlFor="email" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            required 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', color: 'var(--text-heading)', fontSize: '0.95rem', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label htmlFor="subject" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject Inquiry</label>
                                    <input 
                                        type="text" 
                                        id="subject" 
                                        name="subject" 
                                        required 
                                        value={formData.subject} 
                                        onChange={handleChange} 
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', color: 'var(--text-heading)', fontSize: '0.95rem', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label htmlFor="message" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message Details</label>
                                    <textarea 
                                        id="message" 
                                        name="message" 
                                        required 
                                        rows="5"
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.8rem 1rem', color: 'var(--text-heading)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}>
                                    Transmit Message <Send size={16} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
