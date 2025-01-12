//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create a Three.JS Scene
const scene = new THREE.Scene();

// Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Set the initial camera position for the zoom animation
camera.position.z = 100; // Start farther away for zoom effect

let mouseX = 0;
let mouseY = 0;

// Keep the 3D object on a global variable
let object;

// Instantiate OrbitControls
const controls = new OrbitControls(camera, document.getElementById("container3D"));
controls.enableDamping = true; // Smooth camera controls

// Set which object to render
const objToRender = "smallLadybug";

// Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

// Load the file
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    object.rotation.y = Math.PI / 2; // Initial rotation for better view
    scene.add(object);
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
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(5, 5, 5);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 2);
scene.add(ambientLight);

// Zoom animation variables
let zoomComplete = false;


const zoomSpeed = 0.05;
const targetZoom = 10;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Zoom the camera toward the model
  if (!zoomComplete) {
    camera.position.z -= 0.2; // Adjust speed as needed
    if (camera.position.z <= 10) { // Stop zooming when close enough
      zoomComplete = true;
    }
  }

  // Add slow rotation to the model
  if (object) {
    object.rotation.y += 0.005; // Slow rotation
  }

  controls.update(); // Update camera controls
  renderer.render(scene, camera);
}

// Resize handler
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mousemove listener
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Start the animation loop
animate();