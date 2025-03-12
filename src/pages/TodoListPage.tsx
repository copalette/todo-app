import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TodoList } from '../components/TodoList';
import { TodoForm } from '../components/TodoForm';
import { Todo } from '../types';
import { authService } from '../lib/supabase';

function TodoListPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error('認証チェックに失敗しました:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos([newTodo, ...todos]);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate('/login');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="p-8 text-center text-gray-600 bg-white rounded-lg shadow-md">
        読み込み中...
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return null; // ログインページにリダイレクト中
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">Todoリスト</h1>
        <div>
          <button 
            onClick={handleLogout} 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            ログアウト
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-6">
        <TodoForm onTodoAdded={handleTodoAdded} />
        <TodoList />
      </main>
    </div>
  );
}

export default TodoListPage;