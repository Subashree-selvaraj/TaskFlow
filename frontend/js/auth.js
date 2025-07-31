// Authentication JavaScript
class AuthManager {
    constructor() {
        this.apiBase = 'http://localhost:5000/api/auth';
        this.init();
    }

    init() {
        // Check if user is already authenticated
        this.checkAuth();
        
        // Bind form events
        this.bindFormEvents();
    }

    async checkAuth() {
        try {
            const response = await fetch(`${this.apiBase}/profile`, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                // User is authenticated, redirect to dashboard
                if (window.location.pathname !== '/dashboard.html') {
                    window.location.href = 'dashboard.html';
                }
            }
        } catch (error) {
            console.log('Not authenticated');
        }
    }

    bindFormEvents() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Forgot password form
        const forgotForm = document.getElementById('forgotForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        this.clearErrors();
        this.showLoading(e.target);

        try {
            const response = await fetch(`${this.apiBase}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = 'dashboard.html';
            } else {
                this.showAlert('loginAlert', data.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('loginAlert', 'Network error. Please try again.', 'error');
        } finally {
            this.hideLoading(e.target);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        this.clearErrors();

        // Client-side validation
        if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showFieldError('registerPassword', 'Password must be at least 6 characters');
            return;
        }

        this.showLoading(e.target);

        try {
            const response = await fetch(`${this.apiBase}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                window.location.href = 'dashboard.html';
            } else {
                this.showAlert('registerAlert', data.message || 'Registration failed', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('registerAlert', 'Network error. Please try again.', 'error');
        } finally {
            this.hideLoading(e.target);
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value;
        
        this.clearErrors();
        this.showLoading(e.target);

        try {
            const response = await fetch(`${this.apiBase}/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                this.showAlert('forgotAlert', data.message, 'success');
            } else {
                this.showAlert('forgotAlert', data.message || 'Failed to send reset email', 'error');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            this.showAlert('forgotAlert', 'Network error. Please try again.', 'error');
        } finally {
            this.hideLoading(e.target);
        }
    }

    showAlert(alertId, message, type) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.textContent = message;
            alert.className = `alert alert-${type}`;
            alert.classList.remove('hidden');
        }
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            const errorElement = field.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.remove('hidden');
            }
        }
    }

    clearErrors() {
        // Clear all alerts
        document.querySelectorAll('.alert').forEach(alert => {
            alert.classList.add('hidden');
        });

        // Clear field errors
        document.querySelectorAll('.form-error').forEach(error => {
            error.classList.add('hidden');
        });
    }

    showLoading(form) {
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.textContent = 'Loading...';
        }
    }

    hideLoading(form) {
        const button = form.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            
            // Restore original text
            if (form.id === 'loginForm') {
                button.textContent = 'Sign In';
            } else if (form.id === 'registerForm') {
                button.textContent = 'Create Account';
            } else if (form.id === 'forgotForm') {
                button.textContent = 'Send Reset Link';
            }
        }
    }
}

// Initialize auth manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});