function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const btn = document.getElementById("sidebar-toggle-btn");

  sidebar.classList.toggle("open");

  if (sidebar.classList.contains("open")) {
    btn.innerHTML = "&times;"; // X symbol when open
    btn.classList.add("attached"); // move button with sidebar
  } else {
    btn.innerHTML = "&#9776;"; // ☰ when closed
    btn.classList.remove("attached");
  }
}

// Dropdown toggle
document.querySelectorAll(".dropdown-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    let dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.maxHeight && dropdownContent.style.maxHeight !== "0px") {
      dropdownContent.style.maxHeight = "0";
    } else {
      dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
    }
  });
});

// Fixed hover functionality for video wallpapers
document.addEventListener('DOMContentLoaded', function() {
  const videoBoxes = document.querySelectorAll('.wallpaper-box.video-wallpaper');
  console.log('Found video boxes:', videoBoxes.length);
  
  if (videoBoxes.length === 0) {
    console.error('No video wallpapers found! Check your selectors');
    return;
  }
  
  videoBoxes.forEach(box => {
    const progressBar = box.querySelector('.progress-bar');
    const aTag = box.querySelector('a');
    let video = null;
    let isLoading = false;
    let hoverTimer = null;

    box.addEventListener('mouseenter', () => {
      console.log('Mouse entered video box');
      if (isLoading) return;

      isLoading = true;

      // Reset progress bar
      progressBar.style.transition = 'none';
      progressBar.style.width = '0';

      // Force reflow so next transition applies
      void progressBar.offsetWidth;

      // Create video element and start loading immediately
      video = document.createElement('video');
      video.src = box.getAttribute('data-src');
      video.autoplay = false;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto'; // Force browser to start loading
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.borderRadius = 'inherit';
      video.style.position = 'absolute';
      video.style.top = '0';
      video.style.left = '0';
      video.style.zIndex = '1';
      video.style.opacity = '0';
      video.style.transition = 'opacity 0.3s ease';

      // Add video to DOM but keep hidden
      box.appendChild(video);

      // Track loading progress
      video.addEventListener('progress', () => {
        if (video.buffered.length > 0 && video.duration > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const progress = (bufferedEnd / video.duration) * 100;
          
          // Smoothly update progress bar
          progressBar.style.transition = 'width 0.3s ease-out';
          progressBar.style.width = progress + '%';
          
          console.log('Video loading progress:', progress + '%');
        }
      });

      // When video is ready to play
      video.addEventListener('canplaythrough', () => {
        if (!isLoading) return;
        
        // Ensure progress bar shows 100%
        progressBar.style.transition = 'width 0.2s ease-out';
        progressBar.style.width = '100%';
        
        // Small delay then show video
        setTimeout(() => {
          if (!isLoading) return;
          
          aTag.style.opacity = '0';
          video.style.opacity = '1';
          video.play().catch(err => {
            console.log('Autoplay failed:', err);
          });
          
          // Hide progress bar after video shows
          setTimeout(() => {
            progressBar.style.width = '0';
          }, 300);
        }, 100);
      });

      // Handle video load errors
      video.addEventListener('error', () => {
        console.log('Video failed to load');
        isLoading = false;
        progressBar.style.width = '0';
        if (video) video.remove();
        video = null;
      });

      // Fallback timer - if video takes too long, show it anyway
      hoverTimer = setTimeout(() => {
        if (!isLoading || !video) return;
        
        // Show whatever has loaded
        progressBar.style.width = '100%';
        aTag.style.opacity = '0';
        video.style.opacity = '1';
        video.play().catch(() => {
          // Silent fail for autoplay restrictions
        });
        
        setTimeout(() => {
          progressBar.style.width = '0';
        }, 300);
      }, 5000); // Longer timeout since we're waiting for actual loading
    });

    box.addEventListener('mouseleave', () => {
      console.log('Mouse left video box');
      isLoading = false;
      clearTimeout(hoverTimer);
      
      // Reset progress bar quickly
      progressBar.style.transition = 'width 0.2s ease-out';
      progressBar.style.width = '0';
      
      // Show thumbnail again
      aTag.style.opacity = '1';
      aTag.style.transition = 'opacity 0.2s ease';
      
      // Remove video
      if (video) {
        video.pause();
        video.remove();
        video = null;
      }
    });
  });
});
