# replit.md

## Overview

This is a full-stack web application built for task management (TaskFlow) with a focus on user authentication and todo management. The project uses a modern technology stack combining React with TypeScript for the frontend, Express.js for the backend, and MongoDB for data persistence. The application is currently in a transitional state, with both traditional HTML views and a React SPA setup coexisting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application implements a dual frontend approach:
- **Traditional HTML Views**: Located in `/views/` directory with vanilla JavaScript for authentication pages (login, register, forgot password, dashboard)
- **React SPA**: Modern React application with TypeScript in `/client/src/` using Vite as the build tool
- **UI Framework**: Implements shadcn/ui component library with Tailwind CSS for styling
- **State Management**: Uses TanStack Query for server state management
- **Routing**: Wouter for client-side routing (though currently minimal)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with clear separation between authentication and todo routes
- **Middleware**: Cookie-based authentication with JWT tokens
- **Validation**: Zod schema validation for request data
- **Database Layer**: Mongoose ODM for MongoDB interactions with a storage abstraction layer

### Database Design
- **Primary Database**: MongoDB with Mongoose ODM
- **Schema Definition**: Centralized schema definitions in `/shared/schema.ts`
- **Models**: User and Todo models with proper relationships and validation
- **Alternative Setup**: Drizzle configuration present (configured for PostgreSQL) but not actively used

## Key Components

### Authentication System
- **Strategy**: JWT-based authentication with HTTP-only cookies
- **Security**: bcrypt for password hashing with salt rounds
- **Session Management**: Persistent sessions with cookie storage
- **Validation**: Comprehensive input validation for all auth endpoints

### Todo Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Filtering**: Status-based filtering (pending/completed), search by title
- **Sorting**: Sortable by creation date and title with ascending/descending options
- **User Isolation**: Each user can only access their own todos

### UI Components
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Accessibility**: ARIA-compliant components from Radix UI

## Data Flow

### Authentication Flow
1. User submits credentials via HTML forms or React components
2. Server validates input using Zod schemas
3. Password verification using bcrypt comparison
4. JWT token generation and HTTP-only cookie setting
5. Protected routes verify token via middleware

### Todo Management Flow
1. Client requests filtered/sorted todos via API
2. Server applies user-specific filters and queries MongoDB
3. Data returned with calculated statistics (total, pending, completed)
4. Client updates UI with fresh data
5. Mutations trigger re-fetching of todo list

### Error Handling
- Client-side validation with immediate feedback
- Server-side error responses with appropriate HTTP status codes
- Consistent error message format across all endpoints

## External Dependencies

### Core Framework Dependencies
- **React + TypeScript**: Modern frontend development stack
- **Express.js**: Backend web framework
- **MongoDB + Mongoose**: Database and ODM
- **Vite**: Build tool and development server

### Authentication & Security
- **jsonwebtoken**: JWT token handling
- **bcryptjs**: Password hashing
- **cookie-parser**: Cookie management middleware

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Lucide React**: Icon library

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Production build bundling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `/dist/public/`
- **Backend**: esbuild bundles Express server to `/dist/index.js`
- **Static Assets**: Public files served from `/public/` directory

### Environment Configuration
- **Development**: Hot reload with Vite middleware integration
- **Production**: Static file serving with proper error handling
- **Database**: MongoDB connection via environment variable

### Deployment Architecture
- **Single Server**: Both frontend and backend served from same Express instance
- **Static Files**: Vite build output served as static assets
- **API Routes**: Express routes handle all `/api/*` endpoints
- **Fallback**: All non-API routes serve React SPA for client-side routing

The application demonstrates a modern full-stack architecture with room for growth, currently supporting both traditional and SPA approaches while maintaining clean separation of concerns and proper security practices.