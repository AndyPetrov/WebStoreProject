// Music Player State
let playerState = {
  isPlaying: false,
  currentTrack: {
    title: "Get Down (Instrumental)",
    artist: "Craig Mack",
    album: "DJ Tools: Classic Rap Instrumentals",
    duration: 232, // in seconds
    currentTime: 153, // in seconds
  },
  isExpanded: false,
  activeTab: "now-playing" // "now-playing", "lyrics", "recommended", "album"
};

// DOM Elements - to be initialized on page load
let elements = {
  mini: null,
  expanded: null,
  playButtons: null,
  tabs: null,
  tabContents: null,
  progressBars: null,
  timeDisplays: null,
  tracklistItems: null
};

// Initialize the player
export function initMusicPlayer() {
  // Get DOM references
  elements.mini = document.querySelector('.music-controller-minimized');
  elements.expanded = document.querySelector('.music-controller-expanded');
  elements.playButtons = document.querySelectorAll('.mini-play-button');
  elements.tabs = document.querySelectorAll('.expanded-tab');
  elements.tabContents = document.querySelectorAll('.now-playing-content, .lyrics-content, .recommended-content, .album-tracks-content');
  elements.progressBars = document.querySelectorAll('.mini-progress-bar');
  elements.timeDisplays = document.querySelectorAll('.mini-current-time, .current-time');
  elements.tracklistItems = document.querySelectorAll('.track-item');
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize UI based on initial state
  updatePlayerUI();
}

// Set up all event listeners
export function setupEventListeners() {
  // Expand/collapse player
  document.querySelector('.mini-expand-button').addEventListener('click', togglePlayerExpansion);
  document.querySelector('.expanded-close-button').addEventListener('click', togglePlayerExpansion);
  
  // Play/pause buttons
  elements.playButtons.forEach(button => {
    button.addEventListener('click', togglePlayPause);
  });
  
  // Tab switching
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', (e) => switchTab(e.target));
  });
  
  // Progress bar interaction
  if (document.querySelector('.expanded-progress-bar')) {
    document.querySelector('.expanded-progress-bar').addEventListener('click', seekTrack);
  }
  
  // Tracklist integration
  elements.tracklistItems.forEach(item => {
    const playButton = item.querySelector('.track-play');
    if (playButton) {
      playButton.addEventListener('click', () => playTrackFromList(item));
    }
  });
}

// Toggle between expanded and minimized player views
// Modified to keep mini controller visible
export function togglePlayerExpansion() {
  playerState.isExpanded = !playerState.isExpanded;
  
  if (playerState.isExpanded) {
    elements.expanded.classList.add('active');
    // No longer hiding scroll as the mini player is always visible
  } else {
    elements.expanded.classList.remove('active');
  }
  console.log(playerState.isExpanded);
  window.parent.postMessage({
    type: 'resize-player',
    mode: playerState.isExpanded ? 'extended' : 'mini'
  }, '*');
}

// Switch between tabs in the expanded player
export function switchTab(tabElement) {
  // Get the tab identifier from the tab text
  const tabId = tabElement.textContent.toLowerCase().replace(/\s+/g, '-');
  playerState.activeTab = tabId;

  // Update active tab UI
  elements.tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  tabElement.classList.add('active');
  
  // Show the correct content
  elements.tabContents.forEach(content => {
    content.style.display = 'none';
  });
  
  let contentToShow;
  switch (tabId) {
    case 'now-playing':
      contentToShow = document.querySelector('.now-playing-content');
      break;
    case 'lyrics':
      contentToShow = document.querySelector('.lyrics-content');
      break;
    case 'recommended':
      contentToShow = document.querySelector('.recommended-content');
      break;
    case 'from-dj-tools:-classic-rap-instrumentals':
      contentToShow = document.querySelector('.album-tracks-content');
      break;
    default:
      contentToShow = document.querySelector('.now-playing-content');
  }
  
  if (contentToShow) {
    contentToShow.style.display = 'flex';
  }
}

// Toggle play/pause state
export function togglePlayPause() {
  playerState.isPlaying = !playerState.isPlaying;
  updatePlayButtonUI();
  
  if (playerState.isPlaying) {
    // This would connect to audio playback API
    startProgressUpdate();
  } else {
    // This would pause audio playback API
    stopProgressUpdate();
  }
}

// Update play/pause button UI
export function updatePlayButtonUI() {
  const miniPlayButton = document.querySelector('.mini-play-button i');
  
  if (playerState.isPlaying) {
    miniPlayButton.className = 'ph ph-pause';
  } else {
    miniPlayButton.className = 'ph ph-play';
  }
}

// Progress interval ID for clearing
let progressInterval = null;

// Start updating progress bar
export function startProgressUpdate() {
  // Clear any existing interval
  if (progressInterval) {
    clearInterval(progressInterval);
  }
  
  // Update every second
  progressInterval = setInterval(() => {
    playerState.currentTrack.currentTime += 1;
    if (playerState.currentTrack.currentTime >= playerState.currentTrack.duration) {
      playerState.currentTrack.currentTime = 0;
      togglePlayPause(); // Auto-pause at end
    }
    updateProgressUI();
  }, 1000);
}

// Stop updating progress bar
export function stopProgressUpdate() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

// Update progress bar and time displays
export function updateProgressUI() {
  const progressPercent = (playerState.currentTrack.currentTime / playerState.currentTrack.duration) * 100;
  
  // Update progress bars
  elements.progressBars.forEach(bar => {
    bar.style.width = `${progressPercent}%`;
  });
  
  // Update time displays
  const formattedCurrentTime = formatTime(playerState.currentTrack.currentTime);
  elements.timeDisplays.forEach(display => {
    display.textContent = formattedCurrentTime;
  });
  
  // Update total time displays
  document.querySelector('.mini-total-time').textContent = formatTime(playerState.currentTrack.duration);
}

// Seek to a position in the track
export function seekTrack(event) {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percentClicked = clickX / rect.width;
  
  playerState.currentTrack.currentTime = Math.floor(percentClicked * playerState.currentTrack.duration);
  updateProgressUI();
}

// Play a track from the tracklist
export function playTrackFromList(trackItem) {
  // Extract track information from the tracklist item
  const trackNumber = trackItem.querySelector('.track-number').textContent;
  const trackName = trackItem.querySelector('.track-name').textContent;
  const trackDuration = trackItem.querySelector('.track-duration').textContent;
  
  // Convert duration from MM:SS to seconds
  const [minutes, seconds] = trackDuration.split(':').map(Number);
  const durationInSeconds = (minutes * 60) + seconds;
  
  // Update player state
  playerState.currentTrack = {
    title: trackName,
    artist: "Kanye West", // This would come from the album data
    album: "My Beautiful Dark Twisted Fantasy",
    duration: durationInSeconds,
    currentTime: 0
  };
  
  // Start playing
  playerState.isPlaying = true;
  
  // Update UI
  updateTrackInfoUI();
  updateProgressUI();
  updatePlayButtonUI();
  startProgressUpdate();
}

// Update track information in the UI
export function updateTrackInfoUI() {
  // Mini player
  document.querySelector('.mini-track-title').textContent = playerState.currentTrack.title;
  document.querySelector('.mini-track-artist').textContent = playerState.currentTrack.artist;
}

// Update the entire player UI based on current state
export function updatePlayerUI() {
  updateTrackInfoUI();
  updateProgressUI();
  updatePlayButtonUI();
  
  // Set initial tab
  const activeTabElement = document.querySelector(`.expanded-tab:nth-child(1)`); // Default to first tab
  if (activeTabElement) {
    switchTab(activeTabElement);
  }
}

// Format time in seconds to MM:SS
export function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Function to handle loading album data from API
export function loadAlbumData(albumId) {
  console.log(`Loading album data for ID: ${albumId}`);
}

// Function to load track audio
export function loadTrackAudio(trackId) {
  console.log(`Loading audio for track ID: ${trackId}`);
}

export function playerToggle() {
  window.addEventListener('message', function(event) {
    if (event.data.type === 'resize-player') {
      const playerFrame = document.getElementById('persistent-player');
      const body = document.body;

      if (event.data.mode === 'extended') {
        // Keep mini player visible and show expanded player on top
        playerFrame.style.height = '100%';
        body.style.paddingBottom = '80px'; // Keep space for mini player
      } else {
        playerFrame.style.height = '80px';
        body.style.paddingBottom = '80px';
      }
    }
  });
}