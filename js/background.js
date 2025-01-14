// Retrieve the body element
const bodyElement = document.querySelector('body.wallpaper-empty');

// Animation parameters for the body
let bodyAnimationTime = 0; // Time tracker for the animation
const bodyAnimationDuration = 5000; // Duration of one full cycle (in milliseconds)
const bodyContrastRange = [1, 1.8]; // Normal to high contrast range
const bodySaturationRange = [1, 0.5]; // Normal to low saturation range
const bodyOpacityRange = [1, 0.8]; // Normal to low opacity range

function animateBodyFilters() {
    // Calculate animation progress (0 to 1, then back to 0)
    const progress = (bodyAnimationTime % bodyAnimationDuration) / bodyAnimationDuration;
    const easedProgress = Math.sin(progress * Math.PI); // Eases the transition

    // Calculate contrast, saturation, and opacity values
    const contrast = bodyContrastRange[0] + easedProgress * (bodyContrastRange[1] - bodyContrastRange[0]);
    const saturation = bodySaturationRange[0] - easedProgress * (bodySaturationRange[0] - bodySaturationRange[1]);
    const opacity = bodyOpacityRange[0] - easedProgress * (bodyOpacityRange[0] - bodyOpacityRange[1]);

    // Apply the filters and opacity to the body
    bodyElement.style.filter = `contrast(${contrast}) saturate(${saturation})`;
    bodyElement.style.opacity = opacity;

    // Increment animation time and loop
    bodyAnimationTime += 16; // ~16ms per frame (~60FPS)
    requestAnimationFrame(animateBodyFilters); // Continue the animation
}

// Start the animation for the body
animateBodyFilters();