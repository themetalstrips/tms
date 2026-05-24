import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { cartCount, setIsCartOpen } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container nav-container">
                <NavLink to="/" className="nav-logo">
                    The Metal Strips
                </NavLink>

                <nav className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                    <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</NavLink>
                    <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</NavLink>
                </nav>

                <div className="nav-actions">
                    <button className="cart-btn" onClick={() => setIsCartOpen(true)} aria-label="Open Cart">
                        <ShoppingBag size={20} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
                        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
