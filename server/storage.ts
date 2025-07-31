import { User } from './models/User';
import { Todo } from './models/Todo';
import { InsertUser, InsertTodo, UpdateTodo } from '@shared/schema';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<any | undefined>;
  getUserByEmail(email: string): Promise<any | undefined>;
  createUser(user: InsertUser): Promise<any>;
  
  // Todo methods
  getTodos(userId: string, filters?: any): Promise<any[]>;
  createTodo(userId: string, todo: InsertTodo): Promise<any>;
  updateTodo(id: string, userId: string, todo: UpdateTodo): Promise<any>;
  deleteTodo(id: string, userId: string): Promise<boolean>;
  toggleTodoStatus(id: string, userId: string): Promise<any>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<any | undefined> {
    return await User.findById(id).select('-password');
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    return await User.findOne({ email });
  }

  async createUser(userData: InsertUser): Promise<any> {
    const user = new User(userData);
    return await user.save();
  }

  async getTodos(userId: string, filters: any = {}): Promise<any[]> {
    const query: any = { userId };
    
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    
    if (filters.search) {
      query.title = { $regex: filters.search, $options: 'i' };
    }
    
    const sortOptions: any = {};
    if (filters.sortBy === 'title') {
      sortOptions.title = filters.sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = filters.sortOrder === 'desc' ? -1 : 1;
    }
    
    return await Todo.find(query).sort(sortOptions);
  }

  async createTodo(userId: string, todoData: InsertTodo): Promise<any> {
    const todo = new Todo({ ...todoData, userId });
    return await todo.save();
  }

  async updateTodo(id: string, userId: string, todoData: UpdateTodo): Promise<any> {
    return await Todo.findOneAndUpdate(
      { _id: id, userId },
      todoData,
      { new: true, runValidators: true }
    );
  }

  async deleteTodo(id: string, userId: string): Promise<boolean> {
    const result = await Todo.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  async toggleTodoStatus(id: string, userId: string): Promise<any> {
    const todo = await Todo.findOne({ _id: id, userId });
    if (!todo) return null;
    
    todo.status = todo.status === 'pending' ? 'completed' : 'pending';
    return await todo.save();
  }
}

export const storage = new MongoStorage();
