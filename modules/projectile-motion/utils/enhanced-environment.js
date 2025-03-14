/**
 * Enhanced Environment Rendering for Projectile Motion
 * 
 * This module extends the ThreeUtils class to create a more
 * picturesque and environment-aware visualization.
 */

class EnhancedEnvironment {
    constructor(threeUtils) {
        this.threeUtils = threeUtils;
        this.scene = threeUtils.scene;
        this.renderer = threeUtils.renderer;
        
        // Environment settings
        this.timeOfDay = 'day'; // 'day', 'sunset', 'night'
        this.environmentType = 'grassland'; // 'grassland', 'desert', 'snow'
        this.weatherEffect = 'clear'; // 'clear', 'rain', 'fog', 'snow'
        
        // Environment objects
        this.terrain = null;
        this.sky = null;
        this.water = null;
        this.vegetation = [];
        this.clouds = [];
        this.weatherSystem = null;
        
        // Lighting
        this.sunLight = null;
        this.ambientLight = null;
        this.hemisphereLight = null;
        
        // Initialize
        this.setupEnvironment();
    }
    
    /**
     * Set up the enhanced environment
     */
    setupEnvironment() {
        // Enhance renderer settings for better visuals
        this.enhanceRenderer();
        
        // Create lighting system
        this.setupLighting();
        
        // Create sky system
        this.setupSky();
        
        // Create terrain
        this.setupTerrain();
        
        // Add environmental details
        this.addEnvironmentalDetails();
        
        // Set up weather system
        this.setupWeatherSystem();
    }
    
    /**
     * Enhance renderer settings for better visuals
     */
    enhanceRenderer() {
        // Enable shadows with higher quality
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Enable physically correct lighting
        this.renderer.physicallyCorrectLights = true;
        
        // Better color encoding
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        // Add tone mapping for more realistic colors
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }
    
    /**
     * Set up advanced lighting system
     */
    setupLighting() {
        // Remove existing lights
        this.scene.children.forEach(child => {
            if (child.isLight) {
                this.scene.remove(child);
            }
        });
        
        // Create main directional light (sun)
        this.sunLight = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        this.sunLight.position.set(10, 20, 15);
        this.sunLight.castShadow = true;
        
        // Higher resolution shadow maps
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        
        // Adjust shadow camera for better coverage
        const shadowSize = 30;
        this.sunLight.shadow.camera.left = -shadowSize;
        this.sunLight.shadow.camera.right = shadowSize;
        this.sunLight.shadow.camera.top = shadowSize;
        this.sunLight.shadow.camera.bottom = -shadowSize;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 100;
        this.sunLight.shadow.bias = -0.0001;
        
        this.scene.add(this.sunLight);
        
        // Create ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(this.ambientLight);
        
        // Create hemisphere light for better outdoor lighting
        this.hemisphereLight = new THREE.HemisphereLight(0xB1E1FF, 0x4F7942, 0.6);
        this.hemisphereLight.position.set(0, 50, 0);
        this.scene.add(this.hemisphereLight);
    }
    
    /**
     * Set up a dynamic sky system
     */
    setupSky() {
        // Remove existing sky if any
        if (this.sky) {
            this.scene.remove(this.sky.mesh);
        }
        
        // Create sky dome with gradient
        const vertexShader = `
            varying vec3 vWorldPosition;
            
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            uniform vec3 topColor;
            uniform vec3 bottomColor;
            uniform float offset;
            uniform float exponent;
            
            varying vec3 vWorldPosition;
            
            void main() {
                float h = normalize(vWorldPosition + offset).y;
                gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
            }
        `;
        
        // Create shader material with appropriate colors for time of day
        const skyGeo = new THREE.SphereGeometry(500, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077FF) },  // Sky blue
                bottomColor: { value: new THREE.Color(0xAAAAAA) },  // Light gray
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
        });
        
        this.sky = {
            mesh: new THREE.Mesh(skyGeo, skyMat),
            material: skyMat
        };
        
        this.scene.add(this.sky.mesh);
        
        // Add clouds
        this.addClouds();
    }
    
    /**
     * Add volumetric clouds to the sky
     */
    addClouds() {
        const cloudCount = 20;
        
        // Create cloud material
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            roughness: 1,
            metalness: 0
        });
        
        // Clear existing clouds
        this.clouds.forEach(cloud => this.scene.remove(cloud));
        this.clouds = [];
        
        // Create clouds at random positions
        for (let i = 0; i < cloudCount; i++) {
            // Create cloud parts with overlapping spheres
            const cloudParts = 5 + Math.floor(Math.random() * 5);
            const cloudGroup = new THREE.Group();
            
            const cloudWidth = 5 + Math.random() * 10;
            const cloudHeight = 1 + Math.random() * 2;
            const cloudDepth = 3 + Math.random() * 5;
            
            for (let j = 0; j < cloudParts; j++) {
                const radius = 1 + Math.random();
                const geometry = new THREE.SphereGeometry(radius, 7, 7);
                const cloudPiece = new THREE.Mesh(geometry, cloudMaterial);
                
                // Position within cloud dimensions
                cloudPiece.position.x = (Math.random() - 0.5) * cloudWidth;
                cloudPiece.position.y = (Math.random() - 0.5) * cloudHeight;
                cloudPiece.position.z = (Math.random() - 0.5) * cloudDepth;
                
                cloudGroup.add(cloudPiece);
            }
            
            // Position the entire cloud in the sky
            cloudGroup.position.x = (Math.random() - 0.5) * 200;
            cloudGroup.position.y = 50 + Math.random() * 30;
            cloudGroup.position.z = (Math.random() - 0.5) * 200;
            
            // Gentle random rotation
            cloudGroup.rotation.y = Math.random() * Math.PI;
            
            this.clouds.push(cloudGroup);
            this.scene.add(cloudGroup);
        }
    }
    
    /**
     * Set up enhanced terrain with realistic materials
     */
    setupTerrain() {
        // Remove existing terrain if any
        if (this.terrain) {
            this.scene.remove(this.terrain);
        }
        
        // Create heightmap-based terrain
        this.createHeightmapTerrain();
        
        // Add water if needed
        this.addWaterElements();
    }
    
    /**
     * Create a heightmap-based terrain
     */
    createHeightmapTerrain() {
        // Create a larger, more detailed ground plane
        const groundSize = 100;
        const groundSegments = 100;
        
        // Create ground with more vertices for detail
        const groundGeometry = new THREE.PlaneGeometry(
            groundSize, 
            groundSize, 
            groundSegments, 
            groundSegments
        );
        
        // Apply height variations for natural-looking terrain
        const vertices = groundGeometry.attributes.position.array;
        
        for (let i = 0; i < vertices.length; i += 3) {
            // Skip center area to keep it flat for projectile landing
            const x = vertices[i];
            const z = vertices[i + 2];
            const distanceFromCenter = Math.sqrt(x * x + z * z);
            
            if (distanceFromCenter > 15) {
                // Apply Perlin noise for natural-looking height variation
                // (Simplified version without actual Perlin noise)
                const xFactor = Math.sin(x * 0.1) * Math.cos(z * 0.1);
                const zFactor = Math.cos(x * 0.08) * Math.sin(z * 0.08);
                const height = xFactor * zFactor * 2.0;
                
                // Increase height gradually as we move away from center
                const heightFactor = (distanceFromCenter - 15) / 15;
                vertices[i + 1] = height * Math.min(heightFactor, 1.0);
            }
        }
        
        // Update geometry after modifications
        groundGeometry.computeVertexNormals();
        
        // Create enhanced ground material with textures
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x567d46,  // Base green color
            roughness: 0.9,
            metalness: 0.1,
            side: THREE.DoubleSide
        });
        
        // Create terrain mesh
        this.terrain = new THREE.Mesh(groundGeometry, groundMaterial);
        this.terrain.rotation.x = -Math.PI / 2; // Lay flat
        this.terrain.position.y = -0.01; // Slightly below zero to avoid z-fighting
        this.terrain.receiveShadow = true;
        
        this.scene.add(this.terrain);
        
        // Add terrain details
        this.addTerrainDetails();
    }
    
    /**
     * Add details to the terrain (rocks, height variations, etc.)
     */
    addTerrainDetails() {
        // Add hills in the distance
        for (let i = 0; i < 5; i++) {
            const hillSize = 15 + Math.random() * 20;
            const hillGeometry = new THREE.SphereGeometry(
                hillSize, 
                Math.floor(hillSize * 1.2), 
                Math.floor(hillSize * 0.8),
                0, 
                Math.PI * 2, 
                0, 
                Math.PI * 0.5
            );
            
            const hillMaterial = new THREE.MeshStandardMaterial({
                color: 0x3a5f2a,  // Darker green
                roughness: 0.9,
                metalness: 0.1
            });
            
            const hill = new THREE.Mesh(hillGeometry, hillMaterial);
            
            // Position hills in the distance
            const distance = 50 + Math.random() * 20;
            const angle = Math.random() * Math.PI * 2;
            hill.position.set(
                Math.cos(angle) * distance,
                -hillSize + Math.random() * 2, // Partially bury
                Math.sin(angle) * distance
            );
            
            hill.castShadow = true;
            hill.receiveShadow = true;
            this.scene.add(hill);
        }
        
        // Add scattered rocks
        this.addRocks();
    }
    
    /**
     * Add rocks to the terrain
     */
    addRocks() {
        const rockCount = 30;
        
        for (let i = 0; i < rockCount; i++) {
            // Create randomized rock geometry
            const geometry = new THREE.DodecahedronGeometry(1, 1);
            
            // Distort vertices for more natural look
            const positionAttribute = geometry.getAttribute('position');
            const positions = positionAttribute.array;
            
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] += (Math.random() - 0.5) * 0.3;
                positions[j + 1] += (Math.random() - 0.5) * 0.3;
                positions[j + 2] += (Math.random() - 0.5) * 0.3;
            }
            
            geometry.computeVertexNormals();
            
            // Create rock material
            const material = new THREE.MeshStandardMaterial({
                color: 0x7f7f7f,  // Gray
                roughness: 0.9,
                metalness: 0.1
            });
            
            const rock = new THREE.Mesh(geometry, material);
            
            // Scale rock randomly
            const scale = 0.3 + Math.random() * 0.7;
            rock.scale.set(scale, scale, scale);
            
            // Position rock away from center
            const distance = 15 + Math.random() * 35;
            const angle = Math.random() * Math.PI * 2;
            rock.position.set(
                Math.cos(angle) * distance,
                scale / 2 - 0.1,  // Half height, slightly embedded
                Math.sin(angle) * distance
            );
            
            rock.castShadow = true;
            rock.receiveShadow = true;
            this.scene.add(rock);
        }
    }
    
    /**
     * Add water elements to the environment
     */
    addWaterElements() {
        // Create a small lake
        const waterGeometry = new THREE.CircleGeometry(10, 32);
        
        // Improved water material
        const waterMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a85b7,  // Blue
            roughness: 0.1,
            metalness: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        this.water = new THREE.Mesh(waterGeometry, waterMaterial);
        this.water.rotation.x = -Math.PI / 2; // Lay flat
        this.water.position.set(-25, 0.02, -20); // Position offset from center
        this.water.receiveShadow = true;
        
        this.scene.add(this.water);
    }
    
    /**
     * Add environmental details like trees, grass, etc.
     */
    addEnvironmentalDetails() {
        // Add trees
        this.addTrees();
        
        // Add grass patches
        this.addGrassPatches();
        
        // Add decorative elements
        this.addDecorativeElements();
    }
    
    /**
     * Add trees to the environment
     */
    addTrees() {
        const treeCount = 25;
        
        for (let i = 0; i < treeCount; i++) {
            // Create tree at random position
            const distance = 20 + Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            
            this.addTree(x, 0, z);
        }
    }
    
    /**
     * Add a single tree
     */
    addTree(x, y, z) {
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.4, 2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,  // Brown
            roughness: 0.9,
            metalness: 0.1
        });
        
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, y + 1, z);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        this.scene.add(trunk);
        
        // Tree foliage (multiple layers)
        const foliageMaterial = new THREE.MeshStandardMaterial({
            color: 0x2E8B57,  // Forest green
            roughness: 0.8,
            metalness: 0.1
        });
        
        // Tree type variation
        const treeType = Math.floor(Math.random() * 3);
        
        if (treeType === 0) {
            // Pine tree (conical)
            const foliage1 = new THREE.Mesh(
                new THREE.ConeGeometry(1.5, 3, 8),
                foliageMaterial
            );
            foliage1.position.set(x, y + 3, z);
            foliage1.castShadow = true;
            this.scene.add(foliage1);
            
            const foliage2 = new THREE.Mesh(
                new THREE.ConeGeometry(1.2, 2.5, 8),
                foliageMaterial
            );
            foliage2.position.set(x, y + 4.5, z);
            foliage2.castShadow = true;
            this.scene.add(foliage2);
            
            const foliage3 = new THREE.Mesh(
                new THREE.ConeGeometry(0.8, 2, 8),
                foliageMaterial
            );
            foliage3.position.set(x, y + 6, z);
            foliage3.castShadow = true;
            this.scene.add(foliage3);
        } else if (treeType === 1) {
            // Deciduous tree (spherical)
            const foliage = new THREE.Mesh(
                new THREE.SphereGeometry(1.5, 8, 6),
                foliageMaterial
            );
            foliage.position.set(x, y + 3, z);
            foliage.castShadow = true;
            this.scene.add(foliage);
        } else {
            // Abstract low-poly tree
            const foliageGroup = new THREE.Group();
            
            // Create multiple tetrahedrons for a stylized look
            for (let i = 0; i < 5; i++) {
                const tetraGeometry = new THREE.TetrahedronGeometry(1);
                const tetraMesh = new THREE.Mesh(tetraGeometry, foliageMaterial);
                
                tetraMesh.position.set(
                    (Math.random() - 0.5) * 1.2,
                    1.5 + Math.random() * 1.5,
                    (Math.random() - 0.5) * 1.2
                );
                
                tetraMesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                
                tetraMesh.scale.set(
                    0.6 + Math.random() * 0.5,
                    0.6 + Math.random() * 0.5,
                    0.6 + Math.random() * 0.5
                );
                
                foliageGroup.add(tetraMesh);
            }
            
            foliageGroup.position.set(x, y + 1.5, z);
            foliageGroup.castShadow = true;
            this.scene.add(foliageGroup);
        }
    }
    
    /**
     * Add grass patches for ground detail
     */
    addGrassPatches() {
        // This would be implemented with instanced mesh or particle system
        // for performance, but simplified for this example
        const patchCount = 20;
        
        for (let i = 0; i < patchCount; i++) {
            const patchGeometry = new THREE.CircleGeometry(3 + Math.random() * 5, 8);
            const patchMaterial = new THREE.MeshStandardMaterial({
                color: 0x7CFC00,  // Bright green
                roughness: 0.9,
                metalness: 0.1,
                transparent: true,
                opacity: 0.7
            });
            
            const patch = new THREE.Mesh(patchGeometry, patchMaterial);
            patch.rotation.x = -Math.PI / 2; // Lay flat
            
            // Position patch randomly but away from center
            const distance = 15 + Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;
            patch.position.set(
                Math.cos(angle) * distance,
                0.02, // Slightly above ground
                Math.sin(angle) * distance
            );
            
            patch.receiveShadow = true;
            this.scene.add(patch);
        }
    }
    
    /**
     * Add decorative elements to the environment
     */
    addDecorativeElements() {
        // Add a small wooden fence in the distance
        const fenceLength = 10;
        const fenceHeight = 1.2;
        const postCount = 6;
        
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,  // Brown
            roughness: 0.9,
            metalness: 0.1
        });
        
        const fenceGroup = new THREE.Group();
        
        // Create fence posts
        for (let i = 0; i < postCount; i++) {
            const postGeometry = new THREE.BoxGeometry(0.2, fenceHeight, 0.2);
            const post = new THREE.Mesh(postGeometry, woodMaterial);
            post.position.set((i / (postCount - 1) - 0.5) * fenceLength, fenceHeight / 2, 0);
            post.castShadow = true;
            fenceGroup.add(post);
        }
        
        // Create horizontal rails
        for (let i = 0; i < 2; i++) {
            const railGeometry = new THREE.BoxGeometry(fenceLength, 0.1, 0.1);
            const rail = new THREE.Mesh(railGeometry, woodMaterial);
            rail.position.set(0, 0.3 + i * 0.6, 0);
            rail.castShadow = true;
            fenceGroup.add(rail);
        }
        
        // Position the fence in the scene
        fenceGroup.position.set(-15, 0, -35);
        this.scene.add(fenceGroup);
    }
    
    /**
     * Set up weather system (rain, snow, fog)
     */
    setupWeatherSystem() {
        // Initially no active weather effects
        this.weatherSystem = { active: false, type: 'clear' };
    }
    
    /**
     * Set time of day with corresponding lighting changes
     * @param {string} timeOfDay - 'day', 'sunset', or 'night'
     */
    setTimeOfDay(timeOfDay) {
        this.timeOfDay = timeOfDay;
        
        switch (timeOfDay) {
            case 'day':
                // Bright daylight
                this.sunLight.position.set(10, 20, 15);
                this.sunLight.intensity = 1.0;
                this.sunLight.color.set(0xFFFFFF);
                this.hemisphereLight.intensity = 0.6;
                
                // Sky colors
                this.sky.material.uniforms.topColor.value.set(0x0077FF);
                this.sky.material.uniforms.bottomColor.value.set(0xAABBFF);
                
                break;
                
            case 'sunset':
                // Golden hour sunset
                this.sunLight.position.set(20, 5, 15);
                this.sunLight.intensity = 0.8;
                this.sunLight.color.set(0xFF9800);
                this.hemisphereLight.intensity = 0.4;
                
                // Sky colors
                this.sky.material.uniforms.topColor.value.set(0xFF7F00);
                this.sky.material.uniforms.bottomColor.value.set(0xFFFFAA);
                
                break;
                
            case 'night':
                // Moonlight
                this.sunLight.position.set(10, 20, -15);
                this.sunLight.intensity = 0.3;
                this.sunLight.color.set(0xCCDDFF);
                this.hemisphereLight.intensity = 0.1;
                
                // Sky colors
                this.sky.material.uniforms.topColor.value.set(0x000022);
                this.sky.material.uniforms.bottomColor.value.set(0x001133);
                
                break;
        }
        
        // Update sky
        this.sky.material.uniforms.topColor.needsUpdate = true;
        this.sky.material.uniforms.bottomColor.needsUpdate = true;
    }
    
    /**
     * Set environment type (grassland, desert, snow)
     * @param {string} type - Environment type
     */
    setEnvironmentType(type) {
        this.environmentType = type;
        
        // This would update materials and elements based on environment type
        // For brevity, not fully implemented in this example
    }
    
    /**
     * Apply a weather effect
     * @param {string} effect - Weather effect ('clear', 'rain', 'snow', 'fog')
     */
    setWeatherEffect(effect) {
        this.weatherEffect = effect;
        
        // Would implement particle systems for rain/snow
        // and fog for fog effect
        // For brevity, not fully implemented in this example
    }
    
    /**
     * Update method called in animation loop
     * @param {number} deltaTime - Time since last update in seconds
     */
    update(deltaTime) {
        // Animate clouds
        if (this.clouds.length > 0) {
            this.clouds.forEach(cloud => {
                cloud.position.x += deltaTime * 0.2;
                
                // Wrap around when out of bounds
                if (cloud.position.x > 100) {
                    cloud.position.x = -100;
                }
            });
        }
        
        // Add more dynamic updates here as needed
    }
}

// Make the class globally available
window.EnhancedEnvironment = EnhancedEnvironment;