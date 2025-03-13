/**
 * Enhanced UI Core for Calculus Visualizer
 * 
 * Provides functionality for common UI elements and interactions
 * with a focus on accessibility, progressive disclosure, and usability
 */

class UICore {
    constructor() {
        // Default theme (light/dark)
        this.theme = 'light';
        
        // Track focus mode state
        this.focusMode = false;
        
        // Track keyboard shortcuts visibility
        this.keyboardShortcutsVisible = false;
        
        // Selectors for common elements
        this.selectors = {
            theme: '[data-theme]',
            themeToggle: '#theme-toggle',
            collapsible: '.section-title.collapsible',
            parameterSlider: '.slider-control',
            checkbox: '.checkbox-control input[type="checkbox"]',
            focusMode: '#focus-mode-btn',
            keyboardShortcuts: '#keyboard-shortcuts-btn',
            keyboardShortcutsModal: '.keyboard-shortcuts-modal'
        };
        
        // Initialize UI controls
        this.initThemeToggle();
        this.initCollapsiblePanels();
        this.initParameterControls();
        this.initFocusMode();
        this.initKeyboardShortcuts();
        this.initAccessibilityFeatures();
        
        // Check user preferences
        this.checkUserPreferences();
    }
    
    /**
     * Check user preferences for accessibility settings
     */
    checkUserPreferences() {
        // Check for dark mode preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme('dark');
        }
        
        // Check for reduced motion preference
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduce-motion');
        }
    }
    
    /**
     * Initialize theme toggle functionality
     */
    initThemeToggle() {
        const toggle = document.querySelector(this.selectors.themeToggle);
        if (!toggle) return;
        
        // Add proper ARIA attributes to theme toggle
        toggle.setAttribute('aria-pressed', this.theme === 'dark' ? 'true' : 'false');
        
        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Add keyboard support
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Add theme toggle keyboard shortcut (Alt+T)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const body = document.querySelector('body');
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        const toggle = document.querySelector(this.selectors.themeToggle);
        
        body.setAttribute('data-theme', newTheme);
        this.theme = newTheme;
        
        // Update ARIA attribute
        if (toggle) {
            toggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
            
            // Announce theme change to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            announcement.textContent = `Theme changed to ${newTheme} mode`;
            document.body.appendChild(announcement);
            
            // Remove announcement after it's been read
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 3000);
        }
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    }
    
    /**
     * Set specific theme
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') return;
        
        const body = document.querySelector('body');
        const toggle = document.querySelector(this.selectors.themeToggle);
        
        body.setAttribute('data-theme', theme);
        this.theme = theme;
        
        // Update ARIA attribute
        if (toggle) {
            toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    /**
     * Initialize collapsible panels
     */
    initCollapsiblePanels() {
        const collapsibles = document.querySelectorAll(this.selectors.collapsible);
        
        collapsibles.forEach(header => {
            // Add proper ARIA attributes
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', 'true');
            
            // Add tabindex if not interactive
            if (header.tagName !== 'BUTTON' && header.tagName !== 'A') {
                header.setAttribute('tabindex', '0');
            }
            
            // Generate unique ID for content section if not present
            const content = header.nextElementSibling;
            if (content && content.classList.contains('section-content')) {
                if (!header.id) {
                    header.id = `section-title-${Math.random().toString(36).substring(2, 11)}`;
                }
                
                if (!content.id) {
                    content.id = `section-content-${Math.random().toString(36).substring(2, 11)}`;
                }
                
                // Connect with ARIA
                header.setAttribute('aria-controls', content.id);
                content.setAttribute('role', 'region');
                content.setAttribute('aria-labelledby', header.id);
            }
            
            // Add click event
            header.addEventListener('click', () => {
                this.toggleCollapsible(header);
            });
            
            // Add keyboard support
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleCollapsible(header);
                }
            });
        });
    }
    
    /**
     * Toggle collapsible section
     * @param {HTMLElement} header - The collapsible header element
     */
    toggleCollapsible(header) {
        // Toggle collapsed class
        header.classList.toggle('collapsed');
        
        // Update ARIA attributes
        const isExpanded = !header.classList.contains('collapsed');
        header.setAttribute('aria-expanded', isExpanded.toString());
        
        // Toggle content visibility
        const content = header.nextElementSibling;
        if (content && content.classList.contains('section-content')) {
            if (!isExpanded) {
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                content.style.padding = '0';
                content.style.overflow = 'hidden';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                content.style.padding = '';
                content.style.overflow = '';
            }
        }
    }
    
    /**
     * Initialize parameter controls (sliders, inputs)
     */
    initParameterControls() {
        // Initialize sliders with improved accessibility
        const sliders = document.querySelectorAll(this.selectors.parameterSlider);
        
        sliders.forEach(slider => {
            const valueDisplay = slider.parentElement.querySelector('.slider-value');
            const label = slider.parentElement.parentElement.querySelector('.input-label');
            
            // Connect label with slider
            if (label && !slider.getAttribute('aria-labelledby')) {
                if (!label.id) {
                    label.id = `slider-label-${Math.random().toString(36).substring(2, 11)}`;
                }
                slider.setAttribute('aria-labelledby', label.id);
            }
            
            // Add ARIA valuetext for accessibility
            if (valueDisplay) {
                slider.setAttribute('aria-valuetext', valueDisplay.textContent);
            }
            
            // Set initial value
            if (valueDisplay) {
                this.updateSliderValueDisplay(slider, valueDisplay);
            }
            
            // Add event listener for changes
            slider.addEventListener('input', () => {
                if (valueDisplay) {
                    this.updateSliderValueDisplay(slider, valueDisplay);
                }
                
                // Update ARIA valuetext
                slider.setAttribute('aria-valuetext', valueDisplay.textContent);
                
                // Dispatch change event
                slider.dispatchEvent(new CustomEvent('parameter-change', {
                    bubbles: true,
                    detail: { 
                        id: slider.id,
                        value: parseFloat(slider.value)
                    }
                }));
            });
        });
        
        // Initialize checkboxes with improved accessibility
        const checkboxes = document.querySelectorAll(this.selectors.checkbox);
        
        checkboxes.forEach(checkbox => {
            const label = checkbox.parentElement.querySelector('label');
            
            // Connect label with checkbox if not already
            if (label && !label.getAttribute('for')) {
                label.setAttribute('for', checkbox.id);
            }
            
            checkbox.addEventListener('change', () => {
                // Dispatch change event
                checkbox.dispatchEvent(new CustomEvent('parameter-change', {
                    bubbles: true,
                    detail: { 
                        id: checkbox.id,
                        value: checkbox.checked
                    }
                }));
            });
        });
    }
    
    /**
     * Update slider value display
     * @param {HTMLElement} slider - The slider element
     * @param {HTMLElement} valueDisplay - The element to display the value in
     */
    updateSliderValueDisplay(slider, valueDisplay) {
        // Get units from attribute or empty string
        const units = slider.dataset.units || '';
        
        // Get precision from attribute or default to 1
        const precision = parseInt(slider.dataset.precision || '1');
        
        // Format value
        const value = parseFloat(slider.value).toFixed(precision);
        
        // Update display
        valueDisplay.textContent = `${value}${units}`;
    }
    
    /**
     * Initialize focus mode with improved accessibility
     */
    initFocusMode() {
        const focusModeBtn = document.querySelector(this.selectors.focusMode);
        if (!focusModeBtn) return;
        
        // Add proper ARIA attributes
        focusModeBtn.setAttribute('aria-pressed', 'false');
        
        focusModeBtn.addEventListener('click', () => {
            this.toggleFocusMode();
        });
        
        // Add keyboard shortcut for focus mode (Alt+F)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'f') {
                e.preventDefault();
                this.toggleFocusMode();
            }
        });
    }
    
    /**
     * Toggle focus mode
     */
    toggleFocusMode() {
        const focusModeBtn = document.querySelector(this.selectors.focusMode);
        
        document.body.classList.toggle('focus-mode');
        this.focusMode = document.body.classList.contains('focus-mode');
        
        // Update button state and text
        if (focusModeBtn) {
            focusModeBtn.setAttribute('aria-pressed', this.focusMode.toString());
            
            if (this.focusMode) {
                focusModeBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M9 9L2 2M9 15L2 22M15 9L22 2M15 15L22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Exit Focus</span>
                `;
            } else {
                focusModeBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                        <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Focus Mode</span>
                `;
            }
            
            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            announcement.textContent = `Focus mode ${this.focusMode ? 'enabled' : 'disabled'}`;
            document.body.appendChild(announcement);
            
            // Remove announcement after it's been read
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 3000);
        }
        
        // Dispatch focus mode change event
        window.dispatchEvent(new CustomEvent('focusmodechange', { 
            detail: { 
                focusMode: this.focusMode
            }
        }));
    }
    
    /**
     * Initialize keyboard shortcuts
     */
    initKeyboardShortcuts() {
        // Create keyboard shortcuts modal if it doesn't exist
        if (!document.querySelector(this.selectors.keyboardShortcutsModal)) {
            this.createKeyboardShortcutsModal();
        }
        
        const keyboardShortcutsBtn = document.querySelector(this.selectors.keyboardShortcuts);
        if (keyboardShortcutsBtn) {
            keyboardShortcutsBtn.addEventListener('click', () => {
                this.toggleKeyboardShortcuts();
            });
        }
        
        // Add keyboard shortcut to toggle keyboard shortcuts modal (Alt+K)
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' || (e.altKey && e.key === 'k')) {
                e.preventDefault();
                this.toggleKeyboardShortcuts();
            }
            
            // Close modal with Escape key
            if (e.key === 'Escape' && this.keyboardShortcutsVisible) {
                this.toggleKeyboardShortcuts(false);
            }
        });
    }
    
    /**
     * Create keyboard shortcuts modal
     */
    createKeyboardShortcutsModal() {
        const modal = document.createElement('div');
        modal.className = 'keyboard-shortcuts-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'keyboard-shortcuts-title');
        modal.setAttribute('aria-modal', 'true');
        
        const content = document.createElement('div');
        content.className = 'keyboard-shortcuts-content';
        
        content.innerHTML = `
            <h2 id="keyboard-shortcuts-title">Keyboard Shortcuts</h2>
            <div class="keyboard-shortcuts-list">
                <div class="keyboard-shortcut-row">
                    <span>Toggle Dark/Light Mode</span>
                    <span><span class="keyboard-shortcut-key">Alt</span> + <span class="keyboard-shortcut-key">T</span></span>
                </div>
                <div class="keyboard-shortcut-row">
                    <span>Toggle Focus Mode</span>
                    <span><span class="keyboard-shortcut-key">Alt</span> + <span class="keyboard-shortcut-key">F</span></span>
                </div>
                <div class="keyboard-shortcut-row">
                    <span>Show/Hide Keyboard Shortcuts</span>
                    <span><span class="keyboard-shortcut-key">?</span> or <span class="keyboard-shortcut-key">Alt</span> + <span class="keyboard-shortcut-key">K</span></span>
                </div>
                <div class="keyboard-shortcut-row">
                    <span>Play/Pause Animation</span>
                    <span><span class="keyboard-shortcut-key">Space</span></span>
                </div>
                <div class="keyboard-shortcut-row">
                    <span>Reset Visualization</span>
                    <span><span class="keyboard-shortcut-key">Alt</span> + <span class="keyboard-shortcut-key">R</span></span>
                </div>
                <div class="keyboard-shortcut-row">
                    <span>Navigate Sections</span>
                    <span><span class="keyboard-shortcut-key">Tab</span></span>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-primary" id="close-shortcuts-btn">Close</button>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Add close button functionality
        const closeBtn = document.getElementById('close-shortcuts-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.toggleKeyboardShortcuts(false);
            });
        }
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.toggleKeyboardShortcuts(false);
            }
        });
    }
    
    /**
     * Toggle keyboard shortcuts visibility
     * @param {boolean} [force] - Force a specific state
     */
    toggleKeyboardShortcuts(force) {
        const modal = document.querySelector(this.selectors.keyboardShortcutsModal);
        if (!modal) return;
        
        if (force !== undefined) {
            this.keyboardShortcutsVisible = force;
        } else {
            this.keyboardShortcutsVisible = !this.keyboardShortcutsVisible;
        }
        
        if (this.keyboardShortcutsVisible) {
            modal.classList.add('visible');
            
            // Focus on close button
            const closeBtn = document.getElementById('close-shortcuts-btn');
            if (closeBtn) {
                setTimeout(() => {
                    closeBtn.focus();
                }, 50);
            }
            
            // Save last active element to return focus later
            this.lastActiveElement = document.activeElement;
        } else {
            modal.classList.remove('visible');
            
            // Return focus to previous element
            if (this.lastActiveElement) {
                setTimeout(() => {
                    this.lastActiveElement.focus();
                }, 50);
            }
        }
    }
    
    /**
     * Initialize additional accessibility features
     */
    initAccessibilityFeatures() {
        // Add reset visualization keyboard shortcut (Alt+R)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                // Dispatch reset event
                window.dispatchEvent(new CustomEvent('resetvisualization'));
            }
        });
        
        // Add play/pause keyboard shortcut (Space)
        document.addEventListener('keydown', (e) => {
            // Only if target is not an input element to avoid conflicts
            if (e.key === ' ' && !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(document.activeElement.tagName)) {
                e.preventDefault();
                const playButton = document.getElementById('toggle-animation');
                if (playButton) {
                    playButton.click();
                }
            }
        });
        
        // Make sure all interactive elements are keyboard accessible
        this.ensureKeyboardAccessibility();
    }
    
    /**
     * Ensure all interactive elements are keyboard accessible
     */
    ensureKeyboardAccessibility() {
        // Find all elements that might need keyboard access
        const potentialInteractiveElements = document.querySelectorAll('[onclick], [data-action]');
        
        potentialInteractiveElements.forEach(element => {
            // If it's not a native interactive element and doesn't have tabindex
            if (
                !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName) && 
                !element.hasAttribute('tabindex')
            ) {
                element.setAttribute('tabindex', '0');
                
                // Add keyboard event listener
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click(); // Trigger click event
                    }
                });
            }
        });
    }
    
    /**
     * Register a parameter change handler
     * @param {string} parameterId - ID of the parameter element
     * @param {Function} handler - Function to call when parameter changes
     */
    onParameterChange(parameterId, handler) {
        document.addEventListener('parameter-change', event => {
            if (event.detail && event.detail.id === parameterId) {
                handler(event.detail.value);
            }
        });
    }
    
    /**
     * Update a parameter control value programmatically
     * @param {string} parameterId - ID of the parameter element
     * @param {number|boolean} value - New value for the parameter
     */
    setParameterValue(parameterId, value) {
        const element = document.getElementById(parameterId);
        if (!element) return;
        
        if (element.type === 'checkbox') {
            element.checked = Boolean(value);
        } else if (element.type === 'range' || element.type === 'number') {
            element.value = value;
            
            // Update display if it's a slider
            const valueDisplay = element.parentElement.querySelector('.slider-value');
            if (valueDisplay) {
                this.updateSliderValueDisplay(element, valueDisplay);
            }
            
            // Update ARIA valuetext
            if (element.type === 'range') {
                element.setAttribute('aria-valuetext', valueDisplay ? valueDisplay.textContent : value);
            }
        }
    }
    
    /**
     * Add animation class to an element with respect to reduced motion preferences
     * @param {HTMLElement} element - Element to animate
     * @param {string} animationClass - Animation class to add
     */
    animateElement(element, animationClass) {
        if (!element) return;
        
        // Check for reduced motion preference
        if (document.body.classList.contains('reduce-motion')) {
            return; // Skip animation
        }
        
        // Remove any existing animation classes
        element.classList.remove('fade-in', 'slide-in-right', 'slide-in-up');
        
        // Force reflow to restart animation
        void element.offsetWidth;
        
        // Add the animation class
        element.classList.add(animationClass);
    }
    
    /**
     * Show a section and hide others, with improved keyboard focus management
     * @param {string} sectionId - ID of the section to show
     */
    showSection(sectionId) {
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        // Hide all sections first
        sections.forEach(section => {
            section.classList.remove('active');
            section.setAttribute('aria-hidden', 'true');
            
            // Make elements within inactive sections unreachable via keyboard
            const focusableElements = section.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            focusableElements.forEach(el => {
                el.setAttribute('tabindex', '-1');
                // Store original tabindex to restore later
                if (el.hasAttribute('data-original-tabindex')) {
                    el.setAttribute('data-original-tabindex', el.getAttribute('tabindex') || '0');
                }
            });
        });
        
        // Show the requested section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.setAttribute('aria-hidden', 'false');
            this.animateElement(targetSection, 'fade-in');
            
            // Make elements within active section keyboard accessible again
            const focusableElements = targetSection.querySelectorAll('[tabindex="-1"]');
            focusableElements.forEach(el => {
                if (el.hasAttribute('data-original-tabindex')) {
                    el.setAttribute('tabindex', el.getAttribute('data-original-tabindex'));
                } else {
                    el.setAttribute('tabindex', '0');
                }
            });
            
            // Announce section change to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'polite');
            announcement.classList.add('sr-only');
            
            // Get section heading if available
            const sectionHeading = targetSection.querySelector('h1, h2, h3, h4, h5, h6');
            announcement.textContent = sectionHeading 
                ? `Showing section: ${sectionHeading.textContent}` 
                : `Section changed to ${sectionId}`;
                
            document.body.appendChild(announcement);
            
            // Remove announcement after it's been read
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 3000);
        }
    }
}

// Export the UICore class for use in other modules
export default UICore;