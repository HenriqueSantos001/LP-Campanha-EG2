document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById('jogosCarousel');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');

    let baseSlides = Array.from(carousel.children).filter(c => !c.classList.contains('clone'));
    let slides = [];
    let totalSlides = baseSlides.length;
    let currentIndex = 0;

    let isMobile = null;

    const isReallyMobile = () => {
        const widthCheck = window.innerWidth <= 700;
        const uaCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return widthCheck || uaCheck;
    };

    const setupMobileCarousel = () => {
        carousel.innerHTML = '';
        baseSlides.forEach(slide => carousel.appendChild(slide));

        baseSlides.forEach(slide => {
            let clone = slide.cloneNode(true);
            clone.classList.add('clone');
            carousel.appendChild(clone);
        });
        baseSlides.forEach(slide => {
            let clone = slide.cloneNode(true);
            clone.classList.add('clone');
            carousel.insertBefore(clone, carousel.firstChild);
        });

        slides = Array.from(carousel.children);
        currentIndex = totalSlides;
        updatePosition(false);

        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';

        carousel.addEventListener('touchstart', onTouchStart, { passive: true });
        carousel.addEventListener('touchmove', onTouchMove, { passive: true });
        carousel.addEventListener('touchend', onTouchEnd, { passive: true });
    };

    const teardownMobileCarousel = () => {
        carousel.innerHTML = '';
        baseSlides.forEach(slide => {
            slide.classList.remove('clone');
            carousel.appendChild(slide);
        });

        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        carousel.style.transform = 'none';
        carousel.style.transition = 'none';

        carousel.removeEventListener('touchstart', onTouchStart);
        carousel.removeEventListener('touchmove', onTouchMove);
        carousel.removeEventListener('touchend', onTouchEnd);
    };

    const updatePosition = (animate = true) => {
        const slideWidth = slides[0].offsetWidth;
        carousel.style.transition = animate ? 'transform 0.4s ease' : 'none';
        carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    const nextSlide = () => {
        currentIndex++;
        updatePosition();
        if (currentIndex === slides.length - totalSlides) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = totalSlides;
                updatePosition(false);
            }, 400);
        }
    };

    const prevSlide = () => {
        currentIndex--;
        updatePosition();
        if (currentIndex === 0) {
            setTimeout(() => {
                carousel.style.transition = 'none';
                currentIndex = slides.length - (totalSlides * 2);
                updatePosition(false);
            }, 400);
        }
    };

    let startX = 0, deltaX = 0;

    const onTouchStart = (e) => {
        startX = e.touches[0].clientX;
        deltaX = 0;
        carousel.style.transition = 'none';
    };

    const onTouchMove = (e) => {
        deltaX = e.touches[0].clientX - startX;
        const slideWidth = slides[0].offsetWidth;
        carousel.style.transform = `translateX(-${currentIndex * slideWidth - deltaX}px)`;
    };

    const onTouchEnd = () => {
        const slideWidth = slides[0].offsetWidth;
        if (Math.abs(deltaX) > slideWidth / 4) {
            if (deltaX > 0) prevSlide();
            else nextSlide();
        } else {
            updatePosition();
        }
        startX = 0; deltaX = 0;
    };

    const checkAndUpdateMode = () => {
        const nowMobile = isReallyMobile();

        if (nowMobile && isMobile !== true) {
            isMobile = true;
            setupMobileCarousel();
        } else if (!nowMobile && isMobile !== false) {
            isMobile = false;
            teardownMobileCarousel();
        }
    };

    window.addEventListener('resize', checkAndUpdateMode);
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    checkAndUpdateMode();
});
