// Authentication functionality for SaddamStyles
document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('saddamstyles_user');
    updateNavigation(isLoggedIn);
    
    // Login form handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Basic validation
            let isValid = true;
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');
            
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            
            if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                isValid = false;
            }
            
            if (password.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordError.style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate login (in a real app, this would be an API call)
                simulateLogin(email, password);
            }
        });
    }
    
    // Signup form handling
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Basic validation
            let isValid = true;
            const fullnameError = document.getElementById('fullname-error');
            const emailError = document.getElementById('signup-email-error');
            const passwordError = document.getElementById('signup-password-error');
            const confirmPasswordError = document.getElementById('confirm-password-error');
            const termsError = document.getElementById('terms-error');
            
            // Reset errors
            fullnameError.style.display = 'none';
            emailError.style.display = 'none';
            passwordError.style.display = 'none';
            confirmPasswordError.style.display = 'none';
            termsError.style.display = 'none';
            
            if (fullname.trim() === '') {
                fullnameError.textContent = 'Please enter your full name';
                fullnameError.style.display = 'block';
                isValid = false;
            }
            
            if (!validateEmail(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                isValid = false;
            }
            
            if (password.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';
                passwordError.style.display = 'block';
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                confirmPasswordError.textContent = 'Passwords do not match';
                confirmPasswordError.style.display = 'block';
                isValid = false;
            }
            
            if (!terms) {
                termsError.textContent = 'You must agree to the Terms & Conditions';
                termsError.style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                // Simulate signup (in a real app, this would be an API call)
                simulateSignup(fullname, email, password);
            }
        });
    }
    
    // Google sign-in button
    const googleSigninBtn = document.getElementById('google-signin');
    if (googleSigninBtn) {
        googleSigninBtn.addEventListener('click', function() {
            simulateGoogleAuth('signin');
        });
    }
    
    // Google sign-up button
    const googleSignupBtn = document.getElementById('google-signup');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            simulateGoogleAuth('signup');
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Helper function to simulate login
    function simulateLogin(email, password) {
        // In a real app, this would be an API call to verify credentials
        // For this demo, we'll just simulate a successful login
        
        // Show loading state
        const submitBtn = document.querySelector('#login-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing in...';
        submitBtn.disabled = true;
        
        // Simulate API delay
        setTimeout(function() {
            // Create user object
            const user = {
                name: email.split('@')[0], // Use part of email as name for demo
                email: email,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('saddamstyles_user', JSON.stringify(user));
            
            // Show success message using simple modal if available
            if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                simpleModal.show({
                    title: 'Login Successful',
                    message: 'You have been successfully logged in. Redirecting to home page...',
                    type: 'success',
                    autoClose: 2000,
                    onClose: function() {
                        // Redirect to home page after modal closes
                        window.location.href = 'index.html';
                    }
                });
            } else {
                // Fallback if modal is not available
                window.location.href = 'index.html';
            }
        }, 1500);
    }
    
    // Helper function to simulate signup
    function simulateSignup(fullname, email, password) {
        // In a real app, this would be an API call to create an account
        // For this demo, we'll just simulate a successful signup
        
        // Show loading state
        const submitBtn = document.querySelector('#signup-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating account...';
        submitBtn.disabled = true;
        
        // Simulate API delay
        setTimeout(function() {
            // Create user object
            const user = {
                name: fullname,
                email: email,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('saddamstyles_user', JSON.stringify(user));
            
            // Show success message using simple modal if available
            if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                simpleModal.show({
                    title: 'Account Created',
                    message: 'Your account has been successfully created. Redirecting to home page...',
                    type: 'success',
                    autoClose: 2000,
                    onClose: function() {
                        // Redirect to home page after modal closes
                        window.location.href = 'index.html';
                    }
                });
            } else {
                // Fallback if modal is not available
                window.location.href = 'index.html';
            }
        }, 1500);
    }
    
    // Helper function to simulate Google authentication
    function simulateGoogleAuth(type) {
        // In a real app, this would integrate with Google OAuth
        // For this demo, we'll just simulate a successful auth
        
        const btn = document.getElementById(type === 'signin' ? 'google-signin' : 'google-signup');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        btn.disabled = true;
        
        // Simulate API delay
        setTimeout(function() {
            // Create user object with demo data
            const user = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                isLoggedIn: true,
                loginTime: new Date().toISOString(),
                authProvider: 'google'
            };
            
            // Save to localStorage
            localStorage.setItem('saddamstyles_user', JSON.stringify(user));
            
            // Show success message using simple modal if available
            if (typeof simpleModal !== 'undefined' && simpleModal.show) {
                simpleModal.show({
                    title: 'Account Created',
                    message: 'Your account has been successfully created. Redirecting to home page...',
                    type: 'success',
                    autoClose: 2000,
                    onClose: function() {
                        // Redirect to home page after modal closes
                        window.location.href = 'index.html';
                    }
                });
            } else {
                // Fallback if modal is not available
                window.location.href = 'index.html';
            }
        }, 2000);
    }
    
    // Helper function to handle logout
    function logout() {
        // Remove user data from localStorage
        localStorage.removeItem('saddamstyles_user');
        
        // Redirect to home page
        window.location.href = 'index.html';
    }
    
    // Helper function to update navigation based on login status
    function updateNavigation(isLoggedIn) {
        const loginLink = document.getElementById('login-link');
        const accountLink = document.getElementById('account-link');
        
        if (!loginLink || !accountLink) return;
        
        if (isLoggedIn) {
            // User is logged in
            const user = JSON.parse(localStorage.getItem('saddamstyles_user'));
            
            // Hide login link, show account link
            loginLink.style.display = 'none';
            accountLink.style.display = 'block';
            
            // Update account link with user name
            document.getElementById('user-name').textContent = user.name;
            
            // Create dropdown menu if it doesn't exist
            if (!document.querySelector('.user-dropdown-content')) {
                const dropdown = document.createElement('div');
                dropdown.className = 'user-dropdown-content';
                dropdown.innerHTML = `
                    <a href="#"><i class="fas fa-user-circle"></i> My Account</a>
                    <a href="#"><i class="fas fa-shopping-bag"></i> My Orders</a>
                    <a href="#"><i class="fas fa-heart"></i> Wishlist</a>
                    <a href="#" id="logout-btn" class="logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
                `;
                
                // Make account link a dropdown
                accountLink.classList.add('user-dropdown');
                accountLink.appendChild(dropdown);
                
                // Add event listener to logout button
                document.getElementById('logout-btn').addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }
        } else {
            // User is not logged in
            loginLink.style.display = 'block';
            accountLink.style.display = 'none';
        }
    }
    
    // Helper function to validate email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});
