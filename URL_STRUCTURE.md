# Calculus Visualizer URL Structure

This document outlines the URL structure used in the Calculus Visualizer application, providing a clear mapping between URLs and their corresponding functionality.

## Main Application URLs

| URL | Description |
|-----|-------------|
| `/calculus-visualizer` | Home/Landing Page |
| `/calculus-visualizer/accessibility` | Accessibility Statement |

## Core Calculus Concept URLs

| URL | Description |
|-----|-------------|
| `/calculus-visualizer/derivatives` | Derivatives Module |
| `/calculus-visualizer/integrals` | Integrals Module |
| `/calculus-visualizer/limits` | Limits Module |
| `/calculus-visualizer/vector` | Vector Calculus Module |

## Application Examples URLs

| URL | Description |
|-----|-------------|
| `/calculus-visualizer/examples/projectile-motion` | Projectile Motion Example |
| `/calculus-visualizer/examples/harmonic-motion` | Harmonic Motion Example |
| `/calculus-visualizer/examples/area-curves` | Area Under Curves Example |
| `/calculus-visualizer/examples/taylor-series` | Taylor Series Example |
| `/calculus-visualizer/examples/population-growth` | Population Growth Example |

## Real-World Applications URLs

| URL | Description |
|-----|-------------|
| `/calculus-visualizer/applications/car-acceleration` | Car Acceleration Application |
| `/calculus-visualizer/applications/spring-oscillation` | Spring Oscillation Application |
| `/calculus-visualizer/applications/wave-propagation` | Wave Propagation Application |
| `/calculus-visualizer/applications/market-equilibrium` | Market Equilibrium Application |

## User Resources URLs

| URL | Description |
|-----|-------------|
| `/calculus-visualizer/guide` | User Guide |
| `/calculus-visualizer/shortcuts` | Keyboard Shortcuts |
| `/calculus-visualizer/about` | About Page |
| `/calculus-visualizer/contact` | Contact Page |

## User Settings URLs

| URL | Description |
|-----|-------------|
| `/calculus-visualizer/settings/theme` | Theme Preferences |
| `/calculus-visualizer/settings/level` | Difficulty Level Settings |

## Structure Design

The URL structure follows these design principles:

1. All URLs start with the brand name `calculus-visualizer` as the base path
2. The URL structure follows a logical hierarchy:
   - Main concepts directly under the base path
   - Example applications grouped under `/examples/`
   - Real-world applications grouped under `/applications/`
   - User resources directly under the base path
   - Settings grouped under `/settings/`
3. URLs are descriptive yet concise
4. The structure allows for easy expansion with new modules or examples
5. Follows RESTful principles where resource types are plural nouns

## Technical Implementation

The URL routing is implemented using:

1. A client-side JavaScript router (`js/router.js`)
2. URL configuration mapping (`js/routes.js`)
3. Server-side URL rewriting (`.htaccess`) for single-page application (SPA) routing

Relative URLs are used throughout the application with the base path `/calculus-visualizer/` to ensure consistency across deployments.