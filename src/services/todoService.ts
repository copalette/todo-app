import { todoRepository } from '../repositories/todoRepository';
import { Todo } from '../types';

// Todoサービス - ビジネスロジック層
export const todoService = {
  // 全てのTodoを取得
  async getAllTodos(userId: string): Promise<Todo[]> {
    return todoRepository.getAllTodos(userId);
  },

  // 特定のTodoを取得
  async getTodoById(id: string): Promise<Todo | null> {
    return todoRepository.getTodoById(id);
  },

  // 新しいTodoを作成
  async createTodo(userId: string, title: string, description: string): Promise<Todo> {
    // 入力値の検証
    if (!title.trim()) {
      throw new Error('タイトルは必須です');
    }

    const newTodo: Omit<Todo, 'id' | 'created_at' | 'updated_at'> = {
      user_id: userId,
      title: title.trim(),
      description: description.trim(),
      is_completed: false
    };

    return todoRepository.createTodo(newTodo);
  },

  // Todoを更新
  async updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Todo> {
    // 更新前にTodoの存在確認
    const existingTodo = await todoRepository.getTodoById(id);
    if (!existingTodo) {
      throw new Error('更新対象のTodoが見つかりません');
    }

    // タイトルが空でないことを確認
    if (updates.title !== undefined && !updates.title.trim()) {
      throw new Error('タイトルは必須です');
    }

    // 更新データの整形
    const cleanUpdates: Partial<Todo> = {};
    if (updates.title !== undefined) cleanUpdates.title = updates.title.trim();
    if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
    if (updates.is_completed !== undefined) cleanUpdates.is_completed = updates.is_completed;

    return todoRepository.updateTodo(id, cleanUpdates);
  },

  // Todoを完了/未完了に切り替え
  async toggleTodoCompletion(id: string): Promise<Todo> {
    const todo = await todoRepository.getTodoById(id);
    if (!todo) {
      throw new Error('対象のTodoが見つかりません');
    }

    return todoRepository.updateTodo(id, { is_completed: !todo.is_completed });
  },

  // Todoを削除
  async deleteTodo(id: string): Promise<void> {
    // 削除前にTodoの存在確認
    const existingTodo = await todoRepository.getTodoById(id);
    if (!existingTodo) {
      throw new Error('削除対象のTodoが見つかりません');
    }

    return todoRepository.deleteTodo(id);
  },

  // ユーザーのTodo統計情報を取得
  async getTodoStats(userId: string): Promise<{ total: number; completed: number; remaining: number }> {
    const todos = await todoRepository.getAllTodos(userId);
    const total = todos.length;
    const completed = todos.filter(todo => todo.is_completed).length;
    
    return {
      total,
      completed,
      remaining: total - completed
    };
  }
}; 