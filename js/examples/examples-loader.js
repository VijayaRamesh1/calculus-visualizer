/**
 * Examples Loader
 * 
 * This module loads and initializes the selected example visualization.
 */

class ExamplesLoader {
  constructor() {
    this.currentExample = null;
    this.examplesSelect = document.getElementById('examples');
    this.conceptExplanation = document.getElementById('concept-explanation');
    
    // Initialize
    this.init();
  }
  
  init() {
    // Set up event listeners
    if (this.examplesSelect) {
      this.examplesSelect.addEventListener('change', () => this.loadExample());
    }
  }
  
  loadExample() {
    const exampleId = this.examplesSelect.value;
    
    // Clear previous example if any
    if (this.currentExample) {
      // Any cleanup logic would go here
    }
    
    // If no example selected, do nothing
    if (!exampleId) {
      return;
    }
    
    // Load the selected example
    if (window.examples && window.examples[exampleId]) {
      // Initialize the example
      this.currentExample = window.examples[exampleId].init('visualization');
      
      // Update explanation content if available
      if (window.examples[exampleId].description) {
        const title = document.getElementById('concept-title');
        if (title) {
          title.textContent = window.examples[exampleId].description.title;
        }
        
        if (this.conceptExplanation) {
          this.conceptExplanation.innerHTML = window.examples[exampleId].description.content;
        }
      }
    } else {
      console.error(`Example "${exampleId}" not found`);
    }
  }
}

// Initialize the examples loader when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.examplesLoader = new ExamplesLoader();
});
