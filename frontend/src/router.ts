// Simple client-side router for SPA navigation
import { apiClient } from './api.js';

interface Route {
    path: string;
    handler: () => void;
    requireAuth?: boolean;
}

class Router {
    private routes: Route[] = [];
    private currentPath: string = '';
    private isNavigating: boolean = false;

    constructor() {
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        
        // Handle initial navigation with a slight delay
        setTimeout(() => this.handleRoute(), 100);
    }

    addRoute(path: string, handler: () => void, requireAuth = true) {
        this.routes.push({ path, handler, requireAuth });
    }

    navigate(path: string) {
        if (this.isNavigating || this.currentPath === path) {
            return; // Prevent recursive navigation
        }
        
        this.isNavigating = true;
        window.history.pushState({}, '', path);
        this.handleRoute().finally(() => {
            this.isNavigating = false;
        });
    }

    private async handleRoute() {
        if (this.isNavigating) return; // Prevent recursive calls
        
        const newPath = window.location.pathname;
        if (this.currentPath === newPath) return; // Already on this path
        
        this.currentPath = newPath;
        
        // Find matching route
        const route = this.routes.find(r => r.path === this.currentPath) || 
                     this.routes.find(r => r.path === '/'); // Default to home
        
        if (!route) {
            console.warn('No route found for', this.currentPath);
            return;
        }

        // Check authentication if required
        if (route.requireAuth) {
            try {
                const status = await apiClient.getLoginStatus();
                if (!status.isLoggedIn) {
                    this.showLogin();
                    return;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.showLogin();
                return;
            }
        }

        // Execute route handler
        try {
            route.handler();
        } catch (error) {
            console.error('Route handler error:', error);
        }
        
        // Update navbar active state
        this.updateNavbar();
    }

    private showLogin() {
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div class="row justify-content-center">
                    <div class="col-md-6 col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="card-title mb-0">Login to P4 Game</h5>
                            </div>
                            <div class="card-body">
                                <form id="loginForm">
                                    <div class="mb-3">
                                        <label for="username" class="form-label">Username</label>
                                        <input type="text" class="form-control" id="username" required>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Login</button>
                                </form>
                                <div id="loginError" class="alert alert-danger mt-3 d-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            this.setupLoginForm();
        }
    }

    private setupLoginForm() {
        const form = document.getElementById('loginForm') as HTMLFormElement;
        const errorDiv = document.getElementById('loginError') as HTMLElement;
        
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = (document.getElementById('username') as HTMLInputElement).value;
            
            try {
                const response = await apiClient.login(username);
                if (response.success) {
                    // Reload the current route
                    this.handleRoute();
                } else {
                    throw new Error(response.error || 'Login failed');
                }
            } catch (error) {
                if (errorDiv) {
                    errorDiv.textContent = error instanceof Error ? error.message : 'Login failed';
                    errorDiv.classList.remove('d-none');
                }
            }
        });
    }

    private updateNavbar() {
        // Update active nav links
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === this.currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    getCurrentPath(): string {
        return this.currentPath;
    }
}

export const router = new Router();