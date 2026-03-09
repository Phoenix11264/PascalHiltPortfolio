document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    const toggleBackToTop = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        backToTopBtn.classList.toggle('visible', scrollTop > 300);
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

