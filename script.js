// Replace the entire script.js with this file

// Wait until lucide is available; the script tag in HTML loads lucide before this file
if (typeof lucide !== 'undefined') lucide.createIcons();

// --- Configuration ---
const GITHUB_USER = 'Abhii-04';            // GitHub username to fetch repos from
const GITHUB_PER_PAGE = 100;               // how many repos to request (max 100 per page)
const MAX_FETCHED_PROJECTS = 10;           // how many GitHub repos to show (after the 3 hardcoded ones)
const INITIAL_PROJECT_COUNT = 3;           // show these 3 (resume projects) initially

// --- Hardcoded (resume) projects — these come first and are guaranteed to be shown ---
const hardcodedProjects = [
    {
        id: 1,
        title: "Interior CRM",
        desc: "Full-stack CRM with Auth & Admin dashboards, supporting CRUD operations aligned with accounting workflows.",
        link: "https://interior-design-website-e8u9.onrender.com",
        tags: ["FLASK", "POSTGRES"],
        icon: "external-link",
        span: 2,
        repoNameMatch: "interior" // used for dedupe against GitHub results
    },
    {
        id: 2,
        title: "Forencify",
        desc: "Unified dashboard integrating fragmented data across social media sources using advanced parsing techniques.",
        link: "https://github.com/Abhii-04/Forencify",
        tags: ["DATA_PARSING", "FLASK"],
        icon: "database",
        span: 2,
        repoNameMatch: "forencify"
    },
    {
        id: 3,
        title: "Custom CPU Compiler",
        desc: "Custom compiler translating high-level language to CPU bytecode using LLVM concepts and optimization.",
        link: "https://github.com/Abhii-04/Custom-CPU-Compiler",
        tags: ["C++", "LLVM", "SYSTEMS"],
        icon: "cpu",
        span: 2,
        repoNameMatch: "compiler"
    }
];

// Will hold the final combined list (hardcoded + fetched)
let allProjects = [...hardcodedProjects];

// Visible project count states
let visibleProjectCount = INITIAL_PROJECT_COUNT;

// Utility: sanitize repo name to compare
function normalizeName(n) {
    if (!n) return '';
    return String(n).toLowerCase().replace(/[\s\-_]+/g, '');
}

// Create project card HTML
function createProjectCard(project) {
    const tagHtml = (project.tags || []).map(tag =>
        `<span class="text-tech-grey">#${tag}</span>`
    ).join(' ');

    return `
        <div class="neo-brutal-card col-span-1 md:col-span-2 lg:col-span-${project.span || 2} p-0 group">
            <div class="p-6 h-full flex flex-col relative z-20 bg-[#111]">
                <div class="flex justify-between items-center mb-4 border-b border-border group-hover:border-tech-grey pb-2">
                    <span class="font-mono text-xs text-tech-grey border border-tech-grey px-1">PROJECT_${String(project.id).padStart(2, '0')}</span>
                    <a href="${project.link}" target="_blank" class="hover:text-tech-grey" rel="noopener noreferrer">
                        <i data-lucide="${project.icon || 'external-link'}" class="w-5 h-5 ${project.icon === 'external-link' ? 'text-tech-grey' : 'text-gray-600'} group-hover:text-tech-grey"></i>
                    </a>
                </div>
                <h3 class="text-2xl font-bold font-sans mb-2 group-hover:text-tech-grey transition-colors glitch-text-hover">${escapeHtml(project.title)}</h3>
                <p class="text-gray-400 text-sm font-mono mb-4 flex-grow">
                    ${escapeHtml(project.desc || '')}
                </p>
                <div class="flex gap-2 text-xs font-mono text-gray-500 mt-auto pt-2 border-t border-border">
                    ${tagHtml}
                </div>
            </div>
        </div>
    `;
}

// Render projects into DOM
function renderProjects() {
    const container = document.getElementById('projects-container');
    const viewMoreButton = document.getElementById('view-more-button');
    const showLessButton = document.getElementById('show-less-button');
    const githubLinkFinal = document.getElementById('github-link-final');

    if (!container) return;

    container.innerHTML = '';

    // slice visible items
    const projectsToShow = allProjects.slice(0, visibleProjectCount);

    projectsToShow.forEach(project => {
        const cardHtml = createProjectCard(project);
        container.insertAdjacentHTML('beforeend', cardHtml);
    });

    // Re-init lucide icons for newly injected content
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Buttons logic
    if (visibleProjectCount < allProjects.length) {
        const remaining = allProjects.length - visibleProjectCount;
        viewMoreButton.style.display = 'flex';
        viewMoreButton.textContent = `VIEW_MORE_DATA (${remaining} PROJECTS REMAINING)`;
        showLessButton.style.display = 'none';
        githubLinkFinal.style.display = 'none';
    } else {
        viewMoreButton.style.display = 'none';
        githubLinkFinal.style.display = 'flex';
        githubLinkFinal.href = `https://github.com/${GITHUB_USER}`;
        if (allProjects.length > INITIAL_PROJECT_COUNT) {
            showLessButton.style.display = 'flex';
        } else {
            showLessButton.style.display = 'none';
        }
    }

    initCardHoverEffect(); // ensure hover effect binds to newly created cards
}

// VIEW MORE / SHOW LESS
function loadMoreProjects() {
    visibleProjectCount = allProjects.length;
    renderProjects();
}

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

// Mouse-follow effect for cards
function initCardHoverEffect() {
    document.querySelectorAll('.neo-brutal-card').forEach(card => {
        card.removeEventListener('mousemove', handleCardMouse); // remove duplicates
        card.addEventListener('mousemove', handleCardMouse);
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--mouse-x', `50%`);
            card.style.setProperty('--mouse-y', `50%`);
        });
    });

    function handleCardMouse(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    }
}

// Escape text to avoid HTML injection
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// --- GitHub fetch flow ---
// Convert GitHub repo to our project format
function repoToProject(repo, idOffset) {
    return {
        id: idOffset,
        title: repo.name,
        desc: repo.description || 'No description',
        link: repo.html_url,
        tags: inferTagsFromRepo(repo),
        icon: 'github',
        span: 2,
        repoNameMatch: normalizeName(repo.name)
    };
}

// Infer small tags from repo topics/language
function inferTagsFromRepo(repo) {
    const tags = [];
    if (repo.language) tags.push(repo.language.toUpperCase());
    if (repo.topics && repo.topics.length) {
        repo.topics.slice(0, 3).forEach(t => tags.push(String(t).toUpperCase()));
    }
    // fallback: simple heuristics on name
    const name = (repo.name || '').toLowerCase();
    if (name.includes('cli') || name.includes('tool')) tags.push('CLI');
    if (name.includes('api')) tags.push('API');
    return tags.length ? tags : ['OPEN_SOURCE'];
}

// Fetch public repos from GitHub and append to allProjects (after hardcoded ones)
async function fetchAndAppendGitHubRepos() {
    const apiUrl = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=${GITHUB_PER_PAGE}&sort=pushed`;

    try {
        const resp = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github.v3+json' } });
        if (!resp.ok) {
            console.warn('GitHub API returned non-OK status', resp.status);
            showGithubFetchError(resp.status);
            return;
        }
        const repos = await resp.json();

        // Filter — remove forks & private & repos with no name
        const filtered = repos.filter(r => !r.fork && r.name);

        // Deduplicate: exclude names similar to hardcoded projects
        const existingNames = new Set(hardcodedProjects.map(p => normalizeName(p.repoNameMatch || p.title)));
        const deduped = filtered.filter(r => {
            const n = normalizeName(r.name);
            if (existingNames.has(n)) return false; // skip match with hardcoded
            return true;
        });

        // Convert to our project objects and take top N
        const startId = hardcodedProjects.length + 1;
        const converted = deduped.slice(0, MAX_FETCHED_PROJECTS).map((r, i) => repoToProject(r, startId + i));

        // Append converted repos to allProjects
        allProjects = [...hardcodedProjects, ...converted];

        // set visible count to initial (show only first 3) — user can click view more
        visibleProjectCount = INITIAL_PROJECT_COUNT;
        renderProjects();
    } catch (err) {
        console.error('Failed to fetch GitHub repos', err);
        showGithubFetchError('network');
    }
}

function showGithubFetchError(code) {
    // still render hardcoded projects and show link to GitHub
    allProjects = [...hardcodedProjects];
    visibleProjectCount = INITIAL_PROJECT_COUNT;
    renderProjects();

    const githubLinkFinal = document.getElementById('github-link-final');
    if (githubLinkFinal) {
        githubLinkFinal.style.display = 'flex';
        githubLinkFinal.href = `https://github.com/${GITHUB_USER}`;
        githubLinkFinal.textContent = `VIEW GITHUB (${GITHUB_USER}) — ERROR FETCH ${code}`;
    }
}

// Initialization on Load
window.onload = function () {
    // Clock
    setInterval(updateClock, 1000);
    updateClock();

    // Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initially use hardcoded projects and render
    allProjects = [...hardcodedProjects];
    renderProjects();

    // Try to fetch GitHub repos and append (non-blocking)
    fetchAndAppendGitHubRepos();

    // Ensure icons created after everything else
    if (typeof lucide !== 'undefined') lucide.createIcons();
};
