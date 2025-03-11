/**
 * Modern user level toggle functionality
 * Replaces the dropdown selector with a toggle UI
 */

// Initialize the user level toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggleOptions = document.querySelectorAll('.toggle-option');
    
    toggleOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            toggleOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get the selected level
            const level = this.getAttribute('data-level');
            
            // Update the body class (same as the existing functionality)
            document.body.className = '';
            document.body.classList.add('user-level-' + level);
            
            // Show/hide elements based on the selected level
            updateVisibleElements(level);
            
            // Trigger any additional level-specific logic
            if (window.userLevelChanged) {
                window.userLevelChanged(level);
            }
        });
    });
    
    // Function to update visible elements based on user level
    function updateVisibleElements(level) {
        // Hide all level-specific elements
        document.querySelectorAll('.beginner-only, .expert-only, .professional-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Show elements for the selected level and below
        if (level === 'beginner') {
            document.querySelectorAll('.beginner-only').forEach(el => {
                el.style.display = 'block';
            });
        } else if (level === 'expert') {
            document.querySelectorAll('.beginner-only, .expert-only').forEach(el => {
                el.style.display = 'block';
            });
        } else if (level === 'professional') {
            document.querySelectorAll('.beginner-only, .expert-only, .professional-only').forEach(el => {
                el.style.display = 'block';
            });
            
            // Show professional tools
            document.querySelector('.professional-tool').style.display = 'block';
        }
        
        // Update examples dropdown
        updateExamplesDropdown(level);
    }
    
    // Function to update visible options in the examples dropdown
    function updateExamplesDropdown(level) {
        const options = document.querySelectorAll('#examples option');
        
        options.forEach(option => {
            if (option.classList.contains('expert-only') && level === 'beginner') {
                option.style.display = 'none';
            } else if (option.classList.contains('professional-only') && level !== 'professional') {
                option.style.display = 'none';
            } else {
                option.style.display = '';
            }
        });
    }
});
