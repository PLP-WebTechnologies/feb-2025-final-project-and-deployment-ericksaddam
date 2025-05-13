// Checkout functionality for SaddamStyles
document.addEventListener('DOMContentLoaded', function() {
    // Get cart from localStorage
    let cart = [];
    if (localStorage.getItem('cart')) {
        try {
            cart = JSON.parse(localStorage.getItem('cart'));
        } catch (e) {
            console.error('Error loading cart from localStorage:', e);
            localStorage.removeItem('cart');
        }
    }
    
    // Simple Modal Implementation
    const simpleModal = {
        container: document.getElementById('simple-modal-container'),
        title: document.getElementById('simple-modal-title'),
        message: document.getElementById('simple-modal-message'),
        button: document.getElementById('simple-modal-button'),
        closeBtn: document.getElementById('simple-modal-close'),
        
        show: function(options) {
            this.title.textContent = options.title || 'Notification';
            this.message.textContent = options.message || '';
            this.container.classList.add('active');
            
            // Set up event listeners
            const closeModal = () => {
                this.container.classList.remove('active');
                if (typeof options.onClose === 'function') {
                    options.onClose();
                }
            };
            
            this.closeBtn.onclick = closeModal;
            this.button.onclick = closeModal;
            this.container.onclick = (e) => {
                if (e.target === this.container) {
                    closeModal();
                }
            };
            
            // Auto close after 5 seconds for success messages
            if (options.autoClose !== false) {
                setTimeout(closeModal, 5000);
            }
        }
    };
    
    // Display cart items in checkout
    const checkoutItemsContainer = document.getElementById('checkout-items');
    if (checkoutItemsContainer) {
        if (cart.length === 0) {
            // Redirect to products page if cart is empty
            window.location.href = 'products.html';
            return;
        }
        
        let checkoutHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            checkoutHTML += `
                <div class="checkout-item">
                    <div class="checkout-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="checkout-item-details">
                        <h4 class="checkout-item-name">${item.name}</h4>
                        <p class="checkout-item-price">KSh ${formatNumber(item.price)}</p>
                        <p class="checkout-item-quantity">Quantity: ${item.quantity}</p>
                    </div>
                </div>
            `;
        });
        
        checkoutItemsContainer.innerHTML = checkoutHTML;
        
        // Calculate and display totals
        const tax = Math.round(subtotal * 0.16); // 16% VAT
        const shippingCost = 500; // Fixed shipping cost
        const total = subtotal + tax + shippingCost;
        
        document.getElementById('subtotal').textContent = `KSh ${formatNumber(subtotal)}`;
        document.getElementById('tax').textContent = `KSh ${formatNumber(tax)}`;
        document.getElementById('total').textContent = `KSh ${formatNumber(total)}`;
    }
    
    // Handle payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    if (paymentMethods.length > 0) {
        // Set first payment method as active by default
        paymentMethods[0].classList.add('active');
        
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Remove active class from all methods
                paymentMethods.forEach(m => {
                    m.classList.remove('active');
                });
                
                // Add active class to clicked method
                this.classList.add('active');
            });
        });
    }
    
    // Handle checkout steps
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    const confirmation = document.getElementById('confirmation');
    
    const shippingNext = document.getElementById('shipping-next');
    const paymentBack = document.getElementById('payment-back');
    const paymentNext = document.getElementById('payment-next');
    
    if (shippingNext) {
        shippingNext.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Simple validation - check if required fields are filled
            const requiredFields = shippingForm.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Move to payment step
                shippingForm.classList.remove('active');
                paymentForm.classList.add('active');
                
                // Update steps
                document.querySelectorAll('.step')[0].classList.add('completed');
                document.querySelectorAll('.step')[1].classList.add('active');
                const stepLine = document.querySelector('.step-line');
                if (stepLine) stepLine.classList.add('active');
                
                // Show success message
                simpleModal.show({
                    title: 'Shipping Information Saved',
                    message: 'Your shipping information has been saved. Please select your payment method.',
                    autoClose: true
                });
            } else {
                // Show error message
                simpleModal.show({
                    title: 'Form Incomplete',
                    message: 'Please fill in all required fields to continue.',
                    autoClose: true
                });
            }
        });
    }
    
    if (paymentBack) {
        paymentBack.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default
            
            // Go back to shipping step
            paymentForm.classList.remove('active');
            shippingForm.classList.add('active');
            
            // Update steps
            document.querySelectorAll('.step')[1].classList.remove('active');
            const stepLine = document.querySelector('.step-line');
            if (stepLine) stepLine.classList.remove('active');
        });
    }
    
    if (paymentNext) {
        paymentNext.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default
            
            // Simple validation for payment method
            const activePaymentMethod = document.querySelector('.payment-method.active');
            if (!activePaymentMethod) {
                simpleModal.show({
                    title: 'Payment Method Required',
                    message: 'Please select a payment method to continue.',
                    autoClose: true
                });
                return;
            }
            
            // Process order
            processOrder();
        });
    }
    
    // Helper function to add error styling to form fields
    function addErrorClass(field) {
        if (field) {
            field.classList.add('error');
            field.addEventListener('input', function() {
                if (field.value.trim()) {
                    field.classList.remove('error');
                }
            });
        }
    }
    
    // Helper function to process order
    function processOrder() {
        // Show loading state
        const paymentNextBtn = document.getElementById('payment-next');
        const originalText = paymentNextBtn.textContent;
        paymentNextBtn.textContent = 'Processing...';
        paymentNextBtn.disabled = true;
        
        // Simulate API delay
        setTimeout(function() {
            // Move to confirmation step
            paymentForm.classList.remove('active');
            confirmation.classList.add('active');
            
            // Update steps
            document.querySelectorAll('.step')[1].classList.add('completed');
            document.querySelectorAll('.step')[2].classList.add('active');
            const stepLine = document.querySelectorAll('.step-line')[1];
            if (stepLine) stepLine.classList.add('active');
            
            // Generate random order number
            const orderNumber = 'SS' + new Date().getTime().toString().slice(-8);
            const orderNumberElement = document.getElementById('order-number');
            if (orderNumberElement) orderNumberElement.textContent = orderNumber;
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Show success modal
            simpleModal.show({
                title: 'Order Successful',
                message: `Your order #${orderNumber} has been placed successfully! Thank you for shopping with SaddamStyles.`,
                autoClose: false
            });
            
            // Reset button state
            paymentNextBtn.textContent = originalText;
            paymentNextBtn.disabled = false;
        }, 2000);
    }
    
    // Helper function to format numbers with commas for thousands
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
