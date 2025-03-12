/**
 * Core Math Engine for Calculus Visualizer
 * 
 * Provides mathematical operations for calculus concepts, including:
 * - Derivatives and integrals
 * - Vector operations
 * - Physics calculations
 * - Coordinate transformations
 */

class MathEngine {
    constructor() {
        // Configuration
        this.precision = 0.001; // Default precision for numerical methods
    }

    /**
     * Calculate the derivative of a function at a specific point
     * @param {Function} func - The function to differentiate
     * @param {number} x - The point at which to calculate the derivative
     * @param {number} h - Step size (optional, defaults to precision)
     * @returns {number} The derivative value
     */
    derivative(func, x, h = this.precision) {
        return (func(x + h) - func(x - h)) / (2 * h);
    }

    /**
     * Calculate the second derivative of a function at a specific point
     * @param {Function} func - The function to differentiate twice
     * @param {number} x - The point at which to calculate the second derivative
     * @param {number} h - Step size (optional, defaults to precision)
     * @returns {number} The second derivative value
     */
    secondDerivative(func, x, h = this.precision) {
        return (func(x + h) - 2 * func(x) + func(x - h)) / (h * h);
    }

    /**
     * Calculate a definite integral using the trapezoidal rule
     * @param {Function} func - The function to integrate
     * @param {number} a - Lower bound
     * @param {number} b - Upper bound
     * @param {number} n - Number of intervals (optional, defaults to 1/precision)
     * @returns {number} The approximate integral value
     */
    integrate(func, a, b, n = Math.ceil(1 / this.precision)) {
        const h = (b - a) / n;
        let sum = 0.5 * (func(a) + func(b));
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            sum += func(x);
        }
        
        return sum * h;
    }

    /**
     * Calculate the limit of a function as x approaches a value
     * @param {Function} func - The function
     * @param {number} x - The value x approaches
     * @param {number} epsilon - Small value for approaching the limit
     * @returns {number} The approximate limit
     */
    limit(func, x, epsilon = this.precision) {
        const leftLimit = func(x - epsilon);
        const rightLimit = func(x + epsilon);
        
        // Check if the limit exists (left and right limits are approximately equal)
        if (Math.abs(leftLimit - rightLimit) < epsilon) {
            return (leftLimit + rightLimit) / 2;
        }
        
        return NaN; // Limit doesn't exist
    }

    /**
     * Calculate a parametric curve trajectory
     * @param {Function} xFunc - Function for x coordinate in terms of parameter t
     * @param {Function} yFunc - Function for y coordinate in terms of parameter t
     * @param {Function} zFunc - Function for z coordinate in terms of parameter t
     * @param {number} tStart - Starting parameter value
     * @param {number} tEnd - Ending parameter value
     * @param {number} steps - Number of points to generate
     * @returns {Array} Array of points [{x, y, z}] representing the curve
     */
    parametricCurve(xFunc, yFunc, zFunc, tStart, tEnd, steps = 100) {
        const points = [];
        const tStep = (tEnd - tStart) / steps;
        
        for (let i = 0; i <= steps; i++) {
            const t = tStart + i * tStep;
            points.push({
                x: xFunc(t),
                y: yFunc(t),
                z: zFunc(t)
            });
        }
        
        return points;
    }

    /**
     * Vector addition
     * @param {Object} v1 - First vector {x, y, z}
     * @param {Object} v2 - Second vector {x, y, z}
     * @returns {Object} Resulting vector {x, y, z}
     */
    vectorAdd(v1, v2) {
        return {
            x: v1.x + v2.x,
            y: v1.y + v2.y,
            z: v1.z + v2.z
        };
    }

    /**
     * Vector subtraction
     * @param {Object} v1 - First vector {x, y, z}
     * @param {Object} v2 - Second vector {x, y, z}
     * @returns {Object} Resulting vector {x, y, z}
     */
    vectorSubtract(v1, v2) {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
            z: v1.z - v2.z
        };
    }

    /**
     * Vector scalar multiplication
     * @param {Object} v - Vector {x, y, z}
     * @param {number} scalar - Scalar value
     * @returns {Object} Resulting vector {x, y, z}
     */
    vectorScale(v, scalar) {
        return {
            x: v.x * scalar,
            y: v.y * scalar,
            z: v.z * scalar
        };
    }

    /**
     * Vector dot product
     * @param {Object} v1 - First vector {x, y, z}
     * @param {Object} v2 - Second vector {x, y, z}
     * @returns {number} Dot product result
     */
    vectorDot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Vector cross product
     * @param {Object} v1 - First vector {x, y, z}
     * @param {Object} v2 - Second vector {x, y, z}
     * @returns {Object} Resulting vector {x, y, z}
     */
    vectorCross(v1, v2) {
        return {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
        };
    }

    /**
     * Calculate vector magnitude
     * @param {Object} v - Vector {x, y, z}
     * @returns {number} Magnitude of vector
     */
    vectorMagnitude(v) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    /**
     * Normalize a vector (make it unit length)
     * @param {Object} v - Vector {x, y, z}
     * @returns {Object} Unit vector in same direction
     */
    vectorNormalize(v) {
        const mag = this.vectorMagnitude(v);
        if (mag === 0) return { x: 0, y: 0, z: 0 };
        
        return {
            x: v.x / mag,
            y: v.y / mag,
            z: v.z / mag
        };
    }

    /**
     * Projectile motion position function
     * @param {number} v0 - Initial velocity magnitude
     * @param {number} angle - Launch angle in degrees
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @param {number} t - Time in seconds
     * @returns {Object} Position vector {x, y, z}
     */
    projectilePosition(v0, angle, t, g = 9.8) {
        const angleRad = angle * Math.PI / 180;
        const v0x = v0 * Math.cos(angleRad);
        const v0y = v0 * Math.sin(angleRad);
        
        return {
            x: v0x * t,
            y: v0y * t - 0.5 * g * t * t,
            z: 0
        };
    }

    /**
     * Projectile motion velocity function
     * @param {number} v0 - Initial velocity magnitude
     * @param {number} angle - Launch angle in degrees
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @param {number} t - Time in seconds
     * @returns {Object} Velocity vector {x, y, z}
     */
    projectileVelocity(v0, angle, t, g = 9.8) {
        const angleRad = angle * Math.PI / 180;
        const v0x = v0 * Math.cos(angleRad);
        const v0y = v0 * Math.sin(angleRad);
        
        return {
            x: v0x,
            y: v0y - g * t,
            z: 0
        };
    }

    /**
     * Projectile motion acceleration function
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @returns {Object} Acceleration vector {x, y, z}
     */
    projectileAcceleration(g = 9.8) {
        return {
            x: 0,
            y: -g,
            z: 0
        };
    }

    /**
     * Calculate time of flight for projectile motion
     * @param {number} v0 - Initial velocity magnitude
     * @param {number} angle - Launch angle in degrees
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @returns {number} Time of flight in seconds
     */
    projectileTimeOfFlight(v0, angle, g = 9.8) {
        const angleRad = angle * Math.PI / 180;
        return (2 * v0 * Math.sin(angleRad)) / g;
    }

    /**
     * Calculate maximum height for projectile motion
     * @param {number} v0 - Initial velocity magnitude
     * @param {number} angle - Launch angle in degrees
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @returns {number} Maximum height in units
     */
    projectileMaxHeight(v0, angle, g = 9.8) {
        const angleRad = angle * Math.PI / 180;
        return Math.pow(v0 * Math.sin(angleRad), 2) / (2 * g);
    }

    /**
     * Calculate range for projectile motion
     * @param {number} v0 - Initial velocity magnitude
     * @param {number} angle - Launch angle in degrees
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @returns {number} Range in units
     */
    projectileRange(v0, angle, g = 9.8) {
        const angleRad = angle * Math.PI / 180;
        return Math.pow(v0, 2) * Math.sin(2 * angleRad) / g;
    }

    /**
     * Generate the full trajectory of a projectile motion
     * @param {number} v0 - Initial velocity magnitude
     * @param {number} angle - Launch angle in degrees
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @param {number} steps - Number of points to generate (default: 100)
     * @returns {Array} Array of position points along trajectory
     */
    projectileTrajectory(v0, angle, g = 9.8, steps = 100) {
        const tFlight = this.projectileTimeOfFlight(v0, angle, g);
        const tStep = tFlight / steps;
        const trajectory = [];
        
        for (let i = 0; i <= steps; i++) {
            const t = i * tStep;
            trajectory.push(this.projectilePosition(v0, angle, t, g));
        }
        
        return trajectory;
    }

    /**
     * Generate the velocity vectors along a projectile trajectory
     * @param {number} v0 - Initial velocity magnitude
     * @param {number} angle - Launch angle in degrees
     * @param {number} g - Gravity acceleration (default: 9.8 m/s²)
     * @param {number} steps - Number of points to generate (default: 100)
     * @returns {Array} Array of {position, velocity} objects along trajectory
     */
    projectileVelocityVectors(v0, angle, g = 9.8, steps = 20) {
        const tFlight = this.projectileTimeOfFlight(v0, angle, g);
        const tStep = tFlight / steps;
        const vectors = [];
        
        for (let i = 0; i <= steps; i++) {
            const t = i * tStep;
            vectors.push({
                position: this.projectilePosition(v0, angle, t, g),
                velocity: this.projectileVelocity(v0, angle, t, g)
            });
        }
        
        return vectors;
    }
}

// Export the MathEngine class for use in other modules
export default MathEngine;