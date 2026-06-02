
 // ---------- PRODUCT DATABASE ----------
    const products = [
        { id: 1, name: "cross shoulder bag dbrown", brand: "BennieB", price: 180, originalPrice: 200, discount: "10%", image: "productImages/crossshoulderbagdbrown.jpg" },
        { id: 2, name: "cross shoulder bag beige", brand: "BennieB", price: 153, originalPrice: 200, discount: "15%", image: "productImages/crossshoulderbagbeige.jpg" },
        { id: 3, name: "cross shoulder bag print", brand: "BennieB", price: 180, originalPrice: 200, discount: "10%", image: "productImages/crossshoulderbagprint.jpg" },
        { id: 4, name: "cross shoulder bag red", brand: "BennieB", price: 180, originalPrice: 200, discount: "10%", image: "productImages/crossshoulderbagred.jpg" },
        { id: 5, name: "cross shoulder bag brownb ", brand: "BennieB", price: 200, originalPrice: 220, discount: "9%", image: "productImages/crossshoulderbagbrownb.jpg" },
        { id: 6, name: "cross shoulder bag black", brand: "BennieB", price: 180, originalPrice: 200, discount: "10%", image: "productImages/crossshoulderbagblack.jpg" }
     ]

    // cart state: array of { id, name, price, image, quantity}
    let cart = [];
    
    // Helper: save cart to localStorage
    function saveCart() {
        localStorage.setItem('BennieB_cart', JSON.stringify(cart));
    }
    
    function loadCart() {
        const saved = localStorage.getItem('BennieB_cart');
        if (saved) {
            cart = JSON.parse(saved);
        } else {
            cart = [];
        }
        updateCartUI();
    }
    
    // GA4 ecommerce tracking: add_to_cart, remove_from_cart, view_cart, begin_checkout
    function trackAddToCart(product, quantity) {
        if (typeof window.trackEcommerceEvent === 'function') {
            window.trackEcommerceEvent('add_to_cart', {
                currency: 'GHS',
                value: product.price * quantity,
                items: [{
                    item_id: product.id.toString(),
                    item_name: product.name,
                    price: product.price,
                    quantity: quantity,
                    brand: product.brand || 'BennieB'
                }]
            });
        }
    }
    
    function trackRemoveFromCart(product, quantity) {
        if (typeof window.trackEcommerceEvent === 'function') {
            window.trackEcommerceEvent('remove_from_cart', {
                currency: 'GHS',
                value: product.price * quantity,
                items: [{
                    item_id: product.id.toString(),
                    item_name: product.name,
                    price: product.price,
                    quantity: quantity
                }]
            });
        }
    }
    
    function trackBeginCheckout(cartItems, totalValue) {
        if (typeof window.trackEcommerceEvent === 'function') {
            const items = cartItems.map(item => ({
                item_id: item.id.toString(),
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }));
            window.trackEcommerceEvent('begin_checkout', {
                currency: 'GHS',
                value: totalValue,
                items: items
            });
        }
    }
    
    // Update cart icon & sidebar content
    function updateCartUI() {
        const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
        document.getElementById('cartCountBadge').innerText = cartCount;
        const cartContainer = document.getElementById('cartItemsList');
        const totalPrice = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        document.getElementById('cartTotalPrice').innerHTML = `Total: ₵${totalPrice.toFixed(2)}`;
        
        if (!cartContainer) return;
        if (cart.length === 0) {
            cartContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty. Add some footwear/bags!👡💼</div>';
            return;
        }
        cartContainer.innerHTML = '';
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/80x80?text='shoes">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₵${item.price}</div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
                        <span class="remove-item" data-id="${item.id}">Remove</span>
                    </div>
                </div>
            `;
            cartContainer.appendChild(itemDiv);
        });
        
        // attach quantity events
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                const delta = parseInt(btn.dataset.delta);
                updateItemQuantity(id, delta);
            });
        });
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.dataset.id);
                removeItemFromCart(id);
            });
        });
        saveCart();
    }
    
    function updateItemQuantity(productId, delta) {
        const idx = cart.findIndex(i => i.id === productId);
        if (idx !== -1) {
            const newQty = cart[idx].quantity + delta;
            if (newQty <= 0) {
                // remove & track
                const removedItem = { ...cart[idx] };
                cart.splice(idx, 1);
                trackRemoveFromCart(removedItem, removedItem.quantity);
            } else {
                cart[idx].quantity = newQty;
                // we track add again? Actually for increment track add_to_cart for single unit
                if (delta === 1) {
                    trackAddToCart({ id: cart[idx].id, name: cart[idx].name, price: cart[idx].price, brand: cart[idx].brand }, 1);
                } else if (delta === -1) {
                    trackRemoveFromCart({ id: cart[idx].id, name: cart[idx].name, price: cart[idx].price }, 1);
                }
            }
            updateCartUI();
        }
    }
    
    function removeItemFromCart(productId) {
        const idx = cart.findIndex(i => i.id === productId);
        if (idx !== -1) {
            const removed = { ...cart[idx] };
            cart.splice(idx, 1);
            trackRemoveFromCart(removed, removed.quantity);
            updateCartUI();
        }
    }
    
    function addToCart(product, quantity = 1) {
        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                brand: product.brand,
                quantity: quantity
            });
        }
        updateCartUI();
        trackAddToCart(product, quantity);
        // optional: show small notif? but fine
    }
    
    // Render all products into grid
    function renderProducts() {
        const container = document.getElementById('productsContainer');
        container.innerHTML = '';
        products.forEach(prod => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <div class="product-image">
                    <img src="${prod.image}" alt="${prod.name}" onerror="this.src='https://placehold.co/400x500?text='footwear/bag">
                </div>
                <div class="product-info">
                    <div class="brand">${prod.brand}</div>
                    <div class="product-name">${prod.name}</div>
                    <div class="prices">
                        <span class="current-price">₵${prod.price}</span>
                        <span class="original-price">₵${prod.originalPrice}</span>
                        <span class="discount-price">${prod.discount}</span>
                    </div>
                    <div class="cart-controls">
                        <button class="add-to-cart-btn" data-id="${prod.id}">Add to Cart 🛒</button>
                        <button class="buy-now-btn" data-id="${prod.id}">Buy Now</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        // attach add to cart
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = parseInt(btn.dataset.id);
                const product = products.find(p => p.id === prodId);
                if (product) addToCart(product, 1);
                // show side cart hint
                document.getElementById('cartSidebar').classList.add('open');
                document.getElementById('cartOverlay').classList.add('active');
            });
        });
        // Buy Now logic (redirect to checkout flow with that single item)
        document.querySelectorAll('.buy-now-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = parseInt(btn.dataset.id);
                const product = products.find(p => p.id === prodId);
                if (product) {
                    // for buy now: we can either auto add to cart and go to checkout or just prefill form.
                    // We'll use existing purchase form but support single product.
                    document.getElementById('selectedProductImage').src = product.image;
                    document.getElementById('selectedProductName').innerText = product.name;
                    document.getElementById('selectedProductPrice').innerText = `Price: ₵${product.price}`;
                    window.currentBuyNowProduct = product;
                    document.getElementById('purchaseForm').style.display = 'block';
                    document.getElementById('thankYou').style.display = 'none';
                    document.getElementById('purchaseForm').scrollIntoView({ behavior: 'smooth' });
                    // optional GA: view_item or begin checkout? We'll track view promotion.
                    if (typeof window.trackEcommerceEvent === 'function') {
                        window.trackEcommerceEvent('begin_checkout', {
                            currency: 'GHS',
                            value: product.price,
                            items: [{ item_id: product.id.toString(), item_name: product.name, price: product.price, quantity: 1 }]
                        });
                    }
                }
            });
        });
    }
    
    // cart UI interactions
    document.getElementById('cartIconBtn')?.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.add('open');
        document.getElementById('cartOverlay').classList.add('active');
        // track view cart event
        const totalVal = cart.reduce((sum,i)=> sum + (i.price * i.quantity),0);
        if(cart.length && typeof window.trackEcommerceEvent === 'function'){
            window.trackEcommerceEvent('view_cart', { currency: 'GHS', value: totalVal });
        }
    });
    document.getElementById('closeCartBtn')?.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
    });
    document.getElementById('cartOverlay')?.addEventListener('click', () => {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
    });
    document.getElementById('proceedCheckoutFromCart')?.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty. Add some items first!");
            return;
        }
        // track begin_checkout with cart items
        const totalVal = cart.reduce((sum,i)=> sum + (i.price * i.quantity), 0);
        trackBeginCheckout(cart, totalVal);
        // for simplicity we prefill purchase form with cart summary? but we'll combine cart to email
        // we can prepare a multi-item summary in email body
        let cartSummary = cart.map(i => `${i.name} x${i.quantity} = ₵${i.price*i.quantity}`).join('\n');
        const totalCart = cart.reduce((s,i)=> s + (i.price*i.quantity),0);
        // set global selected product for mail (first item preview)
        const first = cart[0];
        document.getElementById('selectedProductImage').src = first.image;
        document.getElementById('selectedProductName').innerHTML = `Cart (${cart.length} items)`;
        document.getElementById('selectedProductPrice').innerHTML = `Total: ₵${totalCart}`;
        window.cartForCheckout = [...cart];
        document.getElementById('purchaseForm').style.display = 'block';
        document.getElementById('thankYou').style.display = 'none';
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
        document.getElementById('purchaseForm').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Email order (supports cart items or single product)
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            let orderDetails = '';
            let totalOrder = 0;
            if (window.cartForCheckout && window.cartForCheckout.length) {
                orderDetails = window.cartForCheckout.map(item => `${item.name} x${item.quantity} = ₵${item.price * item.quantity}`).join('\n');
                totalOrder = window.cartForCheckout.reduce((s,i)=> s + (i.price*i.quantity),0);
            } else if (window.currentBuyNowProduct) {
                orderDetails = `${window.currentBuyNowProduct.name} x1 = ₵${window.currentBuyNowProduct.price}`;
                totalOrder = window.currentBuyNowProduct.price;
            } else {
                orderDetails = 'No specific product';
            }
            const subject = `New Order from ${name}`;
            const body = `Hello BennieB LLC,\n\nI would like to place an order:\n\n${orderDetails}\n\nTotal: ₵${totalOrder}\n\nMy details:\n- Name: ${name}\n- Email: ${email}\n- Address: ${address}\n- Phone: ${phone}\n\nPlease confirm.`;
            const mailtoLink = `mailto:support@bennieb.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailtoLink;
            // GA4 purchase tracking is not actual purchase but email intent, but track generate_lead? optional
            if (typeof window.trackEcommerceEvent === 'function') {
                window.trackEcommerceEvent('generate_lead', { currency: 'GHS', value: totalOrder });
            }
            document.getElementById('purchaseForm').style.display = 'none';
            document.getElementById('thankYou').style.display = 'block';
            // clear cart after order if any cart order
            if (window.cartForCheckout && window.cartForCheckout.length) {
                cart = [];
                updateCartUI();
                saveCart();
                window.cartForCheckout = null;
            } else {
                window.currentBuyNowProduct = null;
            }
        });
    }
    
    document.getElementById("year").textContent = new Date().getFullYear();
    loadCart();
    renderProducts();
