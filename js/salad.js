// Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Import the GLTFLoader
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

// Add progress bar
const progressBar = document.createElement('div');
progressBar.style.position = 'absolute';
progressBar.style.top = '50%';
progressBar.style.left = '50%';
progressBar.style.transform = 'translate(-50%, -50%)';
progressBar.style.width = '300px';
progressBar.style.height = '20px';
progressBar.style.backgroundColor = '#fff';
progressBar.style.border = '1px solid #555';
progressBar.innerHTML = `<div style="width: 0%; height: 100%; background: #0f0;"></div>`;
document.body.appendChild(progressBar);

// Function to load GLTF models with progress
function loadGLTFsWithProgress(models) {
    const loader = new GLTFLoader();
    let totalLoaded = 0;
    const totalFiles = models.length;

    return Promise.all(models.map(url => {
        return new Promise((resolve, reject) => {
            loader.load(
                url,
                (gltf) => {
                    totalLoaded += 1; // Increment loaded count
                    const percentage = Math.round((totalLoaded / totalFiles) * 100);
                    progressBar.firstChild.style.width = `${percentage}%`; // Update progress bar
                    console.log(`Loaded ${url}: ${percentage}%`);
                    resolve(gltf);
                },
                (xhr) => {
                    // Incremental progress for each file
                    const fileProgress = (xhr.loaded / xhr.total) * 100;
                    console.log(`${url}: ${fileProgress.toFixed(2)}% loaded`);
                },
                reject // Reject if loading fails
            );
        });
    }));
}

// GLTF models to load
const gltfModelsToLoad = [
    './models/salati-bizbiz/scene.gltf' // Update the path to your actual GLTF file
];

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

// Load all GLTF models and hide loading screen when done
loadGLTFsWithProgress(gltfModelsToLoad)
    .then(models => {
        models.forEach(gltf => {
            object = gltf.scene;
            object.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = true; // Enable shadow casting
                    node.receiveShadow = true; // Enable shadow receiving
                }
            });
            scene.add(object);
            object.rotation.x = 1.4;
        });

        // Hide the loading screen and progress bar
        loadingScene.style.display = 'none';
        progressBar.style.display = 'none';
        console.log('All models loaded!');
    })
    .catch(error => {
        console.error('Error loading models:', error);
    });

// Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFShadowMap; // Use regular shadows
document.getElementById("container3D").appendChild(renderer.domElement);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x333333, 2); // Ambient light to illuminate the scene
scene.add(ambientLight);

// Add a point light to follow the cursor
const cursorLight = new THREE.PointLight(0xffffff, 1.5, 10); // Increased far value for better range
cursorLight.position.set(0, 0, 10); // Initial position
cursorLight.castShadow = true; // Enable shadow casting

// Configure shadow map settings for performance
cursorLight.shadow.mapSize.width = 1024; // Shadow resolution
cursorLight.shadow.mapSize.height = 1024;
cursorLight.shadow.camera.near = 0.1; // Near clipping plane
cursorLight.shadow.camera.far = 20;   // Far clipping plane
cursorLight.shadow.bias = -0.001;     // Reduce shadow artifacts
scene.add(cursorLight);

// Add raycaster and pointer
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Update cursor light position on mouse move using raycasting
document.addEventListener("mousemove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, -1), camera.position.z - 2);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, intersectionPoint);
    cursorLight.position.copy(intersectionPoint);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

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

    adjustCameraZ();
});

// Start the animation loop
animate();