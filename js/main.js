// Global Javascript for The Metal Strips
document.addEventListener('DOMContentLoaded', () => {
    // 1. Fixed Header Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            mobileToggle.innerHTML = isActive 
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>';
        });
    }

    // 3. Announcement Bar Dismiss
    const announcementBar = document.querySelector('.announcement-bar');
    const announcementClose = document.querySelector('.announcement-close');
    if (announcementBar && announcementClose) {
        // Check if previously dismissed
        if (localStorage.getItem('announcementDismissed') === 'true') {
            announcementBar.classList.add('hidden');
            document.body.style.paddingTop = '70px'; // Less padding when hidden
        }
        announcementClose.addEventListener('click', () => {
            announcementBar.classList.add('hidden');
            localStorage.setItem('announcementDismissed', 'true');
            document.body.style.paddingTop = '70px';
        });
    }

    // 4. Global Cart Logic
    let cart = JSON.parse(localStorage.getItem('tms_cart')) || [];

    window.updateCartUI = function() {
        const cartCountEl = document.querySelector('.cart-badge');
        const cartItemsContainer = document.querySelector('.cart-drawer-items');
        const subtotalPriceEl = document.querySelector('.cart-subtotal-price');

        // Update badge count
        if (cartCountEl) {
            const count = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.textContent = count;
            cartCountEl.style.display = count > 0 ? 'flex' : 'none';
        }

        // Render drawer items
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<div class="cart-empty-message"><p>Your shopping bag is empty.</p></div>';
            } else {
                cart.forEach((item, index) => {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    itemEl.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                        </div>
                        <button class="cart-item-remove" onclick="removeCartItem(${index})" aria-label="Remove item">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    `;
                    cartItemsContainer.appendChild(itemEl);
                });
            }
        }

        // Update subtotal
        if (subtotalPriceEl) {
            const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            subtotalPriceEl.textContent = `$${subtotal.toFixed(2)}`;
        }
    };

    window.addToCart = function(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        localStorage.setItem('tms_cart', JSON.stringify(cart));
        window.updateCartUI();
        window.openCartDrawer();
    };

    window.removeCartItem = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('tms_cart', JSON.stringify(cart));
        window.updateCartUI();
    };

    // Cart Drawer Toggle
    const cartBtn = document.querySelector('.cart-btn');
    const drawerOverlay = document.getElementById('cartDrawerOverlay');
    const drawerClose = document.querySelector('.cart-drawer-close');

    window.openCartDrawer = function() {
        if (drawerOverlay) drawerOverlay.classList.add('active');
    };

    window.closeCartDrawer = function() {
        if (drawerOverlay) drawerOverlay.classList.remove('active');
    };

    if (cartBtn) cartBtn.addEventListener('click', window.openCartDrawer);
    if (drawerClose) drawerClose.addEventListener('click', window.closeCartDrawer);
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) window.closeCartDrawer();
        });
    }

    // Initialize UI
    window.updateCartUI();
});
