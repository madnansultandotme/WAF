// src/public/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Series filter functionality
    const filterButtons = document.querySelectorAll('.series-filters .btn');
    const seriesCards = document.querySelectorAll('.series-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            seriesCards.forEach(card => {
                if (filter === 'all' || card.dataset.status === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Live score auto-refresh
    const liveMatches = document.querySelector('.live-matches');
    if (liveMatches) {
        setInterval(async () => {
            try {
                const response = await fetch('/api/live-scores');
                const data = await response.json();
                updateLiveScores(data);
            } catch (error) {
                console.error('Error fetching live scores:', error);
            }
        }, 30000); // Refresh every 30 seconds
    }
});

function updateLiveScores(matchData) {
    const liveMatches = document.querySelector('.live-matches');
    // Update the DOM with new match data
}