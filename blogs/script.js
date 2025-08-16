// Hardware Decoded  Custom JavaScript

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
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            const hiddenPosts = document.querySelectorAll('.post-card.hidden');
            const postsToShow = Array.from(hiddenPosts).slice(0, 3);

            postsToShow.forEach(post => {
                post.classList.remove('hidden');
                // Add slight delay for visual effect
                setTimeout(() => {
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, 100);
            });

            // Hide button if no more posts
            if (document.querySelectorAll('.post-card.hidden').length === 0) {
                loadMoreBtn.style.display = 'none';
            }

            // Add loading effect
            loadMoreBtn.classList.add('loading');
            loadMoreBtn.textContent = 'Loading...';

            setTimeout(() => {
                loadMoreBtn.classList.remove('loading');
                loadMoreBtn.textContent = 'Load More Posts';
            }, 500);
        });
    }
}

// Reset Load More (for filters)
function resetLoadMore() {
    const hiddenPosts = document.querySelectorAll('.post-card:not(.hidden)');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // Hide posts beyond first 9 visible ones
    let visibleCount = 0;
    hiddenPosts.forEach(post => {
        if (post.style.display !== 'none') {
            visibleCount++;
            if (visibleCount > 9) {
                post.classList.add('hidden');
            }
        }
    });

    // Show/hide load more button based on hidden posts
    if (loadMoreBtn) {
        const hasHiddenPosts = document.querySelectorAll('.post-card.hidden[style*="block"], .post-card.hidden:not([style*="none"])').length > 0;
        loadMoreBtn.style.display = hasHiddenPosts ? 'block' : 'none';
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


// Footer functionality
document.addEventListener('DOMContentLoaded', function () {
    // Set current year
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }

    // Footer newsletter form
    const footerNewsletterForm = document.getElementById('footer-newsletter-form');
    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            // Show success message (you can replace this with actual newsletter signup logic)
            const button = this.querySelector('button');
            const originalHTML = button.innerHTML;

            button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
            button.disabled = true;

            setTimeout(() => {
                button.innerHTML = '✓ Subscribed';
                button.classList.remove('btn-primary');
                button.classList.add('btn-success');

                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.classList.remove('btn-success');
                    button.classList.add('btn-primary');
                    button.disabled = false;
                    this.reset();
                }, 2000);
            }, 1000);
        });
    }

    // Back to top functionality
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '0.75';
            } else {
                backToTopBtn.style.opacity = '0.5';
            }
        });
    }

    // Smooth scrolling for anchor links in footer
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
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



























