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
      
      // Force reflow
      void progressBar.offsetWidth;
      
      // Start loading video immediately
      console.log('Starting video load...');
      
      // Create video element
      video = document.createElement('video');
      video.src = box.getAttribute('data-src');
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
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
      video.style.pointerEvents = 'none';
      
      box.appendChild(video);
      
      // Simulate progress bar based on video loading events
      let progressInterval;
      let currentProgress = 0;
      
      // Start progress animation
      progressBar.style.transition = 'width 0.1s linear';
      
      progressInterval = setInterval(() => {
        if (currentProgress < 90) {
          currentProgress += Math.random() * 15; // Random increments
          if (currentProgress > 90) currentProgress = 90;
          progressBar.style.width = currentProgress + '%';
        }
      }, 100);
      
      // When video data starts loading
      video.addEventListener('loadstart', () => {
        console.log('Video load started...');
      });
      
      // When video is ready to play
      video.addEventListener('canplay', () => {
        console.log('Video can play, finishing progress...');
        clearInterval(progressInterval);
        
        // Complete the progress bar
        progressBar.style.width = '100%';
        
        // Show video and hide progress bar smoothly
        setTimeout(() => {
          aTag.style.opacity = '0';
          video.style.opacity = '1';
          
          // Hide progress bar smoothly
          progressBar.style.transition = 'width 0.5s ease-out, opacity 0.5s ease-out';
          progressBar.style.width = '0';
          progressBar.style.opacity = '0';
        }, 200);
      });
      
      // Fallback timeout in case video doesn't load
      setTimeout(() => {
        if (video && video.readyState < 3) {
          console.log('Video load timeout, showing anyway...');
          clearInterval(progressInterval);
          progressBar.style.width = '100%';
          
          setTimeout(() => {
            aTag.style.opacity = '0';
            video.style.opacity = '1';
            
            // Hide progress bar smoothly
            progressBar.style.transition = 'width 0.5s ease-out, opacity 0.5s ease-out';
            progressBar.style.width = '0';
            progressBar.style.opacity = '0';
          }, 200);
        }
      }, 5000);
    });

    box.addEventListener('mouseleave', () => {
      console.log('Mouse left video box');
      isLoading = false;
      
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
