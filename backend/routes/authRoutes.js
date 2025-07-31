import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.get('/profile', authenticate, authController.getProfile);

export default router;