// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();

// Create a new camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2; // Initial position

// Keep the 3D object on a global variable
let object;

// Instantiate OrbitControls
const controls = new OrbitControls(camera, document.getElementById("container3D"));
controls.enableDamping = true; // Smooth camera controls
controls.enableRotate = false; // Allow rotating the scene
controls.enablePan = false;    // Disable panning with the cursor

// Set which object to render
const objToRender = "salati-bizbiz";

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Function to adjust the camera's z position based on window width
function adjustCameraZ() {
  const baseWidth = 1920; // Reference width for scaling
  const baseZ = 2;       // Default camera z-position for the reference width
  const scaleFactor = window.innerWidth / baseWidth;

  // Adjust the camera z position
  camera.position.z = baseZ / scaleFactor;

  // Prevent the camera from getting too close or too far
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, 3, 20);

  camera.updateProjectionMatrix();
}

// Call the function initially to set the camera position
adjustCameraZ();

// Load the file and add the object to the scene
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    object.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true; // Enable shadow casting
        node.receiveShadow = true; // Enable shadow receiving (self-shadowing)
      }
    });
    scene.add(object);
    object.rotation.x = 1.4;
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  function (error) {
    console.error(error);
  }
);

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFShadowMap; // Use regular shadows (less demanding than soft shadows)
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x333333, 2); // Ambient light to illuminate the scene
scene.add(ambientLight);

// Add a point light to follow the cursor
const cursorLight = new THREE.PointLight(0xffffff, 1.5, 10); // Increased far value for better range
cursorLight.position.set(0, 0, 10); // Initial position
cursorLight.castShadow = true; // Enable shadow casting

// Configure shadow map settings for performance
cursorLight.shadow.mapSize.width = 1024; // Shadow resolution (1024x1024 for balance between quality and performance)
cursorLight.shadow.mapSize.height = 1024;
cursorLight.shadow.camera.near = 0.1; // Near clipping plane
cursorLight.shadow.camera.far = 20;   // Far clipping plane (extend if shadows are cut off)
cursorLight.shadow.bias = -0.001;     // Reduce shadow artifacts (shadow acne)
scene.add(cursorLight);

// Add raycaster and pointer
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Update cursor light position on mouse move using raycasting
document.addEventListener("mousemove", (event) => {
  // Convert cursor position to normalized device coordinates (NDC)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Use the raycaster to project the cursor position into the 3D world
  raycaster.setFromCamera(pointer, camera);

  // Define a plane for the light to follow
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, -1), camera.position.z - 2); // Plane at z = camera.position.z - 2
  const intersectionPoint = new THREE.Vector3();

  // Find the intersection point of the ray with the plane
  raycaster.ray.intersectPlane(planeZ, intersectionPoint);

  // Update the light's position to the intersection point
  cursorLight.position.copy(intersectionPoint);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the object on the Z-axis
  if (object) {
    object.rotation.y += 0.0001; // Adjust the rotation speed here
  }

  controls.update(); // Update camera controls
  renderer.render(scene, camera);
}

// Resize handler
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Adjust camera z position on resize
  adjustCameraZ();
});

// Start the animation loop
animate();