import { useState, useEffect, useCallback } from 'react';
import { todoService } from '../services/todoService';
import { Todo } from '../types';
import { supabase } from '../lib/supabase';

// Todoを管理するカスタムフック - UI層
export const useTodos = (userId: string | undefined) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, remaining: 0 });

  // Todoリストを取得
  const fetchTodos = useCallback(async () => {
    if (!userId) {
      setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const fetchedTodos = await todoService.getAllTodos(userId);
      setTodos(fetchedTodos);
      
      // 統計情報を更新
      const total = fetchedTodos.length;
      const completed = fetchedTodos.filter(todo => todo.is_completed).length;
      setStats({
        total,
        completed,
        remaining: total - completed
      });
    } catch (err) {
      console.error('Todoの取得に失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 新しいTodoを作成
  const createTodo = async (title: string, description: string) => {
    if (!userId) return null;
    
    setError(null);
    try {
      const newTodo = await todoService.createTodo(userId, title, description);
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      
      // 統計情報を更新
      setStats(prev => ({
        total: prev.total + 1,
        completed: prev.completed,
        remaining: prev.remaining + 1
      }));
      
      return newTodo;
    } catch (err) {
      console.error('Todoの作成に失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return null;
    }
  };

  // Todoを更新
  const updateTodo = async (id: string, updates: Partial<Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    setError(null);
    try {
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
      
      // 完了状態が変更された場合、統計情報を更新
      if (updates.is_completed !== undefined) {
        setStats(prev => {
          const wasCompleted = todos.find(t => t.id === id)?.is_completed || false;
          const isNowCompleted = updates.is_completed;
          
          if (wasCompleted === isNowCompleted) return prev;
          
          return {
            total: prev.total,
            completed: prev.completed + (isNowCompleted ? 1 : -1),
            remaining: prev.remaining + (isNowCompleted ? -1 : 1)
          };
        });
      }
      
      return updatedTodo;
    } catch (err) {
      console.error('Todoの更新に失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return null;
    }
  };

  // Todoの完了状態を切り替え
  const toggleTodoCompletion = async (id: string) => {
    setError(null);
    try {
      const updatedTodo = await todoService.toggleTodoCompletion(id);
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === id ? updatedTodo : todo)
      );
      
      // 統計情報を更新
      setStats(prev => {
        const isNowCompleted = updatedTodo.is_completed;
        return {
          total: prev.total,
          completed: prev.completed + (isNowCompleted ? 1 : -1),
          remaining: prev.remaining + (isNowCompleted ? -1 : 1)
        };
      });
      
      return updatedTodo;
    } catch (err) {
      console.error('Todoの状態変更に失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return null;
    }
  };

  // Todoを削除
  const deleteTodo = async (id: string) => {
    setError(null);
    try {
      await todoService.deleteTodo(id);
      
      // 削除前のTodoの状態を取得
      const deletedTodo = todos.find(todo => todo.id === id);
      
      // Todoリストから削除
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      
      // 統計情報を更新
      if (deletedTodo) {
        setStats(prev => ({
          total: prev.total - 1,
          completed: prev.completed - (deletedTodo.is_completed ? 1 : 0),
          remaining: prev.remaining - (deletedTodo.is_completed ? 0 : 1)
        }));
      }
      
      return true;
    } catch (err) {
      console.error('Todoの削除に失敗しました:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return false;
    }
  };

  // リアルタイム更新のセットアップ
  useEffect(() => {
    if (!userId) return;
    
    // 初回データ取得
    fetchTodos();
    
    // リアルタイム購読
    const subscription = supabase
      .channel('todos-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'todos',
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          // 変更があった場合にデータを再取得
          fetchTodos();
        }
      )
      .subscribe();
    
    // クリーンアップ
    return () => {
      subscription.unsubscribe();
    };
  }, [userId, fetchTodos]);

  return {
    todos,
    loading,
    error,
    stats,
    createTodo,
    updateTodo,
    toggleTodoCompletion,
    deleteTodo,
    refreshTodos: fetchTodos
  };
}; 