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



const container = document.querySelector('.rotating-container');
const rows = 12; // Total rows
const cols = 12; // Number of columns in the grid

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-item');

        // Leave rows 2 and 4 (and their repeating counterparts) empty
        if (i % 6 === 1 || i % 6 === 3) {
            container.appendChild(cell); // Add an empty grid item
            continue;
        }

        // Offset rows 3 and 6 (and their repeating counterparts) to the left
        if (i % 6 === 2 || i % 6 === 5) {
            cell.style.transform = `translateX(calc(-100% / ${cols * 0.16}))`; // Offset by 0.5 tile
        }

        // Special case for row 3: Repeat every 6 tiles with one image at the 3rd tile
        if (i % 6 === 2) {
            if (j % 6 === 2) { // Image at the 3rd tile of each 6-tile group (0-based index)
                const img = document.createElement('img');
                img.src = 'images/wallpaper_ladybug.png'; // Replace with your image path
                img.alt = 'wallpaper_ladybug';
                img.classList.add('rotating-image');
                cell.appendChild(img);
            }
        }
        // Special case for row 6: Repeat every 6 tiles with one image at the 6th tile
        else if (i % 6 === 5) {
            if (j % 6 === 5) { // Image at the 6th tile of each 6-tile group (0-based index)
                const img = document.createElement('img');
                img.src = 'images/wallpaper_ladybug.png'; // Replace with your image path
                img.alt = 'wallpaper_ladybug';
                img.classList.add('rotating-image');
                cell.appendChild(img);
            }
        }
        // Default pattern for other rows: Repeat every 3 tiles
        else {
            if (j % 3 === 0) {
                const img = document.createElement('img');
                img.src = 'images/wallpaper_ladybug.png'; // Replace with your image path
                img.alt = 'wallpaper_ladybug';
                img.classList.add('rotating-image');
                cell.appendChild(img);
            }
        }

        container.appendChild(cell);
    }
}

// Rotation Effect
const images = document.querySelectorAll('.rotating-image');
const baseRotation = 90;
document.addEventListener('mousemove', (event) => {
    images.forEach((image) => {
        const rect = image.getBoundingClientRect();
        const imageCenterX = rect.left + rect.width / 2;
        const imageCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(event.clientY - imageCenterY, event.clientX - imageCenterX);
        const angleDegrees = angle * (180 / Math.PI);

        image.style.transform = `rotateZ(${angleDegrees + baseRotation}deg)`;
    });
});