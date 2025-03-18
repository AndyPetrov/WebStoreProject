// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Mini player elements
  const miniPlayer = document.querySelector('.music-controller-minimized');
  const expandButton = document.querySelector('.mini-expand-button');
  const playButton = document.querySelector('.mini-play-button');
  const playIcon = playButton.querySelector('i');
  const prevButton = document.querySelector('.ph-skip-back').parentElement;
  const nextButton = document.querySelector('.ph-skip-forward').parentElement;
  const shuffleButton = document.querySelector('.ph-shuffle').parentElement;
  const repeatButton = document.querySelector('.ph-repeat').parentElement;
  const volumeButton = document.querySelector('.mini-volume-button');
  const queueButton = document.querySelector('.mini-queue-button');
  const progressBar = document.querySelector('.mini-progress-bar');
  const progressContainer = document.querySelector('.mini-progress-container');
  const currentTimeDisplay = document.querySelector('.mini-current-time');
  const totalTimeDisplay = document.querySelector('.mini-total-time');

  // Expanded player elements
  const expandedPlayer = document.querySelector('.music-controller-expanded');
  const closeExpandedButton = document.querySelector('.expanded-close-button');
  const tabs = document.querySelectorAll('.expanded-tab');
  const tabContents = [
      document.querySelector('.now-playing-content'),
      document.querySelector('.lyrics-content'),
      document.querySelector('.recommended-content'),
      document.querySelector('.album-tracks-content')
  ];

  // Audio element
  const audioPlayer = document.getElementById('audio-player');

  // State variables
  let isPlaying = false;
  let isShuffle = false;
  let repeatMode = 'none'; // none, one, all
  let currentVolume = 1;
  let isMuted = false;
  let currentTabIndex = 0;
  let isExpanded = false;

  // Sample track data (would typically come from an API or database)
  const currentTrack = {
      title: "Get Down (Instrumental)",
      artist: "Craig Mack",
      albumArt: "images/album-art.jpg",
      audioSrc: "path/to/audio.mp3" // Update with actual path
  };

  // Initialize the player
  function initPlayer() {
      // Set audio source
      audioPlayer.src = currentTrack.audioSrc;
      
      // Update UI with track info
      updateTrackInfo();
      
      // Add event listener for time update
      audioPlayer.addEventListener('timeupdate', updateProgress);
      
      // Add event listener for track end
      audioPlayer.addEventListener('ended', handleTrackEnd);
      
      // Load audio metadata
      audioPlayer.addEventListener('loadedmetadata', () => {
          totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
      });
      
      // Set initial volume
      audioPlayer.volume = currentVolume;

      // Listen for messages from parent window
      window.addEventListener('message', receiveMessage);
  }

  // Handle messages received from parent window
  function receiveMessage(event) {
      // Check origin for security
      // if (event.origin !== "https://your-domain.com") return;

      const message = event.data;
      
      // Handle different message types
      switch (message.action) {
          case 'play':
              if (!isPlaying) togglePlay();
              break;
          case 'pause':
              if (isPlaying) togglePlay();
              break;
          case 'next':
              playNextTrack();
              break;
          case 'previous':
              playPreviousTrack();
              break;
          case 'seek':
              if (message.time !== undefined) {
                  audioPlayer.currentTime = message.time;
              }
              break;
          case 'closeExpanded':
              if (isExpanded) collapsePlayer();
              break;
      }
  }

  // Send message to parent window
  function sendMessageToParent(message) {
      if (window.parent) {
          window.parent.postMessage(message, 'http://127.0.0.1:5000');
          // In production, replace '*' with your domain for security
          // window.parent.postMessage(message, 'https://your-domain.com');
      }
  }

  // Event listeners for player controls
  function setupEventListeners() {
      // Mini player controls
      playButton.addEventListener('click', togglePlay);
      prevButton.addEventListener('click', playPreviousTrack);
      nextButton.addEventListener('click', playNextTrack);
      shuffleButton.addEventListener('click', toggleShuffle);
      repeatButton.addEventListener('click', toggleRepeat);
      volumeButton.addEventListener('click', toggleMute);
      queueButton.addEventListener('click', showQueue);
      expandButton.addEventListener('click', expandPlayer);
      progressContainer.addEventListener('click', seekTo);

      // Expanded player controls
      closeExpandedButton.addEventListener('click', collapsePlayer);
      
      // Tab switching
      tabs.forEach((tab, index) => {
          tab.addEventListener('click', () => switchTab(index));
      });
  }

  // Play/Pause toggle
  function togglePlay() {
      if (isPlaying) {
          audioPlayer.pause();
          playIcon.classList.remove('ph-pause');
          playIcon.classList.add('ph-play');
          sendMessageToParent({ action: 'playerStateChanged', state: 'paused' });
      } else {
          audioPlayer.play();
          playIcon.classList.remove('ph-play');
          playIcon.classList.add('ph-pause');
          sendMessageToParent({ action: 'playerStateChanged', state: 'playing' });
      }
      isPlaying = !isPlaying;
  }

  // Update progress bar
  function updateProgress() {
      const currentTime = audioPlayer.currentTime;
      const duration = audioPlayer.duration || 1;
      const progressPercent = (currentTime / duration) * 100;
      
      progressBar.style.width = `${progressPercent}%`;
      currentTimeDisplay.textContent = formatTime(currentTime);
      
      // Send progress update to parent (throttled for performance)
      if (currentTime % 1 < 0.1) { // Update roughly every second
          sendMessageToParent({ 
              action: 'progressUpdate', 
              currentTime: currentTime,
              duration: duration,
              percentage: progressPercent
          });
      }
  }

  // Format time in mm:ss
  function formatTime(timeInSeconds) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Handle seeking
  function seekTo(e) {
      const rect = progressContainer.getBoundingClientRect();
      const clickPositionX = e.clientX - rect.left;
      const containerWidth = rect.width;
      const seekPercentage = clickPositionX / containerWidth;
      
      audioPlayer.currentTime = seekPercentage * audioPlayer.duration;
  }

  // Handle track end
  function handleTrackEnd() {
      if (repeatMode === 'one') {
          audioPlayer.currentTime = 0;
          audioPlayer.play();
      } else if (repeatMode === 'all') {
          playNextTrack();
      } else {
          playIcon.classList.remove('ph-pause');
          playIcon.classList.add('ph-play');
          isPlaying = false;
          sendMessageToParent({ action: 'playerStateChanged', state: 'ended' });
      }
  }

  // Play previous track (placeholder)
  function playPreviousTrack() {
      console.log('Previous track');
      sendMessageToParent({ action: 'trackChanged', direction: 'previous' });
      // Here you would typically load the previous track
      // and update UI accordingly
  }

  // Play next track (placeholder)
  function playNextTrack() {
      console.log('Next track');
      sendMessageToParent({ action: 'trackChanged', direction: 'next' });
      // Here you would typically load the next track
      // and update UI accordingly
  }

  // Toggle shuffle mode
  function toggleShuffle() {
      isShuffle = !isShuffle;
      shuffleButton.classList.toggle('active');
      console.log(`Shuffle: ${isShuffle}`);
      sendMessageToParent({ action: 'shuffleChanged', shuffleOn: isShuffle });
  }

  // Toggle repeat mode
  function toggleRepeat() {
      switch (repeatMode) {
          case 'none':
              repeatMode = 'all';
              repeatButton.classList.add('active');
              break;
          case 'all':
              repeatMode = 'one';
              repeatButton.classList.add('active');
              // Add "1" indicator or change icon
              break;
          case 'one':
              repeatMode = 'none';
              repeatButton.classList.remove('active');
              break;
      }
      console.log(`Repeat mode: ${repeatMode}`);
      sendMessageToParent({ action: 'repeatChanged', repeatMode: repeatMode });
  }

  // Toggle mute
  function toggleMute() {
      if (isMuted) {
          audioPlayer.volume = currentVolume;
          volumeButton.querySelector('i').classList.remove('ph-speaker-x');
          volumeButton.querySelector('i').classList.add('ph-speaker-high');
      } else {
          currentVolume = audioPlayer.volume;
          audioPlayer.volume = 0;
          volumeButton.querySelector('i').classList.remove('ph-speaker-high');
          volumeButton.querySelector('i').classList.add('ph-speaker-x');
      }
      isMuted = !isMuted;
      sendMessageToParent({ action: 'volumeChanged', muted: isMuted, volume: audioPlayer.volume });
  }

  // Show queue (placeholder)
  function showQueue() {
      console.log('Show queue');
      // Implementation for showing the queue
  }

  // Expand player view
  function expandPlayer() {
      expandedPlayer.classList.add('active');
      isExpanded = true;
      
      // Notify parent window to resize iframe
      sendMessageToParent({ 
          action: 'resizePlayer', 
          mode: 'expanded',
          height: '100vh'  // Or whatever height you want for expanded view
      });
  }

  // Collapse player view
  function collapsePlayer() {
      expandedPlayer.classList.remove('active');
      isExpanded = false;
      
      // Notify parent window to resize iframe
      sendMessageToParent({ 
          action: 'resizePlayer', 
          mode: 'minimized',
          height: '80px'  // Height of the minimized player
      });
  }

  // Switch tabs in expanded view
  function switchTab(index) {
      tabs.forEach((tab, i) => {
          if (i === index) {
              tab.classList.add('active');
              tabContents[i].style.display = 'flex';
          } else {
              tab.classList.remove('active');
              tabContents[i].style.display = 'none';
          }
      });
      currentTabIndex = index;
  }

  // Update track information
  function updateTrackInfo() {
      const miniTitle = document.querySelector('.mini-track-title');
      const miniArtist = document.querySelector('.mini-track-artist');
      const miniAlbumArt = document.querySelector('.mini-album-art');
      
      miniTitle.textContent = currentTrack.title;
      miniArtist.textContent = currentTrack.artist;
      miniAlbumArt.src = currentTrack.albumArt;
      
      // Notify parent about track info
      sendMessageToParent({
          action: 'trackInfoUpdated',
          trackInfo: {
              title: currentTrack.title,
              artist: currentTrack.artist,
              albumArt: currentTrack.albumArt
          }
      });
  }

  // Initialize the player
  initPlayer();
  setupEventListeners();
});