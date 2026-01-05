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
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
});
