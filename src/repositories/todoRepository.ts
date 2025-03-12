import { supabase } from '../lib/supabase';
import { Todo } from '../types';

// Todoリポジトリ - データアクセス層
export const todoRepository = {
  // 全てのTodoを取得
  async getAllTodos(userId: string): Promise<Todo[]> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // 特定のTodoを取得
  async getTodoById(id: string): Promise<Todo | null> {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // 新しいTodoを作成
  async createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .insert([todo])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Todoを更新
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Todoを削除
  async deleteTodo(id: string): Promise<void> {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // ユーザーのTodoの数を取得
  async getTodoCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('todos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    return count || 0;
  }
}; 