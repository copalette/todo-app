import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Todo } from '../types';
import { todoService } from '../lib/supabase';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, isCompleted: boolean) => void;
}

export function TodoItem({ todo, onDelete, onToggleComplete }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setIsLoading(true);
      await todoService.updateTodo(todo.id, { is_completed: !todo.is_completed });
      onToggleComplete(todo.id, !todo.is_completed);
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
    <div className="todo-item">
      <div className="todo-item-content">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={handleToggleComplete}
          disabled={isLoading}
          className="todo-checkbox"
        />
        <div className={`todo-text ${todo.is_completed ? 'completed' : ''}`}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
        </div>
      </div>
      <div className="todo-actions">
        <Link to={`/todo/${todo.id}/edit`} className="edit-button">
          編集
        </Link>
        <button 
          onClick={handleDelete} 
          disabled={isLoading}
          className="delete-button"
        >
          削除
        </button>
      </div>
    </div>
  );
} 