# TaskFlow - Todo Application

A full-stack todo application built with vanilla HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

## 🚀 Features

### MODULE 1: User Authentication
- **Login, Registration, and Forgot Password pages**
- **Secure password hashing with bcrypt**
- **JWT-based authentication with HTTP-only cookies**
- **MongoDB user credential storage**
- **Express middleware for protected routes**
- **Comprehensive validation (empty fields, password length, duplicate user checks)**
- **Clean, minimal frontend with custom CSS**

### MODULE 2: To-Do Management
- **Create, edit, delete, and update to-do items**
- **Fields: title, description, status (pending/completed), createdAt, updatedAt**
- **User-specific tasks (users can only manage their own)**
- **Complete CRUD operations:**
  - GET /api/todos – View all user tasks
  - POST /api/todos – Add new task
  - PUT /api/todos/:id – Edit task
  - DELETE /api/todos/:id – Delete task
  - PATCH /api/todos/:id/toggle – Mark as completed/pending

### MODULE 3: Dashboard View
- **Task statistics display**
- **Filter by "Pending" and "Completed" status**
- **Sort by creation date (Ascending/Descending) and title**
- **Search tasks by title**
- **Responsive card layout with action buttons**
- **Clean, mobile-responsive design**

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with responsive design
- **Vanilla JavaScript** - No frameworks, pure JS

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Authentication & Security
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **HTTP-only cookies** - Secure token storage

## 📁 Project Structure

```
taskflow/
├── frontend/                 # Frontend files
│   ├── css/
│   │   └── styles.css       # Custom CSS styles
│   ├── js/
│   │   ├── auth.js          # Authentication logic
│   │   └── dashboard.js     # Dashboard functionality
│   ├── index.html           # Login page
│   ├── register.html        # Registration page
│   ├── forgot-password.html # Password reset page
│   └── dashboard.html       # Main dashboard
├── backend/                 # Backend files
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── todoController.js    # Todo CRUD operations
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── User.js          # User model
│   │   └── Todo.js          # Todo model
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication routes
│   │   └── todoRoutes.js    # Todo routes
│   ├── package.json         # Backend dependencies
│   └── server.js            # Main server file
└── README.md
```

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taskflow
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file in the backend directory with:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup
No additional setup required for frontend - it uses vanilla HTML, CSS, and JavaScript.

## 🏃‍♂️ Running the Application

### Method 1: Backend Only (Serves Both Frontend and Backend)
```bash
# From the backend directory
cd backend
npm run dev
```

The application will be available at `http://localhost:5000`

### Method 2: Separate Frontend and Backend

#### Start Backend Server
```bash
# Terminal 1 - Backend
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

#### Serve Frontend
```bash
# Terminal 2 - Frontend (using any static server)
cd frontend

# Option 1: Using Python
python -m http.server 8080

# Option 2: Using Node.js http-server (install globally: npm install -g http-server)
http-server -p 8080

# Option 3: Using Live Server extension in VS Code
# Right-click on index.html and select "Open with Live Server"
```
Frontend runs on `http://localhost:8080`

## 🔧 Configuration

### Environment Variables (Backend)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRE` - Token expiration time (default: 7d)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Frontend Configuration
Update API base URLs in JavaScript files if running frontend and backend on different ports:
- `frontend/js/auth.js` - Line 4: `this.apiBase`
- `frontend/js/dashboard.js` - Line 4: `this.apiBase`

## 🌐 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/profile` - Get user profile (protected)

### Todo Routes (All Protected)
- `GET /api/todos` - Get user's todos with filters
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `PATCH /api/todos/:id/toggle` - Toggle todo status

## 🎨 Features in Detail

### Authentication
- Secure password hashing with bcrypt (12 salt rounds)
- JWT tokens stored in HTTP-only cookies
- Session persistence across browser sessions
- Automatic redirect based on authentication status

### Todo Management
- Real-time task statistics
- Advanced filtering and sorting
- Search functionality with case-insensitive matching
- Responsive design for mobile and desktop

### User Experience
- Clean, minimal design inspired by modern applications
- Intuitive navigation and user flows
- Loading states and error handling
- Success/error notifications

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens with configurable expiration
- HTTP-only cookies to prevent XSS attacks
- Input validation on both frontend and backend
- Protected routes requiring authentication
- User isolation (users can only access their own data)

## 📱 Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design works on mobile devices
- Progressive enhancement with vanilla JavaScript

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MONGODB_URI in environment variables
   - Check MongoDB Atlas network access settings
   - Ensure database user has proper permissions

2. **CORS Issues**
   - Frontend and backend on different ports
   - Update CORS configuration in backend/server.js

3. **Authentication Not Working**
   - Clear browser cookies
   - Check JWT_SECRET configuration
   - Verify token expiration settings

4. **Tasks Not Loading**
   - Check browser developer tools for API errors
   - Verify authentication token is present
   - Check MongoDB connection status