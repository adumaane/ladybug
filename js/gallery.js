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
            console.warn('FYI. But no "data-href" found for button:', button);
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
    'images/wallpaper.PNG'
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





// List of gallery items (images and videos)
const galleryItems = [
    { type: 'image', src: './images/image.png' },
    { type: 'image', src: './images/ladybug_1.png' },
    { type: 'video', src: './videos/ladybug-in-salad.mp4' },
];

let currentIndex = 0;

// Function to update the displayed item
function updateGalleryItem() {
    const container = document.querySelector('.image-container');
    container.innerHTML = ''; // Clear previous content

    const currentItem = galleryItems[currentIndex];

    if (currentItem.type === 'image') {
        // Create and append an image
        const img = document.createElement('img');
        img.src = currentItem.src;
        img.alt = 'Gallery Item';
        img.id = 'galleryImage';
        container.appendChild(img);
    } else if (currentItem.type === 'video') {
        // Create and append a video
        const video = document.createElement('video');
        video.src = currentItem.src;
        video.controls = true; // Add video controls
        video.autoplay = false; // Set autoplay behavior
        video.id = 'galleryVideo';
        container.appendChild(video);
    }
}

// Function to show the next item
window.nextImage = function nextImage() {
    if (currentIndex < galleryItems.length - 1) {
        currentIndex += 1; // Increment index only if it's not the last item
        updateGalleryItem();
    } else {
        console.log('You are at the last item.');
    }
}

// Function to show the previous item
window.prevImage = function prevImage() {
    if (currentIndex > 0) {
        currentIndex -= 1; // Decrement index only if it's not the first item
        updateGalleryItem();
    } else {
        console.log('You are at the first item.');
    }
}

// Initialize the gallery
updateGalleryItem();