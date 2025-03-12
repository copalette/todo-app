import { createClient } from '@supabase/supabase-js';
import { Todo } from '../types';

// 環境変数の値をログに出力
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY設定済み:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Todoテーブルの操作関数
export const todoService = {
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
  }
};

// 認証関連の操作関数
export const authService = {
  // サインアップ
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // ログイン
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },

  // ログアウト
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 現在のユーザーを取得
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}; 