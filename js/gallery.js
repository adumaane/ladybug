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
    './images/ladybug_1.png',
    './images/wallpaper1.png'
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
    { type: 'video', src: './videos/ladybug.mp4' },
];

let currentIndex = 0;

// Function to update the displayed item
// Update button icon in the updateGalleryItem function
function updateGalleryItem() {
    const container = document.querySelector('.image-container');
    const nextIcon = document.getElementById('nextIcon');
    container.innerHTML = ''; // Clear previous content

    const currentItem = galleryItems[currentIndex];

    if (currentItem.type === 'image') {
        const img = document.createElement('img');
        img.src = currentItem.src;
        img.alt = 'Gallery Item';
        img.id = 'galleryImage';
        container.appendChild(img);
    } else if (currentItem.type === 'video') {
        const video = document.createElement('video');
        video.src = currentItem.src;
        video.controls = true;
        video.autoplay = false;
        video.id = 'galleryVideo';
        container.appendChild(video);
    }

    // Update the button icon based on the current index
    if (currentIndex === galleryItems.length - 1) {
        nextIcon.src = './images/image.png'; // Custom "end of gallery" icon
        nextIcon.alt = 'Go to next page';
    } else {
        nextIcon.src = './images/small3dBug.png'; // Default "next" icon
        nextIcon.alt = 'Next';
    }
}

// Function to show the next item or navigate to salad.html
window.nextImage = function nextImage() {
    const nextButton = document.getElementById('nextButton');
    const nextIcon = document.getElementById('nextIcon');

    if (currentIndex < galleryItems.length - 1) {
        currentIndex += 1; // Increment index only if it's not the last item
        updateGalleryItem();
    } else {
        console.log('Navigating to the next page: salad.html');

        // Play sound before navigating
        sound.play();
        setTimeout(() => {
            window.location.href = './salad.html'; // Navigate to the next page
        }, 200); // Adjust delay based on sound duration
    }
};

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