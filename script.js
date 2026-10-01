/* ================================
   GRADUATION CELEBRATION - SCRIPT
   For Taqy Ali 🎓
   ================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ================================
    // 1. GALLERY - Load Photos
    // ================================
    const galleryGrid = document.getElementById('gallery-grid');
    const totalPhotos = 29;

    for (let i = 1; i <= totalPhotos; i++) {
        const item = document.createElement('div');
        item.className = 'gallery-item animate-on-scroll';
        item.innerHTML = `
            <img src="images/${i}.jpeg" alt="صورة تخرج تقتوقتي ${i}" loading="lazy">
            <div class="gallery-overlay">
                <span>📸 صورة ${i}</span>
            </div>
        `;
        item.addEventListener('click', () => openLightbox(i - 1));
        galleryGrid.appendChild(item);
    }

    // ================================
    // 2. LIGHTBOX
    // ================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const imgNum = currentIndex + 1;
        lightboxImg.src = `images/${imgNum}.jpeg`;
        lightboxImg.alt = `صورة تخرج تقتوقتي ${imgNum}`;
        lightboxCounter.textContent = `${imgNum} / ${totalPhotos}`;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % totalPhotos;
        updateLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + totalPhotos) % totalPhotos;
        updateLightbox();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') nextImage();
        if (e.key === 'ArrowRight') prevImage();
    });

    // Touch/swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) prevImage(); // swipe left (RTL)
            else nextImage(); // swipe right (RTL)
        }
    });

    // ================================
    // 3. SCROLL ANIMATIONS
    // ================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Add staggered delay for grid items
                const siblings = entry.target.parentElement?.children;
                if (siblings) {
                    const index = Array.from(siblings).indexOf(entry.target);
                    // Cap the delay so large grids (like 29 photos) don't lag
                    const delay = Math.min(index * 0.08, 0.4);
                    entry.target.style.transitionDelay = `${delay}s`;
                }
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // ================================
    // 4. COUNTER ANIMATION
    // ================================
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number[data-target]');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const startTime = Date.now();
                    
                    function updateCounter() {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.round(eased * target);
                        counter.textContent = current;
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }
                    updateCounter();
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) statsObserver.observe(statsSection);

    // ================================
    // 5. CONFETTI SYSTEM
    // ================================
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let confettiParticles = [];
    let confettiAnimating = false;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const confettiColors = [
        '#f5d76e', '#d4a017', '#b8860b', // golds
        '#7b1e3b', '#9e2d50', '#c0392b', // reds/maroons
        '#ffffff', '#e74c3c', '#2ecc71',  // variety
        '#f39c12', '#8e44ad', '#3498db'   // more colors
    ];

    class ConfettiPiece {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 4;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.opacity = 1;
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
            this.wobble = Math.random() * 10;
            this.wobbleSpeed = Math.random() * 0.1 + 0.05;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.wobble) * 0.5;
            this.wobble += this.wobbleSpeed;
            this.rotation += this.rotationSpeed;
            this.speedY += 0.02; // gravity

            if (this.y > canvas.height + 20) {
                this.opacity = 0;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    function launchConfetti(count = 150) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                confettiParticles.push(new ConfettiPiece());
            }, Math.random() * 1000);
        }

        if (!confettiAnimating) {
            confettiAnimating = true;
            animateConfetti();
        }
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confettiParticles.forEach(p => {
            p.update();
            p.draw();
        });

        confettiParticles = confettiParticles.filter(p => p.opacity > 0);

        if (confettiParticles.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            confettiAnimating = false;
        }
    }

    // Auto-launch confetti on page load
    setTimeout(() => launchConfetti(100), 500);

    // Celebrate button
    const celebrateBtn = document.getElementById('celebrate-btn');
    if (celebrateBtn) {
        celebrateBtn.addEventListener('click', () => {
            launchConfetti(200);
            // Add a fun vibration if supported
            if (navigator.vibrate) navigator.vibrate(200);
        });
    }

    // ================================
    // 6. FLOATING PARTICLES
    // ================================
    const particlesContainer = document.getElementById('particles');
    const particleColors = ['var(--gold)', 'var(--gold-light)', 'var(--maroon)', 'var(--maroon-light)'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 6 + 2;
        const colors = ['#f5d76e', '#d4a017', '#7b1e3b', '#9e2d50'];
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // ================================
    // 7. SMOOTH SCROLL FOR NAV
    // ================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ================================
    // 8. PARALLAX EFFECT ON HERO
    // ================================
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.3}px`;
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
            }
        }
    });

    // ================================
    // 9. PAGE VISIBILITY - TITLE CHANGE
    // ================================
    const originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = '💛 تعالي شوفي المفاجأة يا تقتوقتي!';
        } else {
            document.title = originalTitle;
        }
    });

    // ================================
    // 10. CURSOR SPARKLE EFFECT
    // ================================
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.92) {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                width: 6px;
                height: 6px;
                background: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                animation: sparkleOut 0.6s ease forwards;
            `;
            document.body.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 600);
        }
    });

    // Add sparkle animation
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleOut {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0) translateY(-20px); opacity: 0; }
        }
    `;
    // ================================
    // 11. MUSIC PLAYER
    // ================================
    const musicBtn = document.getElementById('music-btn');
    const bgMusic = document.getElementById('bg-music');
    let isMusicPlaying = false;

    function toggleMusic() {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵';
            musicBtn.classList.remove('playing');
            isMusicPlaying = false;
        } else {
            bgMusic.volume = 0.5;
            bgMusic.play().then(() => {
                musicBtn.textContent = '🔊';
                musicBtn.classList.add('playing');
                isMusicPlaying = true;
            }).catch(() => {
                // Autoplay blocked, will play on next click
                console.log('Music autoplay blocked, tap to play');
            });
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    // Try to autoplay music on first user interaction
    const startMusicOnce = () => {
        if (!isMusicPlaying) {
            toggleMusic();
        }
        document.removeEventListener('click', startMusicOnce);
        document.removeEventListener('touchstart', startMusicOnce);
        document.removeEventListener('scroll', startMusicOnce);
    };

    document.addEventListener('click', startMusicOnce, { once: false });
    document.addEventListener('touchstart', startMusicOnce, { once: false });
    document.addEventListener('scroll', startMusicOnce, { once: false });

    console.log('🎓 مبروك التخرج يا تقتوقتي! 💛');
});
