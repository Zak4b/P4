// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import custom styles
import './style.css';
import './custom.css';

// Import API client and router
import { apiClient } from './api.js';
import { router } from './router.js';
import { showGame } from './gamePage.js';
import { showHistory } from './history.js';

// Set up routes
router.addRoute('/', showGame);
router.addRoute('/history', showHistory);

// Set up navigation event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Handle nav link clicks
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href) {
                router.navigate(href);
            }
        });
    });

    // Set up logout functionality (if needed)
    setupLogoutButton();
});

function setupLogoutButton() {
    // Add logout button to navbar if user is logged in
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
        // We'll add this dynamically when needed
        const logoutButton = document.createElement('li');
        logoutButton.className = 'nav-item d-none';
        logoutButton.id = 'logout-nav-item';
        logoutButton.innerHTML = `
            <a class="nav-link" href="#" id="logout-link">Logout</a>
        `;
        navbar.appendChild(logoutButton);

        const logoutLink = document.getElementById('logout-link');
        logoutLink?.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await apiClient.logout();
                window.location.reload(); // Simple refresh to reset state
            } catch (error) {
                console.error('Logout failed:', error);
            }
        });
    }

    // Check login status and show/hide logout button
    checkLoginStatus();
}

async function checkLoginStatus() {
    try {
        const status = await apiClient.getLoginStatus();
        const logoutItem = document.getElementById('logout-nav-item');
        if (logoutItem) {
            if (status.isLoggedIn) {
                logoutItem.classList.remove('d-none');
            } else {
                logoutItem.classList.add('d-none');
            }
        }
    } catch (error) {
        console.error('Failed to check login status:', error);
    }
}
