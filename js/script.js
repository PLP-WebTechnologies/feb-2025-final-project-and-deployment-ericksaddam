// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.mobile-menu') && !event.target.closest('.nav-links')) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        }
    });
    
    // Product Slider
    const productSlider = document.querySelector('.product-slider');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (productSlider && prevBtn && nextBtn) {
        let slideIndex = 0;
        const slides = document.querySelectorAll('.product-card');
        const slideWidth = slides[0].offsetWidth + 30; // card width + gap
        
        // Initialize slider
        function updateSlider() {
            if (window.innerWidth > 768) {
                productSlider.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
            } else {
                productSlider.style.transform = 'translateX(0)';
            }
        }
        
        // Next slide
        nextBtn.addEventListener('click', function() {
            if (window.innerWidth > 768) {
                if (slideIndex < slides.length - 3) {
                    slideIndex++;
                } else {
                    slideIndex = 0;
                }
                updateSlider();
            }
        });
        
        // Previous slide
        prevBtn.addEventListener('click', function() {
            if (window.innerWidth > 768) {
                if (slideIndex > 0) {
                    slideIndex--;
                } else {
                    slideIndex = slides.length - 3;
                }
                updateSlider();
            }
        });
        
        // Update on resize
        window.addEventListener('resize', updateSlider);
    }
    
    // Newsletter Form Validation
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterMessage = document.getElementById('newsletter-message');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simple email validation
            if (validateEmail(email)) {
                newsletterMessage.textContent = 'Thank you for subscribing!';
                newsletterMessage.style.color = 'white';
                this.reset();
                
                // In a real application, you would send this data to a server
                console.log('Newsletter subscription:', email);
                
                // Show success message using simple modal
                if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                    simpleModal.show({
                        title: 'Subscribed!',
                        message: 'Thank you for subscribing to our newsletter!',
                        type: 'success',
                        autoClose: 3000
                    });
                }
            } else {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.style.color = '#ffcccc';
                
                // Show error message using simple modal
                if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                    simpleModal.show({
                        title: 'Invalid Email',
                        message: 'Please enter a valid email address.',
                        type: 'error',
                        autoClose: 3000
                    });
                }
            }
        });
    }
    
    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const subjectError = document.getElementById('subject-error');
        const messageError = document.getElementById('message-error');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Reset errors
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            subjectError.style.display = 'none';
            messageError.style.display = 'none';
            
            // Validate name
            if (nameInput.value.trim() === '') {
                nameError.textContent = 'Name is required';
                nameError.style.display = 'block';
                isValid = false;
            }
            
            // Validate email
            if (!validateEmail(emailInput.value)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                isValid = false;
            }
            
            // Validate subject
            if (subjectInput.value.trim() === '') {
                subjectError.textContent = 'Subject is required';
                subjectError.style.display = 'block';
                isValid = false;
            }
            
            // Validate message
            if (messageInput.value.trim() === '') {
                messageError.textContent = 'Message is required';
                messageError.style.display = 'block';
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                messageError.textContent = 'Message must be at least 10 characters long';
                messageError.style.display = 'block';
                isValid = false;
            }
            
            // If valid, submit the form
            if (isValid) {
                formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
                formMessage.className = 'success';
                contactForm.reset();
                
                // In a real application, you would send this data to a server
                console.log('Contact form submission:', {
                    name: nameInput.value,
                    email: emailInput.value,
                    subject: subjectInput.value,
                    message: messageInput.value
                });
                
                // Show success message using simple modal
                if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                    simpleModal.show({
                        title: 'Message Sent',
                        message: 'Thank you for your message! We will get back to you soon.',
                        type: 'success',
                        autoClose: 3000
                    });
                }
            } else {
                formMessage.textContent = 'Please fix the errors in the form.';
                formMessage.className = 'error';
                
                // Show error message using simple modal
                if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                    simpleModal.show({
                        title: 'Form Error',
                        message: 'Please fix the errors in the form.',
                        type: 'error',
                        autoClose: 3000
                    });
                }
            }
        });
    }
    
    // Product Filtering
    const applyFiltersBtn = document.getElementById('apply-filters');
    const productsContainer = document.getElementById('products-container');
    
    if (applyFiltersBtn && productsContainer) {
        applyFiltersBtn.addEventListener('click', function() {
            const categoryFilter = document.getElementById('category').value;
            const priceFilter = document.getElementById('price').value;
            const products = productsContainer.querySelectorAll('.product-card');
            
            products.forEach(product => {
                const category = product.dataset.category;
                const price = parseFloat(product.dataset.price);
                
                let categoryMatch = categoryFilter === 'all' || category === categoryFilter;
                let priceMatch = true;
                
                if (priceFilter !== 'all') {
                    if (priceFilter === '0-3000') {
                        priceMatch = price <= 3000;
                    } else if (priceFilter === '3000-6000') {
                        priceMatch = price > 3000 && price <= 6000;
                    } else if (priceFilter === '6000-10000') {
                        priceMatch = price > 6000 && price <= 10000;
                    } else if (priceFilter === '10000+') {
                        priceMatch = price > 10000;
                    }
                }
                
                if (categoryMatch && priceMatch) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
    
    // Shopping Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let cart = [];
    
    if (addToCartButtons.length > 0 && cartItems) {
        // Load cart from localStorage if available
        if (localStorage.getItem('cart')) {
            try {
                cart = JSON.parse(localStorage.getItem('cart'));
                updateCartDisplay();
            } catch (e) {
                console.error('Error loading cart from localStorage:', e);
                localStorage.removeItem('cart');
            }
        }
        
        // Add to cart
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productImage = productCard.querySelector('img').src;
                
                // Extract price value from KSh format (e.g., "KSh 3,499" → 3499)
                const productPriceText = productCard.querySelector('.price').textContent;
                const productPriceValue = parseFloat(productPriceText.replace(/[^0-9]/g, ''));
                
                // Check if product is already in cart
                const existingProduct = cart.find(item => item.name === productName);
                
                if (existingProduct) {
                    existingProduct.quantity++;
                } else {
                    cart.push({
                        name: productName,
                        price: productPriceValue,
                        image: productImage,
                        quantity: 1
                    });
                }
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart display
                updateCartDisplay();
                
                // Show modal confirmation using both systems for compatibility
                // Original modal
                if (typeof showModal === 'function') {
                    showModal({
                        title: 'Added to Cart',
                        message: `${productName} has been added to your cart!`,
                        product: {
                            name: productName,
                            price: `KSh ${formatNumber(productPriceValue)}`,
                            image: productImage
                        }
                    });
                }
                
                // New simple modal system
                if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                    simpleModal.show({
                        title: 'Added to Cart',
                        message: `${productName} has been added to your cart!`,
                        type: 'success',
                        autoClose: 3000
                    });
                }
            });
        }
        
        // Update cart display
        function updateCartDisplay() {
            if (cart.length === 0 || !cartItems || !cartTotal) {
                if (cartItems) cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
                if (cartTotal) cartTotal.textContent = 'KSh 0';
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
            
            // Add event listeners for quantity buttons and remove buttons
            document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        cart.splice(index, 1);
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                });
            });
            
            document.querySelectorAll('.quantity-btn.increase').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart[index].quantity++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                });
            });
            
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    const removedItem = cart[index];
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartDisplay();
                    
                    // Show removal confirmation using both modal systems for compatibility
                    // Original modal
                    if (typeof showModal === 'function') {
                        showModal({
                            title: 'Item Removed',
                            message: `${removedItem.name} has been removed from your cart.`,
                            product: {
                                name: removedItem.name,
                                price: `KSh ${formatNumber(removedItem.price)}`,
                                image: removedItem.image
                            },
                            autoClose: true
                        });
                    }
                    
                    // New simple modal system
                    if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                        simpleModal.show({
                            title: 'Item Removed',
                            message: `${removedItem.name} has been removed from your cart.`,
                            type: 'info',
                            autoClose: 3000
                        });
                    }
                });
            });
        }
    }
});

// Helper function to validate email
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Helper function to format numbers with commas for thousands
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Simplified Modal functionality
function showModal(options) {
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalProductImage = document.getElementById('modal-product-image');
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalContinue = document.getElementById('modal-continue');
    const modalClose = document.querySelector('.modal-close');
    
    if (!modalContainer) return;
    
    // Set modal content
    modalTitle.textContent = options.title || 'Notification';
    modalMessage.textContent = options.message || '';
    
    // Handle product information if provided
    const modalProduct = document.getElementById('modal-product');
    if (options.product) {
        modalProductImage.src = options.product.image;
        modalProductName.textContent = options.product.name;
        modalProductPrice.textContent = options.product.price;
        modalProduct.style.display = 'flex';
    } else {
        modalProduct.style.display = 'none';
    }
    
    // Show modal
    modalContainer.classList.add('active');
    
    // Simple close function
    const closeModal = function() {
        modalContainer.classList.remove('active');
        if (typeof options.onClose === 'function') {
            options.onClose();
        }
    };
    
    // Set up event listeners
    modalClose.onclick = closeModal;
    modalContinue.onclick = closeModal;
    modalContainer.onclick = function(e) {
        if (e.target === modalContainer) {
            closeModal();
        }
    };
    
    // Auto close after 5 seconds for success messages
    if (options.autoClose !== false) {
        setTimeout(closeModal, 5000);
    }
}
