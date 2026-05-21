import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Award, Star, Truck, RotateCcw } from 'lucide-react';
import './Home.css';

const Home = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [heroLoaded, setHeroLoaded] = useState(false);

    useEffect(() => {
        setHeroLoaded(true);
        const timer = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const testimonials = [
        { text: "The alignment and tension on these forceps are absolutely flawless. Autoclaving leaves them pristine without any steel degradation.", author: "Dr. Marcus V., D.D.S.", title: "Lead Prosthodontist, Boston Dental Group" },
        { text: "We upgraded our veterinary surgical suite with their instruments. Durable, lightweight, and engineered to high ISO standards.", author: "Dr. Clara T., D.V.M.", title: "Chief Surgeon, Metro Animal Hospital" },
        { text: "Getting bulk custom surgical packs for our medical center was seamless. Outstanding B2B support and quick delivery.", author: "Richard L.", title: "Director of Clinical Procurement, NY Health" },
    ];

    return (
        <div className="home-page">
            {/* ===== HERO ===== */}
            <section className="hero">
                <div className="hero-grain"></div>
                <div className="hero-gradient-orb hero-orb-1"></div>
                <div className="hero-gradient-orb hero-orb-2"></div>

                <div className="container hero-grid">
                    <div className={`hero-content ${heroLoaded ? 'hero-visible' : ''}`}>
                        <div className="hero-badge">
                            <span className="hero-badge-dot"></span>
                            CE & ISO 13485 Certified Medical Grade Steel
                        </div>
                        <h1 className="hero-title">
                            Where <em>Steel</em> Meets<br />
                            <em>Precision</em>
                        </h1>
                        <p className="hero-subtitle">
                            Premium clinical surgical, dental, and veterinary instruments.
                            Engineered from German-grade surgical stainless steel for exceptional durability and tactile feedback.
                        </p>
                        <div className="hero-cta">
                            <NavLink to="/shop" className="btn btn-primary btn-lg" id="hero-shop-btn">
                                Explore Collection <ArrowRight size={16} />
                            </NavLink>
                            <NavLink to="/about" className="btn btn-outline btn-lg" id="hero-story-btn">
                                Our Quality Standards
                            </NavLink>
                        </div>
                        <div className="hero-stats">
                            <div className="hero-stat">
                                <span className="hero-stat-number">15,000+</span>
                                <span className="hero-stat-label">Units Supplied</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">4.9★</span>
                                <span className="hero-stat-label">Clinical Rating</span>
                            </div>
                            <div className="hero-stat-divider"></div>
                            <div className="hero-stat">
                                <span className="hero-stat-number">100%</span>
                                <span className="hero-stat-label">German Austenitic Steel</span>
                            </div>
                        </div>
                    </div>
                    <div className={`hero-image ${heroLoaded ? 'hero-visible' : ''}`}>
                        <div className="hero-image-glow"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop" 
                            alt="Precision Surgical Instruments Collection" 
                            style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <div className="hero-scroll-indicator">
                    <span></span>
                </div>
            </section>

            {/* ===== TRUST BAR ===== */}
            <section className="trust-bar">
                <div className="container">
                    <div className="trust-items">
                        <div className="trust-item">
                            <Truck size={20} />
                            <span>Global Clinical Shipping</span>
                        </div>
                        <div className="trust-item">
                            <ShieldCheck size={20} />
                            <span>ISO 13485 Certified</span>
                        </div>
                        <div className="trust-item">
                            <RotateCcw size={20} />
                            <span>CE Approved Autoclavable</span>
                        </div>
                        <div className="trust-item">
                            <Award size={20} />
                            <span>Premium B2B Calibration</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CRAFTSMANSHIP ===== */}
            <section className="craft-section section-padding">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Engineering Standards</span>
                        <h2 className="section-title">The <em>Surgical</em> Standard</h2>
                        <p className="section-subtitle">
                            Every surgical, dental, and veterinary instrument undergoes a rigorous 47-step testing process, ensuring zero slip and absolute safety.
                        </p>
                    </div>
                    <div className="craft-grid">
                        <div className="craft-card">
                            <div className="craft-card-icon">
                                <ShieldCheck size={28} />
                            </div>
                            <div className="craft-card-number">01</div>
                            <h3>Austenitic Steel</h3>
                            <p>High-chromium German stainless steel providing unmatched corrosion resistance under high autoclaving pressures of 134°C.</p>
                        </div>
                        <div className="craft-card">
                            <div className="craft-card-icon">
                                <Zap size={28} />
                            </div>
                            <div className="craft-card-number">02</div>
                            <h3>Edge Retentiveness</h3>
                            <p>Scissors and cutting edges equipped with Tungsten Carbide (TC) inserts, ensuring lifelong razor sharpness and pristine margins.</p>
                        </div>
                        <div className="craft-card">
                            <div className="craft-card-icon">
                                <Award size={28} />
                            </div>
                            <div className="craft-card-number">03</div>
                            <h3>Tactile Balance</h3>
                            <p>Perfect weight calibration between joint and tip, offering surgeons and practitioners complete control during sensitive operations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="testimonials-section section-padding">
                <div className="container-narrow">
                    <div className="section-header">
                        <span className="section-label">Testimonials</span>
                        <h2 className="section-title">Trusted by <em>Clinicians</em></h2>
                    </div>
                    <div className="testimonial-carousel">
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className={`testimonial-card ${idx === currentTestimonial ? 'active' : ''}`}>
                                <div className="testimonial-stars">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--accent-gold)" color="var(--accent-gold)" />)}
                                </div>
                                <blockquote>"{testimonial.text}"</blockquote>
                                <div className="testimonial-author">
                                    <strong>{testimonial.author}</strong>
                                    <span>{testimonial.title}</span>
                                </div>
                            </div>
                        ))}
                        <div className="testimonial-dots">
                            {testimonials.map((_, idx) => (
                                <button key={idx} className={`dot ${idx === currentTestimonial ? 'active' : ''}`} onClick={() => setCurrentTestimonial(idx)} aria-label={`Go to testimonial ${idx + 1}`}></button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== STORY TEASER ===== */}
            <section className="story-teaser section-padding">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-image-col">
                            <div className="story-image-frame">
                                <img 
                                    src="https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop" 
                                    alt="Surgical Metal Integrity" 
                                    style={{ borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        <div className="story-text-col">
                            <span className="section-label">Our Metallurgy Philosophy</span>
                            <h2>Engineered for<br /><em>Resilience</em></h2>
                            <p>
                                Clinical integrity is an absolute science. We understand that medical professionals require complete confidence in their tools to perform lifesaving actions.
                            </p>
                            <p>
                                Our instruments embody this dedication. Every joint, every serration, and every micro-finished handle is meticulously hand-calibrated and polished by elite metal artisans.
                            </p>
                            <NavLink to="/about" className="btn btn-ghost" id="read-story-link">
                                Read Our Quality Blueprint
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA BANNER ===== */}
            <section className="cta-banner">
                <div className="cta-grain"></div>
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Elevate Your <em>Clinical Inventory</em>?</h2>
                        <p>Join thousands of hospitals, clinics, and private practices that trust our metal daily.</p>
                        <NavLink to="/shop" className="btn btn-primary btn-lg" id="cta-shop-btn">
                            Explore Catalog <ArrowRight size={16} />
                        </NavLink>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
