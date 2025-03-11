/**
 * animations.js - Animation utilities
 */

const AnimationUtils = {
    /**
     * Animate a value changing over time
     * @param {number} from - Starting value
     * @param {number} to - Target value
     * @param {number} duration - Animation duration in milliseconds
     * @param {function} updateFn - Callback function called with the current value
     * @param {function} easingFn - Easing function (optional)
     * @param {function} completeFn - Callback function called when animation completes (optional)
     */
    animateValue(from, to, duration, updateFn, easingFn, completeFn) {
        const startTime = performance.now();
        
        // Default easing function (easeInOutCubic)
        if (!easingFn) {
            easingFn = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easingFn(progress);
            const currentValue = from + (to - from) * easedProgress;
            
            updateFn(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (completeFn) {
                completeFn();
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    /**
     * Create a smooth transition between two functions
     * @param {string} fromFn - Starting function expression
     * @param {string} toFn - Target function expression
     * @param {number} duration - Animation duration in milliseconds
     * @param {function} updateFn - Callback function called with the current function expression
     */
    animateFunction(fromFn, toFn, duration, updateFn) {
        // Parse function expressions to extract coefficients
        // This is a simplified implementation that works for polynomial functions
        // For more complex functions, we would need a more sophisticated approach
        
        // Create a blended function that transitions from fromFn to toFn
        const blendedFn = (t) => {
            return `(1-${t})*${fromFn} + ${t}*${toFn}`;
        };
        
        this.animateValue(0, 1, duration, (t) => {
            const currentFn = blendedFn(t);
            updateFn(currentFn);
        });
    },
    
    /**
     * Animate a camera transitioning to a new position
     * @param {THREE.Camera} camera - Camera to animate
     * @param {THREE.Vector3} targetPosition - Target camera position
     * @param {THREE.Vector3} targetLookAt - Target point to look at
     * @param {number} duration - Animation duration in milliseconds
     * @param {function} onComplete - Callback when animation completes (optional)
     */
    animateCamera(camera, targetPosition, targetLookAt, duration, onComplete) {
        const startPosition = camera.position.clone();
        const startRotation = camera.rotation.clone();
        
        // Create a dummy camera to calculate the target rotation
        const dummyCamera = camera.clone();
        dummyCamera.position.copy(targetPosition);
        dummyCamera.lookAt(targetLookAt);
        const targetRotation = dummyCamera.rotation.clone();
        
        this.animateValue(0, 1, duration, 
            // Update function
            (t) => {
                // Interpolate position
                camera.position.lerpVectors(startPosition, targetPosition, t);
                
                // Interpolate rotation (using slerp for quaternions)
                const startQuaternion = new THREE.Quaternion().setFromEuler(startRotation);
                const endQuaternion = new THREE.Quaternion().setFromEuler(targetRotation);
                const currentQuaternion = new THREE.Quaternion();
                
                currentQuaternion.slerpQuaternions(startQuaternion, endQuaternion, t);
                camera.setRotationFromQuaternion(currentQuaternion);
            },
            // Easing function (easeInOutCubic)
            null,
            // Complete function
            onComplete
        );
    },
    
    /**
     * Create a pulse effect on a mesh
     * @param {THREE.Mesh} mesh - Mesh to animate
     * @param {number} duration - Pulse duration in milliseconds
     * @param {number} intensity - Pulse intensity (scale factor)
     * @param {number} count - Number of pulses (default: 1)
     */
    pulseMesh(mesh, duration, intensity, count = 1) {
        const originalScale = mesh.scale.clone();
        let pulseCount = 0;
        
        const doPulse = () => {
            this.animateValue(0, Math.PI * 2, duration, 
                // Update function
                (t) => {
                    const scale = 1 + Math.sin(t) * intensity;
                    mesh.scale.copy(originalScale).multiplyScalar(scale);
                },
                // Easing function (none, using sin for pulsing)
                t => t,
                // Complete function
                () => {
                    pulseCount++;
                    if (pulseCount < count) {
                        doPulse();
                    } else {
                        // Reset to original scale
                        mesh.scale.copy(originalScale);
                    }
                }
            );
        };
        
        doPulse();
    },
    
    /**
     * Fade a mesh in or out
     * @param {THREE.Mesh} mesh - Mesh to animate
     * @param {boolean} fadeIn - True to fade in, false to fade out
     * @param {number} duration - Animation duration in milliseconds
     * @param {function} onComplete - Callback when animation completes (optional)
     */
    fadeMesh(mesh, fadeIn, duration, onComplete) {
        // Ensure material has transparency enabled
        if (mesh.material) {
            mesh.material.transparent = true;
            
            const fromOpacity = fadeIn ? 0 : 1;
            const toOpacity = fadeIn ? 1 : 0;
            
            // Make mesh visible if fading in
            if (fadeIn) mesh.visible = true;
            
            this.animateValue(fromOpacity, toOpacity, duration, 
                // Update function
                (opacity) => {
                    mesh.material.opacity = opacity;
                },
                // Easing function (default)
                null,
                // Complete function
                () => {
                    // Hide mesh if faded out completely
                    if (!fadeIn && mesh.material.opacity <= 0.001) {
                        mesh.visible = false;
                    }
                    
                    if (onComplete) onComplete();
                }
            );
        }
    }
};