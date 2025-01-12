// Import the necessary Three.js libraries
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.js scene
const scene = new THREE.Scene();

// Create a new camera with appropriate parameters
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 100; // Start farther away for zoom effect

// Initialize variables
let object; // To hold the loaded 3D model
let zoomComplete = false; // Track zoom completion
let animationProgress = 0; // Animation progress (0 to 1)

// OrbitControls for camera interaction
const controls = new OrbitControls(camera, document.getElementById("container3D"));
controls.enableDamping = true; // Smooth camera controls

// Set the GLTF model to render
const objToRender = "smallLadybug";

// Load the GLTF model
const loader = new GLTFLoader();
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;

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
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

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

  // Smooth zoom, object animation, and transparency
  if (!zoomComplete && object) {
    // Calculate eased progress (0 to 1)
    animationProgress += 0.001; // Adjust speed as needed
    const easedProgress = easeOutQuad(animationProgress); // Apply easing

    // Interpolate camera zoom
    camera.position.z = THREE.MathUtils.lerp(50, 10, easedProgress);

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
  if ( object) {
    object.rotation.y += 0.005; // Slow continuous Y-axis rotation
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