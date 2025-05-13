/**
 * SaddamStyles Shopping Cart Functionality
 * Simple and reliable cart implementation
 */

// Cart functionality - isolated from other scripts
const SaddamCart = (function() {
    console.log('SaddamCart initializing...'); // Debug message
    
    // Private variables
    let cart = [];
    let addToCartButtons;
    let cartItems;
    let cartTotal;

    // Initialize the cart functionality
    function init() {
        console.log('SaddamCart init called');
        
        // Get DOM elements
        addToCartButtons = document.querySelectorAll('.add-to-cart');
        cartItems = document.getElementById('cart-items');
        cartTotal = document.getElementById('cart-total');
        
        console.log('Found addToCartButtons:', addToCartButtons ? addToCartButtons.length : 0);
        console.log('Found cartItems:', cartItems ? true : false);
        console.log('Found cartTotal:', cartTotal ? true : false);
    
        // Initialize cart from localStorage
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            }
        } catch (e) {
            console.error('Error loading cart:', e);
            localStorage.removeItem('cart');
        }
        
        // Add click event listeners to all "Add to Cart" buttons
        if (addToCartButtons && addToCartButtons.length > 0) {
            addToCartButtons.forEach(button => {
                // Remove any existing event listeners
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Add new click event listener
                newButton.addEventListener('click', handleAddToCart);
            });
        }
        
        // Update cart display initially
        updateCartDisplay();
    }
    
    // Handle adding a product to the cart
    function handleAddToCart() {
        button.addEventListener('click', function() {
            // Get product information from the parent product card
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3')?.textContent || 'Unknown Product';
            const productPriceText = productCard.querySelector('.price')?.textContent || 'KSh 0';
            const productImage = productCard.querySelector('img')?.src || '';
            
            // Extract numeric price value (removing "KSh " and commas)
            const priceClean = productPriceText.replace(/[^0-9]/g, '');
            const productPrice = parseInt(priceClean, 10);
            
            console.log('Adding to cart:', {
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            // Check if product is already in cart
            const existingProductIndex = cart.findIndex(item => item.name === productName);
            
            if (existingProductIndex >= 0) {
                // Increment quantity of existing product
                cart[existingProductIndex].quantity += 1;
            } else {
                // Add new product to cart
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update the cart display
            updateCartDisplay();
            
            // Show success message
            showSuccessMessage(productName);
        });
    });
    
    // Function to update cart display
    function updateCartDisplay() {
        if (!cartItems || !cartTotal) return;
        
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
        attachCartItemEventListeners();
    }
    
    // Function to attach event listeners to cart item buttons
    function attachCartItemEventListeners() {
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
    
    // Function to show success message when item is added to cart
    function showSuccessMessage(productName) {
        // First try the simple modal system
        if (typeof simpleModal !== 'undefined' && simpleModal.show) {
            simpleModal.show({
                title: 'Added to Cart',
                message: `${productName} has been added to your cart!`,
                type: 'success',
                autoClose: 3000
            });
        } else {
            // Fallback to alert if modal system isn't available
            alert(`${productName} has been added to your cart!`);
        }
    }
    
    // Function to show removal message when item is removed from cart
    function showRemovalMessage(productName) {
        // First try the simple modal system
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
