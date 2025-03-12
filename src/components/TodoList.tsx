import { useState, useEffect } from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { todoService, authService } from '../lib/supabase';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUser();
        
        if (!user) {
          setError('ログインが必要です');
          return;
        }
        
        const todoData = await todoService.getAllTodos(user.id);
        setTodos(todoData);
      } catch (err) {
        console.error('Todoの取得に失敗しました:', err);
        setError('Todoの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleDelete = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleToggleComplete = (id: string, isCompleted: boolean) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, is_completed: isCompleted } : todo
    ));
  };

  if (isLoading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (todos.length === 0) {
    return <div className="empty-state">Todoがありません。新しいTodoを追加してください。</div>;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      ))}
    </div>
  );
} 