$(document).ready(function () {
    $(window).scroll(function () {
        // sticky navbar on scroll script
        if (this.scrollY > 20) {
            $(".navbar").addClass("sticky");
        } else {
            $(".navbar").removeClass("sticky");
        }

        // scroll-up button show/hide script
        if (this.scrollY > 500) {
            $(".scroll-up-btn").addClass("show");
        } else {
            $(".scroll-up-btn").removeClass("show");
        }
    });

    // slide-up script
    $(".scroll-up-btn").click(function () {
        $("html").animate({ scrollTop: 0 });
        // removing smooth scroll on slide-up button click
        $("html").css("scrollBehavior", "auto");
    });

    $(".navbar .menu li a").click(function () {
        // applying again smooth scroll on menu items click
        $("html").css("scrollBehavior", "smooth");
    });

    // toggle menu/navbar script
    $(".menu-btn").click(function () {
        $(".navbar .menu").toggleClass("active");
        $(".menu-btn i").toggleClass("active");
    });

    // Vim help box toggle
    $(".vim-help-toggle").click(function () {
        $(".vim-help").toggleClass("hidden");

        // Save preference in localStorage
        const isHidden = $(".vim-help").hasClass("hidden");
        localStorage.setItem("vimHelpHidden", isHidden);
    });

    // Check localStorage for vim help visibility preference
    if (localStorage.getItem("vimHelpHidden") === "true") {
        $(".vim-help").addClass("hidden");
    }

    // typing text animation script
    var typedOptions = {
        strings: [
            "Software Engineer",
            "Full Stack Developer",
            "Problem Solver",
            "Tech Enthusiast",
        ],
        typeSpeed: 55,
        backSpeed: 35,
        loop: true,
    };

    var typed = new Typed(".typing", typedOptions);

    var typed2 = new Typed(".typing-2", {
        strings: [
            "Software Engineer",
            "Full Stack Developer",
            "Problem Solver",
            "Tech Enthusiast",
        ],
        typeSpeed: 500,
        backSpeed: 60,
        loop: true,
    });

    // owl carousel script
    $(".carousel").owlCarousel({
        margin: 20,
        loop: true,
        autoplay: true,
        autoplayTimeOut: 2000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
            },
            600: {
                items: 2,
                nav: false,
            },
            1000: {
                items: 3,
                nav: false,
            },
        },
    });

    // --- Tech Skills Animation ---
    // Animate skill bars when the section is in view
    function animateSkillBars() {
        const skillSection = document.getElementById('tech-skills');
        if (!skillSection) return;
        const bars = document.querySelectorAll('.skills .skills-content .column.right .bars .line');
        const sectionTop = skillSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        if (sectionTop < windowHeight - 100) {
            bars.forEach(bar => {
                bar.classList.add('animated');
            });
            window.removeEventListener('scroll', animateSkillBars);
        }
    }
    window.addEventListener('scroll', animateSkillBars);
    // Also trigger on load in case already in view
    animateSkillBars();

    // --- Timeline Animation ---
    // Animate timeline items when they come into view
    function animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        timelineItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            if (rect.top < windowHeight - 100) {
                item.classList.add('timeline-animate--visible');
            }
        });
    }
    window.addEventListener('scroll', animateTimeline);
    // Also trigger on load in case already in view
    animateTimeline();

    // --- Vim Navigation --- 
    const scrollAmount = 700; // Increased from 100 to 250 pixels for faster scrolling
    const ggTimeout = 500; // Milliseconds for gg detection
    let lastKeyPressTime = 0;
    let lastKey = '';
    let colonPressed = false; // Track if : was pressed

    $(document).on('keydown', function (event) {
        // Ignore keypresses in input fields, textareas, etc.
        const targetTagName = event.target.tagName.toLowerCase();
        const isContentEditable = event.target.isContentEditable;

        if (targetTagName === 'input' || targetTagName === 'textarea' || isContentEditable) {
            // If it's 'g', reset lastKey to prevent accidental 'gg' after typing 'g' in an input
            if (event.key === 'g') {
                lastKey = '';
            }
            colonPressed = false; // Reset colon state
            return; // Don't interfere with typing
        }

        const now = Date.now();

        // Handle :q command sequence
        if (event.key === ':') {
            colonPressed = true;
            event.preventDefault();
            return;
        }

        if (colonPressed && event.key === 'q') {
            // Show confirmation before closing
            if (confirm('Do you want to exit this website?')) {
                window.close(); // Try to close the window

                // If window.close() doesn't work (which is common in many browsers)
                // Redirect to a blank page or another site as fallback
                if (window.location.href) {
                    window.location.href = 'about:blank';
                }
            }
            colonPressed = false; // Reset regardless of user's choice
            event.preventDefault();
            return;
        }

        // Reset colon state if any other key is pressed after :
        if (colonPressed && event.key !== 'q') {
            colonPressed = false;
        }

        switch (event.key) {
            case 'j':
                // Use direct scrolling for immediate response rather than smooth scrolling
                window.scrollBy({
                    top: scrollAmount,
                    behavior: 'auto'
                });
                lastKey = ''; // Reset gg sequence
                break;
            case 'k':
                window.scrollBy({
                    top: -scrollAmount,
                    behavior: 'auto'
                });
                lastKey = ''; // Reset gg sequence
                break;
            case 'g':
                if (lastKey === 'g' && (now - lastKeyPressTime < ggTimeout)) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'auto' // Changed from 'smooth' to 'auto' for faster response
                    });
                    lastKey = ''; // Reset after successful gg
                } else {
                    lastKey = 'g';
                    lastKeyPressTime = now;
                }
                break;
            case 'G': // Shift + g
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'auto' // Changed from 'smooth' to 'auto'
                });
                lastKey = ''; // Reset gg sequence
                break;
            case '?': // Show/hide vim help with ? key
                $(".vim-help").toggleClass("hidden");
                lastKey = ''; // Reset gg sequence
                break;
            default:
                // Any other key resets the potential gg sequence
                lastKey = '';
                break;
        }

        // Prevent default browser behavior for handled keys
        if ([':', 'j', 'k', 'g', 'G', '?'].includes(event.key) && !isContentEditable && targetTagName !== 'input' && targetTagName !== 'textarea') {
            event.preventDefault();
        }
    });

    // Reset state variables if the window loses focus
    $(window).on('blur', function () {
        lastKey = '';
        lastKeyPressTime = 0;
        colonPressed = false;
    });
    // --- End Vim Navigation --- 
if (typeof gsap !== 'undefined') {
        gsap.set(".ball", { xPercent: -50, yPercent: -50 });

        const ball = document.querySelector(".ball");
        // Initialize position slightly off-screen or at center until first move
        const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        const mouse = { x: pos.x, y: pos.y };
        const speed = 0.08; // Adjust speed for desired follow delay (lower = slower)

        const xSet = gsap.quickSetter(ball, "x", "px");
        const ySet = gsap.quickSetter(ball, "y", "px");

        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX; // Use clientX/clientY for viewport coordinates
            mouse.y = e.clientY;
        });

        gsap.ticker.add(() => {
            // Adjust speed based on deltaTime for smoother animation
            const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

            pos.x += (mouse.x - pos.x) * dt;
            pos.y += (mouse.y - pos.y) * dt;

            xSet(pos.x);
            ySet(pos.y);
        });

        // Optional: Hide cursor when hovering over links/buttons if desired
        // Select interactive elements
        const interactiveElements = document.querySelectorAll('a, button, kbd, .menu-btn, .vim-help-toggle, .scroll-up-btn');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(ball, { duration: 0.2, scale: 1.3, autoAlpha: 0.7 }); // Example: Grow slightly
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(ball, { duration: 0.2, scale: 1, autoAlpha: 1 }); // Return to normal
            });
        });

    } else {
        console.error("GSAP library not loaded. Mouse trail effect requires GSAP.");
    }
});
