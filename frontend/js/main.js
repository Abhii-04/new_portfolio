// Grid Animation Configuration
const GRID_CONFIG = {
  size: 40,
  numSquares: 25,
  maxOpacity: 0.15,
  duration: 3000,
  repeatDelay: 1000
};

// Meteor Configuration
const METEOR_CONFIG = {
  count: 3,
  minDelay: 2000,
  maxDelay: 8000,
  duration: 2000
};

// Initialize Page Grid Background
function initPageGridBackground() {
  const gridBg = document.querySelector('.page-grid-background');
  if (!gridBg) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('aria-hidden', 'true');
  
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  pattern.setAttribute('id', 'page-grid-pattern');
  pattern.setAttribute('width', GRID_CONFIG.size);
  pattern.setAttribute('height', GRID_CONFIG.size);
  pattern.setAttribute('patternUnits', 'userSpaceOnUse');
  
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M0.5 ${GRID_CONFIG.size}V0.5H${GRID_CONFIG.size}`);
  path.setAttribute('fill', 'none');
  
  pattern.appendChild(path);
  defs.appendChild(pattern);
  svg.appendChild(defs);
  
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', '100%');
  rect.setAttribute('height', '100%');
  rect.setAttribute('fill', 'url(#page-grid-pattern)');
  svg.appendChild(rect);
  
  const squaresGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  svg.appendChild(squaresGroup);
  
  gridBg.appendChild(svg);
  
  // Animate grid squares
  let width = window.innerWidth;
  let height = document.body.scrollHeight;
  
  const observer = new ResizeObserver(() => {
    width = window.innerWidth;
    height = document.body.scrollHeight;
  });
  observer.observe(document.body);
  
  function getRandomPos() {
    return {
      x: Math.floor(Math.random() * width / GRID_CONFIG.size),
      y: Math.floor(Math.random() * height / GRID_CONFIG.size)
    };
  }
  
  function animateSquare(rect) {
    rect.style.opacity = GRID_CONFIG.maxOpacity;
    
    setTimeout(() => {
      rect.style.opacity = 0;
      
      setTimeout(() => {
        const { x, y } = getRandomPos();
        rect.setAttribute('x', x * GRID_CONFIG.size + 1);
        rect.setAttribute('y', y * GRID_CONFIG.size + 1);
        animateSquare(rect);
      }, GRID_CONFIG.repeatDelay);
    }, GRID_CONFIG.duration);
  }
  
  function createSquare(delay) {
    const { x, y } = getRandomPos();
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    
    rect.setAttribute('width', GRID_CONFIG.size - 1);
    rect.setAttribute('height', GRID_CONFIG.size - 1);
    rect.setAttribute('x', x * GRID_CONFIG.size + 1);
    rect.setAttribute('y', y * GRID_CONFIG.size + 1);
    rect.style.fill = getComputedStyle(document.documentElement).getPropertyValue('--grid-square-color');
    rect.style.opacity = 0;
    rect.style.transition = `opacity ${GRID_CONFIG.duration}ms ease`;
    
    squaresGroup.appendChild(rect);
    
    setTimeout(() => animateSquare(rect), delay);
  }
  
  for (let i = 0; i < GRID_CONFIG.numSquares; i++) {
    createSquare(i * 100);
  }
}

// Initialize Meteor Effect for individual sections
function initMeteorEffect(container) {
  const meteorContainer = container.querySelector('.meteor-container');
  if (!meteorContainer) return;
  
  function createMeteor() {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    const startX = Math.random() * 100;
    const startY = Math.random() * 50;
    
    meteor.style.left = `${startX}%`;
    meteor.style.top = `${startY}%`;
    meteor.style.animation = `meteor-fall ${METEOR_CONFIG.duration}ms linear`;
    
    meteorContainer.appendChild(meteor);
    
    setTimeout(() => {
      meteor.remove();
    }, METEOR_CONFIG.duration);
  }
  
  function scheduleMeteor() {
    createMeteor();
    const delay = METEOR_CONFIG.minDelay + Math.random() * (METEOR_CONFIG.maxDelay - METEOR_CONFIG.minDelay);
    setTimeout(scheduleMeteor, delay);
  }
  
  for (let i = 0; i < METEOR_CONFIG.count; i++) {
    setTimeout(scheduleMeteor, i * 1000);
  }
}

// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    html.classList.add('dark');
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    html.classList.toggle('dark');
    
    // Save preference to localStorage
    if (html.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Initialize page-level grid background
  initPageGridBackground();
  
  // Initialize meteors for individual sections
  const sections = document.querySelectorAll('.hero, .skills-section, .about-section, .experience-section, .projects-section, .education-section, .achievements-section, .links-section');
  sections.forEach(section => {
    initMeteorEffect(section);
  });
  
  // Smooth scroll for anchor links with offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 90;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Add scroll reveal animation for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all major sections
  document.querySelectorAll('.hero, .skills-section, .about-section, .experience-section, .projects-section, .education-section, .achievements-section, .links-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Add parallax effect to hero background
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
      const scrolled = window.pageYOffset;
      const heroTop = hero.offsetTop;
      const heroHeight = hero.offsetHeight;
      
      if (scrolled < heroTop + heroHeight) {
        const parallaxSpeed = 0.3;
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    }
  });
});
