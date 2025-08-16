// Hardware Decoded Custom JavaScript

// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features
    initThemeToggle();
    initCurrentYear();
    initSmoothScroll();
    initNewsletterForm();

    // Initialize page-specific features
    if (document.getElementById('filter-buttons')) {
        initBlogFilters();
        initLoadMore();
        checkUrlFilter();
    }

    if (document.getElementById('latest-news-btn')) {
        initLatestNewsButton();
    }
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', function () {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Update theme toggle icon
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = theme === 'dark'
        ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8z"/></svg>';
    themeToggle.innerHTML = icon;
}

// Current Year in Footer
function initCurrentYear() {
    const yearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Show success message (dummy implementation)
            alert(`Thanks for subscribing with ${email}! This is a demo - no actual subscription was created.`);
            this.reset();
        });
    }
}

// Latest News Button
function initLatestNewsButton() {
    const latestNewsBtn = document.getElementById('latest-news-btn');
    latestNewsBtn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'blogs.html?filter=news';
    });
}

// Blog Filter Functionality
function initBlogFilters() {
    const filterButtons = document.querySelectorAll('#filter-buttons .btn');
    const postCards = document.querySelectorAll('.post-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter posts
            filterPosts(filter);

            // Reset load more
            resetLoadMore();

            // Update URL without reload
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

// Filter Posts Function
function filterPosts(filter) {
    const postCards = document.querySelectorAll('.post-card');

    postCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Check URL for Filter Parameter
function checkUrlFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {
        const filterButton = document.querySelector(`[data-filter="${filterParam}"]`);
        if (filterButton) {
            // Remove active from all buttons
            document.querySelectorAll('#filter-buttons .btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Activate correct button
            filterButton.classList.add('active');

            // Filter posts
            filterPosts(filterParam);
        }
    }
}

// Load More Functionality
// Load More Functionality (works with filters + keeps hover + stable button label)
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;

    // Posts that are hidden via .hidden BUT allowed by current filter
    // (filterPosts sets inline style.display to 'none' for disallowed)
    const visibleHiddenPosts = () =>
        Array.from(document.querySelectorAll('.post-card.hidden'))
            .filter(p => p.style.display !== 'none');

    const reveal = (post) => {
        post.classList.remove('hidden');

        // small delay so layout applies, then reveal animation
        setTimeout(() => {
            post.style.opacity = '1';
            post.style.transform = 'translateY(0)';
        }, 20);

        // cleanup inline styles after transition so :hover works
        setTimeout(() => {
            post.style.removeProperty('opacity');
            post.style.removeProperty('transform');
        }, 350); // > your CSS transition (0.2s)
    };

    const setButtonVisibility = () => {
        loadMoreBtn.style.display = visibleHiddenPosts().length ? 'inline-block' : 'none';
    };

    loadMoreBtn.addEventListener('click', () => {
        const toShow = visibleHiddenPosts().slice(0, 3);
        toShow.forEach(reveal);

        // Loading micro-feedback with robust reset
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.setAttribute('aria-busy', 'true');
        loadMoreBtn.disabled = true; // avoids sticky active/focus styles
        const prevLabel = loadMoreBtn.textContent;
        loadMoreBtn.textContent = 'Loading...';

        setTimeout(() => {
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.removeAttribute('aria-busy');
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = prevLabel || 'Load More Posts';
            loadMoreBtn.blur(); // clear focus
            loadMoreBtn.style.removeProperty('color'); // ensure text color resets if it got set inline

            // Update visibility after revealing
            setButtonVisibility();
        }, 500);
    });

    // Initial button visibility (handles filters set via URL)
    setButtonVisibility();
}



// Reset Load More (for filters)
function resetLoadMore() {
    const posts = Array.from(document.querySelectorAll('.post-card'));
    const loadMoreBtn = document.getElementById('load-more-btn');

    // Consider only posts allowed by the current filter (inline style not 'none')
    const visibleByFilter = posts.filter(p => p.style.display !== 'none');

    // First 9 stay visible; the rest get .hidden so Load More can reveal them
    visibleByFilter.forEach((post, idx) => {
        if (idx < 9) {
            post.classList.remove('hidden');
        } else {
            post.classList.add('hidden');
        }
    });

    // If any filtered posts are still hidden, show the button
    const remaining = visibleByFilter.filter(p => p.classList.contains('hidden')).length;
    if (loadMoreBtn) {
        loadMoreBtn.style.display = remaining ? 'inline-block' : 'none';
    }
}


// Utility function for smooth animations
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';

    let start = performance.now();

    function animate(timestamp) {
        let elapsed = timestamp - start;
        let progress = elapsed / duration;

        if (progress > 1) progress = 1;

        element.style.opacity = progress;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.getElementById('navbarNav');
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
    });
});


// Back to Top Button
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    // Smooth scroll to top on click
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Call inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    // Already existing initializers
    initThemeToggle();
    initCurrentYear();
    initSmoothScroll();
    initNewsletterForm();

    // NEW
    initBackToTop();

    // Page-specific
    if (document.getElementById('filter-buttons')) {
        initBlogFilters();
        initLoadMore();
        checkUrlFilter();
    }

    if (document.getElementById('latest-news-btn')) {
        initLatestNewsButton();
    }
});













































// Shrink navbar on scroll
(function () {
    const nav = document.getElementById('site-navbar');

    function onScroll() {
        if (window.scrollY > 8) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
})();



























