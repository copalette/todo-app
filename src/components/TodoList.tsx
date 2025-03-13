import { useState, useEffect } from 'react';
import { Todo } from '../types';
import { TodoItem } from './TodoItem';
import { useTodos } from '../hooks/useTodos';
import { useAuth } from '../hooks/useAuth';

export function TodoList() {
  const { user } = useAuth();
  const { 
    todos, 
    loading: isLoading, 
    error, 
    stats,
    deleteTodo,
    toggleTodoCompletion
  } = useTodos(user?.id);

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  const handleToggleComplete = async (id: string, isCompleted: boolean) => {
    await toggleTodoCompletion(id);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-600 bg-white rounded-lg shadow-md">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg shadow-md">{error}</div>;
  }

  if (todos.length === 0) {
    return <div className="p-8 text-center text-gray-600 bg-white rounded-lg shadow-md">Todoがありません。新しいTodoを追加してください。</div>;
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">統計情報</h3>
        <div className="flex gap-4">
          <div className="bg-gray-100 p-2 rounded-md">
            <span className="text-gray-600">合計: </span>
            <span className="font-bold">{stats.total}</span>
          </div>
          <div className="bg-green-100 p-2 rounded-md">
            <span className="text-gray-600">完了: </span>
            <span className="font-bold">{stats.completed}</span>
          </div>
          <div className="bg-yellow-100 p-2 rounded-md">
            <span className="text-gray-600">未完了: </span>
            <span className="font-bold">{stats.remaining}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </div>
    </div>
  );
} 