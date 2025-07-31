import { Response } from 'express';
import { Todo } from '../models/Todo';
import { insertTodoSchema, updateTodoSchema } from '@shared/schema';
import { AuthRequest } from '../middleware/auth';

export const getTodos = async (req: AuthRequest, res: Response) => {
  try {
    const { status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query: any = { userId: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Build sort object
    const sortOptions: any = {};
    if (sortBy === 'title') {
      sortOptions.title = sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = sortOrder === 'desc' ? -1 : 1;
    }
    
    const todos = await Todo.find(query).sort(sortOptions);
    
    // Calculate stats
    const allTodos = await Todo.find({ userId: req.user._id });
    const totalTasks = allTodos.length;
    const completedTasks = allTodos.filter(todo => todo.status === 'completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    res.json({
      success: true,
      todos,
      stats: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate: `${completionRate}%`
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const createTodo = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = insertTodoSchema.parse(req.body);
    
    const todo = new Todo({
      ...validatedData,
      userId: req.user._id
    });
    
    await todo.save();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      todo
    });
  } catch (error: any) {
    console.error('Create todo error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((err: any) => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateTodoSchema.parse(req.body);
    
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      todo
    });
  } catch (error: any) {
    console.error('Update todo error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map((err: any) => err.message)
      });
    }
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map((err: any) => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteTodo = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user._id });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const toggleTodoStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    const todo = await Todo.findOne({ _id: id, userId: req.user._id });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    todo.status = todo.status === 'pending' ? 'completed' : 'pending';
    await todo.save();
    
    res.json({
      success: true,
      message: 'Task status updated successfully',
      todo
    });
  } catch (error) {
    console.error('Toggle todo status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
