// Sound file
const sound = new Audio('../sounds/click-sound.wav');

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
document.getElementById('loadingScene').style.display = 'block';

// Hide loading screen when the page finishes loading
window.addEventListener('load', () => {
    document.getElementById('loadingScene').style.display = 'none';
});