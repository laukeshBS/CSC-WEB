 // Get all gallery items and lightbox elementsgallery-flex
 //const galleryItems = document.querySelectorAll('.gallery-item');
 //const galleryItems = document.querySelectorAll('.gallery-flex');
 function displayGalleryById(galleryId) {
  const galleryContainer = document.getElementById(`gallery_flex_${galleryId}`);
  const galleryItems = galleryContainer.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeBtn = document.getElementById('closeBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const imageDescription = document.getElementById('imageDescription');

  // Create an array of images belonging to this gallery
  const images = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    title: galleryContainer.dataset.title,
    description: galleryContainer.dataset.description,
  }));

  let currentIndex = 0;

  // Open lightbox for the clicked image
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      lightbox.style.display = 'flex';
      lightboxImage.src = images[index].src;
      imageDescription.textContent = images[index].description;
      currentIndex = index; // Save current index
    });
  });

  // Close lightbox
  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  // Navigate to previous image
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    lightboxImage.src = images[currentIndex].src;
    imageDescription.textContent = images[currentIndex].description;
  });

  // Navigate to next image
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    lightboxImage.src = images[currentIndex].src;
    imageDescription.textContent = images[currentIndex].description;
  });

  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
}

