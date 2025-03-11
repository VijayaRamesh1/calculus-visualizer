/**
 * math.js - Math helper functions
 */

const MathUtils = {
    /**
     * Calculate the numerical derivative of a function at a point
     * @param {string} fn - Function expression
     * @param {number} x - Point at which to calculate derivative
     * @param {number} h - Step size (defaults to 0.0001)
     * @returns {number} - Derivative value
     */
    calculateDerivative(fn, x, h = 0.0001) {
        try {
            // Central difference method: (f(x+h) - f(x-h)) / (2h)
            const fxPlusH = math.evaluate(fn, { x: x + h });
            const fxMinusH = math.evaluate(fn, { x: x - h });
            return (fxPlusH - fxMinusH) / (2 * h);
        } catch (error) {
            console.error('Error calculating derivative:', error);
            return NaN;
        }
    },
    
    /**
     * Generate a symbolic derivative expression (simple cases only)
     * @param {string} fn - Function expression
     * @returns {string} - Derivative expression
     */
    getDerivativeExpression(fn) {
        // This is a simplified symbolic differentiation
        // For more complex functions, we would need a full symbolic math library
        // Here we handle some common cases
        
        // Remove whitespace and convert to lowercase
        fn = fn.trim().toLowerCase();
        
        // Constant
        if (/^-?\\d+(\\.\\d+)?$/.test(fn)) {
            return '0';
        }
        
        // x term: x -> 1
        if (fn === 'x') {
            return '1';
        }
        
        // Power: x^n -> n*x^(n-1)
        const powerMatch = fn.match(/^x\\^(-?\\d+(\\.\\d+)?)$/);
        if (powerMatch) {
            const n = parseFloat(powerMatch[1]);
            if (n === 0) return '0';
            if (n === 1) return '1';
            if (n === 2) return '2*x';
            return `${n}*x^${n-1}`;
        }
        
        // Coefficient: a*x -> a
        const coeffMatch = fn.match(/^(-?\\d+(\\.\\d+)?)\\*x$/);
        if (coeffMatch) {
            return coeffMatch[1];
        }
        
        // Coefficient with power: a*x^n -> a*n*x^(n-1)
        const coeffPowerMatch = fn.match(/^(-?\\d+(\\.\\d+)?)\\*x\\^(-?\\d+(\\.\\d+)?)$/);
        if (coeffPowerMatch) {
            const a = parseFloat(coeffPowerMatch[1]);
            const n = parseFloat(coeffPowerMatch[3]);
            if (n === 0) return '0';
            if (n === 1) return `${a}`;
            return `${a*n}*x^${n-1}`;
        }
        
        // Sin: sin(x) -> cos(x)
        if (fn === 'sin(x)') {
            return 'cos(x)';
        }
        
        // Cos: cos(x) -> -sin(x)
        if (fn === 'cos(x)') {
            return '-sin(x)';
        }
        
        // Exponential: e^x -> e^x
        if (fn === 'e^x' || fn === 'exp(x)') {
            return 'e^x';
        }
        
        // Logarithm: ln(x) -> 1/x
        if (fn === 'ln(x)' || fn === 'log(x)') {
            return '1/x';
        }
        
        // For more complex functions, we'll use numerical differentiation
        // and create an approximation
        return `derivative(${fn})`;
    },
    
    /**
     * Generate a symbolic antiderivative expression (simple cases only)
     * @param {string} fn - Function expression
     * @returns {string} - Antiderivative expression
     */
    getAntiderivativeExpression(fn) {
        // Simplified symbolic integration
        // For more complex functions, we would need a full symbolic math library
        
        // Remove whitespace and convert to lowercase
        fn = fn.trim().toLowerCase();
        
        // Constant: c -> c*x
        if (/^-?\\d+(\\.\\d+)?$/.test(fn)) {
            const c = parseFloat(fn);
            return `${c}*x`;
        }
        
        // x term: x -> x^2/2
        if (fn === 'x') {
            return 'x^2/2';
        }
        
        // Power: x^n -> x^(n+1)/(n+1) for n != -1
        const powerMatch = fn.match(/^x\\^(-?\\d+(\\.\\d+)?)$/);
        if (powerMatch) {
            const n = parseFloat(powerMatch[1]);
            if (n === -1) return 'ln(abs(x))';
            return `x^${n+1}/${n+1}`;
        }
        
        // Coefficient: a*x -> a*x^2/2
        const coeffMatch = fn.match(/^(-?\\d+(\\.\\d+)?)\\*x$/);
        if (coeffMatch) {
            const a = parseFloat(coeffMatch[1]);
            return `${a}*x^2/2`;
        }
        
        // Coefficient with power: a*x^n -> a*x^(n+1)/(n+1)
        const coeffPowerMatch = fn.match(/^(-?\\d+(\\.\\d+)?)\\*x\\^(-?\\d+(\\.\\d+)?)$/);
        if (coeffPowerMatch) {
            const a = parseFloat(coeffPowerMatch[1]);
            const n = parseFloat(coeffPowerMatch[3]);
            if (n === -1) return `${a}*ln(abs(x))`;
            return `${a}*x^${n+1}/${n+1}`;
        }
        
        // Sin: sin(x) -> -cos(x)
        if (fn === 'sin(x)') {
            return '-cos(x)';
        }
        
        // Cos: cos(x) -> sin(x)
        if (fn === 'cos(x)') {
            return 'sin(x)';
        }
        
        // Exponential: e^x -> e^x
        if (fn === 'e^x' || fn === 'exp(x)') {
            return 'e^x';
        }
        
        // Logarithm: 1/x -> ln(abs(x))
        if (fn === '1/x') {
            return 'ln(abs(x))';
        }
        
        // For more complex functions, we'll create a placeholder
        return `antiderivative(${fn}) + C`;
    },
    
    /**
     * Calculate a definite integral numerically
     * @param {string} fn - Function expression
     * @param {number} a - Lower bound
     * @param {number} b - Upper bound
     * @param {number} n - Number of intervals (defaults to 1000)
     * @returns {number} - Definite integral value
     */
    calculateDefiniteIntegral(fn, a, b, n = 1000) {
        // Simpson's rule
        if (a === b) return 0;
        if (a > b) return -this.calculateDefiniteIntegral(fn, b, a, n);
        
        const h = (b - a) / n;
        let sum = 0;
        
        try {
            // Evaluate at the endpoints
            sum = math.evaluate(fn, { x: a }) + math.evaluate(fn, { x: b });
            
            // Add the terms with coefficient 4
            for (let i = 1; i < n; i += 2) {
                const x = a + i * h;
                const fx = math.evaluate(fn, { x });
                if (isFinite(fx)) sum += 4 * fx;
            }
            
            // Add the terms with coefficient 2
            for (let i = 2; i < n; i += 2) {
                const x = a + i * h;
                const fx = math.evaluate(fn, { x });
                if (isFinite(fx)) sum += 2 * fx;
            }
            
            return (h / 3) * sum;
        } catch (error) {
            console.error('Error calculating definite integral:', error);
            return NaN;
        }
    },
    
    /**
     * Calculate a limit numerically
     * @param {string} fn - Function expression
     * @param {number} point - Point to approach
     * @param {string} direction - Direction to approach from: 'left', 'right', or 'both'
     * @returns {number} - Limit value
     */
    calculateLimit(fn, point, direction = 'both') {
        const epsilon = 1e-10;
        const steps = 15;
        const results = [];
        
        try {
            // Try direct evaluation first (for continuous functions)
            try {
                const directValue = math.evaluate(fn, { x: point });
                if (isFinite(directValue)) return directValue;
            } catch (e) {
                // Function not defined at point, continue with limit calculation
            }
            
            // Approach from the left
            if (direction === 'left' || direction === 'both') {
                for (let i = 1; i <= steps; i++) {
                    const h = Math.pow(10, -i);
                    const x = point - h;
                    const fx = math.evaluate(fn, { x });
                    if (isFinite(fx)) results.push(fx);
                }
            }
            
            // Approach from the right
            if (direction === 'right' || direction === 'both') {
                for (let i = 1; i <= steps; i++) {
                    const h = Math.pow(10, -i);
                    const x = point + h;
                    const fx = math.evaluate(fn, { x });
                    if (isFinite(fx)) results.push(fx);
                }
            }
            
            // No valid results
            if (results.length === 0) return NaN;
            
            // Check if the limit exists (results converge)
            const lastResults = results.slice(-Math.min(5, results.length));
            const avg = lastResults.reduce((sum, val) => sum + val, 0) / lastResults.length;
            
            // Check if values are close enough
            const converges = lastResults.every(val => Math.abs(val - avg) < epsilon);
            return converges ? avg : NaN;
        } catch (error) {
            console.error('Error calculating limit:', error);
            return NaN;
        }
    }
};

// Add a global math function for derivatives
math.import({
    derivative: function(expr, x) {
        if (typeof expr === 'string') {
            // When called with just the function expression
            return function(scope) {
                return MathUtils.calculateDerivative(expr, scope.x);
            };
        } else {
            // When called with a value directly
            return MathUtils.calculateDerivative(expr, x);
        }
    }
});

// Add a global math function for antiderivatives
math.import({
    antiderivative: function(expr) {
        // This is just a placeholder for displaying the expression
        // The actual calculation is done numerically via calculateDefiniteIntegral
        return function(scope) {
            return 0; // Placeholder
        };
    }
});