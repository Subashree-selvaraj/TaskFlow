import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as todoController from '../controllers/todoController.js';

const router = express.Router();

// Todo routes (all require authentication)
router.get('/', authenticate, todoController.getTodos);
router.post('/', authenticate, todoController.createTodo);
router.put('/:id', authenticate, todoController.updateTodo);
router.delete('/:id', authenticate, todoController.deleteTodo);
router.patch('/:id/toggle', authenticate, todoController.toggleTodoStatus);

export default router;