/**
 * Classical Design System - JavaScript Enhancements
 * Adds interactive elements and behavior to support the classical design aesthetic
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the reveal animations for content sections
    initializeRevealAnimations();
    
    // Add smooth transitions between sections
    initializeSmoothScrolling();
    
    // Update header styles on scroll
    initializeHeaderScroll();
    
    // Initialize dark/light mode toggle
    initializeThemeToggle();
});

/**
 * Reveals content elements as they scroll into view
 * Uses a staggered, dignified animation pattern
 */
function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-content');
    
    if (!revealElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * Implements smooth scrolling for anchor links
 * Creates a more elegant page navigation experience
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Adjusts header styling based on scroll position
 * Creates a subtle, refined transition effect
 */
function initializeHeaderScroll() {
    const header = document.querySelector('.app-header');
    if (!header) return;
    
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Handles theme toggle functionality
 * Allows users to switch between light and dark classical themes
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', function() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            body.setAttribute('data-theme', 'light');
            themeToggle.setAttribute('aria-pressed', 'false');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.setAttribute('aria-pressed', 'true');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');
    }
}