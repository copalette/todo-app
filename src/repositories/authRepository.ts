import { supabase } from '../lib/supabase';
import { User } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Supabaseユーザーをアプリケーションのユーザー型に変換する関数
const mapToAppUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    created_at: supabaseUser.created_at || new Date().toISOString()
  };
};

// 認証リポジトリ - データアクセス層
export const authRepository = {
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
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return mapToAppUser(user);
  },

  // ユーザーの認証状態を監視
  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(mapToAppUser(session?.user || null));
    });
    
    return data.subscription;
  }
}; 