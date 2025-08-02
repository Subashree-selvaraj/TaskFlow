### TaskFlow
TaskFlow is a full-stack Todo application with user authentication, built using Node.js, Express, MongoDB, and a vanilla JS/CSS/HTML frontend.

### Features
- User registration, login, and logout
- Password reset (email sending logic placeholder)
- JWT-based authentication (stored in HTTP-only cookies)
- Create, read, update, delete, and toggle tasks
- Task filtering, searching, and sorting
- Responsive, modern UI


### Backend Setup
Go to the backend directory:

- `npm install`
- create env and add credentials
- MONGODB_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- `npm run dev`

### Frontend Setup
- The frontend is static and served automatically by the backend.
- Open http://localhost:5000 in your browser.

### API Endpoints
- POST /api/auth/register – Register a new user
- POST /api/auth/login – Login
- POST /api/auth/logout – Logout
- POST /api/auth/forgot-password – Request password reset
- GET /api/auth/profile – Get current user profile
- GET /api/todos – List todos (with filters)
- POST /api/todos – Create todo
- PUT /api/todos/:id – Update todo
- DELETE /api/todos/:id – Delete todo
- PATCH /api/todos/:id/toggle – Toggle todo status

