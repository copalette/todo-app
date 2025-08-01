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
    const tempId = crypto.randomUUID();

    try {
      console.log('楽観的更新前のTodos:', todos);

      // 楽観的UI更新のためのTodoオブジェクト
      const optimisticTodo: Todo = {
        id: tempId,
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        is_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('新しいTodo:', optimisticTodo);

      // 楽観的UI更新
      setTodos(prevTodos => [optimisticTodo, ...prevTodos]);
      
      // 統計情報を更新
      setStats(prev => ({
        total: prev.total + 1,
        completed: prev.completed,
        remaining: prev.remaining + 1
      }));

      // サーバーへの保存
      const newTodo = await todoService.createTodo(userId, title, description);
      console.log('サーバーレスポンス:', newTodo);

      // 一時的なTodoを実際のものに置き換え
      setTodos(prevTodos => 
        prevTodos.map(todo => todo.id === tempId ? newTodo : todo)
      );

      return newTodo;
    } catch (err) {
      // エラー時の処理
      console.error('Todoの作成に失敗しました:', err);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
      setStats(prev => ({
        total: prev.total - 1,
        completed: prev.completed,
        remaining: prev.remaining - 1
      }));
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
    
    // 現在のTodoの状態を取得
    const currentTodo = todos.find(todo => todo.id === id);
    if (!currentTodo) {
      setError('対象のTodoが見つかりません');
      return null;
    }
    
    // 新しい完了状態
    const newIsCompleted = !currentTodo.is_completed;
    
    // 楽観的UI更新のために現在の状態をバックアップ
    const originalTodos = [...todos];
    const originalStats = { ...stats };
    
    try {
      // 楽観的UI更新
      setTodos(prevTodos => 
        prevTodos.map(todo => 
          todo.id === id 
            ? { ...todo, is_completed: newIsCompleted }
            : todo
        )
      );
      
      // 統計情報を更新
      setStats(prev => ({
        total: prev.total,
        completed: prev.completed + (newIsCompleted ? 1 : -1),
        remaining: prev.remaining + (newIsCompleted ? -1 : 1)
      }));

      // サーバーでの更新
      await todoService.toggleTodoCompletion(id);
      
      return currentTodo;
    } catch (err) {
      console.error('Todoの状態変更に失敗しました:', err);
      
      // エラーが発生した場合は元の状態に戻す
      setTodos(originalTodos);
      setStats(originalStats);
      
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return null;
    }
  };

  // Todoを削除
  const deleteTodo = async (id: string) => {
    setError(null);
    try {
      // 削除対象のTodoを取得
      const todoToDelete = todos.find(todo => todo.id === id);
      if (!todoToDelete) {
        throw new Error('削除対象のTodoが見つかりません');
      }

      // 実際の削除処理を先に実行
      await todoService.deleteTodo(id);

      // 削除成功後にUIを更新
      setTodos(prevTodos => {
        const newTodos = prevTodos.filter(todo => todo.id !== id);
        const total = newTodos.length;
        const completed = newTodos.filter(todo => todo.is_completed).length;
        setStats({
          total,
          completed,
          remaining: total - completed
        });
        return newTodos;
      });
    } catch (err) {
      console.error('Todoの削除に失敗しました:', err);
      const errorMessage = err instanceof Error ? err.message : 'Todoの削除に失敗しました';
      setError(errorMessage);
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
        { event: 'INSERT', schema: 'public', table: 'todos', filter: `user_id=eq.${userId}` }, 
        (payload) => {
          // 新しいTodoが追加された場合
          const newTodo = payload.new as Todo;
          setTodos(prevTodos => [newTodo, ...prevTodos]);
          
          // 統計情報を更新
          setStats(prev => ({
            total: prev.total + 1,
            completed: prev.completed,
            remaining: prev.remaining + 1
          }));
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'todos', filter: `user_id=eq.${userId}` }, 
        (payload) => {
          // Todoが更新された場合
          const updatedTodo = payload.new as Todo;
          setTodos(prevTodos => 
            prevTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
          );
          
          // 完了状態が変更された場合、統計情報を更新
          const oldTodo = payload.old as Todo;
          if (oldTodo.is_completed !== updatedTodo.is_completed) {
            setStats(prev => ({
              total: prev.total,
              completed: prev.completed + (updatedTodo.is_completed ? 1 : -1),
              remaining: prev.remaining + (updatedTodo.is_completed ? -1 : 1)
            }));
          }
        }
      )
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table: 'todos', filter: `user_id=eq.${userId}` }, 
        (payload) => {
          // Todoが削除された場合
          const deletedTodo = payload.old as Todo;
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== deletedTodo.id));
          
          // 統計情報を更新
          setStats(prev => ({
            total: prev.total - 1,
            completed: prev.completed - (deletedTodo.is_completed ? 1 : 0),
            remaining: prev.remaining - (deletedTodo.is_completed ? 0 : 1)
          }));
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