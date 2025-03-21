import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Todo } from '../types';
import { todoService } from '../services/todoService';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function TodoItem({ todo, onDelete, onToggleComplete }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setIsLoading(true);
      onToggleComplete(todo.id);
    } catch (error) {
      console.error('Todoの完了状態の更新に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('このTodoを削除してもよろしいですか？')) {
      try {
        setIsLoading(true);
        await todoService.deleteTodo(todo.id);
        onDelete(todo.id);
      } catch (error) {
        console.error('Todoの削除に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
        <Link 
          to={`/todo/${todo.id}/edit`} 
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          編集
        </Link>
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