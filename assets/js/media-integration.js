// Media Integration and Playback Handler
document.addEventListener('DOMContentLoaded', function() {
    // Audio Player Setup
    const audioPlayers = document.querySelectorAll('.audio-player');
    audioPlayers.forEach(player => {
        player.addEventListener('play', function() {
            // Pause other audio players when one starts playing
            audioPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player && !otherPlayer.paused) {
                    otherPlayer.pause();
                }
            });
        });
    });

    // Video Player Setup
    const videoPlayers = document.querySelectorAll('.video-player');
    videoPlayers.forEach(player => {
        player.addEventListener('play', function() {
            // Pause other video players when one starts playing
            videoPlayers.forEach(otherPlayer => {
                if (otherPlayer !== player && !otherPlayer.paused) {
                    otherPlayer.pause();
                }
            });
        });
    });

    // Gallery Image Loading
    const galleryImages = document.querySelectorAll('.gallery-image');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.setAttribute('src', src);
                        img.classList.remove('lazyload');
                    }
                    observer.unobserve(img);
                }
            });
        });

        galleryImages.forEach(img => imageObserver.observe(img));
    }

    // Tracklist Playback
    const trackPlayButtons = document.querySelectorAll('.track-play-button');
    trackPlayButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackItem = this.closest('.track-item');
            const trackTitle = trackItem.querySelector('.track-title').textContent;
            const trackNumber = trackItem.querySelector('.track-number').textContent;

            // Update active track styling
            trackPlayButtons.forEach(btn => {
                btn.closest('.track-item').classList.remove('active');
                btn.querySelector('i').classList.remove('fa-pause');
                btn.querySelector('i').classList.add('fa-play');
            });

            trackItem.classList.add('active');
            this.querySelector('i').classList.remove('fa-play');
            this.querySelector('i').classList.add('fa-pause');

            // Here you would typically handle the actual audio playback
            // For now, we'll just update the UI
            console.log(`Playing track ${trackNumber}: ${trackTitle}`);
        });
    });

    // Video Category Filtering
    const categoryTabs = document.querySelectorAll('.category-tab');
    const videoItems = document.querySelectorAll('.video-item');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter videos
            videoItems.forEach(video => {
                if (category === 'all' || video.getAttribute('data-category') === category) {
                    video.style.display = 'block';
                } else {
                    video.style.display = 'none';
                }
            });
        });
    });

    // Gallery Lightbox
    const galleryLinks = document.querySelectorAll('.gallery-link');
    const lightbox = document.getElementById('gallery-lightbox');

    if (galleryLinks.length && lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');

        let currentIndex = 0;
        const visibleGalleryLinks = () => Array.from(galleryLinks).filter(link => {
            const item = link.closest('.gallery-item');
            return window.getComputedStyle(item).display !== 'none';
        });

        // Open lightbox
        galleryLinks.forEach((link, index) => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const visibleLinks = visibleGalleryLinks();
                currentIndex = visibleLinks.indexOf(this);

                const imgSrc = this.getAttribute('href');
                const imgCaption = this.getAttribute('data-caption');

                lightboxImage.setAttribute('src', imgSrc);
                lightboxImage.setAttribute('alt', imgCaption);
                lightboxCaption.textContent = imgCaption;

                lightbox.setAttribute('aria-hidden', 'false');
                lightbox.style.display = 'flex';

                // Focus trap
                lightboxClose.focus();
            });
        });

        // Close lightbox
        lightboxClose.addEventListener('click', () => {
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.style.display = 'none';
        });

        // Navigate through images
        lightboxPrev.addEventListener('click', () => {
            const visibleLinks = visibleGalleryLinks();
            currentIndex = (currentIndex - 1 + visibleLinks.length) % visibleLinks.length;

            const prevLink = visibleLinks[currentIndex];
            const imgSrc = prevLink.getAttribute('href');
            const imgCaption = prevLink.getAttribute('data-caption');

            lightboxImage.setAttribute('src', imgSrc);
            lightboxImage.setAttribute('alt', imgCaption);
            lightboxCaption.textContent = imgCaption;
        });

        lightboxNext.addEventListener('click', () => {
            const visibleLinks = visibleGalleryLinks();
            currentIndex = (currentIndex + 1) % visibleLinks.length;

            const nextLink = visibleLinks[currentIndex];
            const imgSrc = nextLink.getAttribute('href');
            const imgCaption = nextLink.getAttribute('data-caption');

            lightboxImage.setAttribute('src', imgSrc);
            lightboxImage.setAttribute('alt', imgCaption);
            lightboxCaption.textContent = imgCaption;
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                lightboxClose.click();
            }
        });
    }

    // Play Button Setup
    const playButtons = document.querySelectorAll('.play-button');
    let currentAudio = null;

    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const audioSrc = this.getAttribute('data-audio');
            if (!audioSrc) return;

            // Create or reuse audio element
            if (!currentAudio) {
                currentAudio = new Audio();
                currentAudio.addEventListener('play', function() {
                    // Update all play buttons to show play icon
                    playButtons.forEach(btn => {
                        btn.querySelector('i').classList.remove('fa-pause');
                        btn.querySelector('i').classList.add('fa-play');
                    });
                    // Update clicked button to show pause icon
                    button.querySelector('i').classList.remove('fa-play');
                    button.querySelector('i').classList.add('fa-pause');
                });
                currentAudio.addEventListener('pause', function() {
                    // Update all play buttons to show play icon
                    playButtons.forEach(btn => {
                        btn.querySelector('i').classList.remove('fa-pause');
                        btn.querySelector('i').classList.add('fa-play');
                    });
                });
            }

            // If clicking the same button that's currently playing, pause
            if (currentAudio.src === audioSrc && !currentAudio.paused) {
                currentAudio.pause();
                return;
            }

            // Stop current audio if playing something else
            if (currentAudio.src && currentAudio.src !== audioSrc) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Set new audio source and play
            currentAudio.src = audioSrc;
            currentAudio.play();
        });
    });
});