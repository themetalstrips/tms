// Shop logic for The Metal Strips
document.addEventListener('DOMContentLoaded', () => {
    // If we're not on the shop page, exit
    if (!document.querySelector('.shop-page')) return;

    let selectedCategory = 'None';
    let selectedSubcategory = null;
    let expandedCategory = null;

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

    function getProductCategoryInfo(product) {
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
    }

    function renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        // Filter products
        const filtered = window.products.filter(product => {
            const info = getProductCategoryInfo(product);
            if (selectedCategory === 'All') return true;
            if (info.category !== selectedCategory) return false;
            if (selectedSubcategory && info.subcategory !== selectedSubcategory) return false;
            return true;
        });

        grid.innerHTML = '';

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
                    <h3>No products currently in this category.</h3>
                    <button class="btn btn-outline" style="margin-top: 1.5rem;" id="viewAllBtn">View All Collection</button>
                </div>
            `;
            document.getElementById('viewAllBtn').addEventListener('click', handleClearFilters);
            return;
        }

        filtered.forEach(product => {
            const isClinical = product.id.startsWith('vet-') || product.id.startsWith('dent-') || product.id.startsWith('surg-') || product.id.startsWith('single-');
            const card = document.createElement('div');
            card.className = 'product-card animate-fade-in';
            
            // Build spec row or normal cart row
            let actionRowHtml = '';
            if (isClinical) {
                actionRowHtml = `
                    <div class="product-price-row">
                        <div class="price-tag">
                            <span class="quote-only-tag">Quote Only</span>
                        </div>
                        <a href="product.html?id=${product.id}" class="btn btn-outline btn-sm">Inquire</a>
                    </div>
                `;
            } else {
                actionRowHtml = `
                    <div class="product-price-row">
                        <div class="price-tag">
                            <span class="current-price">$${product.price.toFixed(2)}</span>
                            <span class="old-price">$${product.retailPrice.toFixed(2)}</span>
                        </div>
                        <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                `;
            }

            card.innerHTML = `
                <a href="product.html?id=${product.id}" class="product-image-link">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-badge">${product.badge || 'Premium'}</div>
                    </div>
                </a>
                <div class="product-info">
                    <a href="product.html?id=${product.id}" class="product-title-link">
                        <h3>${product.name}</h3>
                    </a>
                    <p class="product-desc">${product.description}</p>
                    ${actionRowHtml}
                </div>
            `;

            grid.appendChild(card);
        });

        // Add event listeners for dynamic add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = e.target.getAttribute('data-id');
                const prod = window.products.find(p => p.id === prodId);
                if (prod && window.addToCart) {
                    window.addToCart(prod);
                }
            });
        });
    }

    function renderSidebar() {
        const listContainer = document.getElementById('categoryList');
        if (!listContainer) return;

        listContainer.innerHTML = '';

        // Add 'All' option
        const allLi = document.createElement('li');
        allLi.innerHTML = `
            <button class="category-main-btn ${selectedCategory === 'All' ? 'active' : ''}" id="allCategoryBtn">
                <span>All Collection (${window.products.length})</span>
            </button>
        `;
        listContainer.appendChild(allLi);
        document.getElementById('allCategoryBtn').addEventListener('click', handleClearFilters);

        // Add visual categories list
        Object.entries(CATEGORIES_DATA).map(([category, subcategories]) => {
            const isExpanded = expandedCategory === category;
            const isActive = selectedCategory === category;

            const li = document.createElement('li');
            li.className = 'category-item-container';
            
            const btn = document.createElement('button');
            btn.className = `category-main-btn ${isActive ? 'active' : ''}`;
            btn.innerHTML = `
                <span>${category}</span>
                ${subcategories.length > 0 ? `
                    <svg class="category-chevron ${isExpanded ? 'expanded' : ''}" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                ` : ''}
            `;

            btn.addEventListener('click', () => handleCategoryClick(category));
            li.appendChild(btn);

            if (isExpanded && subcategories.length > 0) {
                const subUl = document.createElement('ul');
                subUl.className = 'subcategory-list';

                subcategories.forEach(subcat => {
                    const subcatProducts = window.products.filter(p => {
                        const info = getProductCategoryInfo(p);
                        return info.category === category && info.subcategory === subcat;
                    });

                    const subLi = document.createElement('li');
                    const subBtn = document.createElement('button');
                    subBtn.className = `subcategory-btn ${selectedSubcategory === subcat ? 'active' : ''}`;
                    subBtn.textContent = `${subcat} (${subcatProducts.length})`;
                    subBtn.addEventListener('click', () => handleSubcategoryClick(category, subcat));

                    subLi.appendChild(subBtn);
                    subUl.appendChild(subLi);
                });

                li.appendChild(subUl);
            }

            listContainer.appendChild(li);
        });
    }

    function renderFilterResetBar() {
        const barContainer = document.getElementById('filterResetBarContainer');
        if (!barContainer) return;

        if (selectedCategory === 'None' || (selectedCategory === 'All' && !selectedSubcategory)) {
            barContainer.innerHTML = '';
            return;
        }

        const filteredCount = window.products.filter(product => {
            const info = getProductCategoryInfo(product);
            if (selectedCategory === 'All') return true;
            if (info.category !== selectedCategory) return false;
            if (selectedSubcategory && info.subcategory !== selectedSubcategory) return false;
            return true;
        }).length;

        barContainer.innerHTML = `
            <div class="filter-reset-bar animate-fade-in">
                <div class="filter-info">
                    Showing items in <span>${selectedCategory}</span>
                    ${selectedSubcategory ? ` &gt; <span>${selectedSubcategory}</span>` : ''}
                    (${filteredCount} items found)
                </div>
                <button class="btn btn-outline btn-sm" id="clearFilterBtn">Clear Filter</button>
            </div>
        `;

        document.getElementById('clearFilterBtn').addEventListener('click', handleClearFilters);
    }

    function updateCatalogUI() {
        const layout = document.getElementById('shopLayout');
        if (!layout) return;

        if (selectedCategory === 'None') {
            layout.style.display = 'none';
        } else {
            layout.style.display = 'grid';
            renderSidebar();
            renderFilterResetBar();
            renderProducts();
        }
    }

    function handleCategoryClick(category) {
        if (selectedCategory === category) {
            expandedCategory = expandedCategory === category ? null : category;
        } else {
            selectedCategory = category;
            selectedSubcategory = null;
            expandedCategory = category;
        }

        // Highlight active category visual card
        document.querySelectorAll('.category-card-item').forEach(card => {
            const cardKey = card.getAttribute('data-category');
            if (cardKey === selectedCategory) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        updateCatalogUI();
        
        // Smooth scroll to catalog
        const layout = document.getElementById('shopLayout');
        if (layout) {
            layout.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function handleSubcategoryClick(category, subcat) {
        selectedCategory = category;
        selectedSubcategory = subcat;
        updateCatalogUI();
    }

    function handleClearFilters() {
        selectedCategory = 'All';
        selectedSubcategory = null;
        expandedCategory = null;

        document.querySelectorAll('.category-card-item').forEach(card => {
            card.classList.remove('active');
        });

        updateCatalogUI();
    }

    function handleCollapseToGrid() {
        selectedCategory = 'None';
        selectedSubcategory = null;
        expandedCategory = null;

        document.querySelectorAll('.category-card-item').forEach(card => {
            card.classList.remove('active');
        });

        updateCatalogUI();
    }

    // Bind Category visual Cards click events
    document.querySelectorAll('.category-card-item').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            handleCategoryClick(category);
        });
    });

    // Bind Back to Grid button click event
    const backToGridBtn = document.getElementById('backToGridBtn');
    if (backToGridBtn) {
        backToGridBtn.addEventListener('click', handleCollapseToGrid);
    }

    // Initial setup
    updateCatalogUI();
});
