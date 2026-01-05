// Meteor effect generator
function createMeteors(numberOfMeteors = 20) {
    const container = document.getElementById('meteors-container');
    
    // Clear existing meteors if any
    container.innerHTML = '';
    
    // Create meteors
    for (let i = 0; i < numberOfMeteors; i++) {
        const meteor = document.createElement('span');
        meteor.className = 'meteor';
        
        // Random horizontal position
        const leftPosition = Math.floor(Math.random() * (400 - (-400)) + (-400));
        
        // Random animation delay (0.2s to 0.8s)
        const animationDelay = Math.random() * (0.8 - 0.2) + 0.2;
        
        // Random animation duration (2s to 10s)
        const animationDuration = Math.floor(Math.random() * (10 - 2) + 2);
        
        // Apply styles
        meteor.style.top = '0';
        meteor.style.left = `${leftPosition}px`;
        meteor.style.animationDelay = `${animationDelay}s`;
        meteor.style.animationDuration = `${animationDuration}s`;
        
        container.appendChild(meteor);
    }
}

// Initialize meteors when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createMeteors(20);
});

// Optional: Add button to regenerate meteors
// You can call createMeteors() to regenerate the effect