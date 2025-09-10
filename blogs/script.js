// Hardware Decoded Custom JavaScript (cleaned)

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();       // default light
    initCurrentYear();
    initSmoothScroll();
    initNewsletterForm();
    initBackToTop();         // show/hide + smooth scroll
    initNavbarAutoCollapse();

    // Page-specific
    if (document.getElementById('filter-buttons')) {
        initBlogFilters();
        initLoadMore();
        checkUrlFilter();
    }
    if (document.getElementById('latest-news-btn')) {
        initLatestNewsButton();
    }

    // Shrink navbar on scroll
    initShrinkNavbar();
});

// ---------------- Theme Toggle ----------------
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Force default to light unless user already chose
    const saved = localStorage.getItem('theme');
    const currentTheme = saved ? saved : 'light';
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const now = html.getAttribute('data-theme');
            const next = now === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(next);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Replace with an image instead of SVG
    themeToggle.innerHTML =
        theme === 'dark'
            ? '<img src="moon.png" alt="Moon Icon" width="16" height="16">'
            : '<img src="sun.png" alt="Sun Icon" width="16" height="16">';
}


// ---------------- Smooth scroll ----------------
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ---------------- Newsletter (demo) ----------------
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value || '';
        alert(`Thanks for subscribing with ${email}! This is a demo - no actual subscription was created.`);
        form.reset();
    });
}

// ---------------- Latest News button ----------------
function initLatestNewsButton() {
    const btn = document.getElementById('latest-news-btn');
    if (!btn) return;
    btn.addEventListener('click', e => {
        e.preventDefault();
        window.location.href = 'blogs.html?filter=news';
    });
}

// ---------------- Blog filters + load more ----------------
function initBlogFilters() {
    const buttons = document.querySelectorAll('#filter-buttons .btn');
    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            filterPosts(filter);
            resetLoadMore();

            const url = new URL(window.location);
            if (filter === 'all') url.searchParams.delete('filter');
            else url.searchParams.set('filter', filter);
            window.history.replaceState({}, '', url);
        });
    });
}

function filterPosts(filter) {
    document.querySelectorAll('.post-card').forEach(card => {
        card.style.display =
            filter === 'all' || card.getAttribute('data-category') === filter
                ? 'block'
                : 'none';
    });
}

function checkUrlFilter() {
    const filterParam = new URLSearchParams(window.location.search).get('filter');
    if (!filterParam) return;
    const btn = document.querySelector(`[data-filter="${filterParam}"]`);
    if (!btn) return;
    document.querySelectorAll('#filter-buttons .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterPosts(filterParam);
}

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    const visibleHiddenPosts = () =>
        Array.from(document.querySelectorAll('.post-card.hidden'))
            .filter(p => p.style.display !== 'none');

    const reveal = post => {
        post.classList.remove('hidden');
        setTimeout(() => {
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, 20);
        setTimeout(() => {
            post.style.removeProperty('opacity');
            post.style.removeProperty('transform');
        }, 350);
    };

    const setButtonVisibility = () => {
        loadMoreBtn.style.display = visibleHiddenPosts().length ? 'inline-block' : 'none';
    };

    loadMoreBtn.addEventListener('click', () => {
        visibleHiddenPosts().slice(0, 3).forEach(reveal);
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.setAttribute('aria-busy', 'true');
        loadMoreBtn.disabled = true;
        const prevLabel = loadMoreBtn.textContent;
        loadMoreBtn.textContent = 'Loading...';

        setTimeout(() => {
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.removeAttribute('aria-busy');
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = prevLabel || 'Load More Posts';
            loadMoreBtn.blur();
            setButtonVisibility();
        }, 500);
    });

    setButtonVisibility();
}

function resetLoadMore() {
    const posts = Array.from(document.querySelectorAll('.post-card'));
    const loadMoreBtn = document.getElementById('load-more-btn');
    const visibleByFilter = posts.filter(p => p.style.display !== 'none');

    visibleByFilter.forEach((post, idx) => {
        if (idx < 9) post.classList.remove('hidden');
        else post.classList.add('hidden');
    });

    if (loadMoreBtn) {
        const remaining = visibleByFilter.filter(p => p.classList.contains('hidden')).length;
        loadMoreBtn.style.display = remaining ? 'inline-block' : 'none';
    }
}

// ---------------- Navbar collapse on link click (mobile) ----------------
function initNavbarAutoCollapse() {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.getElementById('navbarNav');
            if (!navbarCollapse) return;
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
        });
    });
}

// ---------------- Back to Top (show/hide + smooth) ----------------
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const toggle = () => {
        if (window.scrollY > 200) btn.classList.add('show');
        else btn.classList.remove('show');
    };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------------- Shrink navbar on scroll ----------------
function initShrinkNavbar() {
    const nav = document.getElementById('site-navbar');
    if (!nav) return;
    const onScroll = () => {
        if (window.scrollY > 8) nav.classList.add('nav-scrolled');
        else nav.classList.remove('nav-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}
