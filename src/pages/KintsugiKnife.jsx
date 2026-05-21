import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import './KintsugiKnife.css';

const KintsugiKnife = () => {
    const { addToCart } = useCart();
    const [openFaq, setOpenFaq] = useState(null);

    const hero = {
        headline: 'Where Art Meets Precision in Every Slice',
        subheadline: 'Inspired by the Japanese art of Kintsugi — beauty through imperfection. Each knife is hand-forged and adorned with gold veins, making every blade truly one-of-a-kind.',
        badge1: 'Lifetime Guarantee', badge2: 'Free Worldwide Shipping', badge3: 'Each Knife Unique'
    };

    const story = {
        heading: 'The Philosophy of Kintsugi',
        body: 'Kintsugi (金継ぎ) is the centuries-old Japanese art of repairing broken ceramics with gold lacquer — turning damage into beauty. We applied this philosophy to steel. Every fracture line, every golden vein is a celebration of resilience and renewal.'
    };

    const specs = [
        { label: 'Blade Material', value: 'Böhler J2 Japanese Steel' },
        { label: 'Blade Length', value: '8 inches (20 cm)' },
        { label: 'Total Length', value: '12 inches (30 cm)' },
        { label: 'Hardness', value: '58 HRC Rockwell' },
        { label: 'Gold Veining', value: '24K gold-fill inlay, hand-applied' },
        { label: 'Handle', value: 'High-grade Pakka Wood' },
        { label: 'Edge Angle', value: '15° per side' },
        { label: 'Weight', value: '~220g' },
    ];

    const faqs = [
        { q: 'Is each knife truly unique?', a: 'Yes. The 24K gold vein pattern is hand-applied by our artisans. No two knives are identical — each one is a one-of-a-kind piece of functional art.' },
        { q: 'Is it dishwasher safe?', a: 'Hand-wash only. Dishwashers dull the blade edge and can damage the gold veins over time. We include a care guide with every purchase.' },
        { q: 'When will my order ship?', a: 'Orders ship within 7–14 business days. Each knife is inspected and hand-packaged before dispatch.' },
        { q: 'What if I\'m not satisfied?', a: 'We offer a 30-day money-back guarantee. If you\'re not completely in love with your knife, return it for a full refund.' },
    ];

    const silverKnife = products.find(p => p.id === 'silver-edition');

    return (
        <div className="kintsugi-page animate-fade-in">
            {/* Hero */}
            <section className="kintsugi-hero">
                <div className="container">
                    <div className="kintsugi-hero-grid">
                        <div className="kintsugi-hero-text">
                            <span className="section-label">Signature Collection</span>
                            <h1>Where <em>Art</em> Meets<br /><em>Precision</em></h1>
                            <p>{hero.subheadline}</p>
                            <div className="kintsugi-badges">
                                <span className="kintsugi-badge">{hero.badge1}</span>
                                <span className="kintsugi-badge">{hero.badge2}</span>
                                <span className="kintsugi-badge">{hero.badge3}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <NavLink to="/shop" className="btn btn-primary btn-lg">
                                    Shop Now <ArrowRight size={16} />
                                </NavLink>
                            </div>
                        </div>
                        <div className="kintsugi-hero-image">
                            <img src="/images/hero-knife.png" alt="Kintsugi Chef Knife" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="kintsugi-story section-padding">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label" style={{ justifyContent: 'center' }}>The Origin</span>
                        <h2>The Philosophy of <em>Kintsugi</em></h2>
                        <div className="gold-divider"></div>
                    </div>
                    <p>{story.body}</p>
                </div>
            </section>

            {/* Specs */}
            <section className="kintsugi-specs section-padding">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label" style={{ justifyContent: 'center' }}>Specifications</span>
                        <h2 className="section-title">Built to <em>Perform</em></h2>
                    </div>
                    <div className="specs-table">
                        {specs.map((spec, idx) => (
                            <div key={idx} className="specs-table-row">
                                <span className="specs-table-label">{spec.label}</span>
                                <span className="specs-table-value">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="kintsugi-faq section-padding">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label" style={{ justifyContent: 'center' }}>FAQ</span>
                        <h2 className="section-title">Common <em>Questions</em></h2>
                    </div>
                    <div className="faq-list">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="faq-item">
                                <button className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                                    {faq.q}
                                    {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                                {openFaq === idx && (
                                    <p className="faq-answer">{faq.a}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-banner">
                <div className="container">
                    <div className="cta-content">
                        <h2>Own a Piece of <em>History</em></h2>
                        <p>Starting from just $47 — limited quantities available.</p>
                        {silverKnife && (
                            <button className="btn btn-primary btn-lg" onClick={() => addToCart(silverKnife)}>
                                Add to Cart — $47.00
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default KintsugiKnife;
