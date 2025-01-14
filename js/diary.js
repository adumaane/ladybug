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
    'images/small3dBug.png',
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


//  == TEXT WRITING
    const textContainer = document.getElementById('typingText');

        // Define each step explicitly with additions (+) and deletions (-)
        const textSteps = [
            { type: "+", text: "I love ladybugs \n" },        // Step 1: Type "Hello,"
            { type: "+", text: "zxz", },       // Step 2: Add " wehjk" (mistake)
            { type: "-", text: "zxz" },       // Step 3: Remove " wehjk"
            { type: "+", text: "I love ladybugs\n" },       // Step 4: Add " world!" (correct text)
            { type: "+", text: "They're so st" },
            { type: "+", text: "ypif" },       // Step 2: Add " wehjk" (mistake)
            { type: "-", text: "ypif" },
            { type: "+", text: "upid\n" },
            { type: "+", text: "They're so so cute!" },
            { type: "-", text: "so cute!" },
            { type: "+", text: "cute\n" },
            { type: "+", text: "They so round\n" },
            { type: "+", text: "I love them too <3\n" },
            { type: "+", text: "\n" },
            { type: "+", text: "I love ladybougess" },
            { type: "-", text: "bougess" },
            { type: "+", text: "bugs\n" },
            { type: "+", text: "I love ladybugs \n" },
            { type: "+", text: "How many dots\n" },
            { type: "+", text: "Are on you!\n" }
        ];

        let currentStep = 0; // Current step index
        let currentChar = 0; // Current character index for typing or deleting
        let currentText = ""; // The text being displayed
        let isPaused = false; // Track if a pause is in progress

        function typeText() {
            if (currentStep >= textSteps.length) {
                return; // Stop the animation after the last step
            }

            const step = textSteps[currentStep]; // Current step
            const targetText = step.text;       // Text to add or remove

            if (!isPaused) {
                if (step.type === "+") {
                    // Typing (adding) characters
                    currentText += targetText[currentChar]; // Add the next character
                    currentChar++;

                    if (currentChar === targetText.length) {
                        // When addition is complete, initiate a pause (if defined)
                        isPaused = true;
                        setTimeout(() => {
                            isPaused = false;
                            currentStep++; // Move to the next step
                            currentChar = 0; // Reset character index
                            typeText(); // Continue after the pause
                        }, step.pause || 0); // Use the defined pause or default to 0
                        return;
                    }
                } else if (step.type === "-") {
                    // Deleting (removing) characters
                    currentText = currentText.slice(0, -1); // Remove the last character
                    currentChar++;

                    if (currentChar === targetText.length) {
                        // When deletion is complete, initiate a pause (if defined)
                        isPaused = true;
                        setTimeout(() => {
                            isPaused = false;
                            currentStep++; // Move to the next step
                            currentChar = 0; // Reset character index
                            typeText(); // Continue after the pause
                        }, step.pause || 0); // Use the defined pause or default to 0
                        return;
                    }
                }
            }

            // Update the displayed text
            textContainer.textContent = currentText;

            // Adjust typing or deleting speed
            const typingSpeed = step.type === "-" ? 150 : 170;
            setTimeout(typeText, typingSpeed);
        }

        // Start the typing animation
        typeText();