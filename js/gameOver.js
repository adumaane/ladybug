// Sound file
const sound = new Audio('./sounds/click-sound.wav');

// Add event listeners to all buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); // Stop default navigation
        sound.play(); // Play the sound

        const href = button.dataset.href; // Get the href link from data attribute
        const originalTextContainer = document.getElementById('originalText');
        const typingTextContainer = document.getElementById('typingText2');

        // Hide button and original text
        button.style.display = 'none';
        if (originalTextContainer) {
            originalTextContainer.style.display = 'none';
        }

        // Show typing text container and start animation
        if (typingTextContainer) {
            typingTextContainer.style.display = 'block';
            startTypingAnimation(typingTextContainer, href);
        } else {
            console.error('Typing text container not found!');
        }
    });
});

// Typing animation function
function startTypingAnimation(textContainer, href) {
    const textSteps = [
        { type: "+", text: "Emīlija Adumāne\n" },
        { type: "+", text: "VKN\n" },
        { type: "+", text: "2024\n" }
    ];

    let currentStep = 0;
    let currentChar = 0;
    let currentText = "";
    let isPaused = false;

    function typeText() {
        if (currentStep >= textSteps.length) {
            // Redirect to the new page after the animation completes
            window.location.href = href;
            return;
        }

        const step = textSteps[currentStep];
        const targetText = step.text;

        if (!isPaused) {
            if (step.type === "+") {
                // Add characters one by one
                currentText += targetText[currentChar];
                currentChar++;

                if (currentChar === targetText.length) {
                    // Pause before moving to the next step
                    isPaused = true;
                    setTimeout(() => {
                        isPaused = false;
                        currentStep++;
                        currentChar = 0;
                        typeText();
                    }, 500); // Adjust pause duration if needed
                    return;
                }
            }
        }

        // Update the text content
        textContainer.textContent = currentText;

        // Set the typing speed
        setTimeout(typeText, 100);
    }

    // Start typing animation
    typeText();
}

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
    './images/noise.gif'
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