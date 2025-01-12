const images = document.querySelectorAll('.rotating-image');
const baseRotation = -90; // Adjust this based on your desired "correct" orientation

document.addEventListener('mousemove', (event) => {
  images.forEach((image) => {
    const rect = image.getBoundingClientRect();
    const imageCenterX = rect.left + rect.width / 2; // Image's center X
    const imageCenterY = rect.top + rect.height / 2; // Image's center Y

    // Calculate cursor angle relative to image center
    const angle = Math.atan2(event.clientY - imageCenterY, event.clientX - imageCenterX);
    const angleDegrees = angle * (180 / Math.PI);

    // Apply the rotation (base rotation + dynamic rotation)
    image.style.transform = `rotateZ(${angleDegrees + baseRotation}deg)`;
  });
});