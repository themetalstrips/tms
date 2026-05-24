// Product Details & Quote modal logic for The Metal Strips
document.addEventListener('DOMContentLoaded', () => {
    // If not on product details page, exit
    if (!document.getElementById('productDetailContainer')) return;

    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        renderNotFound();
        return;
    }

    // 2. Query products database
    const product = window.products.find(p => p.id === productId);
    if (!product) {
        renderNotFound();
        return;
    }

    // 3. Render Product Info
    renderProductDetails(product);

    // 4. Modal Overlays & Success transmission Logic
    const quoteModal = document.getElementById('quoteModal');
    const quoteBtn = document.getElementById('productActionBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const quoteForm = document.getElementById('quoteForm');
    const modalFormView = document.getElementById('modalFormView');
    const modalSuccessView = document.getElementById('modalSuccessView');

    if (quoteBtn && quoteModal) {
        quoteBtn.addEventListener('click', () => {
            if (product.id.startsWith('vet-') || product.id.startsWith('dent-') || product.id.startsWith('surg-') || product.id.startsWith('single-')) {
                // Open Quote request modal
                quoteModal.classList.add('active');
                if (modalFormView) modalFormView.style.display = 'block';
                if (modalSuccessView) modalSuccessView.style.display = 'none';
            } else {
                // Add to standard cart
                if (window.addToCart) {
                    window.addToCart(product);
                }
            }
        });
    }

    if (modalCloseBtn && quoteModal) {
        modalCloseBtn.addEventListener('click', () => {
            quoteModal.classList.remove('active');
        });
        quoteModal.addEventListener('click', (e) => {
            if (e.target === quoteModal) quoteModal.classList.remove('active');
        });
    }

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get inputs
            const name = document.getElementById('quoteName').value;
            const hospital = document.getElementById('quoteHospital').value;
            const email = document.getElementById('quoteEmail').value;
            const qty = document.getElementById('quoteQty').value;

            // Render Success message
            const successDetail = document.getElementById('successDetail');
            if (successDetail) {
                successDetail.innerHTML = `
                    Thank you, <strong>${escapeHTML(name)}</strong>. Your inquiry for <strong>${escapeHTML(qty)} × ${escapeHTML(product.name)}</strong> has been successfully registered under <strong>${escapeHTML(hospital)}</strong>.<br><br>
                    A professional B2B wholesale quotation has been dispatched to <strong>${escapeHTML(email)}</strong>.
                `;
            }

            // Reveal success graphic
            if (modalFormView) modalFormView.style.display = 'none';
            if (modalSuccessView) modalSuccessView.style.display = 'block';

            // Reset form
            quoteForm.reset();
        });
    }

    const modalSuccessCloseBtn = document.getElementById('modalSuccessCloseBtn');
    if (modalSuccessCloseBtn && quoteModal) {
        modalSuccessCloseBtn.addEventListener('click', () => {
            quoteModal.classList.remove('active');
        });
    }

    function renderProductDetails(p) {
        const isClinical = p.id.startsWith('vet-') || p.id.startsWith('dent-') || p.id.startsWith('surg-') || p.id.startsWith('single-');
        const container = document.getElementById('productDetailContainer');
        
        // Dynamic breadcrumbs button
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-ghost';
        backBtn.style.marginBottom = '2rem';
        backBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> Back to Collection
        `;
        backBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
        container.appendChild(backBtn);

        const grid = document.createElement('div');
        grid.className = 'product-detail-grid';

        // Render Specifications items
        let specsHtml = '';
        Object.entries(p.specs).forEach(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').trim();
            specsHtml += `
                <div class="detail-spec-item">
                    <span class="spec-label">${label}</span>
                    <span class="spec-value">${value}</span>
                </div>
            `;
        });

        // Price Section HTML
        let priceHtml = '';
        if (!isClinical) {
            priceHtml = `
                <div class="detail-price-section">
                    <span class="detail-current-price">$${p.price.toFixed(2)}</span>
                    <span class="detail-old-price">$${p.retailPrice.toFixed(2)}</span>
                </div>
            `;
        }

        // Action Button HTML
        let actionBtnHtml = '';
        if (isClinical) {
            actionBtnHtml = `
                <button class="btn btn-primary detail-add-to-cart" id="productActionBtn" style="background: var(--accent-gold); border-color: var(--accent-gold); color: #000;">
                    Request Custom Quote
                </button>
            `;
        } else {
            actionBtnHtml = `
                <button class="btn btn-primary detail-add-to-cart" id="productActionBtn">
                    Add to Cart — $${p.price.toFixed(2)}
                </button>
            `;
        }

        // Trust features bullets
        let trustHtml = '';
        if (isClinical) {
            trustHtml = `
                <div style="display: flex; flex-direction: column; gap: 0.75rem; marginTop: 1.5rem; paddingTop: 1.5rem; border-top: 1px solid var(--border-subtle);">
                    <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.85rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> Free Worldwide Shipping
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.85rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> CE & ISO Certified Medical Standard
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.85rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> Autoclavable German Stainless Steel
                    </div>
                </div>
            `;
        } else {
            trustHtml = `
                <div style="display: flex; flex-direction: column; gap: 0.75rem; marginTop: 1.5rem; paddingTop: 1.5rem; border-top: 1px solid var(--border-subtle);">
                    <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.85rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg> Free Worldwide Shipping
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.85rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> 30-Day Money Back Guarantee
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.85rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> Authentic Kintsugi Etching
                    </div>
                </div>
            `;
        }

        grid.innerHTML = `
            <div class="product-detail-image">
                <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="product-detail-info">
                ${p.badge ? `<span class="product-badge-detail">${p.badge}</span>` : ''}
                <h1>${p.name}</h1>
                ${p.subtitle ? `<p class="product-detail-subtitle">${p.subtitle}</p>` : ''}
                ${priceHtml}
                <p class="detail-description">${p.description}</p>
                <div class="detail-specs-grid">
                    ${specsHtml}
                </div>
                ${actionBtnHtml}
                ${trustHtml}
            </div>
        `;

        container.appendChild(grid);

        // Pre-fill Product name in Quote Modal Form
        const modalProductTitle = document.getElementById('quoteProduct');
        if (modalProductTitle) {
            modalProductTitle.value = p.name;
        }
    }

    function renderNotFound() {
        const container = document.getElementById('productDetailContainer');
        container.innerHTML = `
            <div class="section-padding container" style="text-align: center; padding: 10rem 0;">
                <h2>Product not found</h2>
                <button class="btn btn-outline" style="margin-top: 2rem;" onclick="window.location.href='shop.html'">Back to Shop</button>
            </div>
        `;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
