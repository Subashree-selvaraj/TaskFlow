import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDatabase } from "./config/database";
import { authenticate } from "./middleware/auth";
import * as authController from "./controllers/authController";
import * as todoController from "./controllers/todoController";

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectDatabase();
  
  // Middleware
  app.use(cookieParser());
  app.use(express.static('public'));
  
  // Serve HTML pages
  app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'login.html'));
  });
  
  app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'login.html'));
  });
  
  app.get('/register', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'register.html'));
  });
  
  app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'forgot-password.html'));
  });
  
  app.get('/dashboard', authenticate, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'views', 'dashboard.html'));
  });

  // API Routes - Authentication
  app.post('/api/auth/register', authController.register);
  app.post('/api/auth/login', authController.login);
  app.post('/api/auth/logout', authController.logout);
  app.post('/api/auth/forgot-password', authController.forgotPassword);
  app.get('/api/auth/profile', authenticate, authController.getProfile);

  // API Routes - Todos
  app.get('/api/todos', authenticate, todoController.getTodos);
  app.post('/api/todos', authenticate, todoController.createTodo);
  app.put('/api/todos/:id', authenticate, todoController.updateTodo);
  app.delete('/api/todos/:id', authenticate, todoController.deleteTodo);
  app.patch('/api/todos/:id/toggle', authenticate, todoController.toggleTodoStatus);

  const httpServer = createServer(app);
  return httpServer;
}
