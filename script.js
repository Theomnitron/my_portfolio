// script.js

/**
 * ====================================================================
 * GLOBAL VARIABLES AND INITIALIZATION
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const navMenu = document.getElementById('navMenu');
    const hamburger = document.getElementById('hamburger');
    const navLinks = navMenu.querySelectorAll('a');
    const carousels = document.querySelectorAll('.project-carousel-container');

    // Initialize Theme State
    initializeTheme();

    // Attach Event Listeners
    themeToggle.addEventListener('click', toggleTheme);
    hamburger.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));
    window.addEventListener('scroll', handleScrollAnimations);
    window.addEventListener('load', handleScrollAnimations); // Check on load
    
    // Initialize Carousels
    carousels.forEach(initCarousel);

    /**
     * ===============================================================
     * 7. LIGHT/DARK MODE SYSTEM
     * ===============================================================
     */

    /**
     * Checks localStorage for theme preference or defaults to system preference.
     */
    function initializeTheme() {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine initial theme
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            body.classList.add('dark-mode');
            setToggleIcon(true);
        } else {
            setToggleIcon(false);
        }
    }

    /**
     * Toggles the dark-mode class on the body and updates localStorage.
     */
    function toggleTheme() {
        const isDarkMode = body.classList.toggle('dark-mode');
        
        // Store user preference
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        setToggleIcon(isDarkMode);
    }

    /**
     * Sets the appropriate icon (sun or moon) for the theme toggle button.
     * @param {boolean} isDarkMode - True if dark mode is active.
     */
    function setToggleIcon(isDarkMode) {
        themeToggle.innerHTML = isDarkMode 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }


    /**
     * ===============================================================
     * (1) MOBILE MENU LOGIC
     * ===============================================================
     */

    /**
     * Toggles the mobile navigation menu open/closed.
     */
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        // Prevent body scrolling when menu is open
        body.classList.toggle('no-scroll', navMenu.classList.contains('active'));
    }

    /**
     * Handles nav link clicks for both smooth scroll and closing mobile menu.
     */
    function handleNavLinkClick(event) {
        // Close menu if it's open (mobile)
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }


    /**
     * ===============================================================
     * 6. FADE-IN ON SCROLL ANIMATIONS (Reveal)
     * ===============================================================
     */

    /**
     * Checks elements against the viewport and adds the 'active' class for animation.
     */
    function handleScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        revealElements.forEach(element => {
            // Get the position of the element relative to the viewport
            const elementTop = element.getBoundingClientRect().top;
            
            // If the element is 1/8th of the way up the screen
            const triggerPoint = windowHeight - (windowHeight / 8); 

            if (elementTop < triggerPoint) {
                element.classList.add('active');
            } else {
                // Optional: remove 'active' when scrolled past, but generally better to keep it
                // element.classList.remove('active'); 
            }
        });
    }


    /**
     * ===============================================================
     * (5) PROJECT CAROUSEL LOGIC
     * ===============================================================
     */

    /**
     * Initializes the image carousel functionality for a single project container.
     * @param {HTMLElement} container - The .project-carousel-container element.
     */
    function initCarousel(container) {
        const carousel = container.querySelector('.carousel');
        const slides = Array.from(carousel.children);
        const prevButton = container.querySelector('.carousel-prev');
        const nextButton = container.querySelector('.carousel-next');
        let currentIndex = 0;
        const totalSlides = slides.length;
        let slideInterval;

        /**
         * Updates the carousel display to show the slide at the given index.
         * @param {number} index - The index of the slide to display.
         */
        function updateCarousel(index) {
            // Calculate the horizontal translation required
            const offset = -index * 100;
            carousel.style.transform = `translateX(${offset}%)`;
            currentIndex = index;
        }

        /**
         * Moves the carousel to the next slide (infinite loop).
         */
        function nextSlide() {
            let newIndex = (currentIndex + 1) % totalSlides;
            updateCarousel(newIndex);
        }

        /**
         * Moves the carousel to the previous slide (infinite loop).
         */
        function prevSlide() {
            let newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel(newIndex);
        }
        
        /**
         * Starts the auto-play timer for the carousel (Auto-play every 4–6 seconds).
         */
        function startAutoPlay() {
            // Using 5000ms (5 seconds) as the time interval
            slideInterval = setInterval(nextSlide, 5000); 
        }

        /**
         * Stops the auto-play timer.
         */
        function stopAutoPlay() {
            clearInterval(slideInterval);
        }

        // Event listeners for manual control
        prevButton.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            startAutoPlay(); // Restart timer after manual interaction
        });

        nextButton.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay(); // Restart timer after manual interaction
        });

        // Start the auto-play loop
        startAutoPlay();
    }
});
