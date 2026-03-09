document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.ap-carousel');
    if (!carousels.length) return;

    carousels.forEach((carousel) => {
        const images = (carousel.dataset.images || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        if (!images.length) return;

        const main = carousel.querySelector('.ap-main');
        const left = carousel.querySelector('.ap-left');
        const right = carousel.querySelector('.ap-right');
        const prev = carousel.querySelector('.ap-prev');
        const next = carousel.querySelector('.ap-next');
        const dots = carousel.querySelector('.ap-dots');

        if (!main || !left || !right || !prev || !next || !dots) return;

        let idx = 0;
        const dotButtons = [];

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

        render();
    });
});

