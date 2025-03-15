# Calculus Visualizer

An interactive 3D calculus visualization tool using Three.js

## Overview

Calculus Visualizer is a web-based application designed to help students and educators visualize complex calculus concepts through interactive 3D representations. The tool uses Three.js to render mathematical functions and calculus operations in an engaging and intuitive way.

## Features

- Interactive 3D visualization of calculus concepts
- Dedicated modules for derivatives, integrals, limits, and vector calculus
- Real-world applications and examples
- Customizable parameters for exploration
- Mobile-friendly responsive design
- Accessibility features for inclusive learning

## URL Structure

The application uses a carefully designed URL structure that provides:

- Intuitive navigation through the application
- Direct access to specific modules and examples
- Consistent URL patterns for bookmarking and sharing

See [URL_STRUCTURE.md](URL_STRUCTURE.md) for a detailed breakdown of all URLs and their mapping.

## Technical Implementation

- **Framework**: Vanilla JavaScript with modular architecture
- **Rendering**: Three.js for 3D visualizations
- **Math Processing**: Math.js for mathematical operations
- **Routing**: Custom client-side routing with server-side fallback
- **Styling**: CSS with variables for theming

## Modules

The application consists of several specialized modules:

1. **Core Calculus**
   - Derivatives
   - Integrals
   - Limits
   - Vector Calculus

2. **Interactive Examples**
   - Projectile Motion
   - Harmonic Motion
   - Area Under Curves
   - Taylor Series
   - Population Growth

3. **Real-World Applications**
   - Car Acceleration
   - Spring Oscillation
   - Wave Propagation
   - Market Equilibrium

## Recent Updates

### URL Routing Enhancements (March 2025)

We've improved the URL routing system to ensure consistent navigation between the main application and standalone modules:

- Added URL rewriting rules to correctly map example URLs to module directories
- Enhanced the router to better handle direct module access
- Updated documentation to clarify URL structure and navigation paths
- Created placeholder modules for consistent navigation experience

These changes ensure that all features are accessible regardless of how users navigate to them, improving the overall user experience.

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Explore different calculus concepts through the navigation menu

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - See LICENSE file for details