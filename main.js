/* ================================================================
   Innovalead Foundation — Main JavaScript
   Navigation, scroll effects, animations
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ---- Navbar scroll effect ----
    const navbar = document.getElementById('navbar');
    const scrollThreshold = 60;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---- Mobile menu toggle ----
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = navbar.offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // ---- Scroll-based animation ----
    const animateElements = document.querySelectorAll('.animate-in');
    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        animateElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });
    }

    // ---- Active nav link based on current page ----
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/') ||
            (currentPath.includes(href) && href !== '/' && !href.startsWith('#'))) {
            link.classList.add('active');
        }
    });
});
