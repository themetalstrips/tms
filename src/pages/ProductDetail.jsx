import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { ArrowLeft, CheckCircle, Truck, Shield, X, Check } from 'lucide-react';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [quoteSubmitted, setQuoteSubmitted] = useState(false);
    const [quoteForm, setQuoteForm] = useState({ name: '', email: '', hospital: '', quantity: 1, notes: '' });

    const handleQuoteSubmit = (e) => {
        e.preventDefault();
        setQuoteSubmitted(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setQuoteForm(prev => ({ ...prev, [name]: value }));
    };

    const product = products.find(p => p.id === id);

    if (!product) {
        return (
            <div className="section-padding container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
                <h2>Product not found</h2>
                <button className="btn btn-outline" onClick={() => navigate('/shop')} style={{ marginTop: '2rem' }}>Back to Shop</button>
            </div>
        );
    }

    return (
        <div className="product-detail animate-fade-in">
            <div className="container">
                <button className="btn btn-ghost" onClick={() => navigate('/shop')} style={{ marginBottom: '2rem' }}>
                    <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Collection
                </button>

                <div className="product-detail-grid">
                    <div className="product-detail-image">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="product-detail-info">
                        {product.badge && <span className="product-badge-detail">{product.badge}</span>}
                        <h1>{product.name}</h1>
                        {product.subtitle && <p className="product-detail-subtitle">{product.subtitle}</p>}

                        {!product.id.startsWith('vet-') && (
                            <div className="detail-price-section">
                                <span className="detail-current-price">${product.price.toFixed(2)}</span>
                                <span className="detail-old-price">${product.retailPrice.toFixed(2)}</span>
                            </div>
                        )}

                        <p className="detail-description">{product.description}</p>

                        <div className="detail-specs-grid">
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className="detail-spec-item">
                                    <span className="spec-label">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="spec-value">{value}</span>
                                </div>
                            ))}
                        </div>

                        {product.id.startsWith('vet-') ? (
                            <button
                                className="btn btn-primary detail-add-to-cart"
                                onClick={() => setShowQuoteModal(true)}
                                id="product-request-quote"
                                style={{ background: 'var(--accent-gold)', borderColor: 'var(--accent-gold)', color: '#000' }}
                            >
                                Request Custom Quote
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary detail-add-to-cart"
                                onClick={() => addToCart(product)}
                                id="product-add-to-cart"
                            >
                                Add to Cart — ${product.price.toFixed(2)}
                            </button>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                <Truck size={16} color="var(--accent-gold)" /> Free Worldwide Shipping
                            </div>
                            {product.id.startsWith('vet-') ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Shield size={16} color="var(--accent-gold)" /> CE & ISO Certified Medical Standard
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <CheckCircle size={16} color="var(--accent-gold)" /> Autoclavable German Stainless Steel
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Shield size={16} color="var(--accent-gold)" /> 30-Day Money Back Guarantee
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <CheckCircle size={16} color="var(--accent-gold)" /> Authentic Kintsugi Etching
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showQuoteModal && (
                <div className="modal-overlay" onClick={() => { setShowQuoteModal(false); setQuoteSubmitted(false); }}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => { setShowQuoteModal(false); setQuoteSubmitted(false); }}>
                            <X size={20} />
                        </button>
                        
                        {!quoteSubmitted ? (
                            <>
                                <h2>Request Direct Quote</h2>
                                <p className="modal-subtitle">
                                    Submit your requirement details below. A Mozek Surgical representative will contact you with bulk contract pricing within 24 hours.
                                </p>
                                <form onSubmit={handleQuoteSubmit} className="modal-form">
                                    <div className="form-group">
                                        <label htmlFor="quote-product">Selected Instrument</label>
                                        <input
                                            type="text"
                                            id="quote-product"
                                            className="form-input"
                                            value={product.name}
                                            disabled
                                            style={{ opacity: 0.7, background: 'rgba(255,255,255,0.01)' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quote-name">Full Name *</label>
                                        <input
                                            type="text"
                                            id="quote-name"
                                            name="name"
                                            className="form-input"
                                            required
                                            value={quoteForm.name}
                                            onChange={handleFormChange}
                                            placeholder="Dr. Alexander Smith"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quote-hospital">Hospital / Clinic *</label>
                                        <input
                                            type="text"
                                            id="quote-hospital"
                                            name="hospital"
                                            className="form-input"
                                            required
                                            value={quoteForm.hospital}
                                            onChange={handleFormChange}
                                            placeholder="St. Jude Veterinary Center"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quote-email">Work Email *</label>
                                        <input
                                            type="email"
                                            id="quote-email"
                                            name="email"
                                            className="form-input"
                                            required
                                            value={quoteForm.email}
                                            onChange={handleFormChange}
                                            placeholder="smith@vetclinic.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quote-qty">Quantity Needed *</label>
                                        <input
                                            type="number"
                                            id="quote-qty"
                                            name="quantity"
                                            className="form-input"
                                            required
                                            min="1"
                                            value={quoteForm.quantity}
                                            onChange={handleFormChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="quote-notes">Notes / Special Requirements</label>
                                        <textarea
                                            id="quote-notes"
                                            name="notes"
                                            className="form-input form-textarea"
                                            value={quoteForm.notes}
                                            onChange={handleFormChange}
                                            placeholder="Specify sizes, customization, or shipping schedule..."
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', background: 'var(--accent-gold)', color: '#000', borderColor: 'var(--accent-gold)' }}>
                                        Submit Quote Request
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="modal-success">
                                <div className="modal-success-icon">
                                    <Check size={32} />
                                </div>
                                <h3>Request Submitted</h3>
                                <p>
                                    Thank you, <strong>{quoteForm.name}</strong>. Your inquiry for <strong>{quoteForm.quantity} × {product.name}</strong> has been successfully registered under <strong>{quoteForm.hospital}</strong>.<br /><br />
                                    A professional B2B wholesale quotation has been dispatched to <strong>{quoteForm.email}</strong>.
                                </p>
                                <button className="btn btn-outline" onClick={() => { setShowQuoteModal(false); setQuoteSubmitted(false); }}>
                                    Back to Catalog
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
