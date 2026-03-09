document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const images = (carousel.dataset.images || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    if (!images.length) return;

    const main = document.getElementById('mainImage');
    const left = document.getElementById('leftPreview');
    const right = document.getElementById('rightPreview');
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    const dots = document.getElementById('dots');

    if (!main || !left || !right || !prev || !next || !dots) return;

    let idx = 0;
    const dotButtons = [];

    const preload = (src) => {
        const img = new Image();
        img.src = src;
    };

    const setActiveDot = (activeIndex) => {
        dotButtons.forEach((btn, i) => {
            const isActive = i === activeIndex;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    const render = () => {
        const leftIndex = (idx - 1 + images.length) % images.length;
        const rightIndex = (idx + 1) % images.length;

        carousel.classList.add('is-changing');
        requestAnimationFrame(() => {
            main.src = images[idx];
            left.src = images[leftIndex];
            right.src = images[rightIndex];
            setActiveDot(idx);

            preload(images[(idx + 2) % images.length]);
            preload(images[(idx - 2 + images.length) % images.length]);

            setTimeout(() => carousel.classList.remove('is-changing'), 180);
        });
    };

    const goTo = (newIndex) => {
        idx = (newIndex + images.length) % images.length;
        render();
    };

    const fragment = document.createDocumentFragment();
    images.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'carousel-dot';
        btn.type = 'button';
        btn.setAttribute('aria-label', `Aller a l'image ${i + 1}`);
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', 'false');
        btn.addEventListener('click', () => goTo(i));
        dotButtons.push(btn);
        fragment.appendChild(btn);
    });

    dots.setAttribute('role', 'tablist');
    dots.innerHTML = '';
    dots.appendChild(fragment);

    prev.addEventListener('click', () => goTo(idx - 1));
    next.addEventListener('click', () => goTo(idx + 1));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(idx - 1);
        if (e.key === 'ArrowRight') goTo(idx + 1);
    });

    // Lightbox + zoom
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const expandBtn = document.getElementById('expandBtn');
    const closeBtn = document.getElementById('closeModal');

    if (modal && modalImage && expandBtn && closeBtn) {
        let isZoomed = false;

        const resetZoom = () => {
            isZoomed = false;
            modalImage.classList.remove('is-zoomed');
            modalImage.style.transformOrigin = 'center center';
        };

        const updateZoomOrigin = (e) => {
            const rect = modalImage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            modalImage.style.transformOrigin = `${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`;
        };

        const openModal = () => {
            modalImage.src = images[idx];
            modalImage.classList.add('zoomable-modal-image');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            resetZoom();
        };

        const closeModal = () => {
            resetZoom();
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        };

        expandBtn.addEventListener('click', openModal);
        main.addEventListener('click', openModal);
        closeBtn.addEventListener('click', closeModal);

        modalImage.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!isZoomed) {
                updateZoomOrigin(e);
                isZoomed = true;
                modalImage.classList.add('is-zoomed');
            } else {
                resetZoom();
            }
        });

        modalImage.addEventListener('mousemove', (e) => {
            if (isZoomed) updateZoomOrigin(e);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    render();
});
