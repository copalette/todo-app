import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

// 認証を管理するカスタムフック - UI層
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 現在のユーザーを取得
  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('ユーザー情報の取得に失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, []);

  // サインアップ
  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signUp(email, password);
      // サインアップ後に自動的にログインしない場合もあるため、
      // ユーザー情報を再取得
      await fetchCurrentUser();
      return result;
    } catch (err) {
      console.error('サインアップに失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ログイン
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authService.signIn(email, password);
      await fetchCurrentUser();
      return result;
    } catch (err) {
      console.error('ログインに失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authService.signOut();
      setUser(null);
      return true;
    } catch (err) {
      console.error('ログアウトに失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 認証状態の監視
  useEffect(() => {
    // 初回マウント時にユーザー情報を取得
    fetchCurrentUser();
    
    // 認証状態の変更を監視
    const subscription = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    
    // クリーンアップ
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchCurrentUser]);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
}; 