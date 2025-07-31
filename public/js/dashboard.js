// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.apiBase = '/api';
        this.todos = [];
        this.currentUser = null;
        this.filters = {
            status: 'all',
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        };
        this.init();
    }

    async init() {
        // Check authentication
        await this.checkAuth();
        
        // Load initial data
        await this.loadTodos();
        
        // Bind events
        this.bindEvents();
    }

    async checkAuth() {
        try {
            const response = await fetch(`${this.apiBase}/auth/profile`, {
                credentials: 'include'
            });

            if (!response.ok) {
                window.location.href = '/login';
                return;
            }

            const data = await response.json();
            this.currentUser = data.user;
            this.updateUserInfo();
        } catch (error) {
            console.error('Auth check error:', error);
            window.location.href = '/login';
        }
    }

    updateUserInfo() {
        const userNameElements = document.querySelectorAll('[data-bind="user.name"]');
        userNameElements.forEach(element => {
            element.textContent = this.currentUser.username;
        });
    }

    bindEvents() {
        // Search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.debounce(() => this.loadTodos(), 300)();
            });
        }

        // Filter select
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                if (select.querySelector('option[value="all"]')) {
                    this.filters.status = e.target.value;
                } else {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    this.filters.sortBy = sortBy === 'newest' ? 'createdAt' : sortBy === 'oldest' ? 'createdAt' : 'title';
                    this.filters.sortOrder = sortBy === 'newest' ? 'desc' : sortBy === 'oldest' ? 'asc' : 'asc';
                }
                this.loadTodos();
            });
        });

        // Add task button
        const addButton = document.querySelector('.btn-primary');
        if (addButton && addButton.textContent.includes('Add Task')) {
            addButton.addEventListener('click', () => this.toggleTaskForm());
        }

        // Task form
        const taskForm = document.getElementById('addTaskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        }

        // Cancel button
        const cancelButton = document.querySelector('.btn-secondary');
        if (cancelButton && cancelButton.textContent === 'Cancel') {
            cancelButton.addEventListener('click', () => this.toggleTaskForm());
        }

        // Logout button
        const logoutButton = document.querySelector('button[onclick="logout()"]');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    async loadTodos() {
        try {
            const params = new URLSearchParams();
            Object.keys(this.filters).forEach(key => {
                if (this.filters[key]) {
                    params.append(key, this.filters[key]);
                }
            });

            const response = await fetch(`${this.apiBase}/todos?${params}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to load todos');
            }

            const data = await response.json();
            this.todos = data.todos;
            this.updateStats(data.stats);
            this.renderTodos();
        } catch (error) {
            console.error('Load todos error:', error);
            this.showAlert('Failed to load tasks', 'error');
        }
    }

    updateStats(stats) {
        document.querySelector('[data-bind="stats.total"]').textContent = stats.total;
        document.querySelector('[data-bind="stats.pending"]').textContent = stats.pending;
        document.querySelector('[data-bind="stats.completed"]').textContent = stats.completed;
        document.querySelector('[data-bind="stats.completionRate"]').textContent = stats.completionRate;
    }

    renderTodos() {
        const taskList = document.querySelector('.task-list');
        const emptyState = document.getElementById('emptyState');
        
        // Clear existing tasks (but keep empty state)
        const existingTasks = taskList.querySelectorAll('.task-item');
        existingTasks.forEach(task => task.remove());

        if (this.todos.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            
            this.todos.forEach(todo => {
                const taskElement = this.createTaskElement(todo);
                taskList.insertBefore(taskElement, emptyState);
            });
        }
    }

    createTaskElement(todo) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.innerHTML = `
            <div class="task-header">
                <h3 class="task-title ${todo.status === 'completed' ? 'completed' : ''}">${this.escapeHtml(todo.title)}</h3>
                <span class="task-status status-${todo.status}">${todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}</span>
            </div>
            ${todo.description ? `<p class="task-description">${this.escapeHtml(todo.description)}</p>` : ''}
            <div class="task-meta">
                <span>Created ${this.formatDate(todo.createdAt)}</span>
                <div class="task-actions">
                    <button class="action-edit" data-task-id="${todo._id}">Edit</button>
                    <button class="action-toggle" data-task-id="${todo._id}">
                        ${todo.status === 'pending' ? 'Complete' : 'Mark Pending'}
                    </button>
                    <button class="action-delete" data-task-id="${todo._id}">Delete</button>
                </div>
            </div>
        `;

        // Bind task actions
        this.bindTaskActions(taskDiv);
        
        return taskDiv;
    }

    bindTaskActions(taskElement) {
        const editBtn = taskElement.querySelector('.action-edit');
        const toggleBtn = taskElement.querySelector('.action-toggle');
        const deleteBtn = taskElement.querySelector('.action-delete');

        editBtn.addEventListener('click', () => {
            const taskId = editBtn.dataset.taskId;
            this.editTask(taskId);
        });

        toggleBtn.addEventListener('click', () => {
            const taskId = toggleBtn.dataset.taskId;
            this.toggleTaskStatus(taskId);
        });

        deleteBtn.addEventListener('click', () => {
            const taskId = deleteBtn.dataset.taskId;
            this.deleteTask(taskId);
        });
    }

    toggleTaskForm() {
        const form = document.getElementById('taskForm');
        form.classList.toggle('hidden');
        
        if (!form.classList.contains('hidden')) {
            document.getElementById('taskTitle').focus();
        } else {
            // Clear form
            document.getElementById('addTaskForm').reset();
        }
    }

    async handleAddTask(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();

        if (!title) {
            this.showAlert('Task title is required', 'error');
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                throw new Error('Failed to create task');
            }

            const data = await response.json();
            this.showAlert('Task created successfully', 'success');
            this.toggleTaskForm();
            await this.loadTodos();
        } catch (error) {
            console.error('Add task error:', error);
            this.showAlert('Failed to create task', 'error');
        }
    }

    async editTask(taskId) {
        const todo = this.todos.find(t => t._id === taskId);
        if (!todo) return;

        const title = prompt('Edit task title:', todo.title);
        if (title === null) return; // User cancelled
        
        if (!title.trim()) {
            this.showAlert('Task title cannot be empty', 'error');
            return;
        }

        const description = prompt('Edit description:', todo.description || '');
        if (description === null) return; // User cancelled

        try {
            const response = await fetch(`${this.apiBase}/todos/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ title: title.trim(), description: description.trim() })
            });

            if (!response.ok) {
                throw new Error('Failed to update task');
            }

            this.showAlert('Task updated successfully', 'success');
            await this.loadTodos();
        } catch (error) {
            console.error('Edit task error:', error);
            this.showAlert('Failed to update task', 'error');
        }
    }

    async toggleTaskStatus(taskId) {
        try {
            const response = await fetch(`${this.apiBase}/todos/${taskId}/toggle`, {
                method: 'PATCH',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to toggle task status');
            }

            this.showAlert('Task status updated', 'success');
            await this.loadTodos();
        } catch (error) {
            console.error('Toggle task error:', error);
            this.showAlert('Failed to update task status', 'error');
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBase}/todos/${taskId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            this.showAlert('Task deleted successfully', 'success');
            await this.loadTodos();
        } catch (error) {
            console.error('Delete task error:', error);
            this.showAlert('Failed to delete task', 'error');
        }
    }

    async logout() {
        try {
            await fetch(`${this.apiBase}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            window.location.href = '/login';
        }
    }

    showAlert(message, type) {
        // Create and show a temporary alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '1000';
        alert.style.maxWidth = '300px';
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return diffMins <= 1 ? 'just now' : `${diffMins} minutes ago`;
        } else if (diffHours < 24) {
            return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
