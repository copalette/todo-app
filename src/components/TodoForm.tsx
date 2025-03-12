import { useState } from 'react';
import { todoService, authService } from '../lib/supabase';
import { Todo } from '../types';

interface TodoFormProps {
  onTodoAdded: (todo: Todo) => void;
}

export function TodoForm({ onTodoAdded }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const user = await authService.getCurrentUser();
      
      if (!user) {
        setError('ログインが必要です');
        return;
      }
      
      const newTodo = await todoService.createTodo({
        title,
        description,
        user_id: user.id,
        is_completed: false
      });
      
      onTodoAdded(newTodo);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Todoの作成に失敗しました:', err);
      setError('Todoの作成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2>新しいTodoを追加</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">タイトル</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          placeholder="Todoのタイトルを入力"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">説明</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          placeholder="Todoの詳細を入力（任意）"
          rows={3}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="submit-button"
      >
        {isLoading ? '追加中...' : '追加する'}
      </button>
    </form>
  );
} 