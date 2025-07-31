import { Todo } from '../models/Todo.js';

// Validation functions
const validateTitle = (title) => {
  return title && title.trim().length > 0;
};

const validateStatus = (status) => {
  return !status || ['pending', 'completed'].includes(status);
};

export const getTodos = async (req, res) => {
  try {
    const { status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Build sort object
    const sortOptions = {};
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

export const createTodo = async (req, res) => {
  try {
    const { title, description, status = 'pending' } = req.body;
    
    // Validation
    if (!validateTitle(title)) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    if (!validateStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "pending" or "completed"'
      });
    }
    
    const todo = new Todo({
      title: title.trim(),
      description: description ? description.trim() : '',
      status,
      userId: req.user._id
    });
    
    await todo.save();
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    
    // Validation
    if (title !== undefined && !validateTitle(title)) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty'
      });
    }
    
    if (status !== undefined && !validateStatus(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "pending" or "completed"'
      });
    }
    
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
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
  } catch (error) {
    console.error('Update todo error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteTodo = async (req, res) => {
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

export const toggleTodoStatus = async (req, res) => {
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