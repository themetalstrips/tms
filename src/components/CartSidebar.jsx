import React, { useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartSidebar.css';

const CartSidebar = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal, SHIPPING_FEE, orderTotal } = useCart();
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        if (isCartOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isCartOpen, setIsCartOpen]);

    return (
        <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`}>
            <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`} ref={sidebarRef}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="cart-close" onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <p>Your cart is currently empty.</p>
                            <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.image || "https://placehold.co/100x100/1a1a1a/4169e1?text=Knife"} alt={item.name} />
                                </div>
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="cart-item-price">${item.price.toFixed(2)}</p>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                        </div>
                                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="cart-total-row">
                            <span>Shipping Fee</span>
                            <span>${SHIPPING_FEE.toFixed(2)}</span>
                        </div>
                        <div className="cart-total-row final-total">
                            <span>Total</span>
                            <span>${orderTotal.toFixed(2)}</span>
                        </div>
                        <p className="cart-taxes-notice">Taxes calculated at checkout.</p>
                        <button className="btn btn-primary btn-full checkout-btn">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartSidebar;
