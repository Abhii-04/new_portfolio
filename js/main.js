// Grid Animation Configuration
const GRID_CONFIG = {
  size: 40,
  numSquares: 25,
  maxOpacity: 0.15,
  duration: 3000,
  repeatDelay: 1000
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

function initExperienceToggles() {
  document.querySelectorAll('.experience-toggle').forEach(toggle => {
    const item = toggle.closest('.experience-item');
    if (!item) return;

    toggle.addEventListener('click', () => {
      const isCollapsed = item.classList.toggle('is-collapsed');
      toggle.setAttribute('aria-expanded', String(!isCollapsed));
    });
  });
}

const GITHUB_PROJECTS_URL = 'https://api.github.com/users/Abhii-04/repos?per_page=100&sort=updated&type=owner';

function createProjectCard(repo) {
  const article = document.createElement('article');
  article.className = 'project-card';

  const body = document.createElement('div');
  body.className = 'project-card-body';

  const top = document.createElement('div');
  top.className = 'project-card-top';

  const titleWrap = document.createElement('div');
  titleWrap.className = 'project-title-wrap';

  const mark = document.createElement('div');
  mark.className = 'project-repo-mark';
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = repo.name.slice(0, 2).toUpperCase();

  const title = document.createElement('h3');
  title.className = 'project-card-title';
  title.textContent = repo.name;

  titleWrap.append(mark, title);

  const links = document.createElement('div');
  links.className = 'project-card-links';

  if (repo.homepage) {
    const homepage = document.createElement('a');
    homepage.href = repo.homepage;
    homepage.target = '_blank';
    homepage.rel = 'noreferrer';
    homepage.className = 'project-circle-btn';
    homepage.setAttribute('aria-label', `Open ${repo.name} live site`);
    homepage.innerHTML = '<i class="fa-solid fa-globe"></i>';
    links.appendChild(homepage);
  }

  const github = document.createElement('a');
  github.href = repo.html_url;
  github.target = '_blank';
  github.rel = 'noreferrer';
  github.className = 'project-circle-btn';
  github.setAttribute('aria-label', `Open ${repo.name} on GitHub`);
  github.innerHTML = '<i class="fa-brands fa-github"></i>';
  links.appendChild(github);

  top.append(titleWrap, links);

  const description = document.createElement('p');
  description.className = 'project-card-description';
  description.textContent = repo.description || 'No GitHub description provided.';

  body.append(top, description);
  article.appendChild(body);

  return article;
}

async function initGitHubProjects() {
  const grid = document.querySelector('#github-projects');
  if (!grid) return;

  try {
    const response = await fetch(GITHUB_PROJECTS_URL, {
      headers: {
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}`);
    }

    const repos = await response.json();
    const projects = repos.filter(repo => (
      !repo.fork &&
      !repo.archived &&
      repo.size > 0 &&
      repo.name !== 'Abhii-04'
    )).slice(0, 4);

    grid.replaceChildren(...projects.map(createProjectCard));
  } catch (error) {
    grid.replaceChildren();

    const message = document.createElement('p');
    message.className = 'projects-loading projects-error';
    message.textContent = 'Could not load GitHub projects right now. Visit GitHub for the current repository list.';

    const link = document.createElement('a');
    link.href = 'https://github.com/Abhii-04?tab=repositories';
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = 'Open GitHub repositories';

    message.append(' ', link);
    grid.appendChild(message);

    console.error(error);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize page-level grid background
  initPageGridBackground();
  initExperienceToggles();
  initGitHubProjects();
  
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
  document.querySelectorAll('.hero, .skills-section, .experience-section, .projects-section, .education-section, .links-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

});
