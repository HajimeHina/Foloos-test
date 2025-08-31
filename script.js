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
document.querySelectorAll('.video-wallpaper').forEach(box => {
  console.log('Found video wallpapers:', document.querySelectorAll('.video-wallpaper').length);
  if (box.querySelector('img')) return;
  const videoSrc = box.getAttribute('data-src');
  const video = document.createElement('video');
  video.src = videoSrc;
  video.muted = true;
  video.playsInline = true;
  video.crossOrigin = "anonymous";

  // Wait for video to be ready
  video.addEventListener('loadeddata', () => {
    // Seek to a frame (0.1s)
    video.currentTime = 0.1;
  });

  video.addEventListener('seeked', () => {
    // Draw the frame to canvas
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const img = document.createElement('img');
    img.src = "img/video-placeholder.png"; // temporary placeholder
    img.alt = "Video Thumbnail";
    img.style.width = "100%";
    img.style.display = "block";

    box.appendChild(img);
    video.remove();
  });

  video.addEventListener('error', () => {
    // Fallback: show a placeholder image or icon
    const img = document.createElement('img');
    img.src = "img/video-placeholder.png"; // Add a placeholder image in your img folder
    img.alt = "Video Thumbnail Not Available";
    img.style.width = "100%";
    img.style.display = "block";
    box.appendChild(img);
    video.remove();
  });

  // Add video element to DOM (hidden) if needed for some browsers
  video.style.display = "none";
  box.appendChild(video);
});



