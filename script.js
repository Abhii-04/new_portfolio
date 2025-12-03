// Wait until lucide is available; the script tag in HTML loads lucide before this file
// Init Icons
if (typeof lucide !== 'undefined') lucide.createIcons();

// --- Project Data ---
const allProjects = [
    { id: 1, title: "Interior CRM", desc: "Full-stack CRM with Auth & Admin dashboards, supporting CRUD operations aligned with accounting workflows.", link: "https://interior-design-website-e8u9.onrender.com", tags: ["FLASK", "POSTGRES"], icon: "external-link", span: 2 },
    { id: 2, title: "Forencify", desc: "Unified dashboard integrating fragmented data across social media sources using advanced parsing techniques.", link: "https://github.com/Abhii-04/Forencify", tags: ["DATA_PARSING", "FLASK"], icon: "database", span: 2 },
    { id: 3, title: "CPU Compiler", desc: "Custom compiler translating high-level language to CPU bytecode using LLVM concepts and optimization.", link: "https://github.com/Abhii-04/Custom-CPU-Compiler", tags: ["C++", "LLVM", "SYSTEMS"], icon: "cpu", span: 2 },

    { id: 4, title: "Mobile Finance App", desc: "Cross-platform personal finance tracker built with Flutter and Riverpod for robust state management.", link: "#", tags: ["FLUTTER", "DART", "FIREBASE"], icon: "smartphone", span: 2 },
    { id: 5, title: "TypeScript ORM CLI", desc: "A Command Line Interface tool for generating database migrations using a custom TypeScript ORM layer.", link: "#", tags: ["TYPESCRIPT", "NODEJS", "ORM"], icon: "git-fork", span: 2 },
    { id: 6, title: "SaaS Template V3", desc: "A reusable Next.js 14 template featuring dark mode, authentication (Clerk), and payment integration (Stripe).", link: "#", tags: ["NEXTJS", "REACT", "TAILWIND"], icon: "box", span: 3 },
    { id: 7, title: "Dockerized ML API", desc: "Machine Learning inference API endpoint wrapped in a minimal Flask application and deployed via Docker.", link: "#", tags: ["DOCKER", "PYTHON", "ML"], icon: "server", span: 3 },
    { id: 8, title: "Custom WebGL Renderer", desc: "Basic 3D scene renderer implemented from scratch using WebGL and pure JavaScript for high performance.", link: "#", tags: ["WEBGL", "JAVASCRIPT", "3D"], icon: "square-stack", span: 2 },
    { id: 9, title: "Real-time Chat App", desc: "Real-time messaging platform using React, WebSockets, and a fast Go backend for low latency communication.", link: "#", tags: ["REACT", "WEBSOCKETS", "GOLANG"], icon: "message-circle", span: 2 },
    { id: 10, title: "Advanced Sorting Visualizer", desc: "Interactive tool to visualize various sorting algorithms (QuickSort, MergeSort) written in pure JavaScript.", link: "#", tags: ["JS", "ALGORITHMS", "VISUALS"], icon: "layout-list", span: 2 }
];

const INITIAL_PROJECT_COUNT = 3;
let visibleProjectCount = INITIAL_PROJECT_COUNT;

// Function to create a single project card HTML string
function createProjectCard(project) {
    const tagHtml = project.tags.map(tag =>
        `<span class="text-tech-grey">#${tag}</span>`
    ).join(' ');

    // Note: using template literal to inject span value (tailwind grid class)
    return `
        <div class="neo-brutal-card col-span-1 md:col-span-2 lg:col-span-${project.span} p-0 group">
            <div class="p-6 h-full flex flex-col relative z-20 bg-[#111]">
                <div class="flex justify-between items-center mb-4 border-b border-border group-hover:border-tech-grey pb-2">
                    <span class="font-mono text-xs text-tech-grey border border-tech-grey px-1">PROJECT_${String(project.id).padStart(2, '0')}</span>
                    <a href="${project.link}" target="_blank" class="hover:text-tech-grey">
                        <i data-lucide="${project.icon}" class="w-5 h-5 ${project.icon === 'external-link' ? 'text-tech-grey' : 'text-gray-600'} group-hover:text-tech-grey"></i>
                    </a>
                </div>
                <h3 class="text-2xl font-bold font-sans mb-2 group-hover:text-tech-grey transition-colors glitch-text-hover">${project.title}</h3>
                <p class="text-gray-400 text-sm font-mono mb-4 flex-grow">
                    ${project.desc}
                </p>
                <div class="flex gap-2 text-xs font-mono text-gray-500 mt-auto pt-2 border-t border-border">
                    ${tagHtml}
                </div>
            </div>
        </div>
    `;
}

// Function to render projects
function renderProjects() {
    const container = document.getElementById('projects-container');
    const viewMoreButton = document.getElementById('view-more-button');
    const showLessButton = document.getElementById('show-less-button');
    const githubLinkFinal = document.getElementById('github-link-final');

    // Clear existing projects
    container.innerHTML = '';

    // Determine how many projects to display
    const projectsToShow = allProjects.slice(0, visibleProjectCount);

    projectsToShow.forEach(project => {
        const cardHtml = createProjectCard(project);
        container.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Re-init lucide icons for newly injected content
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Update button visibility and text
    if (visibleProjectCount < allProjects.length) {
        const remaining = allProjects.length - visibleProjectCount;
        viewMoreButton.style.display = 'flex';
        viewMoreButton.textContent = `VIEW_MORE_DATA (${remaining} PROJECTS REMAINING)`;
        showLessButton.style.display = 'none';
        githubLinkFinal.style.display = 'none';
    } else {
        viewMoreButton.style.display = 'none';
        githubLinkFinal.style.display = 'flex';
        if (allProjects.length > INITIAL_PROJECT_COUNT) {
            showLessButton.style.display = 'flex';
        } else {
            showLessButton.style.display = 'none';
        }
    }
}

// "View More" click
function loadMoreProjects() {
    visibleProjectCount = allProjects.length;
    renderProjects();
}

// "Show Less" click
function showLessProjects() {
    visibleProjectCount = INITIAL_PROJECT_COUNT;
    renderProjects();
    document.getElementById('projects-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Clock
function updateClock() {
    const now = new Date();
    const el = document.getElementById('clock');
    if (el) el.innerText = now.toLocaleTimeString('en-US', { hour12: false });
}

// Custom Cursor Interaction (light follow)
function initCardHoverEffect() {
    document.querySelectorAll('.neo-brutal-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', `50%`);
            card.style.setProperty('--mouse-y', `50%`);
        });
    });
}

// Initialization on Load
window.onload = function () {
    // Clock
    setInterval(updateClock, 1000);
    updateClock();
    // Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Projects + Hover
    renderProjects();
    initCardHoverEffect();

    // Ensure icons created after everything else
    if (typeof lucide !== 'undefined') lucide.createIcons();
};
