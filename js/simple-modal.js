/**
 * Simple Modal System
 * A lightweight modal system for SaddamStyles
 */

const simpleModal = (function() {
    // Modal elements
    const modal = document.getElementById('simple-modal');
    const modalTitle = document.getElementById('simple-modal-title');
    const modalMessage = document.getElementById('simple-modal-message');
    const modalClose = document.querySelector('.simple-modal-close');
    const modalIcon = document.querySelector('.simple-modal-icon i');
    
    // Timer for auto-close
    let autoCloseTimer = null;
    
    // Initialize modal events
    function init() {
        if (!modal) return;
        
        // Close modal when clicking the close button
        if (modalClose) {
            modalClose.addEventListener('click', close);
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                close();
            }
        });
    }
    
    // Show the modal with options
    function show(options = {}) {
        if (!modal) return;
        
        // Set modal content
        if (modalTitle) modalTitle.textContent = options.title || 'Notification';
        if (modalMessage) modalMessage.textContent = options.message || '';
        
        // Set icon based on type
        if (modalIcon) {
            switch (options.type) {
                case 'success':
                    modalIcon.className = 'fas fa-check-circle';
                    break;
                case 'error':
                    modalIcon.className = 'fas fa-exclamation-circle';
                    break;
                case 'warning':
                    modalIcon.className = 'fas fa-exclamation-triangle';
                    break;
                default:
                    modalIcon.className = 'fas fa-info-circle';
            }
        }
        
        // Show modal with animation
        modal.classList.add('show');
        
        // Clear any existing auto-close timer
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
        }
        
        // Auto close after delay if specified
        if (options.autoClose !== false) {
            const delay = typeof options.autoClose === 'number' ? options.autoClose : 3000;
            autoCloseTimer = setTimeout(function() {
                close();
                if (typeof options.onClose === 'function') {
                    options.onClose();
                }
            }, delay);
        }
    }
    
    // Close the modal
    function close() {
        if (!modal) return;
        
        modal.classList.remove('show');
        
        // Clear auto-close timer
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
            autoCloseTimer = null;
        }
    }
    
    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', init);
    
    // Return public API
    return {
        show,
        close
    };
})();
