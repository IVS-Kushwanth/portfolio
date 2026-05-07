// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

const toggleMobileMenu = () => {
    navMenu.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');

    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
    } else {
        spans[0].style.transform = 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
};

if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'rotate(0) translate(0, 0)';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });
});

const initNavigationLinks = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
};

const initScrollReveal = () => {
    const revealItems = document.querySelectorAll(
        '.reveal-up, .bento-card, .skill-box, .project-card, .resume-card, .social-card'
    );

    revealItems.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 0.08}s`);
    });

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(item => item.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
};

const initScrollProgress = () => {
    const progressBar = document.getElementById('scrollProgress');

    if (!progressBar) {
        return;
    }

    let ticking = false;

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.setProperty('--scroll-progress', `${Math.min(progress, 100)}%`);
        ticking = false;
    };

    const requestUpdate = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
};

const initHeroSpotlight = () => {
    const hero = document.querySelector('.hero-modern');

    if (!hero || window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    let ticking = false;
    let nextX = 50;
    let nextY = 45;

    const updateSpotlight = () => {
        hero.style.setProperty('--spotlight-x', `${nextX}px`);
        hero.style.setProperty('--spotlight-y', `${nextY}px`);
        ticking = false;
    };

    const requestSpotlight = event => {
        const rect = hero.getBoundingClientRect();
        nextX = event.clientX - rect.left;
        nextY = event.clientY - rect.top;

        if (!ticking) {
            window.requestAnimationFrame(updateSpotlight);
            ticking = true;
        }
    };

    hero.addEventListener('pointerenter', event => {
        hero.classList.add('is-spotlight-active');
        requestSpotlight(event);
    });

    hero.addEventListener('pointermove', requestSpotlight);

    hero.addEventListener('pointerleave', () => {
        hero.classList.remove('is-spotlight-active');
        hero.style.setProperty('--spotlight-x', '50%');
        hero.style.setProperty('--spotlight-y', '45%');
    });
};

const initializePortfolio = () => {
    initNavigationLinks();
    initScrollReveal();
    initScrollProgress();
    initHeroSpotlight();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolio);
} else {
    initializePortfolio();
}

console.log('%cPortfolio ready: spotlight hero theme loaded.', 'font-size: 14px; color: #c65321;');
