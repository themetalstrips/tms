import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import './Shop.css';

const CATEGORIES_DATA = {
    "Dental Instruments": [
        "Bracket Holder Angled",
        "Cement Spatula",
        "Dental Syringe",
        "Dissecting Forceps",
        "Extraction Forceps",
        "Mouth Mirror With Handle",
        "Needle Holder",
        "Root Elevator",
        "Scalar",
        "Scissors",
        "Wax Spatula"
    ],
    "Single Use Instruments": [
        "Disposable Scalpels",
        "Disposable Forceps",
        "Sterile Sutures",
        "Sterile Swabs",
        "Suture Removal Packs"
    ],
    "Surgical Instruments": [
        "Hemostatic Forceps",
        "Dissecting Forceps",
        "Tissue Forceps",
        "Surgical Scissors",
        "Needle Holders"
    ],
    "Veterinary Instruments": [
        "Bull Leads Holder",
        "Bull Nose Ring Applicator",
        "Castration Forceps",
        "Hoof Tools",
        "Obstetric Chains & Miking Tubes",
        "Pet Grooming Tools",
        "Teat Slitters",
        "Teat Tumor Extractor"
    ],
    "Kintsugi Knives": [
        "Chef Knives"
    ]
};

// Data for the beautiful premium category cards grid from first screenshot
const CATEGORY_CARDS = [
    {
        categoryKey: "Dental Instruments",
        scriptTitle: "Dental",
        blockTitle: "Instruments",
        bgImage: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=600&auto=format&fit=crop"
    },
    {
        categoryKey: "Single Use Instruments",
        scriptTitle: "Single Use",
        blockTitle: "Instruments",
        bgImage: "https://images.unsplash.com/photo-1584515901407-d8f46f5394e6?q=80&w=600&auto=format&fit=crop"
    },
    {
        categoryKey: "Surgical Instruments",
        scriptTitle: "Surgical",
        blockTitle: "Instruments",
        bgImage: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?q=80&w=600&auto=format&fit=crop"
    },
    {
        categoryKey: "Veterinary Instruments",
        scriptTitle: "Veterinary",
        blockTitle: "Instruments",
        bgImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=600&auto=format&fit=crop"
    },
    {
        categoryKey: "Kintsugi Knives",
        scriptTitle: "Kintsugi",
        blockTitle: "Knives",
        bgImage: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop"
    }
];

const Shop = () => {
    const { addToCart } = useCart();
    
    // Set default category to 'None' to hide bottom area until a user clicks a card!
    const [selectedCategory, setSelectedCategory] = useState('None');
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const getProductCategoryInfo = (product) => {
        if (product.id.startsWith('vet-')) {
            let subcat = "Other";
            if (product.name.includes("Bull Leads Holder")) subcat = "Bull Leads Holder";
            else if (product.name.includes("Bull Nose Ring Applicator")) subcat = "Bull Nose Ring Applicator";
            else if (product.name.includes("Castration Forceps")) subcat = "Castration Forceps";
            else if (product.name.includes("Hoof Tools")) subcat = "Hoof Tools";
            else if (product.name.includes("Obstetric Chains")) subcat = "Obstetric Chains & Miking Tubes";
            else if (product.name.includes("Pet Grooming") || product.name.includes("Pet Groom")) subcat = "Pet Grooming Tools";
            else if (product.name.includes("Teat Slitters")) subcat = "Teat Slitters";
            else if (product.name.includes("Teat Tumor Extractor")) subcat = "Teat Tumor Extractor";
            
            return { category: "Veterinary Instruments", subcategory: subcat };
        } else if (product.id.startsWith('dent-')) {
            return { category: "Dental Instruments", subcategory: product.subcategory };
        } else if (product.id.startsWith('surg-')) {
            return { category: "Surgical Instruments", subcategory: product.subcategory };
        } else if (product.id.startsWith('single-')) {
            return { category: "Single Use Instruments", subcategory: product.subcategory };
        } else {
            return { category: "Kintsugi Knives", subcategory: "Chef Knives" };
        }
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const info = getProductCategoryInfo(product);
        if (selectedCategory === 'All') return true;
        if (info.category !== selectedCategory) return false;
        if (selectedSubcategory && info.subcategory !== selectedSubcategory) return false;
        return true;
    });

    const handleCategoryClick = (category) => {
        if (selectedCategory === category) {
            setExpandedCategory(prev => prev === category ? null : category);
        } else {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
            setExpandedCategory(category);
        }
    };

    const handleSubcategoryClick = (category, subcat) => {
        setSelectedCategory(category);
        setSelectedSubcategory(subcat);
    };

    const handleClearFilters = () => {
        setSelectedCategory('All');
        setSelectedSubcategory(null);
        setExpandedCategory(null);
    };

    const handleCollapseToGrid = () => {
        setSelectedCategory('None');
        setSelectedSubcategory(null);
        setExpandedCategory(null);
    };

    return (
        <div className="shop-page section-padding animate-fade-in">
            <div className="container">
                <header className="shop-header" style={{ marginBottom: '2.5rem' }}>
                    <h1 className="section-title">The <span>Collection</span></h1>
                    <p className="shop-intro">
                        Explore our precision-crafted surgical and culinary instruments.
                        Inspired by master artisans, designed for exceptional performance and reliability.
                    </p>
                </header>

                {/* Categories Cards Visual Grid (Header Section) */}
                <div className="categories-grid-cards animate-fade-in">
                    <div className="categories-header-badge">
                        <span className="badge-dot"></span>
                        CATEGORIES
                        <span className="badge-dot"></span>
                    </div>
                    
                    <div className="category-cards-container">
                        {CATEGORY_CARDS.map((card) => (
                            <div 
                                key={card.categoryKey}
                                className={`category-card-item ${selectedCategory === card.categoryKey ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(card.categoryKey)}
                            >
                                <div className="category-card-bg" style={{ backgroundImage: `url('${card.bgImage}')` }}></div>
                                <div className="category-card-overlay">
                                    <div className="category-card-title">
                                        <span className="script-title">{card.scriptTitle}</span>
                                        <span className="block-title">{card.blockTitle}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dynamic Bottom Catalog - Hidden by default until a card is clicked! */}
                {selectedCategory !== 'None' && (
                    <div className="shop-layout animate-slide-up" style={{ animationDuration: '0.6s' }}>
                        {/* Left Sidebar - B2B Product Categories */}
                        <aside className="shop-sidebar">
                            <button 
                                className="btn btn-outline btn-sm" 
                                onClick={handleCollapseToGrid} 
                                style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem' }}
                            >
                                <ArrowLeft size={12} /> Back to Grid
                            </button>
                            <h2 className="sidebar-title">Product Categories</h2>
                            <ul className="category-list">
                                <li>
                                    <button 
                                        className={`category-main-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                                        onClick={handleClearFilters}
                                    >
                                        <span>All Collection ({products.length})</span>
                                    </button>
                                </li>
                                {Object.entries(CATEGORIES_DATA).map(([category, subcategories]) => {
                                    const isExpanded = expandedCategory === category;
                                    const isActive = selectedCategory === category;
                                    
                                    return (
                                        <li key={category} className="category-item-container">
                                            <button 
                                                className={`category-main-btn ${isActive ? 'active' : ''}`}
                                                onClick={() => handleCategoryClick(category)}
                                            >
                                                <span>{category}</span>
                                                {subcategories.length > 0 && (
                                                    <ChevronRight 
                                                        size={14} 
                                                        className={`category-chevron ${isExpanded ? 'expanded' : ''}`}
                                                    />
                                                )}
                                            </button>
                                            
                                            {isExpanded && subcategories.length > 0 && (
                                                <ul className="subcategory-list">
                                                    {subcategories.map(subcat => {
                                                        const subcatProducts = products.filter(p => {
                                                            const info = getProductCategoryInfo(p);
                                                            return info.category === category && info.subcategory === subcat;
                                                        });
                                                        
                                                        return (
                                                            <li key={subcat}>
                                                                <button
                                                                    className={`subcategory-btn ${selectedSubcategory === subcat ? 'active' : ''}`}
                                                                    onClick={() => handleSubcategoryClick(category, subcat)}
                                                                >
                                                                    {subcat} ({subcatProducts.length})
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </aside>

                        {/* Right Side - Dynamic Products Grid */}
                        <div className="shop-main-content">
                            {/* Filter Status Bar */}
                            {(selectedCategory !== 'All' || selectedSubcategory) && (
                                <div className="filter-reset-bar animate-fade-in">
                                    <div className="filter-info">
                                        Showing items in <span>{selectedCategory}</span>
                                        {selectedSubcategory && <> &gt; <span>{selectedSubcategory}</span></>}
                                        {` (${filteredProducts.length} items found)`}
                                    </div>
                                    <button className="btn btn-outline btn-sm" onClick={handleClearFilters}>
                                        Clear Filter
                                    </button>
                                </div>
                            )}

                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="product-card">
                                        <NavLink to={`/product/${product.id}`} className="product-card-link">
                                            <div className="product-image">
                                                <img src={product.image} alt={product.name} />
                                                <div className="product-badge">{product.badge || 'Premium'}</div>
                                            </div>
                                        </NavLink>
                                        <div className="product-info">
                                            <NavLink to={`/product/${product.id}`} className="product-title-link">
                                                <h3>{product.name}</h3>
                                            </NavLink>
                                            <p className="product-desc">{product.description}</p>
                                            <div className="product-price-row">
                                                {product.id.startsWith('vet-') || product.id.startsWith('dent-') || product.id.startsWith('surg-') || product.id.startsWith('single-') ? (
                                                    <>
                                                        <div className="price-tag">
                                                            <span className="quote-only-tag" style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>Quote Only</span>
                                                        </div>
                                                        <NavLink to={`/product/${product.id}`} className="btn btn-outline btn-sm" style={{ padding: '0.5rem 1rem' }}>
                                                            Inquire
                                                        </NavLink>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="price-tag">
                                                            <span className="current-price">${product.price.toFixed(2)}</span>
                                                            <span className="old-price">${product.retailPrice.toFixed(2)}</span>
                                                        </div>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => addToCart(product)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                                        <h3>No products currently in this category.</h3>
                                        <button className="btn btn-outline" onClick={handleClearFilters} style={{ marginTop: '1.5rem' }}>View All Collection</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Trust Features */}
                <section className="shop-features">
                    <div className="shop-feature">
                        <h4>CE & ISO Quality Standards</h4>
                        <p>Certified clinical reliability for culinary and surgical applications.</p>
                    </div>
                    <div className="shop-feature">
                        <h4>German Grade Steel</h4>
                        <p>Maximum edge retention, corrosion resistance, and autoclaving durability.</p>
                    </div>
                    <div className="shop-feature">
                        <h4>Premium Craftsmanship</h4>
                        <p>Every piece is individually hand-polished and inspected by master metal artisans.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Shop;
