/**
 * SaddamStyles Shopping Cart Functionality
 * Simple and reliable cart implementation
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cart script loaded');
    
    // Cart elements
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    console.log('Add to cart buttons found:', addToCartButtons.length);
    
    // Initialize cart from localStorage
    let cart = [];
    try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            console.log('Cart loaded from localStorage:', cart.length, 'items');
        }
    } catch (e) {
        console.error('Error loading cart:', e);
        localStorage.removeItem('cart');
    }
    
    // Update cart display
    updateCartDisplay();
    
    // Add click event listeners to all "Add to Cart" buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add to cart button clicked');
            
            // Get product information
            const productCard = this.closest('.product-card');
            if (!productCard) {
                console.error('Product card not found');
                return;
            }
            
            const productName = productCard.querySelector('h3').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Extract price value from KSh format
            const productPriceText = productCard.querySelector('.price').textContent;
            const priceValue = parseInt(productPriceText.replace(/[^0-9]/g, ''));
            
            console.log('Adding product to cart:', productName, priceValue);
            
            // Check if product is already in cart
            const existingProductIndex = cart.findIndex(item => item.name === productName);
            
            if (existingProductIndex >= 0) {
                // Increment quantity of existing product
                cart[existingProductIndex].quantity += 1;
                console.log('Increased quantity for existing product');
            } else {
                // Add new product to cart
                cart.push({
                    name: productName,
                    price: priceValue,
                    image: productImage,
                    quantity: 1
                });
                console.log('Added new product to cart');
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update the cart display
            updateCartDisplay();
            
            // Show success message
            showAddToCartMessage(productName);
        });
    });
    
    // Function to update cart display
    function updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems || !cartTotal) {
            console.log('Cart display elements not found');
            return;
        }
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = 'KSh 0';
            return;
        }
        
        let total = 0;
        let cartHTML = '';
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-price">KSh ${formatNumber(item.price)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-index="${index}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-index="${index}">+</button>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">Remove</button>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        cartTotal.textContent = `KSh ${formatNumber(total)}`;
        
        // Add event listeners to quantity buttons and remove buttons
        setupCartItemButtons();
    }
    
    // Setup event listeners for cart item buttons
    function setupCartItemButtons() {
        // Decrease quantity buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (isNaN(index) || index < 0 || index >= cart.length) return;
                
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            });
        });
        
        // Increase quantity buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (isNaN(index) || index < 0 || index >= cart.length) return;
                
                cart[index].quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (isNaN(index) || index < 0 || index >= cart.length) return;
                
                const removedItem = cart[index];
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartDisplay();
                
                // Show removal message
                showRemovalMessage(removedItem.name);
            });
        });
    }
    
    // Show message when item is added to cart
    function showAddToCartMessage(productName) {
        if (typeof simpleModal !== 'undefined' && simpleModal.show) {
            simpleModal.show({
                title: 'Added to Cart',
                message: `${productName} has been added to your cart!`,
                type: 'success',
                autoClose: 3000
            });
        } else {
            alert(`${productName} has been added to your cart!`);
        }
    }
    
    // Show message when item is removed from cart
    function showRemovalMessage(productName) {
        if (typeof simpleModal !== 'undefined' && simpleModal.show) {
            simpleModal.show({
                title: 'Item Removed',
                message: `${productName} has been removed from your cart.`,
                type: 'info',
                autoClose: 3000
            });
        }
    }
    
    // Helper function to format numbers with commas
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
