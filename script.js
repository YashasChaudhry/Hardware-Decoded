// Hardware Decoded Custom JavaScript (fixed)
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCurrentYear();
    initSmoothScroll();
    initNewsletterForm();
    initBackToTop();
    initNavbarAutoCollapse();

    // Page-specific initialization
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

    // Get saved theme or default to light
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

    themeToggle.innerHTML = theme === 'dark'
        ? '<img src="moon.png" alt="Moon Icon" width="16" height="16">'
        : '<img src="sun.png" alt="Sun Icon" width="16" height="16">';
}

// ---------------- Current Year ----------------
function initCurrentYear() {
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// ---------------- Smooth Scroll ----------------
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

// ---------------- Blog filters + Load More ----------------
function initBlogFilters() {
    const buttons = document.querySelectorAll('#filter-buttons .btn');
    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Remove active class from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Filter posts
            filterPosts(filter);
            // Reset load more functionality
            resetLoadMore();

            // Update URL
            const url = new URL(window.location);
            if (filter === 'all') {
                url.searchParams.delete('filter');
            } else {
                url.searchParams.set('filter', filter);
            }
            window.history.replaceState({}, '', url);
        });
    });
}

function filterPosts(filter) {
    const posts = document.querySelectorAll('.post-card');
    posts.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function checkUrlFilter() {
    const filterParam = new URLSearchParams(window.location.search).get('filter');
    if (!filterParam) return;

    const btn = document.querySelector(`[data-filter="${filterParam}"]`);
    if (!btn) return;

    // Remove active from all buttons
    document.querySelectorAll('#filter-buttons .btn').forEach(b => b.classList.remove('active'));
    // Add active to the correct button
    btn.classList.add('active');
    // Apply the filter
    filterPosts(filterParam);
}

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    // Function to get visible hidden posts based on current filter
    const getVisibleHiddenPosts = () => {
        return Array.from(document.querySelectorAll('.post-card.hidden'))
            .filter(post => post.style.display !== 'none');
    };

    // Function to reveal a post with animation
    const revealPost = (post) => {
        post.classList.remove('hidden');
        // Add smooth reveal animation
        post.style.opacity = '0';
        post.style.transform = 'translateY(20px)';

        setTimeout(() => {
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
            post.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }, 50);

        // Clean up inline styles after animation
        setTimeout(() => {
            post.style.removeProperty('opacity');
            post.style.removeProperty('transform');
            post.style.removeProperty('transition');
        }, 350);
    };

    // Function to update button visibility
    const updateLoadMoreButton = () => {
        const hiddenPosts = getVisibleHiddenPosts();
        loadMoreBtn.style.display = hiddenPosts.length > 0 ? 'inline-block' : 'none';
    };

    // Load more button click handler
    loadMoreBtn.addEventListener('click', () => {
        const hiddenPosts = getVisibleHiddenPosts();
        const postsToShow = hiddenPosts.slice(0, 3); // Show 3 more posts

        // Show loading state
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.setAttribute('aria-busy', 'true');
        loadMoreBtn.disabled = true;

        const originalText = loadMoreBtn.textContent;
        loadMoreBtn.textContent = 'Loading...';

        // Simulate loading delay and reveal posts
        setTimeout(() => {
            postsToShow.forEach(revealPost);

            // Reset button state
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.removeAttribute('aria-busy');
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = originalText;
            loadMoreBtn.blur();

            // Update button visibility
            updateLoadMoreButton();
        }, 500);
    });

    // Initial button state
    updateLoadMoreButton();
}

function resetLoadMore() {
    const allPosts = Array.from(document.querySelectorAll('.post-card'));
    const loadMoreBtn = document.getElementById('load-more-btn');

    // Filter posts that are visible based on current category filter
    const visiblePosts = allPosts.filter(post => post.style.display !== 'none');

    // Show first 9 posts, hide the rest
    visiblePosts.forEach((post, index) => {
        if (index < 9) {
            post.classList.remove('hidden');
        } else {
            post.classList.add('hidden');
        }
    });

    // Update load more button visibility
    if (loadMoreBtn) {
        const hiddenCount = visiblePosts.filter(post => post.classList.contains('hidden')).length;
        loadMoreBtn.style.display = hiddenCount > 0 ? 'inline-block' : 'none';
    }
}

// ---------------- Navbar collapse on link click (mobile) ----------------
function initNavbarAutoCollapse() {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navbarCollapse = document.getElementById('navbarNav');
            if (!navbarCollapse) return;

            // Check if Bootstrap is available
            if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}

// ---------------- Back to Top (show/hide + smooth) ----------------
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    // Function to toggle button visibility
    const toggleBackToTop = () => {
        if (window.scrollY > 200) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    };

    // Listen for scroll events
    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    // Initial check
    toggleBackToTop();

    // Click handler
    btn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------------- Shrink navbar on scroll ----------------
function initShrinkNavbar() {
    const nav = document.getElementById('site-navbar');
    if (!nav) return;

    const handleScroll = () => {
        if (window.scrollY > 8) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    };

    // Initial check
    handleScroll();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
}