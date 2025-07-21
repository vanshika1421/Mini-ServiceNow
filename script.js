
const media = [
  { type: 'image', src: 'assets/img1.jpg' },
  { type: 'image', src: 'assets/img2.jpg' },
  { type: 'image', src: 'assets/img3.jpg' },
  { type: 'image', src: 'assets/img4.jpg' },
  { type: 'image', src: 'assets/img5.jpg' },
  { type: 'image', src: 'assets/img6.jpg' },
  { type: 'image', src: 'assets/img7.jpg' },
  { type: 'image', src: 'assets/img8.jpg' },
  { type: 'video', src: 'assets/video1.mp4' },  // First video
  { type: 'video', src: 'assets/video2.mp4' }   // Second video
];

let current = 0;
let isPlaying = true;
let slideInterval;

const imgElement = document.getElementById("slideshow-img");
const videoElement = document.getElementById("slideshow-video");
const audioPlayer = document.getElementById("audio-player");
const backgroundMusic = document.getElementById("background-music");
const bgMusicToggle = document.getElementById("bg-music-toggle");
const bgVolumeSlider = document.getElementById("bg-volume");
const playPauseBtn = document.getElementById("play-pause-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const mediaTypeIndicator = document.getElementById("media-type");
const nowPlayingText = document.querySelector(".now-playing em");
const playlistItems = document.querySelectorAll(".playlist-item");

// Auto slideshow function
function startSlideshow() {
  slideInterval = setInterval(() => {
    nextImage();
  }, 4000); // Change every 4 seconds
}

// Stop slideshow
function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

// Change to next image/video
function nextImage() {
  current = (current + 1) % media.length;
  updateMedia();
}

// Change to previous image/video
function prevImage() {
  current = (current - 1 + media.length) % media.length;
  updateMedia();
}

// Update media (image or video) with fade effect
function updateMedia() {
  const currentMedia = media[current];
  
  // Update media type indicator
  if (currentMedia.type === 'image') {
    mediaTypeIndicator.textContent = '📸 Photo';
    
    // Hide video, show image
    videoElement.style.display = 'none';
    videoElement.pause();
    
    imgElement.style.opacity = '0';
    setTimeout(() => {
      imgElement.src = currentMedia.src;
      imgElement.style.display = 'block';
      imgElement.style.opacity = '1';
    }, 250);
  } else if (currentMedia.type === 'video') {
    mediaTypeIndicator.textContent = '🎥 Video';
    
    // Hide image, show video
    imgElement.style.display = 'none';
    
    videoElement.style.opacity = '0';
    videoElement.style.display = 'block';
    setTimeout(() => {
      videoElement.src = currentMedia.src;
      videoElement.style.opacity = '1';
      videoElement.play();
    }, 250);
  }
}

// Play/Pause slideshow
function toggleSlideshow() {
  if (isPlaying) {
    stopSlideshow();
    playPauseBtn.textContent = '▶️';
    isPlaying = false;
  } else {
    startSlideshow();
    playPauseBtn.textContent = '⏸️';
    isPlaying = true;
  }
}

// Event listeners
playPauseBtn.addEventListener('click', toggleSlideshow);
nextBtn.addEventListener('click', () => {
  nextImage();
  // Restart interval if playing and audio is playing
  if (isPlaying && !audioPlayer.paused) {
    stopSlideshow();
    startSlideshow();
  }
});
prevBtn.addEventListener('click', () => {
  prevImage();
  // Restart interval if playing and audio is playing
  if (isPlaying && !audioPlayer.paused) {
    stopSlideshow();
    startSlideshow();
  }
});

// Background music functionality
let bgMusicPlaying = false;

// Set initial background music volume (loving piano tune)
backgroundMusic.volume = 0.03;

// Background music toggle
bgMusicToggle.addEventListener('click', () => {
  if (bgMusicPlaying) {
    backgroundMusic.pause();
    bgMusicToggle.textContent = '🔇';
    bgMusicToggle.classList.add('muted');
    bgMusicPlaying = false;
  } else {
    backgroundMusic.play();
    bgMusicToggle.textContent = '🔊';
    bgMusicToggle.classList.remove('muted');
    bgMusicPlaying = true;
  }
});

// Volume slider for background music
bgVolumeSlider.addEventListener('input', (e) => {
  backgroundMusic.volume = e.target.value;
});

// Start background music when voice note starts playing
audioPlayer.addEventListener('play', () => {
  // Start slideshow when audio plays
  if (!isPlaying) {
    toggleSlideshow();
  }
  
  // Start background music automatically when voice note plays
  if (!bgMusicPlaying) {
    backgroundMusic.play();
    bgMusicToggle.textContent = '🔊';
    bgMusicToggle.classList.remove('muted');
    bgMusicPlaying = true;
  }
  // Special birthday celebration effect
  celebrateBirthday();
});

audioPlayer.addEventListener('pause', () => {
  // Stop slideshow when audio is paused
  if (isPlaying) {
    toggleSlideshow();
  }
});

audioPlayer.addEventListener('ended', () => {
  // Stop slideshow when audio ends
  if (isPlaying) {
    toggleSlideshow();
  }
  
  // Optionally stop background music when voice note ends
  backgroundMusic.pause();
  bgMusicPlaying = false;
  bgMusicToggle.textContent = '🔇';
  bgMusicToggle.classList.add('muted');
});

// Birthday celebration function
function celebrateBirthday() {
  const birthdayTitle = document.querySelector('.birthday-title');
  const playerContainer = document.querySelector('.player-container');
  
  // Add special birthday glow effect
  birthdayTitle.style.animation = 'birthday-bounce 0.5s ease-in-out 3';
  playerContainer.style.transform = 'scale(1.02)';
  
  // Reset after animation
  setTimeout(() => {
    playerContainer.style.transform = 'scale(1)';
    birthdayTitle.style.animation = 'birthday-bounce 2s ease-in-out infinite';
  }, 1500);
}

// Start the slideshow
startSlideshow();
