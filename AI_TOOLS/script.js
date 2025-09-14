// AI Tools Hub - Pure JavaScript Implementation

class AIToolsHub {
  constructor() {
    this.isDark = true;
    this.stars = [];
    this.init();
  }

  init() {
    this.initThemeToggle();
    this.createStars();
    this.initAnimations();
    this.handleResize();
  }

  // Theme Toggle Functionality
  initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    const body = document.body;
    
    if (this.isDark) {
      body.classList.remove('light');
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }

  // Falling Stars Animation
  createStars() {
    const starsContainer = document.getElementById('starsContainer');
    const starCount = 50;
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    this.stars = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      const starData = {
        element: star,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5
      };

      star.style.left = `${starData.left}%`;
      star.style.width = `${starData.size}px`;
      star.style.height = `${starData.size}px`;
      star.style.animationDuration = `${starData.duration}s`;
      star.style.animationDelay = `${starData.delay}s`;

      starsContainer.appendChild(star);
      this.stars.push(starData);
    }
  }

  // Initialize scroll-triggered animations
  initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.dataset.delay || 0;
          
          setTimeout(() => {
            element.style.animationPlayState = 'running';
            element.style.opacity = '1';
          }, delay * 1000);
          
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // Handle window resize
  handleResize() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.createStars();
      }, 250);
    });
  }

  // Magnetic effect for cards
  initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.magnetic');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const intensity = 0.3;
        const rotateX = (y / rect.height) * intensity;
        const rotateY = -(x / rect.width) * intensity;
        
        element.style.transform = `
          scale(1.05) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          translateZ(0)
        `;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1) rotateX(0) rotateY(0)';
      });
    });
  }

  // Smooth scroll for internal links
  initSmoothScroll() {
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

  // Parallax effect for background elements
  initParallax() {
    const parallaxElements = document.querySelectorAll('.bg-orb');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.2;
        element.style.transform = `translateY(${rate * speed}px)`;
      });
    });
  }

  // Performance optimization: throttle scroll events
  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Add keyboard navigation support
  initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key to close modals or reset animations
      if (e.key === 'Escape') {
        // Reset any active animations or states
        document.querySelectorAll('.tool-card').forEach(card => {
          card.style.transform = '';
        });
      }
      
      // Space or Enter to activate focused buttons
      if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('launch-btn')) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  // Add loading states and error handling
  initErrorHandling() {
    // Handle image loading errors
    document.querySelectorAll('.tool-image').forEach(img => {
      img.addEventListener('error', () => {
        img.style.background = 'linear-gradient(135deg, hsl(263, 70%, 50%) 0%, hsl(292, 84%, 61%) 100%)';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.innerHTML = '<span style="color: white; font-size: 2rem;">🤖</span>';
      });
    });

    // Handle network errors for external links
    document.querySelectorAll('.launch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Add visual feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
          btn.style.transform = '';
        }, 150);
      });
    });
  }

  // Initialize all features
  start() {
    // Add slight delay to ensure DOM is fully loaded
    setTimeout(() => {
      this.initMagneticEffect();
      this.initSmoothScroll();
      this.initParallax();
      this.initKeyboardNavigation();
      this.initErrorHandling();
    }, 100);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new AIToolsHub();
  app.start();
});

// Add some additional interactive features
document.addEventListener('DOMContentLoaded', () => {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.launch-btn, .theme-toggle');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add CSS for ripple effect
  const style = document.createElement('style');
  style.textContent = `
    .launch-btn, .theme-toggle {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});