import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Todo } from '../types';
import { todoService } from '../services/todoService';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
  onUpdate: (id: string, title: string, description: string) => Promise<void>;
}

export function TodoItem({ todo, onDelete, onToggleComplete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onToggleComplete(todo.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('このTodoを削除してもよろしいですか？')) {
      try {
        setIsLoading(true);
        await onDelete(todo.id);
      } catch (error) {
        console.error('Todoの削除に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) return;
    
    setIsLoading(true);
    try {
      await onUpdate(todo.id, title, description);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="タイトル"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="説明"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpdate}
              disabled={isLoading || !title.trim()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-5 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-all duration-200 ${
      todo.is_completed ? 'bg-gray-50' : ''
    }`}>
      <div className="flex items-start gap-4 flex-1">
        <div className="relative">
          <input
            type="checkbox"
            checked={todo.is_completed}
            onChange={handleToggleComplete}
            disabled={isLoading}
            className="w-5 h-5 cursor-pointer border-2 border-gray-300 rounded-md checked:bg-green-500 checked:border-green-500 transition-colors duration-200"
          />
          {todo.is_completed && (
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-400 transform rotate-45 origin-left"></div>
          )}
        </div>
        <div className={`flex-1 transition-all duration-200 ${
          todo.is_completed 
            ? 'text-gray-400 line-through' 
            : 'text-gray-800'
        }`}>
          <h3 className="text-lg font-medium mb-1">{todo.title}</h3>
          <p className="text-sm text-gray-600">{todo.description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setIsEditing(true)}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          編集
        </button>
        <button 
          onClick={handleDelete} 
          disabled={isLoading}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400"
        >
          削除
        </button>
      </div>
    </div>
  );
} 