// Import the necessary Three.js libraries
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Sound file
const sound = new Audio('./sounds/click-sound.wav');

// Add event listeners to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Stop default navigation
        sound.play(); // Play the sound

        const href = button.dataset.href;
        if (href) {
            setTimeout(() => {
                window.location.href = href; // Navigate after the sound plays
            }, 200); // Adjust delay based on sound duration
        } else {
            console.warn('No "data-href" found for button:', button);
        }
    });
});

// Show loading screen initially
const loadingScene = document.getElementById('loadingScene');
loadingScene.style.display = 'block';

// Add a progress bar
const progressBar = document.createElement('div');
progressBar.style.position = 'absolute';
progressBar.style.width = '300px';
progressBar.style.height = '20px';
progressBar.style.backgroundColor = '#000000';
progressBar.style.border = '5px solid #c60000';
progressBar.style.overflow = 'hidden';
progressBar.style.top = '60%';
progressBar.style.left = '50%';
progressBar.style.transform = 'translate(-50%, -50%)';
progressBar.innerHTML = `<div style="width: 0%; height: 100%; background:#c60000;"></div>`;
loadingScene.appendChild(progressBar);

// Function to load GLTF models with simulated progress
function loadGLTFsWithSimulatedProgress(models) {
    const loader = new GLTFLoader();
    let fakeProgress = 0;

    // Simulate progress
    const interval = setInterval(() => {
        if (fakeProgress < 95) {
            fakeProgress = Math.min(fakeProgress + 0.75, 95); // Increment progress up to 95%
            progressBar.firstChild.style.width = `${fakeProgress}%`;
        }
    }, 100);

    return Promise.all(
        models.map(url => {
            return new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (gltf) => {
                        clearInterval(interval); // Stop simulated progress
                        progressBar.firstChild.style.width = '100%'; // Complete progress bar
                        resolve(gltf);
                    },
                    undefined, // Skip real progress tracking
                    (error) => {
                        clearInterval(interval); // Stop simulated progress on error
                        console.error('Error loading model:', error);
                        reject(error);
                    }
                );
            });
        })
    );
}

// GLTF models to load
const gltfModelsToLoad = [
    './models/salati-fin/scene.gltf' // Update the path to your actual GLTF file
];

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a new camera with appropriate parameters
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 100; // Start farther away for zoom effect

// Initialize variables
let object; // To hold the loaded 3D model
let zoomComplete = false; // Track zoom completion
let animationProgress = 0; // Animation progress (0 to 1)
let mixer; // For animation mixing
let clock = new THREE.Clock(); // For tracking animation timing

// OrbitControls for camera interaction
const controls = new OrbitControls(camera, document.getElementById("container3D"));
controls.enableDamping = true; // Smooth camera controls

// Load the GLTF model with simulated progress
loadGLTFsWithSimulatedProgress(gltfModelsToLoad)
    .then(models => {
        models.forEach(gltf => {
            object = gltf.scene;

            // Check for animations and create a mixer
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(gltf.scene);

                // Play all animations by default
                gltf.animations.forEach((clip) => {
                    mixer.clipAction(clip).play();
                });
            }

            // Traverse and set materials to support transparency
            object.traverse((child) => {
                if (child.isMesh) {
                    child.material.transparent = true; // Enable transparency
                    child.material.opacity = 0; // Start fully transparent
                    child.frustumCulled = false; // Prevent culling
                }
            });

            object.rotation.x = THREE.MathUtils.degToRad(-120); // Start at -120 degrees
            object.position.y = -10; // Start below the frame
            object.position.z = 0; // Centered in the frame
            scene.add(object);
        });

        // Hide the loading screen
        loadingScene.style.display = 'none';
        console.log('All models loaded!');
    })
    .catch(error => {
        console.error('Error loading models:', error);
    });

// Create a renderer and attach it to the DOM
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true for transparency
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(5, 5, 5);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

// Easing function for gradual animation stop
function easeOutQuad(t) {
    return t * (2 - t); // Smooth deceleration
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update the animation mixer
    if (mixer) {
        const delta = clock.getDelta(); // Get time elapsed since the last frame
        mixer.update(delta); // Update animations
    }

    // Smooth zoom, object animation, and transparency
    if (!zoomComplete && object) {
        // Calculate eased progress (0 to 1)
        animationProgress += 0.001; // Adjust speed as needed
        const easedProgress = easeOutQuad(animationProgress); // Apply easing

        // Interpolate camera zoom
        camera.position.z = THREE.MathUtils.lerp(50, 5, easedProgress);

        // Interpolate object position (float in from the bottom)
        object.position.y = THREE.MathUtils.lerp(-10, 0, easedProgress);

        // Interpolate object rotation (X-axis from -90 to 0 degrees)
        object.rotation.x = THREE.MathUtils.lerp(
            THREE.MathUtils.degToRad(-150),
            THREE.MathUtils.degToRad(0),
            easedProgress
        );

        // Animate transparency
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.opacity = easedProgress; // Gradually increase opacity
            }
        });

        // End animation when progress reaches 1
        if (animationProgress >= 1) {
            zoomComplete = true;
            animationProgress = 1; // Clamp to ensure smooth transition
        }
    }

    // Continuous rotation on Y-axis after animation ends
    if (object) {
        object.rotation.y += -0.003; // Slow continuous Y-axis rotation
    }

    controls.update(); // Update camera controls
    renderer.render(scene, camera); // Render the scene
}

// Adjust renderer and camera on window resize
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();