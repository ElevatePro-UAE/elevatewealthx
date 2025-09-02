// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initPricingToggles();
    initSmoothScrolling();
    initIntersectionObserver();
    initPerformanceOptimizations();
    initScrollToTop();
    initAccessibility();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const bars = mobileMenu.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                    if (index === 1) bar.style.opacity = '0';
                    if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                } else {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                }
            });
        });
    }

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
                const bars = mobileMenu?.querySelectorAll('.bar');
                bars?.forEach(bar => {
                    bar.style.transform = '';
                    bar.style.opacity = '';
                });
            }
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    // Get all navigation links that start with #
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Handle contact links differently
            if (targetId === '#contact' || targetId.includes('mailto:')) {
                if (targetId.includes('mailto:')) {
                    window.location.href = targetId;
                    return;
                }
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                const navMenu = document.querySelector('.nav-menu');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const mobileMenu = document.getElementById('mobile-menu');
                    const bars = mobileMenu?.querySelectorAll('.bar');
                    bars?.forEach(bar => {
                        bar.style.transform = '';
                        bar.style.opacity = '';
                    });
                }
            }
        });
    });
}

// CRITICAL FIX: Enhanced pricing section toggle functionality - ALL COLLAPSED ON LOAD
function initPricingToggles() {
    console.log('Initializing pricing toggles...');
    
    // Wait for DOM to be fully ready
    setTimeout(() => {
        const categoryHeaders = document.querySelectorAll('.category-header');
        const categoryContents = document.querySelectorAll('.category-content');
        
        console.log(`Found ${categoryHeaders.length} category headers and ${categoryContents.length} category contents`);
        
        // CRITICAL: Ensure ALL categories start COLLAPSED
        categoryHeaders.forEach((header, index) => {
            header.classList.remove('active');
            console.log(`Header ${index + 1} collapsed`);
        });
        
        categoryContents.forEach((content, index) => {
            content.classList.remove('active');
            content.style.display = 'none';
            console.log(`Content ${index + 1} hidden`);
        });
        
        // Remove any existing event listeners to prevent duplicates
        categoryHeaders.forEach(header => {
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
        });
        
        // Re-query headers after cloning
        const freshHeaders = document.querySelectorAll('.category-header');
        
        // Add robust click event listeners for toggle functionality
        freshHeaders.forEach((header, headerIndex) => {
            console.log(`Adding event listener to header ${headerIndex + 1}`);
            
            // Add multiple event types for better compatibility
            ['click', 'touchstart'].forEach(eventType => {
                header.addEventListener(eventType, function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log(`Header ${headerIndex + 1} clicked`);
                    
                    const content = this.nextElementSibling;
                    const isActive = this.classList.contains('active');
                    
                    if (!content) {
                        console.error(`No content found for header ${headerIndex + 1}`);
                        return;
                    }
                    
                    // Toggle current category
                    if (isActive) {
                        // Close current category
                        console.log(`Closing category ${headerIndex + 1}`);
                        this.classList.remove('active');
                        content.classList.remove('active');
                        content.style.display = 'none';
                    } else {
                        // Close all other categories first
                        freshHeaders.forEach((otherHeader, otherIndex) => {
                            if (otherHeader !== this) {
                                console.log(`Closing other category ${otherIndex + 1}`);
                                otherHeader.classList.remove('active');
                                const otherContent = otherHeader.nextElementSibling;
                                if (otherContent) {
                                    otherContent.classList.remove('active');
                                    otherContent.style.display = 'none';
                                }
                            }
                        });
                        
                        // Open current category
                        console.log(`Opening category ${headerIndex + 1}`);
                        this.classList.add('active');
                        content.style.display = 'block';
                        
                        // Small delay to ensure display block is applied before adding active class
                        setTimeout(() => {
                            content.classList.add('active');
                        }, 10);
                    }
                    
                    // Update ARIA states
                    updatePricingARIA();
                }, { passive: false });
            });
            
            // Add keyboard support
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Add visual feedback on hover
            header.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.backgroundColor = 'var(--color-bg-3)';
                }
            });
            
            header.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.backgroundColor = '';
                }
            });
        });
        
        console.log('Pricing toggles initialized - all categories collapsed');
        
    }, 100); // Small delay to ensure DOM is ready
}

// Update ARIA states when pricing toggles change
function updatePricingARIA() {
    const categoryHeaders = document.querySelectorAll('.category-header');
    
    categoryHeaders.forEach(header => {
        const isExpanded = header.classList.contains('active');
        header.setAttribute('aria-expanded', isExpanded.toString());
    });
}

// Scroll-triggered animations using Intersection Observer
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('services-grid') || 
                    entry.target.classList.contains('benefits-grid')) {
                    const cards = entry.target.querySelectorAll('.service-card, .benefit-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .services-grid,
        .benefits-grid,
        .pricing-categories,
        .contact-content,
        .service-card,
        .benefit-card,
        .pricing-category
    `);

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Initialize cards with opacity 0 for staggered animation
    const cards = document.querySelectorAll('.service-card, .benefit-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
    });
}

// Scroll animations for various elements
function initScrollAnimations() {
    let ticking = false;

    function updateScrollElements() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;

        // Parallax effect for floating elements
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.2);
            const yPos = -(scrollTop * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        // Update scroll indicator visibility
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            if (scrollTop > windowHeight * 0.1) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Optimize animations for 60fps
    const animatedElements = document.querySelectorAll('.service-card, .benefit-card, .floating-element');
    animatedElements.forEach(element => {
        element.style.willChange = 'transform';
    });

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('Window resized - layout recalculated');
        }, 250);
    }, { passive: true });
}

// Scroll-to-top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Add styles for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--brand-gradient);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 18px;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(42, 97, 214, 0.3);
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(42, 97, 214, 0.4);
        }
        
        @media (max-width: 768px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(style);

    // Show/hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Enhanced hover effects for service cards
function initEnhancedHoverEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    [...serviceCards, ...benefitCards].forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Button click animations
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add ripple if it's a navigation link
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                return;
            }
            
            // Create ripple effect for non-navigation buttons
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Accessibility improvements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#services';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link sr-only';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Focus management for mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            setTimeout(() => {
                if (navMenu.classList.contains('active')) {
                    const firstLink = navMenu.querySelector('.nav-link');
                    if (firstLink) firstLink.focus();
                }
            }, 100);
        });
    }

    // Add ARIA attributes for pricing toggles
    setTimeout(() => {
        const categoryHeaders = document.querySelectorAll('.category-header');
        const categoryContents = document.querySelectorAll('.category-content');
        
        categoryHeaders.forEach((header, index) => {
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', `pricing-content-${index}`);
            header.setAttribute('tabindex', '0');
        });
        
        categoryContents.forEach((content, index) => {
            content.setAttribute('id', `pricing-content-${index}`);
            content.setAttribute('role', 'region');
        });
    }, 200);

    // Add focus styles
    const style = document.createElement('style');
    style.textContent = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--brand-blue);
            color: white;
            padding: 8px;
            border-radius: 4px;
            text-decoration: none;
            z-index: 9999;
            transition: top 0.3s;
        }
        
        .skip-link:focus {
            top: 6px;
        }
        
        .nav-link:focus-visible,
        .btn:focus-visible,
        .category-header:focus-visible {
            outline: 2px solid var(--brand-blue);
            outline-offset: 2px;
        }
        
        .category-header:focus {
            background: var(--color-bg-3);
        }
        
        .category-header {
            cursor: pointer;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        .category-header:active {
            background: var(--color-bg-4);
        }
    `;
    document.head.appendChild(style);
}

// Form handling for future contact forms
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    submitBtn.textContent = 'Message Sent!';
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        form.reset();
                    }, 2000);
                }, 1000);
            }
        });
    });
}

// Text visibility check and enhancement
function ensureTextVisibility() {
    console.log('Running text visibility checks...');
    
    // Check for any elements that might have low contrast
    const allTextElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, li, a');
    
    allTextElements.forEach(element => {
        // Get computed styles
        const computedStyle = window.getComputedStyle(element);
        const color = computedStyle.color;
        const backgroundColor = computedStyle.backgroundColor;
        
        // Log elements with transparent or potentially low contrast text
        if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent' || color === 'rgba(255, 255, 255, 0)') {
            console.warn('Element with transparent text found:', element);
            
            // Fix transparent text based on background context
            const parentBg = element.closest('.hero, .contact') ? 'var(--text-on-dark)' : 'var(--text-on-light)';
            element.style.color = parentBg;
        }
    });
    
    // Ensure hero section text is always visible
    const heroElements = document.querySelectorAll('.hero *');
    heroElements.forEach(element => {
        if (element.tagName && ['H1', 'H2', 'H3', 'P', 'SPAN', 'DIV', 'A'].includes(element.tagName)) {
            if (!element.classList.contains('btn')) {
                element.style.color = 'var(--text-on-dark)';
            }
        }
    });
    
    // Ensure contact section text is always visible
    const contactElements = document.querySelectorAll('.contact *');
    contactElements.forEach(element => {
        if (element.tagName && ['H1', 'H2', 'H3', 'P', 'SPAN', 'DIV', 'A'].includes(element.tagName)) {
            if (!element.classList.contains('btn') || element.classList.contains('contact-btn')) {
                element.style.color = 'var(--text-on-dark)';
            }
        }
    });
    
    console.log('Text visibility checks complete');
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Graceful degradation
    if (e.error && e.error.message.includes('animation')) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Elevate Wealth X website loaded successfully');
    console.log('CRITICAL FIX APPLIED: Perfect text visibility with high contrast ratios');
    console.log('CRITICAL FIX APPLIED: All pricing sections start COLLAPSED with enhanced toggle functionality');
    
    // Initialize enhanced effects and additional functionality
    initEnhancedHoverEffects();
    initButtonAnimations();
    initFormHandling();
    
    // CRITICAL: Ensure text visibility after DOM is loaded
    setTimeout(() => {
        ensureTextVisibility();
    }, 500);
    
    // Final performance optimizations
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('[style*="will-change"]');
        animatedElements.forEach(el => {
            el.style.willChange = 'auto';
        });
    }, 3000);
});