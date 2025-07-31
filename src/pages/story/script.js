// Global variables
let scrollY = 0;
let ticking = false;

// DOM elements
const navbar = document.getElementById('navbar');
const parallaxElements = document.querySelectorAll('.parallax-text');
const alphaItems = document.querySelectorAll('.alpha-item');
const floatingElements = document.querySelectorAll('.floating-element');
const bg3DElements = document.querySelectorAll('.bg-3d-element');
const storyText = `
    "The Last Alpha: Rise of the Forgotten Flame"

Episode 1: Ashes of the Hunt
Mid 16th Century – The Wildlands of Eredwyn

The fire crackled under the starlit sky, sending sparks dancing into the void. Around it, the hunters from the village of Kaelor sat in silence, waiting for their leader to speak. Standing tall, cloaked in bear-hide and marked with ancient tribal ink, was Kael, the Alpha of Kaelor.

His presence was not made of brute strength alone, but of something deeper—Leadership. A power older than swords and bows. When he spoke, men listened. When he stood, others followed. Kael didn’t need to command. He inspired.

For three days, Kael led his best men deep into the heart of the Frostgrove Forest in pursuit of the Iron-tusk boar, a creature of myth and meat. It was meant to be a simple hunt, a gift for the festival of the Moonfire. But fate had darker plans.

They returned on the fourth day, just as the morning fog lifted from the valley—and what they saw shattered them.

Kaelor was gone.

Black smoke still curled into the sky. Houses were charred husks. Bodies, unburied. No birds sang. The wind carried only the scent of death and ash.

Kael dropped to his knees, his eyes wide. His warriors spread out, calling names that would never be answered.

On a scorched stone near the ruined village gate, painted in the blood of the fallen, was a sigil: a serpent with seven heads.

The Hydra.

Kael’s fists clenched. He had heard of them—a ruthless horde of merciless hunters, spread like a disease across the northern lands. They killed not for survival, but for sport. For coin. For blood.

His mind screamed. I should have been here. I should have protected them.

He stumbled to what remained of the village hall. There, on the steps, lay the old council elder, breath ragged but still alive. With trembling lips, the elder whispered, “They asked for our Alpha. For you.”

Kael closed the old man’s eyes as the last breath escaped. Guilt crushed him. His power had always been to lead and protect. And now… there was no one left to lead.

The sun dipped below the hills. The world turned cold.

Kael stood alone in the ruins, staring at the distant mountains where the Hydra vanished. A storm brewed behind his eyes—not of sorrow, but of resolve.

Then came a voice—not from man, nor wind—but from something ancient. Echoing in the space around him. Soft, yet powerful.

"Are there any other Alphas… like you?"

Kael turned slowly, as though expecting to see someone behind him—but the ruins were empty.

And yet, he knew. The hunt was not over.

It had just begun.

`;


// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderStoryText();
    setupNavigation();
    setupParallax();
    setupScrollAnimations();
    setupGlowText();
    setup3DElements();
    setupResponsiveMenu();
    setupSmoothScrolling();
    setupScrollHighlightingPolished();
}

// Navigation functionality
function setupNavigation() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Parallax effects
function setupParallax() {
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
        requestTick();
    });
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

function updateParallax() {
    // Parallax for hero text elements
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    // Parallax for floating elements
    floatingElements.forEach((element, index) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = scrollY * speed;
        const rotation = scrollY * 0.1 + (index * 45);
        element.style.transform = `translateY(${yPos}px) rotateX(${45 + rotation}deg) rotateY(${45 + rotation}deg)`;
    });
    
    ticking = false;
}

// Scroll animations for alpha items
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for alpha features
                const features = entry.target.querySelectorAll('.feature');
                features.forEach((feature, index) => {
                    setTimeout(() => {
                        feature.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    alphaItems.forEach(item => {
        observer.observe(item);
    });
}

// render teh stroy of seven alpha 
function renderStoryText() {
    const container = document.querySelector('.story-text-container');

    if (!container) return;

    const paragraph = document.createElement('p');
    paragraph.className = 'story-text glow-text';

    const words = storyText.trim().split(/\s+/); // split by spaces
    words.forEach(word => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        paragraph.appendChild(span);
        paragraph.appendChild(document.createTextNode(' ')); // preserve space
    });

    container.innerHTML = ''; // clear existing content
    container.appendChild(paragraph);
}

// Glow text effects
function setupGlowText() {
    const glowTextElements = document.querySelectorAll('.glow-text');
    
    glowTextElements.forEach(textElement => {
        const words = textElement.querySelectorAll('.word');
        
        words.forEach(word => {
            word.addEventListener('mouseenter', () => {
                // Add ripple effect
                createRippleEffect(word);
            });
            
            word.addEventListener('mouseleave', () => {
                // Remove any existing ripples after animation
                setTimeout(() => {
                    const ripples = word.querySelectorAll('.ripple');
                    ripples.forEach(ripple => ripple.remove());
                }, 600);
            });
        });
    });
}

function createRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        margin-top: -50px;
        margin-left: -50px;
        z-index: 5;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
}

// 3D elements setup
function setup3DElements() {
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        bg3DElements.forEach((element, index) => {
            const rotation = scrollPercent * 360 + (index * 45);
            const scale = 1 + Math.sin(scrollPercent * Math.PI * 2) * 0.1;
            
            element.style.transform = `
                rotateX(${45 + rotation}deg) 
                rotateY(${45 + rotation}deg) 
                rotateZ(${rotation}deg)
                scale(${scale})
            `;
        });
    });
    
    // Mouse interaction with 3D elements
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        floatingElements.forEach((element, index) => {
            const intensity = 10 + (index * 5);
            const xRotation = mouseY * intensity;
            const yRotation = mouseX * intensity;
            
            element.style.transform += ` rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
        });
    });
}

// Responsive menu
function setupResponsiveMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .cta-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Advanced animations for scroll
function setupAdvancedScrollAnimations() {
    const timeline = {
        elements: [],
        add: function(element, animation, trigger) {
            this.elements.push({ element, animation, trigger });
        },
        update: function(scrollY) {
            this.elements.forEach(item => {
                if (scrollY >= item.trigger) {
                    item.animation();
                }
            });
        }
    };
    
    // Add alpha items to timeline
    alphaItems.forEach((item, index) => {
        const trigger = item.offsetTop - window.innerHeight * 0.7;
        
        timeline.add(item, () => {
            item.style.animation = `fadeInUp 0.8s ease forwards`;
            item.style.animationDelay = `${index * 0.1}s`;
        }, trigger);
    });
    
    window.addEventListener('scroll', () => {
        timeline.update(window.scrollY);
    });
}

// Performance optimization
function optimizePerformance() {
    // Throttle scroll events
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            updateParallax();
        }, 16); // ~60fps
    }, { passive: true });
}

// Initialize performance optimizations
optimizePerformance();

// CSS animations for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .ripple {
        animation: ripple 0.6s linear;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements on load
    const heroWords = document.querySelectorAll('.hero-title .word');
    heroWords.forEach((word, index) => {
        setTimeout(() => {
            word.style.animation = 'fadeInUp 1s ease forwards';
        }, index * 200);
    });
});

// Intersection Observer for better performance
const createObserver = (callback, options = {}) => {
    const defaultOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Initialize advanced features
document.addEventListener('DOMContentLoaded', () => {
    setupAdvancedScrollAnimations();
    
    // Add custom cursor for luxury feel
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .word, .feature');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
});

function setupScrollHighlightingPolished() {
    const storySection = document.querySelector('#story');
    const words = storySection.querySelectorAll('.word');
    let ticking = false;

    // Cache the section offset once
    const sectionTop = storySection.offsetTop;

    function updateWordHighlights() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const triggerY = scrollY + windowHeight * 0.25;

        const sectionHeight = storySection.offsetHeight;

        const scrolledInto = triggerY - sectionTop;
        const progress = Math.min(Math.max(scrolledInto / sectionHeight, 0), 1);

        // Smooth out the progress using ease-out
        const easedProgress = Math.pow(progress, 0.8);

        const wordsToHighlight = Math.floor(easedProgress * words.length);

        words.forEach((word, index) => {
            if (index < wordsToHighlight) {
                if (!word.classList.contains('highlight')) {
                    word.classList.add('highlight');
                    word.style.transitionDelay = `${index * 8}ms`;
                }
            } else {
                word.classList.remove('highlight');
                word.style.transitionDelay = `0ms`;
            }
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateWordHighlights);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll);
    updateWordHighlights();
}




