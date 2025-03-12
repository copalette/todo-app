import { createClient } from '@supabase/supabase-js';

// 環境変数の値をログに出力
console.log('SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY設定済み:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Supabaseクライアントの初期化
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 接続テスト用関数
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('todos').select('count').limit(1);
    if (error) {
      console.error('Supabase接続テストエラー:', error);
      return false;
    } else {
      console.log('Supabase接続テスト成功');
      return true;
    }
  } catch (err) {
    console.error('Supabase接続テスト例外:', err);
    return false;
  }
}; 