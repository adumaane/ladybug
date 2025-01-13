// Sound file
const sound = new Audio('../sounds/click-sound.wav');

// Add event listeners to all buttons

document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', (event) => {
      event.preventDefault(); // Stop default navigation
      sound.play(); // Play the sound
      setTimeout(() => {
          window.location.href = button.dataset.href; // Navigate after the sound plays
      }, 200); // Adjust delay based on sound duration
  });
});

document.getElementById('loadingScene').style.display = 'block';

// Simulate file loading
setTimeout(() => {
    document.getElementById('loadingScene').style.display = 'none';
}, 2000); // Replace with actual loading logic