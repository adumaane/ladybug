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

// Retrieve the loading screen element
const loadingScene = document.getElementById('loadingScene');
if (loadingScene) {
    // Show the loading screen initially
    loadingScene.style.display = 'block';
} else {
    console.error('Loading scene element with ID "loadingScene" not found.');
}

// Function to load images
function loadImages(images) {
    return Promise.all(images.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve; // Resolve when the image is loaded
            img.onerror = reject; // Reject if the image fails to load
            img.src = src;
        });
    }));
}

// Define the resources to load
const imagesToLoad = [
    'images/ladybug_1.png',
    'images/small3dBug.png'
];

// Load all resources
Promise.all([
    loadImages(imagesToLoad)
])
    .then(() => {
        // Hide the loading screen when all resources are loaded
        if (loadingScene) {
            loadingScene.style.display = 'none';
        }
        console.log('All resources loaded!');
    })
    .catch(error => {
        console.error('Error loading resources:', error);
    });