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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-bold text-primary mb-4">新しいTodoを追加</h2>
      
      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
          タイトル
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          placeholder="Todoのタイトルを入力"
          required
          className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
          説明
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          placeholder="Todoの詳細を入力（任意）"
          rows={3}
          className="bg-white w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out"
      >
        {isLoading ? '追加中...' : '追加する'}
      </button>
    </form>
  );
} 