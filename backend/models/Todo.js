import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty']
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for efficient querying by user
todoSchema.index({ userId: 1, createdAt: -1 });

export const Todo = mongoose.model('Todo', todoSchema);