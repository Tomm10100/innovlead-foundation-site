// InnovLead Learning Platform - Interactive Features

// Smooth scrolling for anchor links
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

// Track user progress (localStorage)
function trackProgress(moduleId, lessonId) {
    const progress = JSON.parse(localStorage.getItem('innovlead_progress') || '{}');
    if (!progress[moduleId]) {
        progress[moduleId] = [];
    }
    if (!progress[moduleId].includes(lessonId)) {
        progress[moduleId].push(lessonId);
        localStorage.setItem('innovlead_progress', JSON.stringify(progress));
    }
}

// Get user progress
function getProgress(moduleId) {
    const progress = JSON.parse(localStorage.getItem('innovlead_progress') || '{}');
    return progress[moduleId] || [];
}

// Mark lesson as complete
function markLessonComplete(moduleId, lessonId) {
    trackProgress(moduleId, lessonId);
    // Show completion message
    alert('Lesson completed! Progress saved.');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    console.log('InnovLead Learning Platform loaded');

    // Add animation to module cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.module-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(card);
    });
});
