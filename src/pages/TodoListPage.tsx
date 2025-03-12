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
    return <div className="loading-container">読み込み中...</div>;
  }

  if (!isAuthenticated) {
    return null; // ログインページにリダイレクト中
  }

  return (
    <div className="todo-page">
      <header className="todo-header">
        <h1>Todoリスト</h1>
        <div className="header-actions">
          <button onClick={handleLogout} className="logout-button">
            ログアウト
          </button>
        </div>
      </header>

      <main className="todo-content">
        <TodoForm onTodoAdded={handleTodoAdded} />
        <TodoList />
      </main>
    </div>
  );
}

export default TodoListPage;